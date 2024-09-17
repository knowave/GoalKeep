import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreateFeedDto } from './feed/dto/create-feed.dto';
import { UpdateFeedDto } from './feed/dto/update-feed.dto';

@Controller('Community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Post()
  create(@Body() createFeedDto: CreateFeedDto) {
    return this.communityService.create(createFeedDto);
  }

  @Get()
  findAll() {
    return this.communityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.communityService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFeedDto: UpdateFeedDto) {
    return this.communityService.update(+id, updateFeedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.communityService.remove(+id);
  }
}
