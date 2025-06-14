import { User } from '../../generated/prisma/client';

export interface CreateUserDto {
  phoneNumber: string;
}

export interface UpdateUserDto {
  phoneNumber?: string;
}

export interface UserResponse {
  id: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserWithRelations = User;
