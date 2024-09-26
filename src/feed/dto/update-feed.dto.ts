import { PickType } from '@nestjs/mapped-types';
import { Feed } from 'src/community/feed/entities/feed.entity';
import { UploadFileDto } from 'src/common/upload-file.dto';

export class UpdateFeedDto extends PickType(Feed, [
  'content',
  'title',
  'isPublic',
]) {
  thumbnail: UploadFileDto;
}
