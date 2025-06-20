import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Webhook } from 'svix';
import { OrganizationMembershipService } from '../organization-membership/organization-membership.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { UserService } from '../user/user.service';
import {
  OrganizationMembershipCreatedEvent,
  OrganizationMembershipDeletedEvent,
  OrganizationMembershipUpdatedEvent,
  isOrganizationMembershipCreatedEvent,
  isOrganizationMembershipDeletedEvent,
  isOrganizationMembershipUpdatedEvent,
} from './dto/clerk-organization-membership-webhook.dto';
import {
  OrganizationCreatedEvent,
  OrganizationDeletedEvent,
  OrganizationUpdatedEvent,
  isOrganizationCreatedEvent,
  isOrganizationDeletedEvent,
  isOrganizationUpdatedEvent,
} from './dto/clerk-organization-webhook.dto';
import {
  UserCreatedEvent,
  UserDeletedEvent,
  UserUpdatedEvent,
  isUserCreatedEvent,
  isUserDeletedEvent,
  isUserUpdatedEvent,
} from './dto/clerk-user-webhook.dto';
import { UpsertClerkOrganizationMembershipDto } from './dto/upsert-clerk-organization-membership.dto';
import { UpsertClerkOrganizationDto } from './dto/upsert-clerk-organization.dto';
import { UpsertClerkUserDto } from './dto/upsert-clerk-user.dto';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly userService: UserService,
    private readonly organizationsService: OrganizationsService,
    private readonly organizationMembershipService: OrganizationMembershipService,
    private readonly configService: ConfigService,
  ) {}

  async verifyWebhookSignature(request: Request): Promise<void> {
    const webhookSecret = this.configService.get<string>(
      'CLERK_WEBHOOK_SECRET',
    );

    if (!webhookSecret) {
      this.logger.error('CLERK_WEBHOOK_SECRET is not configured');
      throw new UnauthorizedException('Webhook secret not configured');
    }

    const headers = {
      'svix-id': request.headers['svix-id'] as string,
      'svix-timestamp': request.headers['svix-timestamp'] as string,
      'svix-signature': request.headers['svix-signature'] as string,
    };

    const payload = JSON.stringify(request.body);

    try {
      const wh = new Webhook(webhookSecret);
      wh.verify(payload, headers);
      this.logger.log('Webhook signature verified successfully');
    } catch (error) {
      this.logger.warn('Webhook signature verification failed', error);
      throw new UnauthorizedException('Invalid webhook signature');
    }
  }

  async handleUserEvent(event: any): Promise<void> {
    switch (event.type) {
      case 'user.created':
        if (isUserCreatedEvent(event)) {
          await this.handleUserCreated(event);
        } else {
          this.logger.warn(
            'Received user.created event with invalid data structure',
          );
        }
        break;
      case 'user.updated':
        if (isUserUpdatedEvent(event)) {
          await this.handleUserUpdated(event);
        } else {
          this.logger.warn(
            'Received user.updated event with invalid data structure',
          );
        }
        break;
      case 'user.deleted':
        if (isUserDeletedEvent(event)) {
          await this.handleUserDeleted(event);
        } else {
          this.logger.warn(
            'Received user.deleted event with invalid data structure',
          );
        }
        break;
      default:
        this.logger.warn(`Unhandled user webhook event type: ${event.type}`);
    }
  }

  async handleOrganizationEvent(event: any): Promise<void> {
    switch (event.type) {
      case 'organization.created':
        if (isOrganizationCreatedEvent(event)) {
          await this.handleOrganizationCreated(event);
        } else {
          this.logger.warn(
            'Received organization.created event with invalid data structure',
          );
        }
        break;
      case 'organization.updated':
        if (isOrganizationUpdatedEvent(event)) {
          await this.handleOrganizationUpdated(event);
        } else {
          this.logger.warn(
            'Received organization.updated event with invalid data structure',
          );
        }
        break;
      case 'organization.deleted':
        if (isOrganizationDeletedEvent(event)) {
          await this.handleOrganizationDeleted(event);
        } else {
          this.logger.warn(
            'Received organization.deleted event with invalid data structure',
          );
        }
        break;
      default:
        this.logger.warn(
          `Unhandled organization webhook event type: ${event.type}`,
        );
    }
  }

  async handleOrganizationMembershipEvent(event: any): Promise<void> {
    switch (event.type) {
      case 'organizationMembership.created':
        if (isOrganizationMembershipCreatedEvent(event)) {
          await this.handleOrganizationMembershipCreated(event);
        } else {
          this.logger.warn(
            'Received organizationMembership.created event with invalid data structure',
          );
        }
        break;
      case 'organizationMembership.updated':
        if (isOrganizationMembershipUpdatedEvent(event)) {
          await this.handleOrganizationMembershipUpdated(event);
        } else {
          this.logger.warn(
            'Received organizationMembership.updated event with invalid data structure',
          );
        }
        break;
      case 'organizationMembership.deleted':
        if (isOrganizationMembershipDeletedEvent(event)) {
          await this.handleOrganizationMembershipDeleted(event);
        } else {
          this.logger.warn(
            'Received organizationMembership.deleted event with invalid data structure',
          );
        }
        break;
      default:
        this.logger.warn(
          `Unhandled organization membership webhook event type: ${event.type}`,
        );
    }
  }

  private async handleUserCreated(event: UserCreatedEvent): Promise<void> {
    await this.upsertUserFromClerkData(event.data, 'Created');
  }

  private async handleUserUpdated(event: UserUpdatedEvent): Promise<void> {
    await this.upsertUserFromClerkData(event.data, 'Updated');
  }

  private async handleUserDeleted(event: UserDeletedEvent): Promise<void> {
    await this.userService.deleteUserByClerkId(event.data.id);
    this.logger.log(`Deleted user with Clerk ID: ${event.data.id}`);
  }

  private async handleOrganizationCreated(
    event: OrganizationCreatedEvent,
  ): Promise<void> {
    await this.upsertOrganizationFromClerkData(event.data, 'Created');
  }

  private async handleOrganizationUpdated(
    event: OrganizationUpdatedEvent,
  ): Promise<void> {
    await this.upsertOrganizationFromClerkData(event.data, 'Updated');
  }

  private async handleOrganizationDeleted(
    event: OrganizationDeletedEvent,
  ): Promise<void> {
    await this.organizationsService.deleteOrganizationByClerkId(event.data.id);
    this.logger.log(`Deleted organization with Clerk ID: ${event.data.id}`);
  }

  private async handleOrganizationMembershipCreated(
    event: OrganizationMembershipCreatedEvent,
  ): Promise<void> {
    await this.upsertOrganizationMembershipFromClerkData(event.data, 'Created');
  }

  private async handleOrganizationMembershipUpdated(
    event: OrganizationMembershipUpdatedEvent,
  ): Promise<void> {
    await this.upsertOrganizationMembershipFromClerkData(event.data, 'Updated');
  }

  private async handleOrganizationMembershipDeleted(
    event: OrganizationMembershipDeletedEvent,
  ): Promise<void> {
    await this.organizationMembershipService.deleteOrganizationMembershipByClerkIds(
      event.data.public_user_data.user_id,
      event.data.organization.id,
    );
    this.logger.log(
      `Deleted organization membership with Clerk ID: ${event.data.id}`,
    );
  }

  private async upsertUserFromClerkData(
    data: UserCreatedEvent['data'] | UserUpdatedEvent['data'],
    action: 'Created' | 'Updated',
  ): Promise<void> {
    // Extract primary email and phone number
    const primaryEmail = data.primary_email_address_id
      ? data.email_addresses.find(
          (email) => email.id === data.primary_email_address_id,
        )?.email_address
      : data.email_addresses[0]?.email_address;

    const primaryPhone = data.primary_phone_number_id
      ? data.phone_numbers.find(
          (phone) => phone.id === data.primary_phone_number_id,
        )?.phone_number
      : data.phone_numbers[0]?.phone_number;

    const upsertDto: UpsertClerkUserDto = {
      clerkUserId: data.id,
      email: primaryEmail || null,
      phoneNumber: primaryPhone || null,
      firstName: data.first_name || null,
      lastName: data.last_name || null,
    };

    await this.userService.upsertClerkUser(upsertDto);
    this.logger.log(`${action} user with Clerk ID: ${data.id}`);
  }

  private async upsertOrganizationFromClerkData(
    data: OrganizationCreatedEvent['data'] | OrganizationUpdatedEvent['data'],
    action: 'Created' | 'Updated',
  ): Promise<void> {
    const upsertDto: UpsertClerkOrganizationDto = {
      clerkOrganizationId: data.id,
      name: data.name,
      slug: data.slug,
      imageUrl: data.image_url,
      logoUrl: data.logo_url,
      createdBy: data.created_by,
    };

    await this.organizationsService.upsertClerkOrganization(upsertDto);
    this.logger.log(`${action} organization with Clerk ID: ${data.id}`);
  }

  private async upsertOrganizationMembershipFromClerkData(
    data:
      | OrganizationMembershipCreatedEvent['data']
      | OrganizationMembershipUpdatedEvent['data'],
    action: 'Created' | 'Updated',
  ): Promise<void> {
    const upsertDto: UpsertClerkOrganizationMembershipDto = {
      clerkMembershipId: data.id,
      clerkUserId: data.public_user_data.user_id,
      clerkOrganizationId: data.organization.id,
      role: data.role,
    };

    await this.organizationMembershipService.upsertClerkOrganizationMembership(
      upsertDto,
    );
    this.logger.log(
      `${action} organization membership with Clerk ID: ${data.id}`,
    );
  }
}
