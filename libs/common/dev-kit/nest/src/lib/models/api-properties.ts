import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export function DateApiProperty(options?: ApiPropertyOptions): PropertyDecorator {
  return (target, propertyKey) => {
    ApiProperty({
      example: new Date().toISOString(),
      ...options,
    })(target, propertyKey);
  };
}

export function CreatedDateApiProperty() {
  return DateApiProperty({ description: 'Datetime when the exclusion was created.' });
}

export function ModifiedDateApiProperty() {
  return DateApiProperty({ description: 'Datetime when the exclusion was last modified.' });
}
