import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UpsertUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findUserByPhoneNumber(phoneNumber: string) {
    return this.prisma.user.findUnique({
      where: { phoneNumber },
    });
  }

  async upsertUser(upsertUserDto: UpsertUserDto) {
    return this.prisma.user.upsert({
      where: { phoneNumber: upsertUserDto.phoneNumber },
      create: { phoneNumber: upsertUserDto.phoneNumber },
      update: {},
    });
  }
}
