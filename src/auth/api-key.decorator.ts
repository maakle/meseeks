import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from './api-key.guard';

export function RequireApiKey() {
  return applyDecorators(UseGuards(ApiKeyGuard));
}
