import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { UploadFileDto } from 'src/common/upload-file.dto';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력해주세요' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요' })
  @Matches(/^[가-힣a-zA-Z]{2,10}$/, {
    message: '이름은 한글, 영문 2~10자로 입력해주세요',
  })
  username: string;

  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요' })
  @Matches(/^[가-힣a-zA-Z]{2,20}$/, {
    message: '닉네임은 한글, 영문 2~20자로 입력해주세요',
  })
  nickname: string;

  @IsNotEmpty({ message: '비밀번호를 입력해주세요' })
  @Matches(
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
    {
      message:
        '비밀번호는 영문 대소문자, 숫자, 특수문자를 포함한 8~20자로 입력해주세요',
    },
  )
  password: string;

  @IsString()
  @IsNotEmpty({ message: '전화번호를 입력해주세요' })
  @Matches(/^\d{3}-\d{3,4}-\d{4}$/, {
    message: '전화번호 형식에 맞게 입력해주세요',
  })
  phoneNumber: string;

  profileImage?: UploadFileDto;

  @MaxLength(100, { message: '100자 이하로 작성해주세요.' })
  introduction: string;
}
