import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { OpenAI } from 'openai';
import { HandleServiceErrors } from '../common/decorators/error-handler.decorator';
import { MessageService } from '../message/message.service';
import { UserService } from '../user/user.service';

@Injectable()
@HandleServiceErrors(AgentService.name)
export class AgentService {
    constructor(
        private readonly userService: UserService,
        private readonly messageService: MessageService,
    ) { }

    private readonly openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    private readonly logger = new Logger(AgentService.name);

    async generateChatResponse(userId: string, userInput: string): Promise<string> {
        const systemPrompt = `You are a helpful AI assistant. You are knowledgeable, friendly, and always ready to help users with their questions and tasks. 

    Guidelines:
    1. Be helpful and informative
    2. Keep responses concise but thorough
    3. Use a friendly and professional tone
    4. If you don't know something, be honest about it
    5. Ask clarifying questions when needed
    6. Provide practical and actionable advice`;

        const userContext = await this.messageService.createAndManyFetchMessages(
            userInput,
            'user',
            userId,
        );

        const response = await this.openai.chat.completions.create({
            messages: [
                { role: 'system' as const, content: systemPrompt },
                ...userContext.map((msg) => ({
                    role: msg.role as 'user' | 'assistant',
                    content: msg.content,
                })),
            ],
            model: process.env.OPENAI_MODEL || 'gpt-4o-2024-05-13',
        });

        const aiResponse = response.choices[0].message.content;
        if (!aiResponse) {
            throw new InternalServerErrorException('No response content from OpenAI');
        }

        await this.messageService.createMessage(aiResponse, 'assistant', userId);

        return aiResponse;
    }
} 