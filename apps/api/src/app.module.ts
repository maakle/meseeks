import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { AudioModule } from './audio/audio.module';
import { AuthModule } from './auth/auth.module';
import { ClerkModule } from './clerk/clerk.module';
import { MessageModule } from './message/message.module';
import { OpenaiModule } from './openai/openai.module';
import { OrganizationMembershipModule } from './organization-membership/organization-membership.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { PrismaModule } from './prisma/prisma.module';
import { StabilityaiModule } from './stabilityai/stabilityai.module';
import { UserModule } from './user/user.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';

import { ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { CombinedAuthGuard } from './auth/guards/combined-auth.guard';
import { ClerkClientProvider } from './common/providers/clerk-client.provider';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClerkModule,
    PrismaModule,
    WhatsappModule,
    OpenaiModule,
    StabilityaiModule,
    AudioModule,
    UserModule,
    MessageModule,
    AuthModule,
    OrganizationsModule,
    OrganizationMembershipModule,
    ApiKeysModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [
    ClerkClientProvider,
    {
      provide: APP_GUARD,
      useClass: CombinedAuthGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule { }
