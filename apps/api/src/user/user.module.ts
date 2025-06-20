import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [AuthModule],
  controllers: [UserController, WebhookController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
