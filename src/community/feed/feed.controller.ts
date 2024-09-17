import { Controller } from '@nestjs/common';
import { FeedService } from './feed.service';

@Controller('feeds')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}
}
