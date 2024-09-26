import { IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateCommentDto {
  @IsNotEmpty({ message: '댓글 내용을 입력해주세요.' })
  @MaxLength(500, { message: '댓글 내용은 최대 500자까지 입력이 가능합니다.' })
  content: string;

  @IsNotEmpty({ message: 'feed의 Id값은 필수값입니다..' })
  feedId: string;

  @IsNotEmpty({ message: 'user의 id값은 필수값입니다.' })
  userId: string;
}
