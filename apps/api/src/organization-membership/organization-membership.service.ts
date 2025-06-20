import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UpsertClerkOrganizationMembershipDto } from '../clerk/dto/upsert-clerk-organization-membership.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrganizationMembershipService {
  private readonly logger = new Logger(OrganizationMembershipService.name);

  constructor(private readonly prisma: PrismaService) {}

  async upsertClerkOrganizationMembership(
    dto: UpsertClerkOrganizationMembershipDto,
  ): Promise<void> {
    // Find the user by Clerk ID
    const user = await this.prisma.user.findUnique({
      where: { clerkUserId: dto.clerkUserId },
    });

    if (!user) {
      this.logger.warn(
        `User with Clerk ID ${dto.clerkUserId} not found for membership creation`,
      );
      return;
    }

    // Find the organization by Clerk ID
    const organization = await this.prisma.organization.findUnique({
      where: { clerkOrganizationId: dto.clerkOrganizationId },
    });

    if (!organization) {
      this.logger.warn(
        `Organization with Clerk ID ${dto.clerkOrganizationId} not found for membership creation`,
      );
      return;
    }

    // Upsert the membership
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
      `Upserted organization membership for user ${user.id} in organization ${organization.id} with role ${dto.role}`,
    );
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
