import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Plan } from './entities/plan.entity';
import { UpdateSubPlansCompletionDto } from './dto/update-sub-plans-completion.dto';
import { IPage } from 'src/common/types/page';
import { PaginationDto } from 'src/common/dto/pagination.dto';

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

  @Get(':planId')
  async getMyPlan(
    @Param('planId') planId: string,
    @CurrentUser() user: User,
  ): Promise<Plan> {
    return await this.planService.getMyPlan(planId, user.id);
  }

  @Get('')
  async getMyPlans(
    @Query() paginationDto: PaginationDto,
    @CurrentUser() user: User,
  ): Promise<IPage<Plan>> {
    return await this.planService.getMyPlans(paginationDto, user.id);
  }

  @Patch('')
  async updatePlan(
    @Body() updatePlanDto: UpdatePlanDto,
    @CurrentUser() user: User,
  ): Promise<Plan> {
    return await this.planService.updatePlan(updatePlanDto, user);
  }

  @Patch('completed')
  async updateSubPlansCompletion(
    @Body() updateSubPlansCompletionDto: UpdateSubPlansCompletionDto[],
    @CurrentUser() user: User,
  ): Promise<void> {
    return await this.planService.updateSubPlansCompletion(
      updateSubPlansCompletionDto,
      user,
    );
  }

  @Delete(':id')
  async deletePlan(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    return await this.planService.deletePlan(id, user.id);
  }

  @Delete('sub-plans')
  async deleteSubPlans(
    @Body('subPlanIds') subPlanIds: string[],
    @CurrentUser() user: User,
  ): Promise<void> {
    return await this.planService.deleteSubPlans(subPlanIds, user.id);
  }
}
