import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as process from 'node:process';

import { AudioService } from '../audio/audio.service';
import { Public } from '../common/decorators/public.decorator';
import { OpenaiService } from '../openai/openai.service';
import { StabilityaiService } from '../stabilityai/stabilityai.service';
import {
  WebhookVerificationQueryDto,
  WhatsappWebhookEventDto,
  isAudioMessage,
  isTextMessage,
} from './dto/whatsapp-webhook.dto';
import { convertToIntlPhonenumber } from './util';
import { WhatsappService } from './whatsapp.service';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WhatsappWebhookController {
  private readonly logger = new Logger(WhatsappWebhookController.name);

  constructor(
    private readonly whatsAppService: WhatsappService,
    private readonly stabilityaiService: StabilityaiService,
    private readonly audioService: AudioService,
    private readonly openaiService: OpenaiService,
  ) {}

  @Get('whatsapp')
  @Public()
  @ApiOperation({ summary: 'Verify WhatsApp webhook' })
  @ApiQuery({
    name: 'hub.mode',
    required: true,
    description: 'The mode of the webhook verification',
  })
  @ApiQuery({
    name: 'hub.challenge',
    required: true,
    description: 'The challenge string to verify the webhook',
  })
  @ApiQuery({
    name: 'hub.verify_token',
    required: true,
    description: 'The verification token',
  })
  @ApiResponse({ status: 200, description: 'Webhook verification successful' })
  @ApiResponse({ status: 400, description: 'Invalid verification request' })
  async verifyWebhook(
    @Query() query: WebhookVerificationQueryDto,
  ): Promise<string> {
    const {
      'hub.mode': mode,
      'hub.challenge': challenge,
      'hub.verify_token': token,
    } = query;

    const verificationToken =
      process.env.WHATSAPP_CLOUD_API_WEBHOOK_VERIFICATION_TOKEN;

    if (!mode || !token) {
      this.logger.warn('Missing required verification parameters');
      return 'Error verifying token';
    }

    if (mode === 'subscribe' && token === verificationToken) {
      this.logger.log('Webhook verification successful');
      return challenge?.toString() || '';
    }

    this.logger.warn('Webhook verification failed: invalid token or mode');
    return 'Error verifying token';
  }

  @Post('whatsapp')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Handle WhatsApp webhook events' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid webhook payload' })
  async handleWhatsappWebhook(
    @Body() event: WhatsappWebhookEventDto,
  ): Promise<{ received: boolean }> {
    this.logger.log('Received WhatsApp webhook event');

    try {
      const { entry } = event;

      if (!entry || entry.length === 0) {
        this.logger.warn('No entries found in webhook event');
        return { received: true };
      }

      const changes = entry[0]?.changes;
      if (!changes || changes.length === 0) {
        this.logger.warn('No changes found in webhook entry');
        return { received: true };
      }

      const messages = changes[0]?.value?.messages;
      if (!messages || messages.length === 0) {
        this.logger.log('No messages in webhook event');
        return { received: true };
      }

      const message = messages[0];
      await this.processMessage(message);

      this.logger.log('Successfully processed WhatsApp webhook event');
      return { received: true };
    } catch (error) {
      this.logger.error('Error processing WhatsApp webhook event:', error);
      throw error;
    }
  }

  private async processMessage(message: any): Promise<void> {
    const messageSender = message.from;
    const messageID = message.id;

    await this.whatsAppService.markMessageAsRead(messageID);

    if (isTextMessage(message)) {
      await this.handleTextMessage(message, messageSender, messageID);
    } else if (isAudioMessage(message)) {
      await this.handleAudioMessage(message, messageSender);
    } else {
      this.logger.warn(`Unhandled message type: ${message.type}`);
    }
  }

  private async handleTextMessage(
    message: any,
    messageSender: string,
    messageID: string,
  ): Promise<void> {
    const text = message.text.body;
    const imageGenerationCommand = '/imagine';

    if (text.toLowerCase().includes(imageGenerationCommand)) {
      await this.handleImageGeneration(text, messageSender, messageID);
    } else {
      await this.whatsAppService.sendWhatsAppMessage(
        messageSender,
        text,
        messageID,
      );
    }
  }

  private async handleImageGeneration(
    text: string,
    messageSender: string,
    messageID: string,
  ): Promise<void> {
    try {
      const imageGenerationCommand = '/imagine';
      const prompt = text.replaceAll(imageGenerationCommand, '').trim();
      const response = await this.stabilityaiService.textToImage(prompt);

      if (Array.isArray(response) && response.length > 0) {
        await this.whatsAppService.sendImageByUrl(
          messageSender,
          response[0],
          messageID,
        );
      }
    } catch (error) {
      this.logger.error('Error generating image:', error);
    }
  }

  private async handleAudioMessage(
    message: any,
    messageSender: string,
  ): Promise<void> {
    try {
      const audioID = message.audio.id;
      const response = await this.whatsAppService.downloadMedia(audioID);

      if (response.status === 'error') {
        this.logger.error('Failed to download audio media');
        return;
      }

      const transcribedSpeech = await this.audioService.convertAudioToText(
        response.data,
      );

      if (transcribedSpeech.status === 'error') {
        this.logger.error('Failed to transcribe audio');
        return;
      }

      const phoneNumber = convertToIntlPhonenumber(messageSender);
      const aiResponse = await this.openaiService.generateAIResponse(
        phoneNumber,
        transcribedSpeech.data,
      );

      const textToSpeech =
        await this.audioService.convertTextToSpeech(aiResponse);

      if (textToSpeech.status === 'error') {
        this.logger.error('Failed to convert text to speech');
        return;
      }

      await this.whatsAppService.sendAudioByUrl(
        messageSender,
        textToSpeech.data,
      );
    } catch (error) {
      this.logger.error('Error processing audio message:', error);
    }
  }
}
