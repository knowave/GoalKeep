import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { INVALID_AUTH_ERROR } from './error/auth.error';
import {
  JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  JWT_REFRESH_TOKEN_SECRET,
} from 'src/common/env';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async getUserIfRefreshTokenMatches(id: string, token: string): Promise<User> {
    const user = await this.userService.getUser(id);

    const isRefreshTokenMatching = await bcrypt.compare(token, user.token);

    if (isRefreshTokenMatching) return user;
  }

  async validateUser(id: string, plainTextPassword: string): Promise<any> {
    const user = await this.userService.getUser(id);
    await this.verifyPassword(plainTextPassword, user.password);

    delete user.password;
    return user;
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;

    const user = await this.userService.getUserByEmail(email);
    const isValidationUser = await this.validateUser(user.id, password);

    if (!isValidationUser) throw new BadRequestException(INVALID_AUTH_ERROR);

    const accessToken = this.createAccessToken(user.id);
    const refreshToken = this.createRefreshToken(user.id);

    await this.userService.setCurrentRefreshToken(refreshToken, user.id);
    return { accessToken, refreshToken };
  }

  async logout(userId: string): Promise<void> {
    await this.userService.removeRefreshToken(userId);
  }

  private createAccessToken(userId: string) {
    const payload = { userId };
    return this.jwtService.sign(payload, {
      secret: JWT_ACCESS_TOKEN_SECRET,
      expiresIn: JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    });
  }

  private createRefreshToken(userId: string) {
    const payload = { userId };
    return this.jwtService.sign(payload, {
      secret: JWT_REFRESH_TOKEN_SECRET,
      expiresIn: JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    });
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatch = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!isPasswordMatch) {
      throw new BadRequestException(INVALID_AUTH_ERROR);
    }
  }
}
