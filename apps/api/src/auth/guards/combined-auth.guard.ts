import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { firstValueFrom, Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { ApiKeyGuard } from './api-key.guard';
import { ClerkAuthGuard } from './clerk-auth.guard';

@Injectable()
export class CombinedAuthGuard implements CanActivate {
  private clerkGuard: ClerkAuthGuard;

  constructor(
    private reflector: Reflector,
    private readonly apiKeyGuard: ApiKeyGuard,
  ) {
    this.clerkGuard = new ClerkAuthGuard(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = this.extractApiKeyFromHeader(request);

    // If API key is present, validate it using ApiKeyGuard
    if (apiKey) {
      try {
        return await this.apiKeyGuard.canActivate(context);
      } catch (error) {
        throw new UnauthorizedException('Invalid API key');
      }
    }

    // If no API key, fall back to Clerk authentication
    try {
      const result = this.clerkGuard.canActivate(context);

      if (typeof result === 'boolean') {
        return result;
      }

      // Handle Observable - convert to Promise
      if (result instanceof Observable) {
        return firstValueFrom(result);
      }

      // If it's already a Promise
      return result;
    } catch (error) {
      throw new UnauthorizedException('Authentication required');
    }
  }

  private extractApiKeyFromHeader(request: Request): string | undefined {
    const authHeader = request.headers['x-api-key'];
    return authHeader as string;
  }
}
