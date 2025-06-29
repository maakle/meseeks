import { User } from '@clerk/backend';
import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { MessageService } from '../message/message.service';
import { UserService } from '../user/user.service';
import { AgentService } from './agent.service';
import { ChatResponseDto } from './dto/chat-response.dto';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';

@ApiTags('Agent')
@Controller('agent')
@UseGuards(ClerkAuthGuard)
export class AgentController {
    constructor(
        private readonly agentService: AgentService,
        private readonly messageService: MessageService,
        private readonly userService: UserService,
    ) { }

    @Post('chat/message')
    @ApiOperation({ summary: 'Send a message to the AI agent' })
    @ApiResponse({
        status: 200,
        description: 'Message sent successfully',
        type: ChatResponseDto,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async sendMessage(
        @Body() createChatMessageDto: CreateChatMessageDto,
        @Request() req: { user: User },
    ): Promise<ChatResponseDto> {
        const clerkUserId = req.user.id;

        // Get or create user
        const user = await this.userService.upsertClerkUser({
            clerkUserId,
            email: req.user.emailAddresses[0]?.emailAddress,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
        });

        // Create user message
        await this.messageService.createMessage(
            createChatMessageDto.message,
            'user',
            user.id,
        );

        // Generate AI response
        const aiResponse = await this.agentService.generateChatResponse(
            user.id,
            createChatMessageDto.message,
        );

        return {
            message: aiResponse,
            timestamp: new Date(),
        };
    }

    @Get('chat/messages')
    @ApiOperation({ summary: 'Get chat history' })
    @ApiResponse({
        status: 200,
        description: 'Chat history retrieved successfully',
        type: [ChatResponseDto],
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getMessages(@Request() req: { user: User }) {
        const clerkUserId = req.user.id;
        const user = await this.userService.upsertClerkUser({
            clerkUserId,
            email: req.user.emailAddresses[0]?.emailAddress,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
        });

        const messages = await this.messageService.getMessagesByUserId(user.id);
        return messages;
    }
} 