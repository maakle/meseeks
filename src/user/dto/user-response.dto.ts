import { User } from 'generated/prisma/client';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const UserResponseSchema = z.object({
  id: z.string(),
  phoneNumber: z.string().nullable(),
  email: z.string().nullable(),
});

export class UserResponseDto extends createZodDto(UserResponseSchema) {}

export const mapToUserResponseDto = (prisma: User): UserResponseDto => {
  return UserResponseDto.create({
    id: prisma.id,
    phoneNumber: prisma.phoneNumber,
    email: prisma.email,
  });
};
