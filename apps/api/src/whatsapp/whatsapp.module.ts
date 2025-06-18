import { Module } from '@nestjs/common';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';
import { OpenaiService } from '../openai/openai.service';
import { StabilityaiService } from '../stabilityai/stabilityai.service';
import { AudioService } from '@/audio/audio.service';
import { UserService } from '@/user/user.service';
import { MessageModule } from '@/message/message.module';

@Module({
  imports: [MessageModule],
  controllers: [WhatsappController],
  providers: [
    OpenaiService,
    WhatsappService,
    UserService,
    StabilityaiService,
    AudioService,
  ],
})
export class WhatsappModule {}
