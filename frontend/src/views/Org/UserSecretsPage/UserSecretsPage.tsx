import { type FC } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { createNotification } from "@app/components/notifications";
import { Button, DeleteActionModal } from "@app/components/v2";
import { OrgPermissionActions, OrgPermissionSubjects, useOrganization } from "@app/context";
import { withPermission } from "@app/hoc";
import { usePopUp } from "@app/hooks";
import { useDeleteConsumerSecret } from "@app/hooks/api/consumerSecrets/mutations";

import { AddUserSecretModal, EditUserSecretModal, UserSecretsTable } from "./components";

type DeleteModalData = { name: string; id: string };

export const UserSecretsPage: FC = withPermission(
  () => {
    const { currentOrg } = useOrganization();
    const orgId = currentOrg?.id || "";
    const deleteSecret = useDeleteConsumerSecret();

    const { popUp, handlePopUpToggle, handlePopUpClose, handlePopUpOpen } = usePopUp([
      "deleteConsumerSecretConfirmation",
      "createUserSecret",
      "editUserSecret"
    ] as const);

    const onDeleteApproved = async () => {
      try {
        await deleteSecret.mutateAsync({
          id: (popUp?.deleteConsumerSecretConfirmation?.data as DeleteModalData)?.id
        });

        createNotification({
          text: "Successfully deleted secret",
          type: "success"
        });

        handlePopUpClose("deleteConsumerSecretConfirmation");
      } catch (err) {
        console.error(err);
        createNotification({
          text: "Failed to delete secret",
          type: "error"
        });
      }
    };

    if (!orgId) return null;

    return (
      <div className="h-full">
        <div className="container mx-auto h-full w-full max-w-7xl bg-bunker-800 px-6 text-white">
          <div className="flex items-center justify-between py-6">
            <div className="flex w-full flex-col">
              <h2 className="text-3xl font-semibold text-gray-200">User Secrets</h2>
              <p className="text-bunker-300">
                Securely store login information, accessible only by you
              </p>
            </div>
          </div>
          <div className="mb-6 rounded-lg border border-mineshaft-600 bg-mineshaft-900 p-4">
            <div className="mb-4 flex justify-between">
              <p className="text-xl font-semibold text-mineshaft-100">Your Secrets</p>
              <Button
                colorSchema="primary"
                leftIcon={<FontAwesomeIcon icon={faPlus} />}
                onClick={() => handlePopUpOpen("createUserSecret")}
              >
                Add User Secret
              </Button>
            </div>
            <UserSecretsTable orgId={orgId} handlePopUpOpen={handlePopUpOpen} />
          </div>
          <DeleteActionModal
            isOpen={popUp.deleteConsumerSecretConfirmation.isOpen}
            title={`Delete ${
              (popUp?.deleteConsumerSecretConfirmation?.data as DeleteModalData)?.name || ""
            }?`}
            onChange={(isOpen) => handlePopUpToggle("deleteConsumerSecretConfirmation", isOpen)}
            deleteKey="confirm"
            onClose={() => handlePopUpClose("deleteConsumerSecretConfirmation")}
            onDeleteApproved={onDeleteApproved}
          />
          <AddUserSecretModal popUp={popUp} handlePopUpToggle={handlePopUpToggle} />
          <EditUserSecretModal popUp={popUp} handlePopUpToggle={handlePopUpToggle} />
        </div>
      </div>
    );
  },
  {
    action: OrgPermissionActions.Read,
    subject: OrgPermissionSubjects.ConsumerSecret
  }
);
