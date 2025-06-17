import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RequireApiKey } from '../auth/api-key.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';
import { UserResponseSchema } from './dto/user-response.dto';
import { CombinedAuthGuard } from '@/auth/combined-auth.guard';

@ApiTags('users')
@UseGuards(CombinedAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @RequireApiKey()
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the user',
    schema: zodToOpenAPI(UserResponseSchema),
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  async getUserById(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }
}
