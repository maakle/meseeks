import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import {
  mapToUserResponseDto,
  UserResponseDto,
} from '@/user/dto/user-response.dto';
import { HandleServiceErrors } from '@/common/decorators/error-handler.decorator';

@Injectable()
@HandleServiceErrors(AuthService.name)
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(email: string, password: string): Promise<UserResponseDto> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return user;
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserResponseDto | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user || !user.password) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return null;
      }

      return mapToUserResponseDto(user);
    } catch (error) {
      throw new UnauthorizedException('Authentication failed');
    }
  }

  async login(user: UserResponseDto) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateApiKey(apiKey: string) {
    const prefix = apiKey.slice(0, 8);
    const apiKeyRecord = await this.prisma.apiKey.findFirst({
      where: {
        prefix,
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    });

    if (!apiKeyRecord) {
      return false;
    }

    // Update last used timestamp
    await this.prisma.apiKey.update({
      where: { id: apiKeyRecord.id },
      data: { lastUsedAt: new Date() },
    });

    return true;
  }
}
