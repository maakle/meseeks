import { AudioService } from '@/audio/audio.service';
import { MessageModule } from '@/message/message.module';
import { UserService } from '@/user/user.service';
import { Module } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';
import { StabilityaiService } from '../stabilityai/stabilityai.service';
import { WhatsappWebhookController } from './webhook.controller';
import { WhatsappService } from './whatsapp.service';

@Module({
  imports: [MessageModule],
  controllers: [WhatsappWebhookController],
  providers: [
    OpenaiService,
    WhatsappService,
    UserService,
    StabilityaiService,
    AudioService,
  ],
})
export class WhatsappModule {}
