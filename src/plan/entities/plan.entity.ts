import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { SubPlan } from './sub-plan.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Plan extends BaseEntity {
  @Column({ type: 'varchar', length: 255, comment: '총 계획 이름' })
  title: string;

  @Column({ type: 'float', default: 0, comment: '진행 퍼센트' })
  progress: number;

  @OneToMany(() => SubPlan, (subPlan) => subPlan.plan, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  subPlans: SubPlan[];

  @ManyToOne(() => User, (user) => user.plans, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;
}
