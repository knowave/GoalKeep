import { IsOptional, IsString } from 'class-validator';

export class UploadFileDto {
  @IsString()
  fileName: string;

  @IsString()
  mimeType: string;

  @IsOptional()
  fileContent: Buffer;
}
