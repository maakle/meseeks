import { User } from '../../../generated/prisma/client';

export interface IUser {
  id: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserWithConversations extends IUser {
  conversations: Array<{
    id: string;
    content: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

export class UpsertUserDto {
  phoneNumber: string;
}

export class UserResponseDto implements IUser {
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
