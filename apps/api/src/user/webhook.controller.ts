import { Body, Controller, HttpCode, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import {
  ClerkWebhookEventDto,
  UserCreatedEvent,
  UserDeletedEvent,
  UserUpdatedEvent,
  isUserCreatedEvent,
  isUserDeletedEvent,
  isUserUpdatedEvent,
} from './dto/clerk-webhook.dto';
import { UpsertClerkUserDto } from './dto/upsert-clerk-user.dto';
import { UserService } from './user.service';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly userService: UserService) {}

  @Post('clerk')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Handle Clerk webhook events' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid webhook payload' })
  async handleClerkWebhook(
    @Body() event: ClerkWebhookEventDto,
  ): Promise<{ received: boolean }> {
    this.logger.log(`Received Clerk webhook event: ${event.type}`);

    try {
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
          this.logger.warn(`Unhandled webhook event type: ${event.type}`);
      }

      this.logger.log(`Successfully processed webhook event: ${event.type}`);
      return { received: true };
    } catch (error) {
      this.logger.error(`Error processing webhook event ${event.type}:`, error);
      throw error;
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

    const upsertDto: UpsertClerkUserDto = {
      clerkUserId: data.id,
      email: primaryEmail || null,
    };

    await this.userService.upsertClerkUser(upsertDto);
    this.logger.log(`${action} user with Clerk ID: ${data.id}`);
  }
}
