import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feed } from '../entities/feed.entity';
import { UserModule } from 'src/user/user.module';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [TypeOrmModule.forFeature([Feed]), UserModule, S3Module],
  providers: [FeedService],
  exports: [FeedService],
})
export class FeedModule {}
