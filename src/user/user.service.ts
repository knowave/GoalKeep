import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { ALREADY_EXIST_USER, NOT_FOUND_USER } from './error/user.error';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/common/env';
import { v4 as uuid } from 'uuid';
import { S3Service } from 'src/s3/s3.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly s3Service: S3Service,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const {
      email,
      username,
      nickname,
      password,
      phoneNumber,
      profileImage,
      introduction,
    } = signUpDto;
    let profileImageUrl: string;

    const existEmail = await this.userRepository.getUserByEmail(email);

    if (existEmail) throw new BadRequestException(ALREADY_EXIST_USER);

    const hashedPassword = await this.hashPassword(password);

    if (profileImage) {
      const { fileName, mimeType, fileContent } = profileImage;
      const newFileName = `${uuid()}-${fileName}`;

      const uploadFile = await this.s3Service.uploadObject(
        newFileName,
        fileContent,
        mimeType,
      );

      profileImageUrl = uploadFile.Key;
    }

    const savedUser = await this.userRepository.save(
      this.userRepository.create({
        email,
        username,
        nickname,
        password: hashedPassword,
        phoneNumber,
        profileImage: profileImageUrl ?? null,
        introduction: introduction ?? null,
      }),
    );

    delete savedUser.password;
    delete savedUser.token;

    return savedUser;
  }

  async getUser(id: string): Promise<User> {
    const user = await this.userRepository.getUserById(id);

    if (user) throw new NotFoundException(NOT_FOUND_USER);

    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) throw new NotFoundException(NOT_FOUND_USER);

    return user;
  }

  async setCurrentRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<User> {
    const user = await this.getUser(userId);

    user.token = refreshToken;
    return await this.userRepository.save(user);
  }

  async removeRefreshToken(id: string): Promise<boolean> {
    const user = await this.getUser(id);

    user.token = null;
    await this.userRepository.save(user);
    return true;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const {
      email,
      username,
      nickname,
      phoneNumber,
      profileImage,
      introduction,
    } = updateUserDto;

    const user = await this.getUser(id);

    if (email) user.email = email;
    if (username) user.username = username;
    if (nickname) user.nickname = nickname;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (introduction) user.introduction = introduction;

    if (profileImage) {
      if (user.profileImage) {
        const url = user.profileImage.split('/');
        const fileName = url.slice(-1)[0];
        await this.s3Service.deleteObject(fileName);
      }

      const { fileName, mimeType, fileContent } = profileImage;
      const newFileName = `${uuid()}-${fileName}`;

      const uploadFile = await this.s3Service.uploadObject(
        newFileName,
        fileContent,
        mimeType,
      );

      user.profileImage = uploadFile.Key;
    }

    return await this.userRepository.save(user);
  }

  async changePassword(id: string, password: string): Promise<void> {
    const user = await this.getUser(id);
    const hashedPassword = await this.hashPassword(password);

    user.password = hashedPassword;
    await this.userRepository.save(user);
  }

  async removeUser(id: string): Promise<void> {
    const user = await this.getUser(id);
    await this.userRepository.softRemove(user);
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }
}
