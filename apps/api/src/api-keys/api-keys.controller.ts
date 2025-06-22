import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { ApiKeysService } from './api-keys.service';
import { ApiKeyResponseDto } from './dto/api-key-response.dto';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

@ApiTags('API Keys')
@Controller('api-keys')
@UseGuards(ApiKeyGuard)
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new API key' })
  @ApiResponse({
    status: 201,
    description: 'API key created successfully',
    type: ApiKeyResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  async createApiKey(
    @Body() createApiKeyDto: CreateApiKeyDto,
    @Request() req: any,
  ) {
    return this.apiKeysService.create(req.user.organizationId, createApiKeyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all API keys for the organization' })
  @ApiResponse({
    status: 200,
    description: 'Return all API keys',
    type: [ApiKeyResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  async getApiKeys(@Request() req: any) {
    return this.apiKeysService.findAll(req.user.organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an API key by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the API key',
    type: ApiKeyResponseDto,
  })
  @ApiResponse({ status: 404, description: 'API key not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  async getApiKeyById(@Param('id') id: string) {
    return this.apiKeysService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an API key' })
  @ApiResponse({
    status: 204,
    description: 'API key deleted successfully',
    type: ApiKeyResponseDto,
  })
  @ApiResponse({ status: 404, description: 'API key not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  async deleteApiKey(@Param('id') id: string) {
    return this.apiKeysService.remove(id);
  }
}
