import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feed } from './entities/feed.entity';
import { UserModule } from 'src/user/user.module';
import { S3Module } from 'src/s3/s3.module';
import { RedisConfigModule } from 'src/database/redis/redis-config.module';
import { FeedRepository } from './feed.repository';
import { FeedController } from './feed.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feed]),
    UserModule,
    S3Module,
    RedisConfigModule,
  ],
  providers: [FeedService, FeedRepository],
  controllers: [FeedController],
  exports: [FeedService],
})
export class FeedModule {}
