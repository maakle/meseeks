import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import {
  ApiKeyResponseDto,
  ApiKeyResponseSchema,
} from './dto/api-key-response.dto';
import { zodToOpenAPI } from 'nestjs-zod';
import z from 'zod';

@ApiTags('api-keys')
@Controller('organizations/:organizationId/api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new API key' })
  @ApiResponse({
    status: 201,
    description: 'API key created successfully',
    schema: zodToOpenAPI(ApiKeyResponseSchema),
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(
    @Param('organizationId') organizationId: string,
    @Body() dto: CreateApiKeyDto,
  ): Promise<{ apiKey: ApiKeyResponseDto; key: string }> {
    return this.apiKeysService.create(organizationId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all API keys for an organization' })
  @ApiResponse({
    status: 200,
    description: 'Return all API keys',
    schema: zodToOpenAPI(z.array(ApiKeyResponseSchema)),
  })
  findAll(
    @Param('organizationId') organizationId: string,
  ): Promise<ApiKeyResponseDto[]> {
    return this.apiKeysService.findAll(organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an API key by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the API key',
    schema: zodToOpenAPI(ApiKeyResponseSchema),
  })
  @ApiResponse({ status: 404, description: 'API key not found' })
  findOne(@Param('id') id: string): Promise<ApiKeyResponseDto> {
    return this.apiKeysService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an API key' })
  @ApiResponse({
    status: 204,
    description: 'API key deleted successfully',
    schema: zodToOpenAPI(ApiKeyResponseSchema),
  })
  @ApiResponse({ status: 404, description: 'API key not found' })
  remove(@Param('id') id: string): Promise<ApiKeyResponseDto> {
    return this.apiKeysService.remove(id);
  }
}
