import { User } from '../../generated/prisma/client';

export interface UserResponse {
  id: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserWithRelations = User;
