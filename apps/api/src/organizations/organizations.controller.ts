import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CombinedAuthGuard } from '../auth/guards/combined-auth.guard';
import { OrganizationResponseDto } from './dto/organization-response.dto';

@ApiTags('Organizations')
@Controller('organizations')
@UseGuards(CombinedAuthGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

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
