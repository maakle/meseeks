import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ClerkClientProvider } from '../common/providers/clerk-client.provider';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthService } from './auth.service';
import { ClerkStrategy } from './clerk.strategy';
import { ApiKeyGuard } from './guards/api-key.guard';
import { CombinedAuthGuard } from './guards/combined-auth.guard';

@Module({
  imports: [PrismaModule, PassportModule],
  providers: [
    AuthService,
    ApiKeyGuard,
    CombinedAuthGuard,
    ClerkStrategy,
    ClerkClientProvider,
  ],
  controllers: [],
  exports: [AuthService, ApiKeyGuard, CombinedAuthGuard, PassportModule],
})
export class AuthModule {}
