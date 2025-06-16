import { User } from 'generated/prisma/client';
import { UserResponseSchema } from '../schema';
import { createZodDto } from 'nestjs-zod';

export class UserResponseDto extends createZodDto(UserResponseSchema) {}

export const mapToUserResponseDto = (prisma: User): UserResponseDto => {
  return UserResponseDto.create({
    id: prisma.id,
    phoneNumber: prisma.phoneNumber,
  });
};
