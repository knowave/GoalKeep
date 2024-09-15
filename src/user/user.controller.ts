import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: SignUpDto): Promise<User> {
    return await this.userService.signUp(createUserDto);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User> {
    return await this.userService.getUser(id);
  }

  @Get('profile')
  async myProfile(@CurrentUser() user: User): Promise<User> {
    return await this.userService.myProfile(user.id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUser(id, updateUserDto);
  }

  @Patch('password/:id')
  async changePassword(
    @Param('id') id: string,
    @Body('password') password: string,
  ): Promise<void> {
    return await this.userService.changePassword(id, password);
  }

  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    return await this.userService.removeUser(id);
  }
}
