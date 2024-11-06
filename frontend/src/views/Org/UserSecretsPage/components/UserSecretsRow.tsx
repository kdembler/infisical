import { type FC } from "react";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { IconButton, Td, Tr } from "@app/components/v2";
import { type DecryptedConsumerSecret } from "@app/hooks/api/consumerSecrets/types";
import { type UsePopUpState } from "@app/hooks/usePopUp";

import { PasswordCell } from "./PasswordCell";

type Props = {
  row: DecryptedConsumerSecret;
  handlePopUpOpen: (
    popUpName: keyof UsePopUpState<["deleteConsumerSecretConfirmation" | "editUserSecret"]>,
    data:
      | {
          name: string;
          id: string;
        }
      | DecryptedConsumerSecret
  ) => void;
};

export const UserSecretsRow: FC<Props> = ({ row, handlePopUpOpen }) => {
  return (
    <Tr key={row.id} className="group">
      <Td>{row.username}</Td>
      <Td>
        <PasswordCell password={row.password} />
      </Td>
      <Td>
        <div className="flex justify-end gap-2">
          <IconButton
            onClick={() => {
              handlePopUpOpen("editUserSecret", row);
            }}
            variant="plain"
            ariaLabel="edit user secret"
          >
            <FontAwesomeIcon icon={faEdit} />
          </IconButton>
          <IconButton
            onClick={() => {
              handlePopUpOpen("deleteConsumerSecretConfirmation", {
                name: row.username,
                id: row.id
              });
            }}
            variant="plain"
            ariaLabel="delete user secret"
          >
            <FontAwesomeIcon icon={faTrash} />
          </IconButton>
        </div>
      </Td>
    </Tr>
  );
};
