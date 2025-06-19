import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import * as process from 'node:process';
import { AudioService } from '../audio/audio.service';
import { Public } from '../common/decorators/public.decorator';
import { OpenaiService } from '../openai/openai.service';
import { StabilityaiService } from '../stabilityai/stabilityai.service';
import { UserService } from '../user/user.service';
import { convertToIntlPhonenumber } from './util';
import { WhatsappService } from './whatsapp.service';

@ApiTags('WhatsApp')
@Controller('whatsapp')
export class WhatsappController {
  constructor(
    private readonly whatsAppService: WhatsappService,
    private readonly stabilityaiService: StabilityaiService,
    private readonly audioService: AudioService,
    private readonly openaiService: OpenaiService,
    private readonly userService: UserService,
  ) {}

  @Get('webhook')
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
  whatsappVerificationChallenge(@Req() request: Request) {
    const mode = request.query['hub.mode'];
    const challenge = request.query['hub.challenge'];
    const token = request.query['hub.verify_token'];

    const verificationToken =
      process.env.WHATSAPP_CLOUD_API_WEBHOOK_VERIFICATION_TOKEN;

    if (!mode || !token) {
      return 'Error verifying token';
    }

    if (mode === 'subscribe' && token === verificationToken) {
      return challenge?.toString();
    }
  }

  @Post('webhook')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Handle incoming messages' })
  @ApiResponse({ status: 200, description: 'Message processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid message format' })
  async handleIncomingWhatsappMessage(@Body() request: any) {
    const { messages } = request?.entry?.[0]?.changes?.[0].value ?? {};
    if (!messages) return;

    const message = messages[0];
    const messageSender = message.from;
    const messageID = message.id;

    await this.whatsAppService.markMessageAsRead(messageID);

    switch (message.type) {
      case 'text':
        const text = message.text.body;
        const imageGenerationCommand = '/imagine';
        if (text.toLowerCase().includes(imageGenerationCommand)) {
          const response = await this.stabilityaiService.textToImage(
            text.replaceAll(imageGenerationCommand, ''),
          );

          if (Array.isArray(response)) {
            await this.whatsAppService.sendImageByUrl(
              messageSender,
              response[0],
              messageID,
            );
          }
          return;
        }

        await this.whatsAppService.sendWhatsAppMessage(
          messageSender,
          text,
          messageID,
        );
        break;
      case 'audio':
        const audioID = message.audio.id;
        const response = await this.whatsAppService.downloadMedia(audioID);
        if (response.status === 'error') {
          return;
        }

        const transcribedSpeech = await this.audioService.convertAudioToText(
          response.data,
        );

        if (transcribedSpeech.status === 'error') {
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
          return;
        }

        await this.whatsAppService.sendAudioByUrl(
          messageSender,
          textToSpeech.data,
        );
    }

    return 'Message processed';
  }
}
