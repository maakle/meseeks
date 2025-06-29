import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatMessageDto {
    @ApiProperty({
        description: 'The message to send to the AI agent',
        example: 'Hello, how can you help me today?',
    })
    @IsString()
    @IsNotEmpty()
    message!: string;
} 