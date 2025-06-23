import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CombinedAuthGuard } from '../auth/guards/combined-auth.guard';
import { UpdateOrganizationMembershipRoleDto } from './dto/update-organization-membership-role.dto';
import { OrganizationMembershipService } from './organization-membership.service';

@ApiTags('Organization Memberships')
@Controller('organization-memberships')
@UseGuards(CombinedAuthGuard)
export class OrganizationMembershipController {
  private readonly logger = new Logger(OrganizationMembershipController.name);

  constructor(
    private readonly organizationMembershipService: OrganizationMembershipService,
  ) {}

  @Get('organization/:organizationId')
  @ApiOperation({ summary: 'Get all memberships for an organization' })
  @ApiResponse({
    status: 200,
    description: 'Organization memberships retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async getOrganizationMemberships(
    @Param('organizationId') organizationId: string,
  ) {
    return this.organizationMembershipService.getOrganizationMemberships(
      organizationId,
    );
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all organization memberships for a user' })
  @ApiResponse({
    status: 200,
    description: 'User organization memberships retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserOrganizationMemberships(@Param('userId') userId: string) {
    return this.organizationMembershipService.getUserOrganizationMemberships(
      userId,
    );
  }

  @Get(':userId/:organizationId')
  @ApiOperation({ summary: 'Get a specific organization membership' })
  @ApiResponse({
    status: 200,
    description: 'Organization membership retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Membership not found' })
  async getOrganizationMembership(
    @Param('userId') userId: string,
    @Param('organizationId') organizationId: string,
  ) {
    return this.organizationMembershipService.getOrganizationMembership(
      userId,
      organizationId,
    );
  }

  @Patch(':userId/:organizationId/role')
  @ApiOperation({ summary: 'Update organization membership role' })
  @ApiResponse({
    status: 200,
    description: 'Organization membership role updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Membership not found' })
  async updateOrganizationMembershipRole(
    @Param('userId') userId: string,
    @Param('organizationId') organizationId: string,
    @Body() body: UpdateOrganizationMembershipRoleDto,
  ) {
    return this.organizationMembershipService.updateOrganizationMembershipRole(
      userId,
      organizationId,
      body.role,
    );
  }

  @Delete(':userId/:organizationId')
  @ApiOperation({ summary: 'Delete organization membership' })
  @ApiResponse({
    status: 200,
    description: 'Organization membership deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Membership not found' })
  async deleteOrganizationMembership(
    @Param('userId') userId: string,
    @Param('organizationId') organizationId: string,
  ) {
    await this.organizationMembershipService.deleteOrganizationMembership(
      userId,
      organizationId,
    );
    return { message: 'Organization membership deleted successfully' };
  }
}
