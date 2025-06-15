import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { UserService } from '@/user/user.service';
import { MessageModule } from '@/message/message.module';

@Module({
  imports: [MessageModule],
  providers: [OpenaiService, UserService],
})
export class OpenaiModule {}
