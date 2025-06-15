import { Module } from '@nestjs/common';
import { WhatsappController } from './whatsapp/whatsapp.controller';
import { WhatsappService } from './whatsapp/whatsapp.service';
import { OpenaiService } from '@/openai/openai.service';
import { StabilityaiService } from '@/stabilityai/stabilityai.service';
import { AudioService } from '@/audio/audio.service';
import { UserService } from '@/user/user.service';
import { ConversationModule } from '@/conversation/conversation.module';

@Module({
  imports: [ConversationModule],
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
