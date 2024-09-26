import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentRepository } from './comment.repository';

@Module({
  providers: [CommentService, CommentRepository],
  controllers: [CommentController],
})
export class CommentModule {}
