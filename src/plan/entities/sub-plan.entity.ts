import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Plan } from './plan.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class SubPlan extends BaseEntity {
  @Column({ type: 'varchar', length: 255, comment: '세부 계획 이름' })
  title: string;

  @Column({ type: 'boolean', default: false, comment: '완료 여부' })
  completed: boolean;

  @ManyToOne(() => Plan, (plan) => plan.subPlans, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  plan: Plan;

  @ManyToOne(() => User, (user) => user.subPlans, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;
}
