import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UpsertUserDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }

  @Post()
  async createUser(@Body() userData: UpsertUserDto) {
    return this.userService.upsertUser(userData);
  }
}
