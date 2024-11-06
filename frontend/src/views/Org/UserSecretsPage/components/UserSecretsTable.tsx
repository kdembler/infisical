import { type FC } from "react";
import { faKey } from "@fortawesome/free-solid-svg-icons";

import {
  EmptyState,
  Table,
  TableContainer,
  TableSkeleton,
  TBody,
  Th,
  THead,
  Tr
} from "@app/components/v2";
import { useGetConsumerSecrets } from "@app/hooks/api/consumerSecrets/queries";
import { DecryptedConsumerSecret } from "@app/hooks/api/consumerSecrets/types";
import { type UsePopUpState } from "@app/hooks/usePopUp";

import { UserSecretsRow } from "./UserSecretsRow";

type Props = {
  orgId: string;
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

export const UserSecretsTable: FC<Props> = ({ orgId, handlePopUpOpen }) => {
  const { isLoading, data: secrets } = useGetConsumerSecrets({ orgId });

  return (
    <TableContainer>
      <Table>
        <THead>
          <Tr>
            <Th className="w-[45%]">Username</Th>
            <Th className="w-[45%]">Password</Th>
            <Th aria-label="actions" className="w-[10%]" />
          </Tr>
        </THead>
        <TBody>
          {isLoading && <TableSkeleton columns={3} innerKey="user-secrets" />}
          {!isLoading &&
            secrets?.map((row) => (
              <UserSecretsRow key={row.id} row={row} handlePopUpOpen={handlePopUpOpen} />
            ))}
        </TBody>
      </Table>
      {!isLoading && !secrets?.length && <EmptyState title="No user secrets found" icon={faKey} />}
    </TableContainer>
  );
};
