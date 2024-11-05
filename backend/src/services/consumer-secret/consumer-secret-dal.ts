import { TDbClient } from "@app/db";
import { TableName } from "@app/db/schemas";
import { ormify } from "@app/lib/knex";

export type TConsumerSecretDALFactory = ReturnType<typeof consumerSecretDALFactory>;

export const consumerSecretDALFactory = (db: TDbClient) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const consumerSecretOrm = ormify(db, TableName.ConsumerSecret);

  return {};
};
