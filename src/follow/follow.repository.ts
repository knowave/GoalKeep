import { Injectable } from '@nestjs/common';
import { Follow } from 'src/user/entities/follow.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class FollowRepository extends Repository<Follow> {
  constructor(private readonly dataSource: DataSource) {
    super(Follow, dataSource.createEntityManager());
  }

  async getFollow(followerId: string, followingId: string): Promise<Follow> {
    return await this.createQueryBuilder('follow')
      .where('follow.followerId = :followerId', { followerId })
      .andWhere('follow.followingId = :followingId', { followingId })
      .getOne();
  }

  async getFollowersByUserId(userId: string): Promise<Follow[]> {
    return await this.createQueryBuilder('follow')
      .innerJoin('follow.follower', 'follower')
      .select([
        'follower.id',
        'follower.username',
        'follower.nickname',
        'follower.profileImage',
      ])
      .where('follow.followingId = :userId', { userId })
      .getMany();
  }

  async getFollowingsByUserId(userId: string): Promise<Follow[]> {
    return await this.createQueryBuilder('follow')
      .innerJoin('follow.following', 'following')
      .select([
        'following.id',
        'following.username',
        'following.nickname',
        'following.profileImage',
      ])
      .where('follow.followerId = :userId', { userId })
      .getMany();
  }
}
