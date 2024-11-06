import { type FC } from "react";

import { Modal, ModalContent } from "@app/components/v2";
import { type DecryptedConsumerSecret } from "@app/hooks/api/consumerSecrets/types";
import { type UsePopUpState } from "@app/hooks/usePopUp";

import { EditUserSecretForm } from "./EditUserSecretForm";

type Props = {
  popUp: UsePopUpState<["editUserSecret"]>;
  handlePopUpToggle: (popUpName: keyof UsePopUpState<["editUserSecret"]>, state?: boolean) => void;
};

export const EditUserSecretModal: FC<Props> = ({ popUp, handlePopUpToggle }) => {
  const secret = popUp.editUserSecret.data as DecryptedConsumerSecret | undefined;

  return (
    <Modal
      isOpen={popUp?.editUserSecret?.isOpen}
      onOpenChange={(isOpen) => {
        handlePopUpToggle("editUserSecret", isOpen);
      }}
    >
      <ModalContent title="Edit User Secret" subTitle="Update your stored secret">
        {secret && (
          <EditUserSecretForm
            secret={secret}
            onSuccess={() => {
              handlePopUpToggle("editUserSecret", false);
            }}
          />
        )}
      </ModalContent>
    </Modal>
  );
};
