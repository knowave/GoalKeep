import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class SubPlanDto {
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  completed: boolean;
}
