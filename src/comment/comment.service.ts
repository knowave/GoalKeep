import { Injectable, NotFoundException } from '@nestjs/common';
import { FeedService } from 'src/feed/feed.service';
import { CommentRepository } from './comment.repository';
import { Comment } from 'src/feed/entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NOT_FOUND_COMMENT } from './error/comment.error';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IPage } from 'src/common/types/page';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { DeleteCommentDto } from './dto/delete-comment.dto';

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
    feedId: string,
  ): Promise<IPage<Comment>> {
    const [comments, totalCount] =
      await this.commentRepository.getCommentsByFeedId(paginationDto, feedId);

    return {
      data: comments,
      totalCount,
      pageInfo: {
        currentPage: paginationDto.page,
        totalPages: Math.ceil(totalCount / paginationDto.limit),
        hasNextPage: paginationDto.page * paginationDto.limit < totalCount,
      },
    };
  }

  async updateComment(updateCommentDto: UpdateCommentDto): Promise<boolean> {
    const { content, feedId, userId } = updateCommentDto;

    const comment = await this.getMyCommentById(feedId, userId);

    comment.content = content;
    await this.commentRepository.save(comment);
    return true;
  }

  async deleteComment(deleteCommentDto: DeleteCommentDto): Promise<void> {
    const comment =
      await this.commentRepository.getCommentByIdAndFeedIdAndUserId(
        deleteCommentDto,
      );

    if (!comment) throw new NotFoundException(NOT_FOUND_COMMENT);

    await this.commentRepository.softRemove(comment);
  }

  async getCommentById(commentId: string): Promise<Comment> {
    const comment = await this.commentRepository.getCommentById(commentId);

    if (!comment) throw new NotFoundException(NOT_FOUND_COMMENT);

    return comment;
  }

  async incrementLikeCountByComment(commentId: string): Promise<void> {
    await this.commentRepository.increment({ id: commentId }, 'likeCount', 1);
  }

  async decrementLikeCountByComment(commentId: string): Promise<void> {
    await this.commentRepository.decrement({ id: commentId }, 'likeCount', 1);
  }
}
