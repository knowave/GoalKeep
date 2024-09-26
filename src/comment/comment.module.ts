import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentRepository } from './comment.repository';
import { FeedModule } from 'src/feed/feed.module';

@Module({
  imports: [FeedModule],
  providers: [CommentService, CommentRepository],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
