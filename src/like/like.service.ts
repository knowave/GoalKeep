import { Injectable } from '@nestjs/common';
import { LikeRepository } from './like.repository';
import { User } from 'src/user/entities/user.entity';
import { FeedService } from 'src/feed/feed.service';
import { CommentService } from 'src/comment/comment.service';

@Injectable()
export class LikeService {
  constructor(
    private readonly likeRepository: LikeRepository,
    private readonly feedService: FeedService,
    private readonly commentService: CommentService,
  ) {}

  async feedLike(feedId: string, user: User): Promise<boolean> {
    const feed = await this.feedService.getPublicFeed(feedId);
    const isLike = await this.likeRepository.getLikeByFeedIdAndUserId(
      feedId,
      user.id,
    );

    if (isLike) {
      if (isLike.deletedAt) {
        await this.likeRepository.restore(isLike.id);
        await this.feedService.incrementLikeCountByFeed(feedId);
        return true;
      } else {
        await this.feedService.decrementLikeCountByFeed(feedId);
        await this.likeRepository.softRemove(isLike);
        return false;
      }
    } else {
      await this.feedService.incrementLikeCountByFeed(feedId);
      await this.likeRepository.save(
        this.likeRepository.create({
          feed,
          user,
        }),
      );

      return true;
    }
  }

  async commentLike(commentId: string, user: User): Promise<boolean> {
    const comment = await this.commentService.getCommentById(commentId);
    const isLike = await this.likeRepository.getLikeByCommentIdAndUserId(
      commentId,
      user.id,
    );

    if (isLike) {
      if (isLike.deletedAt) {
        await this.likeRepository.restore(isLike.id);
        await this.commentService.incrementLikeCountByComment(commentId);
      } else {
        await this.commentService.decrementLikeCountByComment(commentId);
        await this.likeRepository.softRemove(isLike);
      }
    } else {
      await this.commentService.incrementLikeCountByComment(commentId);
      await this.likeRepository.save(
        this.likeRepository.create({
          comment,
          user,
        }),
      );

      return true;
    }
  }
}
