import { Injectable } from '@nestjs/common';
import { HandleServiceErrors } from '../common/decorators/error-handler.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertUserDto } from './dto/upsert-user';
import { mapToUserResponseDto, UserResponseDto } from './dto/user-response.dto';
import { UserNotFoundError } from './errors';

@Injectable()
@HandleServiceErrors(UserService.name)
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserById(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new UserNotFoundError(id, 'id');
    }

    return mapToUserResponseDto(user);
  }

  async findUserByPhoneNumber(phoneNumber: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (!user) {
      throw new UserNotFoundError(phoneNumber, 'phoneNumber');
    }

    return mapToUserResponseDto(user);
  }

  async upsertUser(dto: UpsertUserDto): Promise<UserResponseDto> {
    const user = await this.prisma.user.upsert({
      where: { phoneNumber: dto.phoneNumber },
      create: { phoneNumber: dto.phoneNumber },
      update: {},
    });

    return mapToUserResponseDto(user);
  }
}
