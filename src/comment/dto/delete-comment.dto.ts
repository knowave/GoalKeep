import { IsNotEmpty } from 'class-validator';

export class DeleteCommentDto {
  @IsNotEmpty({ message: 'feed의 id값은 필수값입니다.' })
  feedId: string;

  @IsNotEmpty({ message: 'comment의 id값은 필수값입니다.' })
  commentId: string;

  @IsNotEmpty({ message: 'user의 id값은 필수값입니다.' })
  userId: string;
}
