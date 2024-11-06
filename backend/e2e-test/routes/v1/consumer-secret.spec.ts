import { z } from "zod";

import { ConsumerSecretsSchema } from "@app/db/schemas";
import { seedData1 } from "@app/db/seed-data";

// Create test-specific schema that expects date strings instead of Date objects
const ConsumerSecretsTestSchema = ConsumerSecretsSchema.extend({
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

const mockConsumerSecret = {
  usernameCiphertext: "encrypted_username",
  usernameNonce: "username_nonce",
  passwordCiphertext: "encrypted_password",
  passwordNonce: "password_nonce",
  algorithm: "nacl-box"
};

describe("Consumer Secret V1 Router", () => {
  let createdSecretId: string;

  test("POST Create consumer secret", async () => {
    const res = await testServer.inject({
      method: "POST",
      url: `/api/v1/consumer-secrets?orgId=${seedData1.organization.id}`,
      headers: {
        authorization: `Bearer ${jwtAuthToken}`
      },
      payload: mockConsumerSecret
    });

    expect(res.statusCode).toBe(200);
    const payload = JSON.parse(res.payload);
    expect(payload).toHaveProperty("consumerSecret");

    const parsed = ConsumerSecretsTestSchema.parse(payload.consumerSecret);
    expect(parsed.usernameCiphertext).toBe(mockConsumerSecret.usernameCiphertext);
    expect(parsed.usernameNonce).toBe(mockConsumerSecret.usernameNonce);
    expect(parsed.passwordCiphertext).toBe(mockConsumerSecret.passwordCiphertext);
    expect(parsed.passwordNonce).toBe(mockConsumerSecret.passwordNonce);
    expect(parsed.algorithm).toBe(mockConsumerSecret.algorithm);

    createdSecretId = parsed.id;
  });

  test("GET List consumer secrets", async () => {
    const res = await testServer.inject({
      method: "GET",
      url: `/api/v1/consumer-secrets?orgId=${seedData1.organization.id}`,
      headers: {
        authorization: `Bearer ${jwtAuthToken}`
      }
    });

    expect(res.statusCode).toBe(200);
    const payload = JSON.parse(res.payload);
    expect(payload).toHaveProperty("consumerSecrets");
    expect(Array.isArray(payload.consumerSecrets)).toBe(true);
    expect(payload.consumerSecrets.length).toBeGreaterThan(0);

    const parsed = z.array(ConsumerSecretsTestSchema).parse(payload.consumerSecrets);
    const createdSecret = parsed.find((secret) => secret.id === createdSecretId);
    expect(createdSecret).toBeDefined();
  });

  test("GET Single consumer secret", async () => {
    const res = await testServer.inject({
      method: "GET",
      url: `/api/v1/consumer-secrets/${createdSecretId}`,
      headers: {
        authorization: `Bearer ${jwtAuthToken}`
      }
    });

    expect(res.statusCode).toBe(200);
    const payload = JSON.parse(res.payload);
    expect(payload).toHaveProperty("consumerSecret");

    const parsed = ConsumerSecretsTestSchema.parse(payload.consumerSecret);
    expect(parsed.id).toBe(createdSecretId);
  });

  test("PATCH Update consumer secret", async () => {
    const updatePayload = {
      usernameCiphertext: "new_encrypted_username",
      usernameNonce: "new_username_nonce"
    };

    const res = await testServer.inject({
      method: "PATCH",
      url: `/api/v1/consumer-secrets/${createdSecretId}`,
      headers: {
        authorization: `Bearer ${jwtAuthToken}`
      },
      payload: updatePayload
    });

    expect(res.statusCode).toBe(200);
    const payload = JSON.parse(res.payload);
    expect(payload).toHaveProperty("consumerSecret");

    const parsed = ConsumerSecretsTestSchema.parse(payload.consumerSecret);
    expect(parsed.usernameCiphertext).toBe(updatePayload.usernameCiphertext);
    expect(parsed.usernameNonce).toBe(updatePayload.usernameNonce);

    expect(parsed.passwordCiphertext).toBe(mockConsumerSecret.passwordCiphertext);
  });

  test("DELETE consumer secret", async () => {
    const res = await testServer.inject({
      method: "DELETE",
      url: `/api/v1/consumer-secrets/${createdSecretId}`,
      headers: {
        authorization: `Bearer ${jwtAuthToken}`
      }
    });

    expect(res.statusCode).toBe(200);

    const getRes = await testServer.inject({
      method: "GET",
      url: `/api/v1/consumer-secrets/${createdSecretId}`,
      headers: {
        authorization: `Bearer ${jwtAuthToken}`
      }
    });

    expect(getRes.statusCode).toBe(404);
  });

  test("GET consumer secret with invalid ID returns 401/404", async () => {
    const res1 = await testServer.inject({
      method: "GET",
      url: "/api/v1/consumer-secrets/invalid-id",
      headers: {
        authorization: `Bearer ${jwtAuthToken}`
      }
    });

    expect(res1.statusCode).toBe(401);

    const res2 = await testServer.inject({
      method: "GET",
      url: "/api/v1/consumer-secrets/1d0ab0ee-92b9-41b6-859b-d7d6a63acc66",
      headers: {
        authorization: `Bearer ${jwtAuthToken}`
      }
    });

    expect(res2.statusCode).toBe(404);
  });

  test("POST Create consumer secret without required fields fails", async () => {
    const res = await testServer.inject({
      method: "POST",
      url: `/api/v1/consumer-secrets?orgId=${seedData1.organization.id}`,
      headers: {
        authorization: `Bearer ${jwtAuthToken}`
      },
      payload: {
        algorithm: "nacl-box"
      }
    });

    expect(res.statusCode).toBe(401);
  });
});
