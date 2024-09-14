import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Follow } from './follow.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { Feed } from 'src/community/entities/feed.entity';
import { Comment } from 'src/community/entities/comment.entity';
import { Like } from 'src/community/entities/like.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', unique: true, comment: '사용자 이메일' })
  email: string;

  @Column({ type: 'varchar', comment: '사용자 이름' })
  username: string;

  @Column({ type: 'varchar', comment: '사용자 닉네임' })
  nickname: string;

  @Column({
    type: 'varchar',
    length: 128,
    comment: '사용자 비밀번호',
    select: false,
  })
  password: string;

  @Column({ type: 'varchar', comment: '사용자 전화번호' })
  phoneNumber: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '프로필 이미지',
  })
  profileImage: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '사용자 소개글',
  })
  introduction: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: true,
    comment: '사용자 토큰',
    select: false,
  })
  token: string;

  @Column({ type: 'boolean', nullable: true, comment: '탈퇴여부' })
  isDeleted: boolean;

  @Column({ type: 'smallint', default: 0, comment: '총 계획 개수' })
  planCount: number;

  @Column({ type: 'smallint', default: 0, comment: '완료한 계획 개수' })
  completedPlanCount: number;

  @Column({ type: 'smallint', default: 0, comment: '미완료 계획 개수' })
  pendingPlanCount: number;

  @Column({ type: 'smallint', default: 0, comment: '게시글 개수' })
  feedCount: number;

  @Column({ type: 'smallint', default: 0, comment: '팔로워 수' })
  followerCount: number;

  @Column({ type: 'smallint', default: 0, comment: '팔로잉 수' })
  followingCount: number;

  @OneToMany(() => Follow, (follow) => follow.follower, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  following: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  followers: Follow[];

  @OneToMany(() => Plan, (plan) => plan.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  plans: Plan[];

  @OneToMany(() => Feed, (feed) => feed.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  feeds: Feed[];

  @OneToMany(() => Comment, (comment) => comment.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  likes: Like[];
}
