import { HandleServiceErrors } from '@/common/decorators/error-handler.decorator';
import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
@HandleServiceErrors(AuthService.name)
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateApiKey(apiKey: string) {
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

    // Update last used timestamp
    await this.prisma.apiKey.update({
      where: { id: apiKeyRecord.id },
      data: { lastUsedAt: new Date() },
    });

    return true;
  }
}
