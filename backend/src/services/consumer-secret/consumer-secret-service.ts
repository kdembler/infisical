import { TConsumerSecretDALFactory } from "./consumer-secret-dal";

type TConsumerSecretServiceFactoryDep = {
  consumerSecretDAL: TConsumerSecretDALFactory;
};

export type TConsumerSecretServiceFactory = ReturnType<typeof consumerSecretServiceFactory>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const consumerSecretServiceFactory = ({ consumerSecretDAL }: TConsumerSecretServiceFactoryDep) => {
  return {};
};
