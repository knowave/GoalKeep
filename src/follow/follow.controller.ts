import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FollowService } from './follow.service';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { IPage } from 'src/common/types/page';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  async follow(
    @CurrentUser() follower: User,
    @Body('name') name: string,
  ): Promise<boolean> {
    return await this.followService.follow(follower, name);
  }

  @Get('followers/')
  async getFollowers(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @CurrentUser() user: User,
  ): Promise<IPage<User>> {
    return await this.followService.getFollowers({ page, limit }, user.id);
  }

  @Get('followers/')
  async getFollowings(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @CurrentUser() user: User,
  ): Promise<IPage<User>> {
    return await this.followService.getFollowings({ page, limit }, user.id);
  }
}
