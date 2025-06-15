import { User } from 'generated/prisma/client';
import { CreateUserInput, UpdateUserInput } from './validation';

export type UpsertUserDto = CreateUserInput;
export type UpdateUserDto = UpdateUserInput;

export class UserResponseDto {
  id: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.phoneNumber = user.phoneNumber;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}

export class UserWithConversationsResponseDto extends UserResponseDto {
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
