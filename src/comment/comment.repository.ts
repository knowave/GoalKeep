import { Injectable } from '@nestjs/common';
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
        'feed.id',
        'feed.title',
        'feed.thumbnail',
      ])
      .where('comment.id = :commentId', { id: commentId })
      .andWhere('comment.userId = :userId', { userId })
      .getOne();
  }
}
