import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Comment } from 'src/feed/entities/comment.entity';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':feedId')
  async createComment(
    @Param('feedId') feedId: string,
    @Body('content') content: string,
    @CurrentUser() user: User,
  ): Promise<Comment> {
    return await this.commentService.createComment({ content, feedId, user });
  }

  @Get(':commentId')
  async getMyCommentById(
    @Param('commentId') commentId: string,
    @CurrentUser() user: User,
  ): Promise<Comment> {
    return await this.commentService.getMyCommentById(commentId, user.id);
  }
}
