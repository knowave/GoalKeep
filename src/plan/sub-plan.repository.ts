import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SubPlan } from './entities/sub-plan.entity';

@Injectable()
export class SubPlanRepository extends Repository<SubPlan> {
  constructor(private readonly dataSource: DataSource) {
    super(SubPlan, dataSource.createEntityManager());
  }

  async getSubPlansByIdAndUserIdWithPlan(
    ids: string[],
    userId: string,
  ): Promise<SubPlan[]> {
    return await this.createQueryBuilder('subPlan')
      .innerJoin('subPlan.plan', 'plan')
      .innerJoin('subPlan.user', 'user')
      .addSelect(['plan.progress', 'user.completedPlanCount'])
      .where('subPlan.id IN (:...ids)', { ids })
      .andWhere('subPlan.userId = :userId', { userId })
      .getMany();
  }
}
