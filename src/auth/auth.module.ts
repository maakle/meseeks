import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { ApiKeyGuard } from './api-key.guard';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CombinedAuthGuard } from './combined-auth.guard';
import { ZodValidationPipe } from 'nestjs-zod';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key', // Use environment variable in production
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    AuthService,
    ApiKeyGuard,
    JwtStrategy,
    CombinedAuthGuard,
    ZodValidationPipe,
  ],
  controllers: [AuthController],
  exports: [AuthService, ApiKeyGuard, CombinedAuthGuard, JwtModule],
})
export class AuthModule {}
