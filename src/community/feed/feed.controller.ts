import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Feed } from '../entities/feed.entity';
import { IPage } from 'src/common/types/page';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { UpdateFeedDto } from './dto/update-feed.dto';

@Controller('feeds')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post('')
  async createFeed(
    @Body() createFeedDto: CreateFeedDto,
    @UploadedFile() thumbnail: Express.Multer.File,
    @CurrentUser() user: User,
  ): Promise<Feed> {
    createFeedDto.thumbnail = {
      fileName: thumbnail.originalname,
      mimeType: thumbnail.mimetype,
      fileContent: thumbnail.buffer,
    };

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

  @Get('top-ten')
  @Public()
  async topTenFeeds(): Promise<Feed[]> {
    return await this.feedService.topTenFeeds();
  }

  @Patch('/:feedId')
  async updateFeed(
    @Param('feedId') feedId: string,
    @UploadedFile() thumbnail: Express.Multer.File,
    @Body() updateFeedDto: UpdateFeedDto,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    updateFeedDto.thumbnail = {
      fileName: thumbnail.originalname,
      mimeType: thumbnail.mimetype,
      fileContent: thumbnail.buffer,
    };

    return await this.feedService.updateFeed(updateFeedDto, feedId, user.id);
  }

  @Post(':feedId')
  async removeFeed(
    @Param('feedId') feedId: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    return await this.feedService.removeFeed(feedId, user.id);
  }
}
