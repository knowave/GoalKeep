import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async signUp(
    @Body() signUpDto: SignUpDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      signUpDto.profileImage = {
        fileName: file.originalname,
        mimeType: file.mimetype,
        fileContent: file.buffer,
      };
    }

    return await this.userService.signUp(signUpDto);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User> {
    return await this.userService.getUser(id);
  }

  @Get('profile')
  async myProfile(@CurrentUser() user: User): Promise<User> {
    return await this.userService.myProfile(user.id);
  }

  @Patch('')
  async updateUser(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    updateUserDto.profileImage = {
      fileName: file.originalname,
      mimeType: file.mimetype,
      fileContent: file.buffer,
    };

    return await this.userService.updateUser(user.id, updateUserDto);
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
