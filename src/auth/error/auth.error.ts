import { CommonError } from 'src/common/error.interface';

export const INVALID_AUTH_ERROR: CommonError = {
  code: 'INVALID_AUTH_ERROR',
  message: '잘못된 비밀번호 입니다.',
};
