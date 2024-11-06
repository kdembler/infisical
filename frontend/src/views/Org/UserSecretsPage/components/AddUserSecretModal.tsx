import { type FC } from "react";

import { Modal, ModalContent } from "@app/components/v2";
import { type UsePopUpState } from "@app/hooks/usePopUp";

import { AddUserSecretForm } from "./AddUserSecretForm";

type Props = {
  popUp: UsePopUpState<["createUserSecret"]>;
  handlePopUpToggle: (
    popUpName: keyof UsePopUpState<["createUserSecret"]>,
    state?: boolean
  ) => void;
};

export const AddUserSecretModal: FC<Props> = ({ popUp, handlePopUpToggle }) => {
  return (
    <Modal
      isOpen={popUp?.createUserSecret?.isOpen}
      onOpenChange={(isOpen) => {
        handlePopUpToggle("createUserSecret", isOpen);
      }}
    >
      <ModalContent title="Add New User Secret" subTitle="Create a new secret to store securely">
        <AddUserSecretForm
          onSuccess={() => {
            handlePopUpToggle("createUserSecret", false);
          }}
        />
      </ModalContent>
    </Modal>
  );
};
