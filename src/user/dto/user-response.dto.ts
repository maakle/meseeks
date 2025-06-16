import { User } from 'generated/prisma/client';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const UserResponseSchema = z.object({
  id: z.string(),
  phoneNumber: z.string(),
});

export class UserResponseDto extends createZodDto(UserResponseSchema) {}

export const mapToUserResponseDto = (prisma: User): UserResponseDto => {
  return UserResponseDto.create({
    id: prisma.id,
    phoneNumber: prisma.phoneNumber,
  });
};
