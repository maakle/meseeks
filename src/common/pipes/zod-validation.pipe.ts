import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { z } from 'zod/v4';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodType) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
