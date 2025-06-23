import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrganizationMembershipModule } from '../organization-membership/organization-membership.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { UserModule } from '../user/user.module';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  imports: [
    UserModule,
    OrganizationsModule,
    ConfigModule,
    OrganizationMembershipModule,
  ],
  controllers: [WebhookController],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class ClerkModule {}
