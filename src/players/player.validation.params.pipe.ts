import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class PlayerValidationParamsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new Error(`Missing required fields: ${metadata.data}`);
    }

    return value;
  }
}
