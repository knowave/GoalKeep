import { Body, Controller, Post } from '@nestjs/common';
import { FeedService } from './feed.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Feed } from '../entities/feed.entity';

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
}
