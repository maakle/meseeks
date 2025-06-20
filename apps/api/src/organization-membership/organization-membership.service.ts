import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UpsertClerkOrganizationMembershipDto } from '../clerk/dto/upsert-clerk-organization-membership.dto';
import { OrganizationsService } from '../organizations/organizations.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class OrganizationMembershipService {
  private readonly logger = new Logger(OrganizationMembershipService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationsService: OrganizationsService,
    private readonly userService: UserService,
  ) {}

  async upsertClerkOrganizationMembership(
    dto: UpsertClerkOrganizationMembershipDto,
  ): Promise<void> {
    this.logger.log(
      `Starting upsert for organization membership: ${JSON.stringify(dto)}`,
    );

    // Find the user by Clerk ID
    let user = await this.prisma.user.findUnique({
      where: { clerkUserId: dto.clerkUserId },
    });

    if (!user) {
      this.logger.warn(
        `User with Clerk ID ${dto.clerkUserId} not found for membership creation. Creating minimal user record.`,
      );

      // Create a minimal user record since the user webhook might not have arrived yet
      try {
        await this.userService.upsertClerkUser({
          clerkUserId: dto.clerkUserId,
          email: null, // Will be updated when user webhook arrives
          phoneNumber: null, // Will be updated when user webhook arrives
          firstName: null, // Will be updated when user webhook arrives
          lastName: null, // Will be updated when user webhook arrives
        });

        this.logger.log(
          `Created minimal user record for Clerk ID: ${dto.clerkUserId}`,
        );
      } catch (error) {
        const errorMessage = `Failed to create minimal user record for Clerk ID ${dto.clerkUserId}: ${error instanceof Error ? error.message : String(error)}`;
        this.logger.error(errorMessage, error);
        throw new Error(errorMessage);
      }

      // Fetch the newly created user
      user = await this.prisma.user.findUnique({
        where: { clerkUserId: dto.clerkUserId },
      });

      if (!user) {
        const errorMessage = `Failed to find newly created user with Clerk ID ${dto.clerkUserId}`;
        this.logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      this.logger.log(`Found newly created user: ${user.id}`);
    } else {
      this.logger.log(`Found existing user: ${user.id} (${user.email})`);
    }

    // Find the organization by Clerk ID
    let organization = await this.prisma.organization.findUnique({
      where: { clerkOrganizationId: dto.clerkOrganizationId },
    });

    if (!organization) {
      this.logger.warn(
        `Organization with Clerk ID ${dto.clerkOrganizationId} not found for membership creation. Creating minimal organization record.`,
      );

      // Create a minimal organization record since the organization webhook might not have arrived yet
      try {
        await this.organizationsService.upsertClerkOrganization({
          clerkOrganizationId: dto.clerkOrganizationId,
          name: null, // Will be updated when organization webhook arrives
          slug: null, // Will be updated when organization webhook arrives
          imageUrl: null, // Will be updated when organization webhook arrives
          logoUrl: null, // Will be updated when organization webhook arrives
          createdBy: null, // Will be updated when organization webhook arrives
        });

        this.logger.log(
          `Created minimal organization record for Clerk ID: ${dto.clerkOrganizationId}`,
        );
      } catch (error) {
        const errorMessage = `Failed to create minimal organization record for Clerk ID ${dto.clerkOrganizationId}: ${error instanceof Error ? error.message : String(error)}`;
        this.logger.error(errorMessage, error);
        throw new Error(errorMessage);
      }

      // Fetch the newly created organization
      organization = await this.prisma.organization.findUnique({
        where: { clerkOrganizationId: dto.clerkOrganizationId },
      });

      if (!organization) {
        const errorMessage = `Failed to find newly created organization with Clerk ID ${dto.clerkOrganizationId}`;
        this.logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      this.logger.log(`Found newly created organization: ${organization.id}`);
    } else {
      this.logger.log(
        `Found existing organization: ${organization.id} (${organization.name})`,
      );
    }

    // Upsert the membership
    try {
      await this.prisma.organizationMembership.upsert({
        where: {
          userId_organizationId: {
            userId: user.id,
            organizationId: organization.id,
          },
        },
        update: {
          role: dto.role,
          updatedAt: new Date(),
        },
        create: {
          userId: user.id,
          organizationId: organization.id,
          role: dto.role,
        },
      });

      this.logger.log(
        `Successfully upserted organization membership for user ${user.id} in organization ${organization.id} with role ${dto.role}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to upsert organization membership: ${error instanceof Error ? error.message : String(error)}`,
        error,
      );
      throw error;
    }
  }

  async deleteOrganizationMembershipByClerkIds(
    clerkUserId: string,
    clerkOrganizationId: string,
  ): Promise<void> {
    // Find the user by Clerk ID
    const user = await this.prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      this.logger.warn(
        `User with Clerk ID ${clerkUserId} not found for membership deletion`,
      );
      return;
    }

    // Find the organization by Clerk ID
    const organization = await this.prisma.organization.findUnique({
      where: { clerkOrganizationId },
    });

    if (!organization) {
      this.logger.warn(
        `Organization with Clerk ID ${clerkOrganizationId} not found for membership deletion`,
      );
      return;
    }

    // Delete the membership
    await this.prisma.organizationMembership.deleteMany({
      where: {
        userId: user.id,
        organizationId: organization.id,
      },
    });

    this.logger.log(
      `Deleted organization membership for user ${user.id} in organization ${organization.id}`,
    );
  }

  async getOrganizationMemberships(organizationId: string) {
    return this.prisma.organizationMembership.findMany({
      where: { organizationId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            clerkUserId: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
            logoUrl: true,
            clerkOrganizationId: true,
          },
        },
      },
    });
  }

  async getUserOrganizationMemberships(userId: string) {
    return this.prisma.organizationMembership.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            clerkUserId: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
            logoUrl: true,
            clerkOrganizationId: true,
          },
        },
      },
    });
  }

  async getOrganizationMembership(userId: string, organizationId: string) {
    const membership = await this.prisma.organizationMembership.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            clerkUserId: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
            logoUrl: true,
            clerkOrganizationId: true,
          },
        },
      },
    });

    if (!membership) {
      throw new NotFoundException(
        `Membership not found for user ${userId} in organization ${organizationId}`,
      );
    }

    return membership;
  }

  async updateOrganizationMembershipRole(
    userId: string,
    organizationId: string,
    role: string,
  ) {
    const membership = await this.prisma.organizationMembership.update({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
      data: {
        role,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            clerkUserId: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
            logoUrl: true,
            clerkOrganizationId: true,
          },
        },
      },
    });

    this.logger.log(
      `Updated organization membership role for user ${userId} in organization ${organizationId} to ${role}`,
    );

    return membership;
  }

  async deleteOrganizationMembership(userId: string, organizationId: string) {
    await this.prisma.organizationMembership.delete({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
    });

    this.logger.log(
      `Deleted organization membership for user ${userId} in organization ${organizationId}`,
    );
  }
}
