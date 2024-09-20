import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Feed } from '../entities/feed.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginationEnum } from 'src/common/enums/pagination.enum';

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

  async getFeedsByUserIdWithUser(
    paginationDto: PaginationDto,
    userId: string,
  ): Promise<[Feed[], number]> {
    const { page, limit, sort } = paginationDto;
    const skip = (page - 1) * limit;

    const qb = this.createQueryBuilder('feed')
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
      .where('feed.userId = :userId', { userId });

    switch (sort) {
      case PaginationEnum.VIEW_COUNT_ASC:
        qb.orderBy('feed.viewCount', 'ASC');
        break;

      case PaginationEnum.VIEW_COUNT_DESC:
        qb.orderBy('feed.viewCount', 'DESC');
        break;

      case PaginationEnum.CREATE_DATE_ASC:
        qb.orderBy('feed.createdAt', 'ASC');
        break;

      default:
        qb.orderBy('feed.createdAt', 'DESC');
        break;
    }

    qb.offset(skip).limit(limit);
    return await qb.getManyAndCount();
  }
}
