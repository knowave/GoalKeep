import { Injectable, NotFoundException } from '@nestjs/common';
import { FeedRepository } from './feed.repository';
import { Feed } from '../entities/feed.entity';
import { CreateFeedDto } from './dto/create-feed.dto';
import { User } from 'src/user/entities/user.entity';
import { S3Service } from 'src/s3/s3.service';
import { v4 as uuid } from 'uuid';
import { NOT_FOUND_FEED, NOT_FOUND_PUBLIC_FEED } from '../error/feed.error';
import { IPage } from 'src/common/types/page';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RedisService } from 'src/database/redis/redis.service';

@Injectable()
export class FeedService {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly s3Service: S3Service,
    private readonly redisService: RedisService,
  ) {}

  async createFeed(createFeedDto: CreateFeedDto, user: User): Promise<Feed> {
    const { title, thumbnail, content, isPublic } = createFeedDto;
    let thumbnailUrl: string;

    if (thumbnail) {
      const { fileName, mimeType, fileContent } = thumbnail;
      const newFileName = `${uuid()}-${fileName}`;

      const uploadFile = await this.s3Service.uploadObject(
        newFileName,
        fileContent,
        mimeType,
      );

      thumbnailUrl = uploadFile.Key;
    }

    return await this.feedRepository.save(
      this.feedRepository.create({
        title,
        thumbnail: thumbnailUrl,
        content,
        isPublic: !isPublic ? false : true,
        user,
      }),
    );
  }

  async getMyFeed(feedId: string, userId: string): Promise<Feed> {
    const feed = await this.feedRepository.getFeedByIdAndUserId(feedId, userId);

    if (!feed) throw new NotFoundException(NOT_FOUND_FEED);

    return feed;
  }

  async getMyFeeds(
    paginationDto: PaginationDto,
    userId: string,
  ): Promise<IPage<Feed>> {
    const [feeds, totalCount] =
      await this.feedRepository.getFeedsByUserIdWithUser(paginationDto, userId);

    return {
      data: feeds,
      totalCount,
      pageInfo: {
        currentPage: paginationDto.page,
        totalPages: Math.ceil(totalCount / paginationDto.limit),
        hasNextPage: paginationDto.page * paginationDto.limit < totalCount,
      },
    };
  }

  async getPublicFeed(feedId: string): Promise<Feed> {
    const publicFeed = await this.feedRepository.getFeedByIdAndIsPublic(feedId);

    if (!publicFeed) throw new NotFoundException(NOT_FOUND_PUBLIC_FEED);

    return publicFeed;
  }

  async getPublicFeeds(paginationDto: PaginationDto): Promise<IPage<Feed>> {
    const { page, limit, sort } = paginationDto;

    const [feeds, totalCount] = await this.feedRepository.getFeedsByPublic({
      page,
      limit,
      sort,
    });

    return {
      data: feeds,
      totalCount,
      pageInfo: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page * limit < totalCount,
      },
    };
  }

  async incrementViewCount(feedId: string): Promise<boolean> {
    const feed = await this.getPublicFeed(feedId);
    await this.feedRepository.increment({ id: feed.id }, 'viewCount', 1);
    return true;
  }

  async topTenFeeds(): Promise<Feed[]> {
    const topTenFeeds = await this.redisService.get('topTenFeeds');

    if (topTenFeeds) return JSON.parse(topTenFeeds);

    const feeds = await this.feedRepository.getTopTenFeedsAndSortViewCount();
    await this.redisService.set(
      'topTenFeeds',
      JSON.stringify(feeds),
      'EX',
      300000,
    );

    return feeds;
  }
}
