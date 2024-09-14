import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PlanModule } from './plan/plan.module';
import { CommunityModule } from './community/community.module';
import { MysqlModule } from './database/mysql/mysql.module';

@Module({
  imports: [UserModule, PlanModule, CommunityModule, MysqlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
