import { Injectable, NotFoundException } from '@nestjs/common';
import { UpsertClerkOrganizationDto } from '../clerk/dto/upsert-clerk-organization.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import {
  mapToOrganizationResponseDto,
  OrganizationResponseDto,
} from './dto/organization-response.dto';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrganizationDto): Promise<OrganizationResponseDto> {
    const organization = await this.prisma.organization.create({
      data: {
        clerkOrganizationId: dto.clerkOrganizationId,
        name: dto.name,
        slug: dto.slug,
      },
      include: {
        apiKeys: true,
      },
    });

    return mapToOrganizationResponseDto(organization);
  }

  async findAll(): Promise<OrganizationResponseDto[]> {
    const organizations = await this.prisma.organization.findMany({
      include: {
        apiKeys: true,
      },
    });

    return organizations.map(mapToOrganizationResponseDto);
  }

  async findOne(id: string): Promise<OrganizationResponseDto> {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        apiKeys: true,
      },
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    return mapToOrganizationResponseDto(organization);
  }

  async remove(id: string): Promise<OrganizationResponseDto> {
    const organization = await this.prisma.organization.delete({
      where: { id },
      include: {
        apiKeys: true,
      },
    });

    return mapToOrganizationResponseDto(organization);
  }

  async upsertClerkOrganization(
    dto: UpsertClerkOrganizationDto,
  ): Promise<OrganizationResponseDto> {
    const organization = await this.prisma.organization.upsert({
      where: { clerkOrganizationId: dto.clerkOrganizationId },
      update: {
        name: dto.name || '',
        slug: dto.slug || '',
        imageUrl: dto.imageUrl,
        logoUrl: dto.logoUrl,
        createdBy: dto.createdBy,
      },
      create: {
        clerkOrganizationId: dto.clerkOrganizationId,
        name: dto.name || '',
        slug: dto.slug || '',
        imageUrl: dto.imageUrl,
        logoUrl: dto.logoUrl,
        createdBy: dto.createdBy,
      },
      include: {
        apiKeys: true,
      },
    });

    return mapToOrganizationResponseDto(organization);
  }

  async deleteOrganizationByClerkId(
    clerkOrganizationId: string,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // First, delete all organization memberships
      await tx.organizationMembership.deleteMany({
        where: {
          organization: {
            clerkOrganizationId,
          },
        },
      });

      // Then, delete all API keys
      await tx.apiKey.deleteMany({
        where: {
          organization: {
            clerkOrganizationId,
          },
        },
      });

      // Finally, delete the organization
      await tx.organization.delete({
        where: { clerkOrganizationId },
      });
    });
  }
}
