import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginationEnum } from 'src/common/enums/pagination.enum';
import { Comment } from 'src/feed/entities/comment.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CommentRepository extends Repository<Comment> {
  constructor(private readonly dataSource: DataSource) {
    super(Comment, dataSource.createEntityManager());
  }

  async getCommentByIdAndUserIdWithUserAndFeed(
    commentId: string,
    userId: string,
  ): Promise<Comment> {
    return await this.createQueryBuilder('comment')
      .innerJoin('comment.user', 'user')
      .innerJoin('comment.feed', 'comment')
      .addSelect([
        'comment.id',
        'comment.createdAt',
        'comment.updatedAt',
        'comment.content',
        'comment.likeCount',
        'user.username',
        'user.nickname',
        'user.profileImage',
        'feed.id',
        'feed.title',
        'feed.thumbnail',
      ])
      .where('comment.id = :commentId', { id: commentId })
      .andWhere('comment.userId = :userId', { userId })
      .getOne();
  }

  async getCommentsByFeedId(
    paginationDto: PaginationDto,
    feedId: string,
  ): Promise<[Comment[], number]> {
    const { page = 1, limit, sort } = paginationDto;
    const skip = (page - 1) * limit;

    const qb = this.createQueryBuilder('comment')
      .innerJoin('comment.user', 'user')
      .addSelect([
        'comment.id',
        'comment.content',
        'comment.likeCount',
        'comment.createdAt',
        'comment.updatedAt',
        'user.username',
        'user.nickname',
        'user.profileImage',
      ])
      .where('comment.feedId = :feedId', { feedId });

    switch (sort) {
      case PaginationEnum.CREATE_DATE_ASC:
        qb.orderBy('comment.createdAt', 'ASC');
        break;
      case PaginationEnum.CREATE_DATE_DESC:
        qb.orderBy('comment.createdAt', 'DESC');
        break;

      default:
        qb.orderBy('comment.createdAt', 'DESC');
        break;
    }

    qb.offset(skip).limit(limit);
    return await qb.getManyAndCount();
  }
}
