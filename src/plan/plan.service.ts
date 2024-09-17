import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanRepository } from './plan.repository';
import { SubPlanRepository } from './sub-plan.repository';
import { User } from 'src/user/entities/user.entity';
import { Plan } from './entities/plan.entity';
import { UserService } from 'src/user/user.service';
import { NOT_FOUND_PLAN } from './error/plan.error';
import { SubPlan } from './entities/sub-plan.entity';
import { UpdateSubPlansCompletionDto } from './dto/update-sub-plans-completion.dto';
import {
  NOT_FOUND_SUB_PLAN,
  SUB_PLANS_NOT_FOUND,
} from './error/sub-plan.error';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IPage } from 'src/common/types/page';

@Injectable()
export class PlanService {
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly subPlanRepository: SubPlanRepository,
    private readonly userService: UserService,
  ) {}

  async createPlan(createPlanDto: CreatePlanDto, user: User): Promise<Plan> {
    const { title, subPlans } = createPlanDto;

    const plan = this.planRepository.create({
      title,
      user,
    });

    const subPlanEntities = subPlans.map((subPlanDto) =>
      this.subPlanRepository.create({
        ...subPlanDto,
        plan,
        user,
      }),
    );

    await this.planRepository.save(plan);
    await this.subPlanRepository.save(subPlanEntities);
    await this.userService.incrementUserPlanCount(user.id);

    return plan;
  }

  async updatePlan(updatePlanDto: UpdatePlanDto, user: User): Promise<Plan> {
    const { id, title, subPlans } = updatePlanDto;
    const updatedSubPlans: SubPlan[] = [];

    const plan = await this.planRepository.getPlanByIdAndUserIdWithSubPlan(
      id,
      user.id,
    );

    if (!plan) throw new NotFoundException(NOT_FOUND_PLAN);

    if (title) plan.title = title;

    const existSubPlans = plan.subPlans;

    for (const subPlanDto of subPlans) {
      const existSubPlan = existSubPlans.find(
        (subPlan) => subPlan.id === subPlanDto.id,
      );

      if (existSubPlan) {
        if (subPlanDto.title) existSubPlan.title = subPlanDto.title;
        updatedSubPlans.push(existSubPlan);
      }
    }

    await this.subPlanRepository.save(updatedSubPlans);
    return plan;
  }

  async updateSubPlansCompletion(
    updateSubPlansCompletionDto: UpdateSubPlansCompletionDto[],
    user: User,
  ): Promise<void> {
    const updateSubPlans: SubPlan[] = [];

    const subPlans =
      await this.subPlanRepository.getSubPlansByIdAndUserIdWithPlan(
        updateSubPlansCompletionDto.map(
          (updateSubPlansCompletion) => updateSubPlansCompletion.id,
        ),
        user.id,
      );

    if (subPlans.length === 0) throw new NotFoundException(NOT_FOUND_SUB_PLAN);

    const plan = subPlans[0].plan;

    for (const subPlan of subPlans) {
      const dto = updateSubPlansCompletionDto.find(
        (updateSubPlansCompletion) =>
          updateSubPlansCompletion.id === subPlan.id,
      );

      if (dto && dto.completed) {
        subPlan.completed = true;
        updateSubPlans.push(subPlan);
      }
    }
    const updatedSubPlans = await this.subPlanRepository.save(updateSubPlans);

    const totalSubPlansCount = updatedSubPlans.length;
    const completedSubPlansCount = updatedSubPlans.filter(
      (subPlan) => subPlan.completed,
    ).length;

    const progress = Math.round(
      (completedSubPlansCount / totalSubPlansCount) * 100,
    );

    plan.progress = progress;
    if (plan.progress === 100) {
      await this.userService.incrementUserPlanCount(user.id, progress);
    }

    await this.planRepository.save(plan);
  }

  async deletePlan(planId: string, userId: string): Promise<void> {
    const removeSubPlans: SubPlan[] = [];

    const plan = await this.planRepository.getPlanByIdAndUserIdWithSubPlan(
      planId,
      userId,
    );

    if (!plan) throw new NotFoundException(NOT_FOUND_PLAN);

    for (const subPlan of plan.subPlans) {
      removeSubPlans.push(subPlan);
    }

    await this.planRepository.softRemove(plan);
    await this.subPlanRepository.softRemove(removeSubPlans);
  }

  async deleteSubPlans(subPlanIds: string[], userId: string): Promise<void> {
    const removedSubPlans: SubPlan[] = [];

    const subPlans =
      await this.subPlanRepository.getSubPlansByIdAndUserIdWithPlan(
        subPlanIds,
        userId,
      );

    if (subPlanIds.length !== subPlans.length) {
      const missingSubPlanIds = subPlanIds.filter((productId) =>
        subPlans.every((product) => product.id !== productId),
      );
      throw new NotFoundException(SUB_PLANS_NOT_FOUND(missingSubPlanIds));
    }

    for (const subPlan of subPlans) {
      removedSubPlans.push(subPlan);
    }

    await this.subPlanRepository.softRemove(removedSubPlans);
  }

  async getMyPlan(planId: string, userId: string): Promise<Plan> {
    const plan = await this.planRepository.getPlanByIdAndUserIdWithSubPlan(
      planId,
      userId,
    );

    if (!plan) throw new NotFoundException(NOT_FOUND_PLAN);

    return plan;
  }

  async getMyPlans(
    paginationDto: PaginationDto,
    userId: string,
  ): Promise<IPage<Plan>> {
    const [plans, totalCount] =
      await this.planRepository.getPlansByUserIdWithSubPlan(
        paginationDto,
        userId,
      );

    return {
      data: plans,
      totalCount,
      pageInfo: {
        currentPage: paginationDto.page,
        totalPages: Math.ceil(totalCount / paginationDto.limit),
        hasNextPage: paginationDto.page * paginationDto.limit < totalCount,
      },
    };
  }
}
