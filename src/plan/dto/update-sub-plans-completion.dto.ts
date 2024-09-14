import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateSubPlansCompletionDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsBoolean()
  @IsNotEmpty()
  completed: boolean;
}
