import { useQuery } from "@tanstack/react-query";

import { decryptAssymmetric } from "@app/components/utilities/cryptography/crypto";
import { apiRequest } from "@app/config/request";

import type {
  ConsumerSecret,
  DecryptedConsumerSecret,
  TGetConsumerSecretDTO,
  TGetConsumerSecretsDTO
} from "./types";

export const consumerSecretKeys = {
  list: (dto: TGetConsumerSecretsDTO) => ["consumer-secrets", dto] as const,
  detail: (id: string) => ["consumer-secret", id] as const
};

const decryptConsumerSecret = (secret: ConsumerSecret): DecryptedConsumerSecret => {
  const PRIVATE_KEY = localStorage.getItem("PRIVATE_KEY") as string;
  const PUBLIC_KEY = localStorage.getItem("publicKey") as string;

  return {
    ...secret,
    username: decryptAssymmetric({
      ciphertext: secret.usernameCiphertext,
      nonce: secret.usernameNonce,
      publicKey: PUBLIC_KEY,
      privateKey: PRIVATE_KEY
    }),
    password: decryptAssymmetric({
      ciphertext: secret.passwordCiphertext,
      nonce: secret.passwordNonce,
      publicKey: PUBLIC_KEY,
      privateKey: PRIVATE_KEY
    })
  };
};

const fetchConsumerSecrets = async ({ orgId }: TGetConsumerSecretsDTO) => {
  const { data } = await apiRequest.get<{ consumerSecrets: ConsumerSecret[] }>(
    "/api/v1/consumer-secrets",
    {
      params: { orgId }
    }
  );
  return data.consumerSecrets.map(decryptConsumerSecret);
};

const fetchConsumerSecret = async ({ id }: TGetConsumerSecretDTO) => {
  const { data } = await apiRequest.get<{ consumerSecret: ConsumerSecret }>(
    `/api/v1/consumer-secrets/${id}`
  );
  return decryptConsumerSecret(data.consumerSecret);
};

export const useGetConsumerSecrets = (dto: TGetConsumerSecretsDTO) =>
  useQuery({
    queryKey: consumerSecretKeys.list(dto),
    queryFn: () => fetchConsumerSecrets(dto)
  });

export const useGetConsumerSecret = (dto: TGetConsumerSecretDTO) =>
  useQuery({
    queryKey: consumerSecretKeys.detail(dto.id),
    queryFn: () => fetchConsumerSecret(dto),
    enabled: Boolean(dto.id)
  });
