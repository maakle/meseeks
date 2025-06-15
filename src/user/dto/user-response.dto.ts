import { User } from 'generated/prisma/client';

export type UserResponseDto = {
  id: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
};

export const mapToUserResponseDto = (prisma: User): UserResponseDto => ({
  id: prisma.id,
  phoneNumber: prisma.phoneNumber,
  createdAt: prisma.createdAt,
  updatedAt: prisma.updatedAt,
});
