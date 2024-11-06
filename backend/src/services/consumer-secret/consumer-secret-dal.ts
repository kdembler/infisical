import { Knex } from "knex";

import { TDbClient } from "@app/db";
import { TableName, TConsumerSecretsInsert, TConsumerSecretsUpdate } from "@app/db/schemas";
import { DatabaseError } from "@app/lib/errors";

export type TConsumerSecretDALFactory = ReturnType<typeof consumerSecretDALFactory>;

export const consumerSecretDALFactory = (db: TDbClient) => {
  const insert = async (data: TConsumerSecretsInsert, tx?: Knex) => {
    try {
      const consumerSecret = await (tx || db)(TableName.ConsumerSecret).insert(data).returning("*");
      return consumerSecret[0];
    } catch (error) {
      throw new DatabaseError({ error, name: "insert consumer secret" });
    }
  };

  const findById = async (id: string) => {
    try {
      const consumerSecret = await db.replicaNode()(TableName.ConsumerSecret).where({ id }).first();
      return consumerSecret;
    } catch (error) {
      throw new DatabaseError({ error, name: "find consumer secret by id" });
    }
  };

  const findByUserAndOrgId = async (userId: string, orgId: string) => {
    try {
      const consumerSecrets = await db
        .replicaNode()(TableName.ConsumerSecret)
        .where({ userId, orgId })
        .orderBy("id", "asc");
      return consumerSecrets;
    } catch (error) {
      throw new DatabaseError({ error, name: "get all consumer secrets" });
    }
  };

  const updateById = async (id: string, data: Omit<TConsumerSecretsUpdate, "version">, tx?: Knex) => {
    try {
      const updated = await (tx || db)(TableName.ConsumerSecret)
        .where({ id })
        .update(data)
        .increment("version", 1)
        .returning("*");
      return updated[0];
    } catch (error) {
      throw new DatabaseError({ error, name: "update consumer secret" });
    }
  };

  const deleteById = async (id: string, tx?: Knex) => {
    try {
      const deleted = await (tx || db)(TableName.ConsumerSecret).where({ id }).delete().returning("*");
      return deleted[0];
    } catch (error) {
      throw new DatabaseError({ error, name: "delete consumer secret" });
    }
  };

  return {
    insert,
    findByUserAndOrgId,
    findById,
    updateById,
    deleteById
  };
};
