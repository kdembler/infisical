export type ConsumerSecret = {
  id: string;
  userId: string;
  orgId: string;
  usernameCiphertext: string;
  usernameNonce: string;
  passwordCiphertext: string;
  passwordNonce: string;
  algorithm: string;
  createdAt: string;
  updatedAt: string;
};

export type DecryptedConsumerSecret = {
  username: string;
  password: string;
} & ConsumerSecret;

export type TCreateConsumerSecretDTO = {
  orgId: string;
  usernameCiphertext: string;
  usernameNonce: string;
  passwordCiphertext: string;
  passwordNonce: string;
  algorithm: string;
};

export type TCreateConsumerSecretRawDTO = {
  orgId: string;
  username: string;
  password: string;
};

export type TUpdateConsumerSecretDTO = {
  id: string;
  usernameCiphertext?: string;
  usernameNonce?: string;
  passwordCiphertext?: string;
  passwordNonce?: string;
  algorithm?: string;
};

export type TUpdateConsumerSecretRawDTO = {
  id: string;
  username?: string;
  password?: string;
};

export type TDeleteConsumerSecretDTO = {
  id: string;
};

export type TGetConsumerSecretsDTO = {
  orgId: string;
};

export type TGetConsumerSecretDTO = {
  id: string;
};
