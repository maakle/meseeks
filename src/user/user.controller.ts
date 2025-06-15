import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UpsertUserDto } from './dto/upsert-user';
import { RequireApiKey } from '../auth/api-key.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @RequireApiKey()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the user',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        phoneNumber: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  async getUserById(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }

  @Post()
  @RequireApiKey()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create or update a user' })
  @ApiResponse({
    status: 201,
    description: 'User created/updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        phoneNumber: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  async createUser(@Body() dto: UpsertUserDto) {
    return this.userService.upsertUser(dto);
  }
}
