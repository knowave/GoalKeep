import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Plan } from './entities/plan.entity';
import { UpdateSubPlansCompletionDto } from './dto/update-sub-plans-completion.dto';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post('')
  async createPlan(
    @Body() createPlanDto: CreatePlanDto,
    @CurrentUser() user: User,
  ): Promise<Plan> {
    return await this.planService.createPlan(createPlanDto, user);
  }

  @Patch('')
  async updatePlan(
    @Body() updatePlanDto: UpdatePlanDto,
    @CurrentUser() user: User,
  ): Promise<Plan> {
    return await this.planService.updatePlan(updatePlanDto, user);
  }

  @Patch('complted')
  async updateSubPlansCompletion(
    @Body() updateSubPlansCompletionDto: UpdateSubPlansCompletionDto[],
    @CurrentUser() user: User,
  ): Promise<void> {
    return await this.planService.updateSubPlansCompletion(
      updateSubPlansCompletionDto,
      user,
    );
  }
}
