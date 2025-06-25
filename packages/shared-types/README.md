# @meseeks/shared-types

Shared TypeScript types and validation classes between the API and frontend using class-validator.

## Usage

### In API (NestJS)

```typescript
import { CreateUserDto, User, ApiResponse } from '@meseeks/shared-types';

@Post()
async createUser(@Body() createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
  // Validation happens automatically via ValidationPipe
  // No manual validation needed!
  return this.userService.create(createUserDto);
}
```

### In Frontend (Next.js)

```typescript
import { CreateUserDto, User, ApiResponse } from '@meseeks/shared-types';

// Type safety for API calls
const createUser = async (data: CreateUserDto): Promise<ApiResponse<User>> => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

// Form validation (if needed)
import { validate } from 'class-validator';

const validateForm = async (data: CreateUserDto) => {
  const userDto = Object.assign(new CreateUserDto(), data);
  const errors = await validate(userDto);
  return errors;
};
```

## Structure

- `api/` - API response types and common API interfaces
- `models/` - Domain models and enums
- `dto/` - Data Transfer Objects with class-validator decorators
- `validation/` - Common validation classes (PaginationDto, SearchDto, etc.)

## Benefits

✅ **NestJS Native**: Works seamlessly with ValidationPipe, Swagger, etc.
✅ **Type Safety**: Shared interfaces between API and frontend
✅ **Auto-validation**: No manual validation needed in NestJS
✅ **Decorator-based**: Familiar class-validator syntax
✅ **Monorepo Ready**: Works with your existing turbo/pnpm setup

## Development

```bash
# Build the package
pnpm build

# Watch for changes
pnpm dev

# Type check
pnpm type-check
```

## Adding New DTOs

1. Create a new class with class-validator decorators
2. Export it from `src/dto/index.ts`
3. Build the package
4. Use in your NestJS controllers with automatic validation 