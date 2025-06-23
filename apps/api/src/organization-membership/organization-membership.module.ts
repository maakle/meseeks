import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { OrganizationMembershipController } from './organization-membership.controller';
import { OrganizationMembershipService } from './organization-membership.service';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, OrganizationsModule],
  controllers: [OrganizationMembershipController],
  providers: [OrganizationMembershipService],
  exports: [OrganizationMembershipService],
})
export class OrganizationMembershipModule {}
