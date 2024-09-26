import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Plan } from './entities/plan.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginationEnum } from 'src/common/enums/pagination.enum';

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
      .addSelect([
        'plan.title',
        'plan.progress',
        'subPlan.title',
        'subPlan.completed',
      ])
      .where('plan.id = :id', { id })
      .andWhere('plan.userId = :userId', { userId })
      .getOne();
  }

  async getPlansByUserIdWithSubPlan(
    paginationDto: PaginationDto,
    userId: string,
  ): Promise<[Plan[], number]> {
    const { page = 1, limit, sort } = paginationDto;
    const skip = (page - 1) * limit;

    const qb = this.createQueryBuilder('plan')
      .innerJoin('plan.subPlans', 'subPlan')
      .addSelect([
        'plan.title',
        'plan.progress',
        'subPlan.title',
        'subPlan.completed',
      ])
      .where('plan.userId = :userId', { userId });

    switch (sort) {
      case PaginationEnum.CREATE_DATE_ASC:
        qb.orderBy('plan.createdAt', 'ASC');
        break;

      case PaginationEnum.CREATE_DATE_DESC:
        qb.orderBy('plan.createdAt', 'DESC');
        break;
    }

    qb.offset(skip).limit(limit);
    return await qb.getManyAndCount();
  }
}
