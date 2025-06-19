import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = this.extractApiKeyFromHeader(request);

    if (!apiKey) {
      throw new UnauthorizedException('API key is missing');
    }

    const isValid = await this.validateApiKey(apiKey);
    if (!isValid) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }

  private extractApiKeyFromHeader(request: Request): string | undefined {
    const authHeader = request.headers['x-api-key'];
    return authHeader as string;
  }

  private async validateApiKey(apiKey: string): Promise<boolean> {
    const prefix = apiKey.slice(0, 8);
    const apiKeyRecord = await this.prisma.apiKey.findFirst({
      where: {
        prefix,
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    });

    if (!apiKeyRecord) {
      return false;
    }

    const hashedKey = createHash('sha256').update(apiKey).digest('hex');
    if (hashedKey !== apiKeyRecord.hashedKey) {
      return false;
    }

    await this.prisma.apiKey.update({
      where: { id: apiKeyRecord.id },
      data: { lastUsedAt: new Date() },
    });

    return true;
  }
}
