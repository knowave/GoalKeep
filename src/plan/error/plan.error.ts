import { CommonError } from 'src/common/error.interface';

export const NOT_FOUND_PLAN: CommonError = {
  code: 'NOT_FOUND_PLAN',
  message: '존재하는 계획이 없습니다.',
};
