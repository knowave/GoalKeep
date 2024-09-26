import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { LikeRepository } from './like.repository';
import { FeedModule } from 'src/feed/feed.module';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports: [FeedModule, CommentModule],
  providers: [LikeService, LikeRepository],
  controllers: [LikeController],
})
export class LikeModule {}
