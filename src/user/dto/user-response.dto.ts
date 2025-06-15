import { User } from 'generated/prisma/client';

export type UserResponseDto = {
  id: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
};

export const mapToUserResponseDto = (user: User): UserResponseDto => ({
  id: user.id,
  phoneNumber: user.phoneNumber,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
