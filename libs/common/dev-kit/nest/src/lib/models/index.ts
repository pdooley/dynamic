import { ApiExtraModels, ApiOkResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger';

export * from './api-properties';

// eslint-disable-next-line @typescript-eslint/ban-types
type Model = { type: Function; parent: Function | null };
const models: Model[] = [];

export function VsolvModel(): ClassDecorator {
  return target => {
    const parentCtor = Reflect.getMetadata('vsolv/modelName', target);
    models.push({ type: target, parent: parentCtor || null });
    Reflect.defineMetadata('vsolv/modelName', target, target);
  };
}

type ModelTree = { model: Model; children?: ModelTree[] };
function getModelTree(model: Model): ModelTree {
  const children: ModelTree[] = [];
  for (const child of models.filter(m => m.parent === model.type)) {
    children.push(getModelTree(child));
  }
  return { model, ...(children.length ? { children } : {}) };
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function VsolvModelApiOkResponse(modelType: Function | [Function]): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    setTimeout(() => {
      const isArray = Array.isArray(modelType);
      const modelCtor = isArray ? modelType[0] : modelType;

      const model = models.find(m => m.type === modelCtor);
      if (!model) throw new Error();

      const tree = getModelTree(model);
      tree.children?.forEach(m => ApiExtraModels(m.model.type)(target.constructor));

      const schema = { oneOf: tree.children?.map(m => ({ $ref: getSchemaPath(m.model.type) })) };
      ApiOkResponse({ schema: isArray ? { type: 'array', items: schema } : { type: 'object', ...schema } })(
        target,
        propertyKey,
        descriptor
      );
    });
  };
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function VsolvModelApiProperty(modelTypeParam: Function | [Function]): PropertyDecorator {
  return (target, propertyKey) => {
    setTimeout(() => {
      const isArray = Array.isArray(modelTypeParam);
      const modelType = isArray ? modelTypeParam[0] : modelTypeParam;

      const model = models.find(m => m.type === modelType);
      if (!model) throw new Error();

      const tree = getModelTree(model);
      ApiExtraModels(tree.model.type)(target.constructor);
      tree.children?.forEach(m => ApiExtraModels(m.model.type)(target.constructor));

      Reflect.defineMetadata('swagger/apiModelProperties', null, target, propertyKey);

      ApiProperty(
        isArray
          ? {
              type: 'array',
              items: tree.children?.length
                ? tree.children.length === 1
                  ? { $ref: getSchemaPath(tree.children[0].model.type) }
                  : { oneOf: tree.children.map(child => ({ $ref: getSchemaPath(child.model.type) })) }
                : { $ref: getSchemaPath(tree.model.type) },
            }
          : tree.children?.length
          ? tree.children.length === 1
            ? { type: tree.children[0].model.type }
            : { oneOf: tree.children.map(child => ({ $ref: getSchemaPath(child.model.type) })) }
          : { type: tree.model.type }
      )(target, propertyKey);
    });
  };
}
