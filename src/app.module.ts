import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PlanModule } from './plan/plan.module';
import { CommunityModule } from './community/community.module';
import { MysqlModule } from './database/mysql/mysql.module';
import { S3Module } from './s3/s3.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { FollowModule } from './follow/follow.module';

@Module({
  imports: [
    UserModule,
    PlanModule,
    CommunityModule,
    MysqlModule,
    S3Module,
    AuthModule,
    FollowModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
