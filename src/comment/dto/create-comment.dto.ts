import { IsNotEmpty, MaxLength } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateCommentDto {
  @IsNotEmpty({ message: '댓글 내용을 입력해주세요.' })
  @MaxLength(500, { message: '댓글 내용은 최대 500자까지 입력이 가능합니다.' })
  content: string;

  @IsNotEmpty({ message: 'feed의 Id값을 넣어주세요.' })
  feedId: string;

  @IsNotEmpty({ message: 'user가 없습니다.' })
  user: User;
}
