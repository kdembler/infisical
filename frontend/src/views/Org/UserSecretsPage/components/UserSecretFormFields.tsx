import { type FC, useState } from "react";
import { type UseFormRegister } from "react-hook-form";

import { FormControl, Input } from "@app/components/v2";

export type UserSecretFormData = {
  username: string;
  password: string;
};

type Props = {
  register: UseFormRegister<UserSecretFormData>;
  errors: {
    username?: { message?: string };
    password?: { message?: string };
  };
};

export const UserSecretFormFields: FC<Props> = ({ register, errors }) => {
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  return (
    <>
      <FormControl
        label="Username"
        isRequired
        isError={Boolean(errors.username)}
        errorText={errors.username?.message}
      >
        <Input {...register("username")} placeholder="Enter username" />
      </FormControl>
      <FormControl
        label="Password"
        isRequired
        isError={Boolean(errors.password)}
        errorText={errors.password?.message}
      >
        <Input
          {...register("password")}
          placeholder="Enter password"
          type={isPasswordFocused ? "text" : "password"}
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
        />
      </FormControl>
    </>
  );
};
