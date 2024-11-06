import { type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createNotification } from "@app/components/notifications";
import { Button, ModalClose } from "@app/components/v2";
import { useUpdateConsumerSecret } from "@app/hooks/api/consumerSecrets/mutations";
import {
  type DecryptedConsumerSecret,
  type TUpdateConsumerSecretRawDTO
} from "@app/hooks/api/consumerSecrets/types";

import { type UserSecretFormData, UserSecretFormFields } from "./UserSecretFormFields";

const formSchema = z.object({
  username: z.string().trim().min(1, { message: "Username is required" }),
  password: z.string().trim().min(1, { message: "Password is required" })
});

type Props = {
  secret: DecryptedConsumerSecret;
  onSuccess?: () => void;
};

export const EditUserSecretForm: FC<Props> = ({ secret, onSuccess }) => {
  const updateSecret = useUpdateConsumerSecret();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<UserSecretFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: secret.username,
      password: secret.password
    }
  });

  const onSubmit = async (data: UserSecretFormData) => {
    try {
      const dto: TUpdateConsumerSecretRawDTO = {
        id: secret.id,
        username: data.username !== secret.username ? data.username : undefined,
        password: data.password !== secret.password ? data.password : undefined
      };

      if (!dto.username && !dto.password) {
        createNotification({
          text: "No changes to submit",
          type: "info"
        });
        onSuccess?.();
        return;
      }

      await updateSecret.mutateAsync(dto);

      createNotification({
        text: "Successfully updated user secret",
        type: "success"
      });

      onSuccess?.();
    } catch (err) {
      console.error(err);
      createNotification({
        text: "Failed to update user secret",
        type: "error"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <UserSecretFormFields register={register} errors={errors} />
      <div className="flex gap-4">
        <Button type="submit" colorSchema="primary" isLoading={isSubmitting}>
          Update
        </Button>
        <ModalClose asChild>
          <Button variant="plain" colorSchema="secondary" onClick={onSuccess}>
            Cancel
          </Button>
        </ModalClose>
      </div>
    </form>
  );
};
