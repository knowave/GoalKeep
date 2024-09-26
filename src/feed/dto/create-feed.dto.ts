import { IsNotEmpty, IsString } from 'class-validator';
import { UploadFileDto } from 'src/common/upload-file.dto';

export class CreateFeedDto {
  @IsString()
  @IsNotEmpty({ message: '게시물 제목은 필수 입력 값입니다.' })
  title: string;

  thumbnail?: UploadFileDto;

  @IsString()
  @IsNotEmpty({ message: '게시물 글은 필수 입력 값입니다.' })
  content: string;

  isPublic?: boolean;
}
