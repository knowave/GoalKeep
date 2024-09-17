import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feed } from '../entities/feed.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feed])],
  providers: [FeedService],
  exports: [FeedService],
})
export class FeedModule {}
