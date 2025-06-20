import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrganizationsModule } from '../organizations/organizations.module';
import { UserModule } from '../user/user.module';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  imports: [UserModule, OrganizationsModule, ConfigModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class ClerkModule {}
