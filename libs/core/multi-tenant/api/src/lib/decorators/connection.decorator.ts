import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AppType, MultiTenancyConstants } from '@vsolv/core/multi-tenant/domain';
import { Request } from 'express';
import { ConnectionOptions, createConnection, EntityTarget, getConnection } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { TenantEntity } from '../entities';
import { getTenantIdFromRequestHeader } from '../middleware';

/** This decorator can be used in controller methods to utilize the tenant id in the request to get the proper tenant database connection to pass down to services*/
export const VSolvConnection = createParamDecorator(async (type: AppType, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return getConnectionFromRequest(request, type);
});

export async function getConnectionFromRequest(request: Request, connectionType: AppType) {
  try {
    const appType = request[MultiTenancyConstants.APP_TYPE] as string;
    if (connectionType === AppType.PLATFORM || appType === AppType.PLATFORM) {
      return getPlatformConnection(appType);
    } else {
      if (appType === AppType.TENANT) {
        return await getTenantConnection(request);
      } else {
        return getConnection();
      }
    }
  } catch (err) {
    console.error('Error getting connection from decorator:', err);
    return null;
  }
}

/**get connection based on tenant id in request */
async function getTenantConnection(request: Request) {
  const isSandbox = (request[MultiTenancyConstants.IS_SANDBOX] as string) === 'true';
  const tenantId = getTenantIdFromRequestHeader(request);
  if (!tenantId) return null;
  return getVsolvConnection(tenantId, isSandbox);
}

/**get connection based on tenant id in request */
export async function getVsolvConnection(connectionName?: string, isSandbox = false, appType = AppType.TENANT) {
  const connection = tryGetConnection(connectionName, isSandbox);
  if (connection) return connection;
  return await tryCreateConnection(connectionName, isSandbox, appType);
}

export async function getVsolvRepository<E = unknown>(
  target: EntityTarget<E>,
  connectionName?: string,
  isSandbox = false
) {
  const connection = await getVsolvConnection(connectionName, isSandbox);
  return connection.getRepository<E>(target);
}

/**get connection to the platform db */
function getPlatformConnection(appType: string | AppType) {
  switch (appType) {
    case AppType.PLATFORM:
      return getConnection();
    case AppType.TENANT:
      return tryGetConnection(MultiTenancyConstants.PLATFORM_DB_CONNECTION_NAME, false);
    default:
      //basic apps
      return getConnection();
  }
}

function tryGetConnection(tenantId: string, isSandbox: boolean) {
  if (isSandbox) tenantId += '_sandbox';
  //try to get existing connection.
  try {
    if (tenantId === 'demo') return getConnection();
    return getConnection(tenantId); //this unfortunately throws an error if no connection exists, so it needs to be in a try
  } catch (err) {
    return null;
  }
}

async function tryCreateConnection(tenantId: string, isSandbox: boolean, appType: AppType) {
  console.log('create connection', tenantId, isSandbox, appType);
  //create a connection based on tenantId
  try {
    const tenantRepo = getConnection(
      appType === AppType.TENANT ? MultiTenancyConstants.PLATFORM_DB_CONNECTION_NAME : undefined
    ).getRepository(TenantEntity);
    const defaultConn = getConnection();
    // const defaultConn = getConnection( //TODO: (PLATFORM) LOAD TENANT ENTITIES FOR DEFAULT TENANT CONNECTION
    //   appType === AppType.TENANT ? undefined : MultiTenancyConstants.TENANT_CONNECTION_NAME
    // );
    const connectionOptions = !isSandbox
      ? (await tenantRepo.findOne(tenantId))?.connection
      : (await tenantRepo.findOne(tenantId))?.sandboxConnection;
    if (connectionOptions) {
      const connectionName = tenantId + (isSandbox ? '_sandbox' : '');
      return await createConnection({
        ...connectionOptions,
        entities: defaultConn.options.entities,
        name: connectionName,
        username: (defaultConn.options as MysqlConnectionOptions).username,
        password: (defaultConn.options as MysqlConnectionOptions).password,
      } as ConnectionOptions);
    } else return null;
  } catch (err) {
    console.error('Error creating connection:', err);
    return null;
  }
}
