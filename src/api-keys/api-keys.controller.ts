import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createApiKeySchema } from './validation';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { ApiKeyResponseDto } from './dto/api-key-response.dto';

@ApiTags('api-keys')
@Controller('organizations/:organizationId/api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createApiKeySchema))
  @ApiOperation({ summary: 'Create a new API key' })
  @ApiResponse({ status: 201, description: 'API key created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(
    @Param('organizationId') organizationId: string,
    @Body() dto: CreateApiKeyDto,
  ): Promise<{ apiKey: ApiKeyResponseDto; key: string }> {
    return this.apiKeysService.create(organizationId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all API keys for an organization' })
  @ApiResponse({ status: 200, description: 'Return all API keys' })
  findAll(
    @Param('organizationId') organizationId: string,
  ): Promise<ApiKeyResponseDto[]> {
    return this.apiKeysService.findAll(organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an API key by id' })
  @ApiResponse({ status: 200, description: 'Return the API key' })
  @ApiResponse({ status: 404, description: 'API key not found' })
  findOne(@Param('id') id: string): Promise<ApiKeyResponseDto> {
    return this.apiKeysService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an API key' })
  @ApiResponse({ status: 204, description: 'API key deleted successfully' })
  @ApiResponse({ status: 404, description: 'API key not found' })
  remove(@Param('id') id: string): Promise<ApiKeyResponseDto> {
    return this.apiKeysService.remove(id);
  }
}
