import { type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createNotification } from "@app/components/notifications";
import { Button } from "@app/components/v2";
import { useOrganization } from "@app/context";
import { useCreateConsumerSecret } from "@app/hooks/api/consumerSecrets/mutations";
import { type TCreateConsumerSecretRawDTO } from "@app/hooks/api/consumerSecrets/types";

import { type UserSecretFormData, UserSecretFormFields } from "./UserSecretFormFields";

const formSchema = z.object({
  username: z.string().trim().min(1, { message: "Username is required" }),
  password: z.string().trim().min(1, { message: "Password is required" })
});

type Props = {
  onSuccess?: () => void;
};

export const AddUserSecretForm: FC<Props> = ({ onSuccess }) => {
  const { currentOrg } = useOrganization();
  const orgId = currentOrg?.id || "";
  const createSecret = useCreateConsumerSecret();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<UserSecretFormData>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: UserSecretFormData) => {
    try {
      const dto: TCreateConsumerSecretRawDTO = {
        orgId,
        username: data.username,
        password: data.password
      };

      await createSecret.mutateAsync(dto);

      createNotification({
        text: "Successfully created user secret",
        type: "success"
      });

      reset();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      createNotification({
        text: "Failed to create user secret",
        type: "error"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <UserSecretFormFields register={register} errors={errors} />
      <Button type="submit" colorSchema="primary" className="ml-auto" isLoading={isSubmitting}>
        Create User Secret
      </Button>
    </form>
  );
};
