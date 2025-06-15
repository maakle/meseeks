import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UpsertUserDto } from './dto/upsert-user';
import { RequireApiKey } from '../auth/api-key.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @RequireApiKey()
  async getUserById(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }

  @Post()
  @RequireApiKey()
  async createUser(@Body() dto: UpsertUserDto) {
    return this.userService.upsertUser(dto);
  }
}
