import { useMutation, useQueryClient } from "@tanstack/react-query";

import { encryptAssymmetric } from "@app/components/utilities/cryptography/crypto";
import { apiRequest } from "@app/config/request";

import { consumerSecretKeys } from "./queries";
import type {
  ConsumerSecret,
  TCreateConsumerSecretDTO,
  TCreateConsumerSecretRawDTO,
  TDeleteConsumerSecretDTO,
  TUpdateConsumerSecretDTO,
  TUpdateConsumerSecretRawDTO
} from "./types";

const encryptValue = (value: string) => {
  const PUBLIC_KEY = localStorage.getItem("publicKey") as string;
  const PRIVATE_KEY = localStorage.getItem("PRIVATE_KEY") as string;

  return encryptAssymmetric({
    plaintext: value,
    publicKey: PUBLIC_KEY,
    privateKey: PRIVATE_KEY
  });
};

export const useCreateConsumerSecret = () => {
  const queryClient = useQueryClient();

  return useMutation<ConsumerSecret, unknown, TCreateConsumerSecretRawDTO>({
    mutationFn: async (rawDto) => {
      const { ciphertext: usernameCiphertext, nonce: usernameNonce } = encryptValue(
        rawDto.username
      );
      const { ciphertext: passwordCiphertext, nonce: passwordNonce } = encryptValue(
        rawDto.password
      );
      const dto: TCreateConsumerSecretDTO = {
        ...rawDto,
        usernameCiphertext,
        usernameNonce,
        passwordCiphertext,
        passwordNonce,
        algorithm: "nacl-box"
      };
      const { data } = await apiRequest.post<{ consumerSecret: ConsumerSecret }>(
        "/api/v1/consumer-secrets",
        dto,
        {
          params: { orgId: dto.orgId }
        }
      );
      return data.consumerSecret;
    },
    onSuccess: (_, { orgId }) => {
      queryClient.invalidateQueries(consumerSecretKeys.list({ orgId }));
    }
  });
};

export const useUpdateConsumerSecret = () => {
  const queryClient = useQueryClient();

  return useMutation<ConsumerSecret, unknown, TUpdateConsumerSecretRawDTO>({
    mutationFn: async ({ id, ...rawDto }) => {
      const dto: TUpdateConsumerSecretDTO = {
        ...rawDto,
        id
      };

      if (rawDto.username) {
        const { ciphertext: usernameCiphertext, nonce: usernameNonce } = encryptValue(
          rawDto.username
        );
        dto.usernameCiphertext = usernameCiphertext;
        dto.usernameNonce = usernameNonce;
        dto.algorithm = "nacl-box";
      }
      if (rawDto.password) {
        const { ciphertext: passwordCiphertext, nonce: passwordNonce } = encryptValue(
          rawDto.password
        );
        dto.passwordCiphertext = passwordCiphertext;
        dto.passwordNonce = passwordNonce;
        dto.algorithm = "nacl-box";
      }
      const { data } = await apiRequest.patch<{ consumerSecret: ConsumerSecret }>(
        `/api/v1/consumer-secrets/${id}`,
        dto
      );
      return data.consumerSecret;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(consumerSecretKeys.detail(data.id));
      queryClient.invalidateQueries(consumerSecretKeys.list({ orgId: data.orgId }));
    }
  });
};

export const useDeleteConsumerSecret = () => {
  const queryClient = useQueryClient();

  return useMutation<ConsumerSecret, unknown, TDeleteConsumerSecretDTO>({
    mutationFn: async ({ id }) => {
      const { data } = await apiRequest.delete<{ consumerSecret: ConsumerSecret }>(
        `/api/v1/consumer-secrets/${id}`
      );
      return data.consumerSecret;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(consumerSecretKeys.detail(data.id));
      queryClient.invalidateQueries(consumerSecretKeys.list({ orgId: data.orgId }));
    }
  });
};
