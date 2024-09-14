import { BaseEntity } from 'src/common/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, ManyToOne } from 'typeorm';
import { Feed } from './feed.entity';
import { Comment } from './comment.entity';

@Entity()
export class Like extends BaseEntity {
  @ManyToOne(() => User, (user) => user.likes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Feed, (feed) => feed.likes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  feed: Feed;

  @ManyToOne(() => Comment, (comment) => comment.likes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  comment: Comment;
}
