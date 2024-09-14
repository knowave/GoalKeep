import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;
}
