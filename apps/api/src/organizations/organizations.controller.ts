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
import { OrganizationsService } from './organizations.service';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationResponseDto } from './dto/organization-response.dto';

@ApiTags('Organizations')
@Controller('organizations')
@UseGuards(ApiKeyGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiResponse({
    status: 201,
    description: 'Organization created successfully',
    type: OrganizationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  async createOrganization(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @Request() req: any,
  ) {
    return this.organizationsService.create(createOrganizationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiResponse({
    status: 200,
    description: 'Return all organizations',
    type: [OrganizationResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  findAll(): Promise<OrganizationResponseDto[]> {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an organization by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the organization',
    type: OrganizationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  async getOrganizationById(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an organization' })
  @ApiResponse({
    status: 204,
    description: 'Organization deleted successfully',
    type: OrganizationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  remove(@Param('id') id: string): Promise<OrganizationResponseDto> {
    return this.organizationsService.remove(id);
  }
}
