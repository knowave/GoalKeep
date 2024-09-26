import { Injectable } from '@nestjs/common';
import { FeedService } from 'src/feed/feed.service';
import { CommentRepository } from './comment.repository';
import { Comment } from 'src/feed/entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly feedService: FeedService,
    private readonly commentRepository: CommentRepository,
  ) {}

  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { content, feedId, user } = createCommentDto;
    const feed = await this.feedService.getPublicFeed(feedId);

    await this.commentRepository.save(
      this.commentRepository.create({
        content,
        feed,
        user,
      }),
    );
    return;
  }
}
