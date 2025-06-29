import { ApiProperty } from '@nestjs/swagger';

export class ChatResponseDto {
    @ApiProperty({
        description: 'The response message from the AI agent',
        example: 'Hello! I\'m here to help you. How can I assist you today?',
    })
    message!: string;

    @ApiProperty({
        description: 'Timestamp of the response',
        example: '2024-01-01T00:00:00.000Z',
    })
    timestamp!: Date;
} 