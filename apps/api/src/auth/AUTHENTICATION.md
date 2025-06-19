# Authentication System

This application implements a flexible authentication system that supports both API key authentication and Clerk authentication, with the ability to mark endpoints as public.

## Overview

The authentication system consists of:

1. **CombinedAuthGuard** - Global guard that handles both authentication methods
2. **@Public() decorator** - Marks endpoints as publicly accessible
3. **API Key authentication** - Using `x-api-key` header
4. **Clerk authentication** - Using Clerk JWT tokens

## How It Works

### Global Guard Configuration

The `CombinedAuthGuard` is configured globally in `app.module.ts`:

```typescript
{
  provide: APP_GUARD,
  useClass: CombinedAuthGuard,
}
```

### Authentication Flow

1. **Public Endpoints**: If an endpoint is marked with `@Public()`, it bypasses all authentication
2. **API Key Authentication**: If `x-api-key` header is present, it validates the API key using `ApiKeyGuard`
3. **Clerk Authentication**: If no API key is provided, it falls back to Clerk authentication using `ClerkAuthGuard`
4. **Unauthorized**: If neither authentication method is valid, returns 401

## Usage Examples

### Public Endpoints

Use the `@Public()` decorator to mark endpoints that don't require authentication:

```typescript
import { Public } from '../common/decorators/public.decorator';

@Controller('webhooks')
export class WebhookController {
  @Post('whatsapp')
  @Public()
  handleWhatsAppWebhook(@Body() data: any) {
    // This endpoint is accessible without authentication
    return { received: true };
  }
}
```

### Protected Endpoints

Endpoints without the `@Public()` decorator require authentication:

```typescript
@Controller('api')
export class ApiController {
  @Get('users')
  getUsers() {
    // This endpoint requires either API key or Clerk authentication
    return { users: [] };
  }
}
```

### API Key Authentication

To authenticate with an API key, include it in the request headers:

```bash
curl -H "x-api-key: your-api-key-here" \
     http://localhost:3000/api/users
```

### Clerk Authentication

To authenticate with Clerk, include the JWT token in the Authorization header:

```bash
curl -H "Authorization: Bearer your-clerk-jwt-token" \
     http://localhost:3000/api/users
```

## Implementation Details

### CombinedAuthGuard

The guard implements the following logic:

1. **Check for @Public() decorator**: If present, allow access
2. **Extract API key**: Look for `x-api-key` header
3. **Validate API key**: Use the existing `ApiKeyGuard` for validation
4. **Fallback to Clerk**: If no API key, use `ClerkAuthGuard` for Clerk authentication
5. **Handle errors**: Throw UnauthorizedException for invalid credentials

The `CombinedAuthGuard` reuses the existing `ApiKeyGuard` and `ClerkAuthGuard` to avoid code duplication and maintain consistency.

### API Key Validation

API keys are validated against the database with the following criteria:

- Key exists in the database
- Key is active (`isActive: true`)
- Key is not expired (`expiresAt` is null or in the future)

### Clerk Integration

The guard uses the existing `ClerkAuthGuard` for Clerk authentication, ensuring compatibility with the existing Clerk setup.

## Testing the Authentication

### Test Public Endpoints

```bash
# Health check (public)
curl http://localhost:3000/health

# Webhook example (public)
curl -X POST http://localhost:3000/webhook-example \
     -H "Content-Type: application/json" \
     -d '{"test": "data"}'
```

### Test Protected Endpoints

```bash
# Without authentication (should return 401)
curl http://localhost:3000/protected

# With API key
curl -H "x-api-key: your-api-key" \
     http://localhost:3000/protected

# With Clerk token
curl -H "Authorization: Bearer your-clerk-token" \
     http://localhost:3000/protected
```

## WhatsApp Webhook Configuration

The WhatsApp webhook endpoints are marked as public to allow WhatsApp to send messages:

```typescript
@Controller('whatsapp')
export class WhatsappController {
  @Get('webhook')
  @Public()
  whatsappVerificationChallenge(@Req() request: Request) {
    // WhatsApp verification endpoint
  }

  @Post('webhook')
  @Public()
  async handleIncomingWhatsappMessage(@Body() request: any) {
    // WhatsApp message handling endpoint
  }
}
```

## Security Considerations

1. **API Key Security**: API keys should be stored hashed in the database
2. **Rate Limiting**: Consider implementing rate limiting for public endpoints
3. **Input Validation**: Always validate input data, especially for public endpoints
4. **Logging**: Log authentication attempts for security monitoring
5. **HTTPS**: Ensure all endpoints are served over HTTPS in production

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check if the endpoint is marked as `@Public()` or if authentication credentials are valid
2. **API Key not working**: Verify the key exists in the database and is active
3. **Clerk authentication failing**: Check if Clerk is properly configured and the token is valid

### Debug Mode

To debug authentication issues, you can temporarily add logging to the guard:

```typescript
console.log('API Key present:', !!apiKey);
console.log('Is Public:', isPublic);
```

## File Structure

```
src/auth/guards/
├── combined-auth.guard.ts    # Main authentication guard (reuses other guards)
├── clerk-auth.guard.ts       # Clerk-specific guard
└── api-key.guard.ts          # API key validation logic
```

The `CombinedAuthGuard` is the only guard you need to configure globally. It internally reuses the `ClerkAuthGuard` for Clerk authentication and the `ApiKeyGuard` for API key validation, ensuring code reuse and maintainability. 