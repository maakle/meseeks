import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { catchError, lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { OpenaiService } from '../openai/openai.service';
import axios, { AxiosRequestConfig } from 'axios';
import * as path from 'path';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { convertToIntlPhonenumber } from './util';
import { HandleServiceErrors } from '../common/decorators/error-handler.decorator';

@Injectable()
@HandleServiceErrors(WhatsappService.name)
export class WhatsappService {
  constructor(private readonly openaiService: OpenaiService) {}

  private readonly httpService = new HttpService();
  private readonly logger = new Logger(WhatsappService.name);
  private readonly url = `https://graph.facebook.com/${process.env.WHATSAPP_CLOUD_API_VERSION}/${process.env.WHATSAPP_CLOUD_API_PHONE_NUMBER_ID}/messages`;
  private readonly config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.WHATSAPP_CLOUD_API_ACCESS_TOKEN}`,
    },
  };

  async sendWhatsAppMessage(
    messageSender: string,
    userInput: string,
    messageID: string,
  ) {
    const phoneNumber = convertToIntlPhonenumber(messageSender);
    const aiResponse = await this.openaiService.generateAIResponse(
      phoneNumber,
      userInput,
    );

    const data = JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: messageSender,
      context: {
        message_id: messageID,
      },
      type: 'text',
      text: {
        preview_url: false,
        body: aiResponse,
      },
    });

    const response = this.httpService.post(this.url, data, this.config).pipe(
      map((res) => res.data),
      catchError((error) => {
        this.logger.error(error);
        throw new BadRequestException('Error Posting To WhatsApp Cloud API');
      }),
    );

    const messageSendingStatus = await lastValueFrom(response);
    this.logger.log('Message Sent. Status:', messageSendingStatus);
  }

  async getMediaUrl(
    mediaID: string,
  ): Promise<{ status: 'error' | 'success'; data: string }> {
    const url = `https://graph.facebook.com/${process.env.WHATSAPP_CLOUD_API_VERSION}/${mediaID}`;
    const response = await axios.get(url, this.config);
    return { status: 'success', data: response.data.url };
  }

  async downloadMedia(fileID: string) {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.WHATSAPP_CLOUD_API_ACCESS_TOKEN}`,
      },
      responseType: 'arraybuffer',
    };

    const url = await this.getMediaUrl(fileID);
    this.logger.log('Our url', url);
    if (url.status === 'error') {
      throw new Error('Failed to get media url');
    }
    const response = await axios.get(url.data, config);

    const fileType = response?.headers['content-type'];
    const fileExtension = fileType?.split('/')[1];

    const fileName = `${fileID}.${fileExtension}`;

    const folderName = process.env.AUDIO_FILES_FOLDER || 'audio-files';

    const folderPath = path.join(process.cwd(), folderName);
    const filePath = path.join(folderPath, fileName);

    //check if the audio folder exists, if not create
    if (!existsSync(folderPath)) {
      mkdirSync(folderPath);
    }

    writeFileSync(filePath, response.data);
    return { status: 'success', data: filePath };
  }

  async sendImageByUrl(
    messageSender: string,
    fileName: string,
    messageID: string,
  ) {
    const imageUrl = `${process.env.SERVER_URL}/${fileName}`;
    const data = JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: messageSender,
      context: {
        message_id: messageID,
      },
      type: 'image',
      image: {
        link: imageUrl,
      },
    });

    const response = this.httpService.post(this.url, data, this.config).pipe(
      map((res) => res.data),
      catchError((error) => {
        this.logger.error(error);
        throw new BadRequestException('Error Posting To WhatsApp Cloud API');
      }),
    );

    const messageSendingStatus = await lastValueFrom(response);
    return `Image sent successfully, response: ${messageSendingStatus}`;
  }

  async sendAudioByUrl(messageSender: string, fileName: string) {
    const audioUrl = `${process.env.SERVER_URL}/${fileName}`;
    const data = JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: messageSender,
      type: 'audio',
      audio: {
        link: audioUrl,
      },
    });

    const response = this.httpService.post(this.url, data, this.config).pipe(
      map((res) => res.data),
      catchError((error) => {
        this.logger.error(error);
        throw new BadRequestException('Error Posting To WhatsApp Cloud API');
      }),
    );

    const messageSendingStatus = await lastValueFrom(response);
    return `Audio sent successfully, response: ${messageSendingStatus}`;
  }

  async markMessageAsRead(messageID: string) {
    const data = JSON.stringify({
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageID,
    });

    const response = this.httpService.post(this.url, data, this.config).pipe(
      map((res) => res.data),
      catchError((error) => {
        this.logger.error(error);
        throw new BadRequestException('Error Marking Message As Read');
      }),
    );

    const messageStatus = await lastValueFrom(response);
    this.logger.log('Message Marked As Read. Status:', messageStatus);
  }
}
