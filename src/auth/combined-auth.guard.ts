import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class CombinedAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authentication provided');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid authentication format');
    }

    const token = authHeader.substring(7);

    try {
      // First try JWT authentication
      await this.jwtService.verifyAsync(token);
      return true;
    } catch {
      // If JWT fails, try API key authentication
      const isValidApiKey = await this.authService.validateApiKey(token);
      if (!isValidApiKey) {
        throw new UnauthorizedException('Invalid authentication');
      }
      return true;
    }
  }
}
