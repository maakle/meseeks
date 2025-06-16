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
import { OrganizationsService } from './organizations.service';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  OrganizationResponseDto,
  OrganizationResponseSchema,
} from './dto/organization-response.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { zodToOpenAPI } from 'nestjs-zod';
import z from 'zod';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiResponse({
    status: 201,
    description: 'Organization created successfully',
    schema: zodToOpenAPI(OrganizationResponseSchema),
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() dto: CreateOrganizationDto): Promise<OrganizationResponseDto> {
    return this.organizationsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiResponse({
    status: 200,
    description: 'Return all organizations',
    schema: zodToOpenAPI(z.array(OrganizationResponseSchema)),
  })
  findAll(): Promise<OrganizationResponseDto[]> {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an organization by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the organization',
    schema: zodToOpenAPI(OrganizationResponseSchema),
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  findOne(@Param('id') id: string): Promise<OrganizationResponseDto> {
    return this.organizationsService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an organization' })
  @ApiResponse({
    status: 204,
    description: 'Organization deleted successfully',
    schema: zodToOpenAPI(OrganizationResponseSchema),
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  remove(@Param('id') id: string): Promise<OrganizationResponseDto> {
    return this.organizationsService.remove(id);
  }
}
