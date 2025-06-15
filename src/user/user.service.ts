import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertUserDto } from './dto/upsert-user';
import { HandleServiceError } from '../common/decorators/error-handler.decorator';
import { UserNotFoundError } from './errors';
import { mapToUserResponseDto, UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleServiceError(UserService.name)
  async findUserById(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new UserNotFoundError(id, 'id');
    }

    return mapToUserResponseDto(user);
  }

  @HandleServiceError(UserService.name)
  async findUserByPhoneNumber(phoneNumber: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (!user) {
      throw new UserNotFoundError(phoneNumber, 'phoneNumber');
    }

    return mapToUserResponseDto(user);
  }

  @HandleServiceError(UserService.name)
  async upsertUser(dto: UpsertUserDto): Promise<UserResponseDto> {
    const user = await this.prisma.user.upsert({
      where: { phoneNumber: dto.phoneNumber },
      create: { phoneNumber: dto.phoneNumber },
      update: {},
    });

    return mapToUserResponseDto(user);
  }
}
