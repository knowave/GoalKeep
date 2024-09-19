import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Feed } from '../entities/feed.entity';

@Injectable()
export class FeedRepository extends Repository<Feed> {
  constructor(private readonly dataSource: DataSource) {
    super(Feed, dataSource.createEntityManager());
  }

  async getFeedByIdAndUserId(id: string, userId: string): Promise<Feed> {
    return await this.createQueryBuilder('feed')
      .innerJoin('feed.user', 'user')
      .addSelect([
        'feed.id',
        'feed.title',
        'feed.content',
        'feed.thumbnail',
        'feed.isPublic',
        'feed.createdAt',
        'user.name',
      ])
      .where('feed.id = :id', { id })
      .andWhere('feed.userId = :userId', { userId })
      .getOne();
  }
}
