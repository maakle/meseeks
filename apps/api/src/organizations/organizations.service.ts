import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  mapToOrganizationResponseDto,
  OrganizationResponseDto,
} from './dto/organization-response.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrganizationDto): Promise<OrganizationResponseDto> {
    const organization = await this.prisma.organization.create({
      data: {
        name: dto.name,
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
}
