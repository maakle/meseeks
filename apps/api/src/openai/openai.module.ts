import { MessageModule } from '@/message/message.module';
import { UserService } from '@/user/user.service';
import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Module({
  imports: [MessageModule],
  providers: [OpenaiService, UserService],
  exports: [OpenaiService],
})
export class OpenaiModule { }
