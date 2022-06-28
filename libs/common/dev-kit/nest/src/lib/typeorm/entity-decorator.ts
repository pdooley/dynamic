import { BeforeInsert, Entity, EntityOptions, getMetadataArgsStorage } from 'typeorm';
import { v4 } from 'uuid';

/**
 * Describes all VSolvEntity options.
 */
export type VSolvEntityOptions = Omit<EntityOptions, 'name'> & { name: string; prefix?: string };

// eslint-disable-next-line @typescript-eslint/ban-types
export const TENANT_REGISTERED_ENTITIES: Function[] = [];
// eslint-disable-next-line @typescript-eslint/ban-types
export const PLATFORM_REGISTERED_ENTITIES: Function[] = [];

type PlatformOrTenant = 'platform' | 'tenant';

export const BaseVsolvEntity = (
  options: Omit<EntityOptions, 'name'> & { name: string },
  tenantOrPlatform: PlatformOrTenant | PlatformOrTenant[]
): ClassDecorator => {
  return target => {
    if (process.env['TYPEORM_CLI']) {
      const register = (type: PlatformOrTenant) => {
        (type === 'platform' ? PLATFORM_REGISTERED_ENTITIES : TENANT_REGISTERED_ENTITIES).push(target);
      };

      if (typeof tenantOrPlatform === 'string') register(tenantOrPlatform);
      else tenantOrPlatform.forEach(t => register(t));
    }

    // eslint-disable-next-line no-restricted-syntax
    Entity(options)(target);
  };
};

/**
 * This decorator is used to mark classes that will be an entity (table or document depend on database type).
 *  Database schema will be created for all classes decorated with it, and Repository can be retrieved and used for it.
 *  Use the 'prefix' option to prefix (and generate - if empty) a string at the start of your primary column values.
 */

//TODO: VSolvEntity to generate id threw errors when copied over as is, let's go over the changes
export const VsolvEntity = (
  { prefix, ...options }: VSolvEntityOptions,
  tenantOrPlatform: PlatformOrTenant | PlatformOrTenant[]
): ClassDecorator => {
  return target => {
    const primaryCol = getMetadataArgsStorage().columns.find(c => c.options.primary);
    if (primaryCol) {
      if (
        ![
          'character varying',
          'varying character',
          'char varying',
          'nvarchar',
          'national varchar',
          'character',
          'native character',
          'varchar',
          'char',
          'nchar',
          'national char',
          'varchar2',
          'nvarchar2',
          'alphanum',
          'shorttext',
          'raw',
          'binary',
          'varbinary',
          'string',
        ].includes(
          typeof primaryCol.options.type === 'function'
            ? typeof primaryCol.options.type()
            : primaryCol.options.type || ''
        )
      )
        throw new Error(
          `${target.prototype.constructor.name}'s primary column must be a 'string' to use the 'prefix' option.`
        );

      Reflect.defineProperty(target.prototype, '_setPrimary', {
        value: function () {
          this[primaryCol.propertyName as keyof PropertyDescriptor] =
            (prefix && !this[primaryCol.propertyName as keyof PropertyDescriptor]?.startsWith(prefix + '_')
              ? prefix + '_'
              : '') + (this[primaryCol.propertyName as keyof PropertyDescriptor] ?? v4().replace('-', ''));
        },
      });
      BeforeInsert()(target.prototype, '_setPrimary');
    }

    BaseVsolvEntity(options, tenantOrPlatform)(target);
  };
};
