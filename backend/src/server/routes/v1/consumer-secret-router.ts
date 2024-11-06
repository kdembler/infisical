import { z } from "zod";

import { ConsumerSecretsSchema } from "@app/db/schemas";
import { CONSUMER_SECRETS } from "@app/lib/api-docs";
import { readLimit, writeLimit } from "@app/server/config/rateLimiter";
import { verifyAuth } from "@app/server/plugins/auth/verify-auth";
import { AuthMode } from "@app/services/auth/auth-type";

// TODO: add audit logs
// TODO: add telemetry
export const registerConsumerSecretRouter = async (server: FastifyZodProvider) => {
  server.route({
    method: "GET",
    url: "/",
    config: {
      rateLimit: readLimit
    },
    schema: {
      description: "List user's consumer secrets",
      security: [
        {
          bearerAuth: []
        }
      ],
      querystring: z.object({
        orgId: z.string().trim().describe(CONSUMER_SECRETS.LIST.orgId)
      }),
      response: {
        200: z.object({
          consumerSecrets: ConsumerSecretsSchema.array()
        })
      }
    },
    onRequest: verifyAuth([AuthMode.JWT]),
    handler: async (req) => {
      const { orgId } = req.query;

      const consumerSecrets = await server.services.consumerSecret.getConsumerSecrets({
        actor: req.permission.type,
        actorId: req.permission.id,
        actorOrgId: req.permission.orgId,
        actorAuthMethod: req.permission.authMethod,
        orgId
      });

      return { consumerSecrets };
    }
  });

  server.route({
    method: "GET",
    url: "/:id",
    config: {
      rateLimit: readLimit
    },
    schema: {
      description: "Get a consumer secret by ID",
      security: [
        {
          bearerAuth: []
        }
      ],
      params: z.object({
        id: z.string().trim().describe(CONSUMER_SECRETS.GET.id)
      }),
      response: {
        200: z.object({
          consumerSecret: ConsumerSecretsSchema
        })
      }
    },
    onRequest: verifyAuth([AuthMode.JWT]),
    handler: async (req) => {
      const { id } = req.params;

      const consumerSecret = await server.services.consumerSecret.getConsumerSecretById({
        actor: req.permission.type,
        actorId: req.permission.id,
        actorOrgId: req.permission.orgId,
        actorAuthMethod: req.permission.authMethod,
        orgId: req.permission.orgId,
        id
      });

      return { consumerSecret };
    }
  });

  server.route({
    method: "POST",
    url: "/",
    config: {
      rateLimit: writeLimit
    },
    schema: {
      description: "Create a consumer secret",
      security: [
        {
          bearerAuth: []
        }
      ],
      body: z.object({
        usernameCiphertext: z.string().trim().describe(CONSUMER_SECRETS.CREATE.usernameCiphertext),
        usernameNonce: z.string().trim().describe(CONSUMER_SECRETS.CREATE.usernameNonce),
        passwordCiphertext: z.string().trim().describe(CONSUMER_SECRETS.CREATE.passwordCiphertext),
        passwordNonce: z.string().trim().describe(CONSUMER_SECRETS.CREATE.passwordNonce),
        algorithm: z.string().trim().describe(CONSUMER_SECRETS.CREATE.algorithm)
      }),
      querystring: z.object({
        orgId: z.string().trim().describe(CONSUMER_SECRETS.CREATE.orgId)
      }),
      response: {
        200: z.object({
          consumerSecret: ConsumerSecretsSchema
        })
      }
    },
    onRequest: verifyAuth([AuthMode.JWT]),
    handler: async (req) => {
      const { orgId } = req.query;
      const { usernameCiphertext, usernameNonce, passwordCiphertext, passwordNonce, algorithm } = req.body;

      const consumerSecret = await server.services.consumerSecret.createConsumerSecret({
        actor: req.permission.type,
        actorId: req.permission.id,
        actorOrgId: req.permission.orgId,
        actorAuthMethod: req.permission.authMethod,
        orgId,
        usernameCiphertext,
        usernameNonce,
        passwordCiphertext,
        passwordNonce,
        algorithm
      });

      return { consumerSecret };
    }
  });

  server.route({
    method: "PATCH",
    url: "/:id",
    config: {
      rateLimit: writeLimit
    },
    schema: {
      description: "Update a consumer secret",
      security: [
        {
          bearerAuth: []
        }
      ],
      params: z.object({
        id: z.string().trim().describe(CONSUMER_SECRETS.UPDATE.id)
      }),
      body: z.object({
        usernameCiphertext: z.string().optional().describe(CONSUMER_SECRETS.UPDATE.usernameCiphertext),
        usernameNonce: z.string().optional().describe(CONSUMER_SECRETS.UPDATE.usernameNonce),
        passwordCiphertext: z.string().optional().describe(CONSUMER_SECRETS.UPDATE.passwordCiphertext),
        passwordNonce: z.string().optional().describe(CONSUMER_SECRETS.UPDATE.passwordNonce),
        algorithm: z.string().optional().describe(CONSUMER_SECRETS.UPDATE.algorithm)
      }),
      response: {
        200: z.object({
          consumerSecret: ConsumerSecretsSchema
        })
      }
    },
    onRequest: verifyAuth([AuthMode.JWT]),
    handler: async (req) => {
      const { id } = req.params;
      const { usernameCiphertext, usernameNonce, passwordCiphertext, passwordNonce, algorithm } = req.body;

      const consumerSecret = await server.services.consumerSecret.updateConsumerSecret({
        actor: req.permission.type,
        actorId: req.permission.id,
        actorOrgId: req.permission.orgId,
        actorAuthMethod: req.permission.authMethod,
        orgId: req.permission.orgId,
        id,
        usernameCiphertext,
        usernameNonce,
        passwordCiphertext,
        passwordNonce,
        algorithm
      });

      return { consumerSecret };
    }
  });

  server.route({
    method: "DELETE",
    url: "/:id",
    config: {
      rateLimit: writeLimit
    },
    schema: {
      description: "Delete a consumer secret",
      security: [
        {
          bearerAuth: []
        }
      ],
      params: z.object({
        id: z.string().trim().describe(CONSUMER_SECRETS.DELETE.id)
      }),
      response: {
        200: z.object({
          consumerSecret: ConsumerSecretsSchema
        })
      }
    },
    onRequest: verifyAuth([AuthMode.JWT]),
    handler: async (req) => {
      const { id } = req.params;

      const consumerSecret = await server.services.consumerSecret.deleteConsumerSecret({
        actor: req.permission.type,
        actorId: req.permission.id,
        actorOrgId: req.permission.orgId,
        actorAuthMethod: req.permission.authMethod,
        orgId: req.permission.orgId,
        id
      });

      return { consumerSecret };
    }
  });
};
