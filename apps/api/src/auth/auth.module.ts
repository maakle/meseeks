import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ZodValidationPipe } from 'nestjs-zod';
import { ClerkClientProvider } from '../common/providers/clerk-client.provider';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthService } from './auth.service';
import { ClerkStrategy } from './clerk.strategy';
import { ApiKeyGuard } from './guards/api-key.guard';

@Module({
  imports: [PrismaModule, PassportModule],
  providers: [
    AuthService,
    ApiKeyGuard,
    ClerkStrategy,
    ZodValidationPipe,
    ClerkClientProvider,
  ],
  controllers: [],
  exports: [AuthService, ApiKeyGuard, PassportModule],
})
export class AuthModule {}
