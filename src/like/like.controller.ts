import { Controller, Param, Post } from '@nestjs/common';
import { LikeService } from './like.service';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('/feed/:feedId')
  async feedLike(
    @Param('feedId') feedId: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.likeService.feedLike(feedId, user);
  }

  @Post('/comment/:commentId')
  async commentLike(
    @Param('commentId') commentId: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.likeService.commentLike(commentId, user);
  }
}
