import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Feed } from '../entities/feed.entity';

@Injectable()
export class FeedRepository extends Repository<Feed> {
  constructor(private readonly dataSource: DataSource) {
    super(Feed, dataSource.createEntityManager());
  }
}
