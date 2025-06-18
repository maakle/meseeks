import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';
import { UserResponseSchema } from './dto/user-response.dto';
import { CombinedAuthGuard } from '@/auth/guards/combined-auth.guard';

@ApiTags('Users')
@UseGuards(CombinedAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
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
