import { PickType } from '@nestjs/mapped-types';
import { UploadFileDto } from 'src/common/upload-file.dto';
import { Feed } from '../entities/feed.entity';

export class UpdateFeedDto extends PickType(Feed, [
  'content',
  'title',
  'isPublic',
]) {
  thumbnail: UploadFileDto;
}
