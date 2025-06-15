import { Module } from '@nestjs/common';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { ConfigModule } from '@nestjs/config';
import { OpenaiModule } from './openai/openai.module';
import { StabilityaiModule } from './stabilityai/stabilityai.module';
import { AudioModule } from './audio/audio.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ApiKeysModule } from './api-keys/api-keys.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    WhatsappModule,
    OpenaiModule,
    StabilityaiModule,
    AudioModule,
    UserModule,
    MessageModule,
    AuthModule,
    OrganizationsModule,
    ApiKeysModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
