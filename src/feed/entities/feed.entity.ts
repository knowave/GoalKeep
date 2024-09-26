import { BaseEntity } from 'src/common/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Comment } from './comment.entity';
import { Like } from './like.entity';

@Entity()
export class Feed extends BaseEntity {
  @Column({ type: 'varchar', length: 50, comment: 'Feed 제목' })
  title: string;

  @Column({ type: 'text', comment: 'Feed 썸네일', nullable: true })
  thumbnail?: string;

  @Column({ type: 'text', comment: 'Feed 글' })
  content: string;

  @Column({ type: 'boolean', default: true, comment: '공개 여부' })
  isPublic: boolean;

  @Column({ type: 'int', default: 0, comment: '조회수' })
  viewCount: number;

  @Column({ type: 'int', default: 0, comment: '좋아요 수' })
  likeCount: number;

  @ManyToOne(() => User, (user) => user.feeds, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.feed, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.feed, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  likes: Like[];
}
