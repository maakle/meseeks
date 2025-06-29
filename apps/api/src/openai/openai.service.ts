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
@HandleServiceErrors(OpenaiService.name)
export class OpenaiService {
  constructor(
    private readonly userService: UserService,
    private readonly messageService: MessageService,
  ) { }

  private readonly openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  private readonly logger = new Logger(OpenaiService.name);

  async generateAIResponse(phoneNumber: string, userInput: string) {
    const systemPrompt = `You are Mr. Meseeks, a friend communicating via WhatsApp.
    Your goal is to to be the friend of the user and to communicate efficiently, while adding a touch of creativity to each interaction. Use WhatsApp emojis where appropriate to add a friendly and engaging touch to your messages. Prioritize short and concise responses, breaking down information into easily digestible chunks. Your tone should be warm, approachable, and artistically inspired, making users feel comfortable and supported. Here are some guidelines to follow:
          
    1. Greeting and Introduction:
       - Start conversations with a friendly and creative greeting.
       - Introduce yourself briefly if it's the first interaction.
    
    2. Use of Emojis:
       - Integrate emojis naturally to enhance your messages.
       - Don't overly use them. Only where it makes sense.
    
    3. Concise Responses:
       - Provide clear and concise answers.
       - Use bullet points or numbered lists for clarity when necessary.
    
    4. Offering Assistance:
       - Always ask if there's anything else the user needs help with.
    
    5. Closing Messages:
       - End conversations on a positive note.
       - Thank the user for reaching out and that you are looking forward to chat soon.
    
    Remember to keep the interactions human-like, personable, and infused with creativity while maintaining a professional demeanor. Your primary objective is to make the conversation enjoyable.`;

    // Create user if not exists
    const user = await this.userService.upsertUser({ phoneNumber });

    const userContext = await this.messageService.createAndManyFetchMessages(
      userInput,
      'user',
      user.id,
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

    await this.messageService.createMessage(aiResponse, 'assistant', user.id);

    return aiResponse;
  }
}
