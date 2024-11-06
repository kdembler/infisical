import { ForbiddenError, subject } from "@casl/ability";

import { OrgPermissionActions, OrgPermissionSubjects } from "@app/ee/services/permission/org-permission";
import { TPermissionServiceFactory } from "@app/ee/services/permission/permission-service";
import { NotFoundError } from "@app/lib/errors";

import { TConsumerSecretDALFactory } from "./consumer-secret-dal";
import {
  TDeleteConsumerSecretDTO,
  TGetConsumerSecretByIdDTO,
  TGetConsumerSecretsDTO,
  TInsertConsumerSecretDTO,
  TUpdateConsumerSecretDTO
} from "./consumer-secret-types";

type TConsumerSecretServiceFactoryDep = {
  consumerSecretDAL: TConsumerSecretDALFactory;
  permissionService: TPermissionServiceFactory;
};

export type TConsumerSecretServiceFactory = ReturnType<typeof consumerSecretServiceFactory>;

export const consumerSecretServiceFactory = ({
  consumerSecretDAL,
  permissionService
}: TConsumerSecretServiceFactoryDep) => {
  const getConsumerSecrets = async ({ actor, actorId, orgId, actorOrgId, actorAuthMethod }: TGetConsumerSecretsDTO) => {
    const { permission } = await permissionService.getOrgPermission(actor, actorId, orgId, actorAuthMethod, actorOrgId);

    ForbiddenError.from(permission).throwUnlessCan(OrgPermissionActions.Read, OrgPermissionSubjects.ConsumerSecret);

    return consumerSecretDAL.findByUserAndOrgId(actorId, orgId);
  };

  const getConsumerSecretById = async ({
    actor,
    actorId,
    orgId,
    actorOrgId,
    actorAuthMethod,
    id
  }: TGetConsumerSecretByIdDTO) => {
    const { permission } = await permissionService.getOrgPermission(actor, actorId, orgId, actorAuthMethod, actorOrgId);

    const consumerSecret = await consumerSecretDAL.findById(id);

    if (!consumerSecret) {
      throw new NotFoundError({
        message: `Consumer secret with id '${id}' not found`,
        name: "GetConsumerSecretById"
      });
    }

    ForbiddenError.from(permission).throwUnlessCan(
      OrgPermissionActions.Read,
      subject(OrgPermissionSubjects.ConsumerSecret, { userId: consumerSecret.userId })
    );

    return consumerSecret;
  };

  const createConsumerSecret = async ({
    actor,
    actorId,
    orgId,
    actorOrgId,
    actorAuthMethod,
    ...secretData
  }: TInsertConsumerSecretDTO) => {
    const { permission } = await permissionService.getOrgPermission(actor, actorId, orgId, actorAuthMethod, actorOrgId);

    ForbiddenError.from(permission).throwUnlessCan(OrgPermissionActions.Create, OrgPermissionSubjects.ConsumerSecret);

    return consumerSecretDAL.insert({
      userId: actorId,
      orgId,
      ...secretData
    });
  };

  const updateConsumerSecret = async ({
    id,
    actor,
    actorId,
    orgId,
    actorOrgId,
    actorAuthMethod,
    ...secretData
  }: TUpdateConsumerSecretDTO) => {
    const { permission } = await permissionService.getOrgPermission(actor, actorId, orgId, actorAuthMethod, actorOrgId);

    const consumerSecret = await consumerSecretDAL.findById(id);

    if (!consumerSecret) {
      throw new NotFoundError({
        message: `Consumer secret with id '${id}' not found`,
        name: "UpdateConsumerSecret"
      });
    }

    ForbiddenError.from(permission).throwUnlessCan(
      OrgPermissionActions.Edit,
      subject(OrgPermissionSubjects.ConsumerSecret, { userId: consumerSecret.userId })
    );

    return consumerSecretDAL.updateById(id, secretData);
  };

  const deleteConsumerSecret = async ({
    id,
    actor,
    actorId,
    orgId,
    actorOrgId,
    actorAuthMethod
  }: TDeleteConsumerSecretDTO) => {
    const { permission } = await permissionService.getOrgPermission(actor, actorId, orgId, actorAuthMethod, actorOrgId);

    const consumerSecret = await consumerSecretDAL.findById(id);

    if (!consumerSecret) {
      throw new NotFoundError({
        message: `Consumer secret with id '${id}' not found`,
        name: "DeleteConsumerSecret"
      });
    }

    ForbiddenError.from(permission).throwUnlessCan(
      OrgPermissionActions.Delete,
      subject(OrgPermissionSubjects.ConsumerSecret, { userId: consumerSecret.userId })
    );

    return consumerSecretDAL.deleteById(id);
  };

  return {
    getConsumerSecrets,
    getConsumerSecretById,
    createConsumerSecret,
    updateConsumerSecret,
    deleteConsumerSecret
  };
};
