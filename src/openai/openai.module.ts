import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { UserService } from '../user/user.service';

@Module({
  providers: [OpenaiService, UserService],
})
export class OpenaiModule {}
