import { Knex } from "knex";

import { ConsumerSecretEncryptionAlgo, TableName } from "../schemas/models";
import { createOnUpdateTrigger, dropOnUpdateTrigger } from "../utils";

export async function up(knex: Knex): Promise<void> {
  const hasConsumerSecretTable = await knex.schema.hasTable(TableName.ConsumerSecret);
  if (!hasConsumerSecretTable) {
    await knex.schema.createTable(TableName.ConsumerSecret, (t) => {
      t.uuid("id", { primaryKey: true }).defaultTo(knex.fn.uuid());
      t.integer("version").defaultTo(1).notNullable();
      // TODO: only username and password for now, expand to other fields
      t.string("usernameCiphertext").notNullable();
      t.string("usernameNonce").notNullable();
      t.string("passwordCiphertext").notNullable();
      t.string("passwordNonce").notNullable();
      t.string("algorithm").notNullable().defaultTo(ConsumerSecretEncryptionAlgo.NaClBox);
      t.uuid("userId").notNullable();
      t.foreign("userId").references("id").inTable(TableName.Users).onDelete("CASCADE");
      t.uuid("orgId").notNullable();
      t.foreign("orgId").references("id").inTable(TableName.Organization).onDelete("CASCADE");
      t.timestamps(true, true, true);
    });
  }
  await createOnUpdateTrigger(knex, TableName.ConsumerSecret);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(TableName.ConsumerSecret);
  await dropOnUpdateTrigger(knex, TableName.ConsumerSecret);
}
