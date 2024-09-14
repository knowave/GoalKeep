import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { PlanRepository } from './plan.repository';
import { SubPlanRepository } from './sub-plan.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { SubPlan } from './entities/sub-plan.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Plan, SubPlan]), UserModule],
  controllers: [PlanController],
  providers: [PlanService, PlanRepository, SubPlanRepository],
})
export class PlanModule {}
