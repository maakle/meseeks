import { MessageModule } from '@/message/message.module';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';

@Module({
    imports: [MessageModule, UserModule],
    controllers: [AgentController],
    providers: [AgentService],
    exports: [AgentService],
})
export class AgentModule { } 