import { Inject, Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Connection, getConnection } from 'typeorm';

import { AuthInfo } from '@vsolv/core/auth/domain';
import { PLATFORM_CONNECTION_NAME } from '@vsolv/core/multi-tenant/api';

import { AuthUserEntity, UserEntity } from '../entities';

@Injectable()
export class AuthUserService {
  constructor(@Inject(PLATFORM_CONNECTION_NAME) private platformConnName: { value: string | undefined }) {}

  async getDefaultForAuth(authId: string, tenantId?: string) {
    try {
      const platformConnection = getConnection(this.platformConnName.value);
      return await platformConnection.transaction(
        async manager => await manager.findOne(AuthUserEntity, { where: { authId, tenantId: tenantId || null } })
      );
    } catch (err) {
      console.error('getOneByUser', err);
      return undefined;
    }
  }

  /**Retrieves the auth user of user*/
  async getOneByUser(authId: string, userId: string, tenantId?: string) {
    try {
      const platformConnection = getConnection(this.platformConnName.value);
      return await platformConnection.transaction(
        async manager =>
          await manager.findOne(AuthUserEntity, { where: { authId, userId, tenantId: tenantId || null } })
      );
    } catch (err) {
      console.error('getOneByUser', err);
      return undefined;
    }
  }
  /**Paginates the auth users of the platform */
  async paginateAuthUsers(pagination: IPaginationOptions) {
    try {
      const platformConnection = getConnection(this.platformConnName.value);
      return await paginate(platformConnection.getRepository(AuthUserEntity), pagination);
    } catch (err) {
      console.error('paginateAuthUsers', err);
      return undefined;
    }
  }
  /**Gets all users registered to provided authentication*/
  async getUsersForAuth(connection: Connection, authInfo: AuthInfo, tenantId?: string) {
    try {
      const pConn = getConnection(this.platformConnName.value);
      const userIds = (
        await pConn.getRepository(AuthUserEntity).find({ where: { authId: authInfo.id, tenantId: tenantId || null } })
      ).map(au => au.userId);
      const users = await connection
        .getRepository(UserEntity)
        .createQueryBuilder()
        .where('id IN (:userIds)', { userIds: userIds })
        .getMany();
      return users;
    } catch (err) {
      console.error('getUsersForAuth', err);
      return undefined;
    }
  }
}
