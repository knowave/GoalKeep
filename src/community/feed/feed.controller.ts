import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { FeedService } from './feed.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Feed } from '../entities/feed.entity';
import { IPage } from 'src/common/types/page';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('feeds')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post('')
  async createFeed(
    @Body() createFeedDto: CreateFeedDto,
    @CurrentUser() user: User,
  ): Promise<Feed> {
    return await this.feedService.createFeed(createFeedDto, user);
  }

  @Post(':feedId/view-count')
  async incrementViewCount(@Param('feedId') feedId: string): Promise<boolean> {
    return await this.feedService.incrementViewCount(feedId);
  }

  @Get(':feedId')
  async getMyFeed(
    @Param('feedId') feedId: string,
    @CurrentUser() user: User,
  ): Promise<Feed> {
    return await this.feedService.getMyFeed(feedId, user.id);
  }

  @Get('')
  async getMyFeeds(
    @Query() paginationDto: PaginationDto,
    @CurrentUser() user: User,
  ): Promise<IPage<Feed>> {
    return await this.feedService.getMyFeeds(paginationDto, user.id);
  }

  @Get('public/:feedId')
  async getPublicFeed(@Param('feedId') feedId: string): Promise<Feed> {
    return await this.feedService.getPublicFeed(feedId);
  }

  @Get('public')
  async getPublicFeeds(
    @Query() paginationDto: PaginationDto,
  ): Promise<IPage<Feed>> {
    return await this.feedService.getPublicFeeds(paginationDto);
  }
}
