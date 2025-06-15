import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { UserService } from '@/user/user.service';
import { ConversationModule } from '@/conversation/conversation.module';

@Module({
  imports: [ConversationModule],
  providers: [OpenaiService, UserService],
})
export class OpenaiModule {}
