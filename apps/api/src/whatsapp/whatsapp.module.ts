import { AudioService } from '@/audio/audio.service';
import { MessageModule } from '@/message/message.module';
import { UserService } from '@/user/user.service';
import { Module } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';
import { StabilityaiService } from '../stabilityai/stabilityai.service';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';

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
