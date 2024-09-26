import { Injectable } from '@nestjs/common';
import { Like } from 'src/feed/entities/like.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class LikeRepository extends Repository<Like> {
  constructor(private readonly dataSource: DataSource) {
    super(Like, dataSource.createEntityManager());
  }

  async getLikeByFeedIdAndUserId(
    feedId: string,
    userId: string,
  ): Promise<Like> {
    return await this.createQueryBuilder('like')
      .where('like.feedId = :feedId', { feedId })
      .andWhere('like.userId = :userId', { userId })
      .getOne();
  }
}
