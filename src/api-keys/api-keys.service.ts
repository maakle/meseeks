import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes, createHash } from 'crypto';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import {
  ApiKeyResponseDto,
  mapToApiKeyResponseDto,
} from './dto/api-key-response.dto';

@Injectable()
export class ApiKeysService {
  constructor(private prisma: PrismaService) {}

  private async generateApiKey() {
    const key = randomBytes(32).toString('hex');
    const prefix = key.slice(0, 8);
    const hashedKey = createHash('sha256').update(key).digest('hex');

    return {
      key,
      prefix,
      hashedKey,
    };
  }

  async create(
    organizationId: string,
    dto: CreateApiKeyDto,
  ): Promise<{ apiKey: ApiKeyResponseDto; key: string }> {
    const { key, prefix, hashedKey } = await this.generateApiKey();

    const apiKey = await this.prisma.apiKey.create({
      data: {
        name: dto.name,
        prefix,
        hashedKey,
        organizationId,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
    });

    return { apiKey: mapToApiKeyResponseDto(apiKey), key };
  }

  async findAll(organizationId: string): Promise<ApiKeyResponseDto[]> {
    const apiKeys = await this.prisma.apiKey.findMany({
      where: { organizationId },
    });

    return apiKeys.map(mapToApiKeyResponseDto);
  }

  async findOne(id: string): Promise<ApiKeyResponseDto> {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { id },
    });

    if (!apiKey) {
      throw new NotFoundException(`API key with ID ${id} not found`);
    }

    return mapToApiKeyResponseDto(apiKey);
  }

  async remove(id: string): Promise<ApiKeyResponseDto> {
    await this.findOne(id);

    const apiKey = await this.prisma.apiKey.delete({
      where: { id },
    });

    return mapToApiKeyResponseDto(apiKey);
  }

  async validateApiKey(key: string): Promise<boolean> {
    const prefix = key.slice(0, 8);
    const apiKey = await this.prisma.apiKey.findFirst({
      where: { prefix },
    });

    if (!apiKey) {
      return false;
    }

    const hashedKey = createHash('sha256').update(key).digest('hex');
    return hashedKey === apiKey.hashedKey;
  }
}
