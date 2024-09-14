import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { SubPlanDto } from './sub-plan.dto';

export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  subPlans: SubPlanDto[];
}
