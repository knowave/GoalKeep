import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Plan } from './entities/plan.entity';

@Injectable()
export class PlanRepository extends Repository<Plan> {
  constructor(private readonly dataSource: DataSource) {
    super(Plan, dataSource.createEntityManager());
  }

  async getPlanByIdAndUserIdWithSubPlan(
    id: string,
    userId: string,
  ): Promise<Plan> {
    return await this.createQueryBuilder('plan')
      .innerJoin('plan.subPlan', 'subPlan')
      .addSelect(['subPlan.title'])
      .where('plan.id = :id', { id })
      .andWhere('plan.userId = :userId', { userId })
      .getOne();
  }
}
