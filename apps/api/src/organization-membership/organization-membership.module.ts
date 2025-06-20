import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OrganizationMembershipController } from './organization-membership.controller';
import { OrganizationMembershipService } from './organization-membership.service';

@Module({
  imports: [PrismaModule],
  controllers: [OrganizationMembershipController],
  providers: [OrganizationMembershipService],
  exports: [OrganizationMembershipService],
})
export class OrganizationMembershipModule {}
