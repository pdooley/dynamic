import { Inject, Injectable, Optional } from '@nestjs/common';
import { AuthInfo } from '@vsolv/core/auth/domain';
import { PLATFORM_CONNECTION_NAME } from '@vsolv/core/multi-tenant/api';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Connection, getConnection } from 'typeorm';
import { AuthUserEntity, UserEntity } from '../entities';

@Injectable()
export class UserService {
  constructor(@Optional() @Inject(PLATFORM_CONNECTION_NAME) private platformConnName: { value: string | undefined }) {}

  /**Retrieves the user */
  async getUser(connection: Connection, userId: string) {
    return await connection.transaction(async manager => await manager.findOne(UserEntity, { where: { id: userId } }));
  }

  /**Paginates the users of the app/tenant */
  async paginateUsers(connection: Connection, pagination: IPaginationOptions) {
    const data = await paginate(connection.getRepository(UserEntity), pagination);
    return data;
  }
  /**Using the Auth Info in the request, searches the platform database connection for a default auth user. If none exists, it creates a user in the app/tenant connection and then links it to a new default auth user in the platform connection */
  async ensureUser(connection: Connection, authInfo: AuthInfo, tenantId?: string) {
    try {
      const pConn = getConnection(this.platformConnName.value);
      const user = await pConn.transaction(async pManager => {
        let authUser = await pManager.findOne(AuthUserEntity, {
          where: { authId: authInfo?.id, default: true, tenantId: tenantId || null },
        });
        if (!authUser) {
          const user = await connection.transaction(async cManager => {
            return await cManager.save(
              cManager.create(UserEntity, {
                email: authInfo.email,
                emailVerified: authInfo.emailVerified,
                displayName: authInfo.displayName,
                phoneNumber: authInfo.phoneNumber,
                photoURL: authInfo.photoUrl,
              })
            );
          });
          authUser = await pManager.save(
            pManager.create(AuthUserEntity, {
              authId: authInfo.id,
              userId: user.id,
              default: true,
              tenantId,
            })
          );
          return user;
        }
        return await connection.getRepository(UserEntity).findOne({ where: { id: authUser.userId } });
      });
      return user;
    } catch (err) {
      console.error('ensureUser', err);
      return undefined;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createNewUser(connection: Connection, authInfo: AuthInfo, dto: any, tenantId?: string) {
    //TODO: DTO
    try {
      const pConn = getConnection(this.platformConnName.value);
      const user = await pConn.transaction(async pManager => {
        const user = await connection.transaction(async cManager => {
          return await cManager.save(
            cManager.create(UserEntity, {
              email: dto.email || authInfo.email,
              emailVerified: dto.email ? false : authInfo.emailVerified,
              displayName: dto.displayName || authInfo.displayName,
              phoneNumber: dto.phoneNumber || authInfo.phoneNumber,
              photoURL: dto.photoUrl || authInfo.photoUrl,
            })
          );
        });
        const isDefault = !(await pManager.find(AuthUserEntity, { where: { userId: user.id, tenantId } })).length;
        //create auth user in platform
        await pManager.save(
          pManager.create(AuthUserEntity, {
            authId: authInfo.id,
            userId: user.id,
            default: isDefault,
            tenantId,
          })
        );
        return user;
      });
      return user;
    } catch (err) {
      console.error('createNewUser', err);
      return undefined;
    }
  }
}
