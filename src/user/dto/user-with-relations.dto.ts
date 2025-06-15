import { User } from 'generated/prisma/client';
import { UserResponseDto } from './user-response.dto';

export class UserWithRelationsResponseDto extends UserResponseDto {
  conversations: Array<{
    id: string;
    content: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  }>;

  constructor(user: User & { conversations: any[] }) {
    super(user);
    this.conversations = user.conversations;
  }
}
