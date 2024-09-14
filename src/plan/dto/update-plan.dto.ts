import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { SubPlanDto } from './sub-plan.dto';

export class UpdatePlanDto {
  @IsNotEmpty()
  id: string;

  @IsString()
  title: string;

  @IsArray()
  subPlans: SubPlanDto[];
}
