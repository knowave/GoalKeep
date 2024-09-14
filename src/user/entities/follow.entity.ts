import { BaseEntity } from 'src/common/base.entity';
import { Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Follow extends BaseEntity {
  @ManyToOne(() => User, (user) => user.following)
  follower: User;

  @ManyToOne(() => User, (user) => user.followers)
  following: User;
}
