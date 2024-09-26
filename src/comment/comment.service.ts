import { Injectable, NotFoundException } from '@nestjs/common';
import { FeedService } from 'src/feed/feed.service';
import { CommentRepository } from './comment.repository';
import { Comment } from 'src/feed/entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NOT_FOUND_COMMENT } from './error/comment.error';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IPage } from 'src/common/types/page';

@Injectable()
export class CommentService {
  constructor(
    private readonly feedService: FeedService,
    private readonly commentRepository: CommentRepository,
  ) {}

  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { content, feedId, user } = createCommentDto;
    const feed = await this.feedService.getPublicFeed(feedId);

    await this.commentRepository.save(
      this.commentRepository.create({
        content,
        feed,
        user,
      }),
    );
    return;
  }

  async getMyCommentById(commentId: string, userId: string): Promise<Comment> {
    const comment =
      await this.commentRepository.getCommentByIdAndUserIdWithUserAndFeed(
        commentId,
        userId,
      );

    if (!comment) throw new NotFoundException(NOT_FOUND_COMMENT);

    return comment;
  }

  async getCommentsByFeedId(
    paginationDto: PaginationDto,
    feeId: string,
  ): Promise<IPage<Comment>> {
    return;
  }
}
