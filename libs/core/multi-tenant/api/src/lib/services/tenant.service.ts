import { BadRequestException, Inject, Injectable, NotFoundException, Type } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { MultiTenancyConstants } from '@vsolv/core/multi-tenant/domain';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import {
  Connection,
  ConnectionOptions,
  createConnection,
  getConnection,
  MigrationInterface,
  Repository,
} from 'typeorm';
import { TenantEntity } from '../entities';
import { TENANT_MIGRATIONS } from '../symbols';

export const PLATFORM_CONNECTION_PORT = 3310;
export const PLATFORM_CONNECTION_HOST = '127.0.0.1';
export const PLATFORM_CONNECTION_USERNAME = 'root';
export const PLATFORM_CONNECTION_PASSWORD = 'password';
export const PLATFORM_CONNECTION_DATABASE = 'platform';

export const TENANT_CONNECTION_PORT = 3320;
export const TENANT_CONNECTION_HOST = '127.0.0.1';
export const TENANT_CONNECTION_USERNAME = 'root';
export const TENANT_CONNECTION_PASSWORD = 'password';
export const TENANT_CONNECTION_DATABASE = 'tenant0';

// Changes required to run dev db through gcloud proxy.
// export const PLATFORM_CONNECTION_PORT = 3306;
// export const PLATFORM_CONNECTION_HOST = '127.0.0.1';
// export const PLATFORM_CONNECTION_USERNAME = 'root';
// export const PLATFORM_CONNECTION_PASSWORD = 'v501v@ccess';
// export const PLATFORM_CONNECTION_DATABASE = 'platform';

// export const TENANT_CONNECTION_PORT = 3306;
// export const TENANT_CONNECTION_HOST = '127.0.0.1';
// export const TENANT_CONNECTION_USERNAME = 'root';
// export const TENANT_CONNECTION_PASSWORD = 'v501v@ccess';
// export const TENANT_CONNECTION_DATABASE = 'tenant0';

// export const TENANT_CONNECTION_NAME = 'tenant_default_db';

/**This is a platform-side service used to create and manage tenants */
@Injectable()
export class TenantService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectRepository(TenantEntity)
    private repo: Repository<TenantEntity>,
    @Inject(TENANT_MIGRATIONS) private migrations: Type<MigrationInterface>[]
  ) {}

  async getAll() {
    return await this.connection.transaction(async manager => await manager.find(TenantEntity));
  }

  async paginate(pagination: IPaginationOptions) {
    return await paginate(this.repo, pagination);
  }

  async getOne(id: string) {
    return await this.connection.transaction(async manager => await manager.findOne(TenantEntity, { where: { id } }));
  }

  async getOneByDomain(domain: string) {
    return await this.connection.transaction(
      async manager => await manager.findOne(TenantEntity, { where: { domain } })
    );
  }

  /**Create a new tenant entity in the platform database and provision a tenant database */
  async create(name: string) {
    const tenantEntity = await this.connection.transaction(async manager => {
      let tenant = await manager.findOne(TenantEntity, { where: { name } });
      if (tenant) throw new BadRequestException(`Tenant ${name} already exists`);
      //TODO: VSolvEntity to generate id
      tenant = await manager.save(
        manager.create(TenantEntity, {
          name,
          domain: name.toLowerCase() + '.vectorsolv.com', //TODO: replace illegal characters + make configurable
          //TODO: should domains be an array to support .vectorsolv.com and a custom domains at the same time? YES
          connection: {
            name,
            type: 'mysql',
            port: TENANT_CONNECTION_PORT,
            host: TENANT_CONNECTION_HOST,
            username: TENANT_CONNECTION_USERNAME,
            password: TENANT_CONNECTION_PASSWORD,
            //database: name,
            autoLoadEntities: true,
            entities: [],
            synchronize: true, //TODO: probably shouldn't be true in prod
            logging: ['schema'],
          } as ConnectionOptions,
          sandboxConnection: {
            name,
            type: 'mysql',
            port: TENANT_CONNECTION_PORT,
            host: TENANT_CONNECTION_HOST,
            username: TENANT_CONNECTION_USERNAME,
            password: TENANT_CONNECTION_PASSWORD,
            //database: name,
            autoLoadEntities: true,
            entities: [],
            synchronize: true, //TODO: probably shouldn't be true in prod
            logging: ['schema'],
          } as ConnectionOptions,
        })
      );
      tenant.connection = { ...tenant.connection, database: tenant.id } as ConnectionOptions;
      tenant.sandboxConnection = { ...tenant.sandboxConnection, database: tenant.id + '_sandbox' } as ConnectionOptions;
      return await manager.save(tenant);
    });
    //TODO: create tenant database
    await this.createNewTenantDB(tenantEntity);
    return tenantEntity;
  }

  /**Provisions a new database for the tenant and runs all registered migrations */
  private async createNewTenantDB(tenantEntity: TenantEntity) {
    try {
      const serverConnection = await createConnection({
        name: 'tenant_connection', // TODO: Why not user 'tenantEntity.id'
        type: 'mysql',
        port: TENANT_CONNECTION_PORT,
        host: TENANT_CONNECTION_HOST,
        username: TENANT_CONNECTION_USERNAME,
        password: TENANT_CONNECTION_PASSWORD,
      });
      const queryRunner = serverConnection.createQueryRunner();
      await queryRunner.createDatabase(tenantEntity.id);
      const defaultConn = getConnection(MultiTenancyConstants.TENANT_CONNECTION_NAME);
      const tenantConnection = await createConnection({
        ...tenantEntity.connection,
        entities: defaultConn.options.entities,
        migrations: this.migrations,
        migrationsTableName: 'typeorm_migrations',
        name: tenantEntity.id,
      });
      await tenantConnection.runMigrations();
      const tenantSandboxConnection = await createConnection({
        ...tenantEntity.connection,
        database: tenantEntity.id + '_sandbox',
        entities: defaultConn.options.entities,
        migrations: this.migrations,
        migrationsTableName: 'typeorm_migrations',
        name: tenantEntity.id,
      } as ConnectionOptions);
      await tenantSandboxConnection.runMigrations();
    } catch (err) {
      console.error();
    }
  }

  async update(id: string, dto: { name: string }) {
    return await this.connection.transaction(async manager => {
      const tenant = await this.getOne(id);
      if (!tenant) throw new NotFoundException(`Tenant ${id} does not exist`);
      const checkTenants = await manager.findOne(TenantEntity, { where: { name: dto.name } });
      if (checkTenants) throw new BadRequestException(`Cannot update. Tenant with name "${dto.name}" already exists`);
      tenant.name = dto.name;
      return await manager.save(tenant);
    });
  }

  async delete(id: string) {
    return await this.connection.transaction(async manager => {
      const tenant = await this.getOne(id);
      if (!tenant) throw new NotFoundException(`Tenant ${id} does not exist`);
      try {
        await manager.delete(TenantEntity, tenant);
      } catch (err) {
        console.error('Error deleting tenant' + err);
        return;
      }
    });
  }
}
