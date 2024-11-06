import { TOrgPermission } from "@app/lib/types";

export type TGetConsumerSecretsDTO = TOrgPermission;

export type TGetConsumerSecretByIdDTO = {
  id: string;
} & TOrgPermission;

export type TInsertConsumerSecretDTO = {
  usernameCiphertext: string;
  usernameNonce: string;
  passwordCiphertext: string;
  passwordNonce: string;
  algorithm: string;
} & TOrgPermission;

export type TUpdateConsumerSecretDTO = {
  id: string;
  usernameCiphertext?: string;
  usernameNonce?: string;
  passwordCiphertext?: string;
  passwordNonce?: string;
  algorithm?: string;
} & TOrgPermission;

export type TDeleteConsumerSecretDTO = {
  id: string;
} & TOrgPermission;
