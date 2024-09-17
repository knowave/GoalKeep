import { Injectable } from '@nestjs/common';
import { CreateFeedDto } from './feed/dto/create-feed.dto';
import { UpdateFeedDto } from './feed/dto/update-feed.dto';

@Injectable()
export class CommunityService {
  create(createFeedDto: CreateFeedDto) {
    return 'This action adds a new feed';
  }

  findAll() {
    return `This action returns all feed`;
  }

  findOne(id: number) {
    return `This action returns a #${id} feed`;
  }

  update(id: number, updateFeedDto: UpdateFeedDto) {
    return `This action updates a #${id} feed`;
  }

  remove(id: number) {
    return `This action removes a #${id} feed`;
  }
}
