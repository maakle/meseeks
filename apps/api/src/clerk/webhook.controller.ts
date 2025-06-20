import { Body, Controller, HttpCode, Logger, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { WebhookService } from './webhook.service';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly webhookService: WebhookService) {}

  @Post('clerk')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Handle Clerk webhook events' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid webhook payload' })
  @ApiResponse({ status: 401, description: 'Invalid webhook signature' })
  async handleClerkWebhook(
    @Req() request: Request,
    @Body() event: any, // Using any for now to handle user, organization, and organization membership events
  ): Promise<{ received: boolean }> {
    this.logger.log(`Received Clerk webhook event: ${event.type}`);

    await this.webhookService.verifyWebhookSignature(request);

    try {
      // Handle user events
      if (event.type.startsWith('user.')) {
        await this.webhookService.handleUserEvent(event);
      }
      // Handle organization events
      else if (event.type.startsWith('organization.')) {
        await this.webhookService.handleOrganizationEvent(event);
      }
      // Handle organization membership events
      else if (event.type.startsWith('organizationMembership.')) {
        await this.webhookService.handleOrganizationMembershipEvent(event);
      } else {
        this.logger.warn(`Unhandled webhook event type: ${event.type}`);
      }

      this.logger.log(`Successfully processed webhook event: ${event.type}`);
      return { received: true };
    } catch (error) {
      this.logger.error(`Error processing webhook event ${event.type}:`, error);
      throw error;
    }
  }
}
