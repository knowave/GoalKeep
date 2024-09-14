import { CommonError } from 'src/common/error.interface';

export const ALREADY_EXIST_USER: CommonError = {
  code: 'ALREADY_EXIST_USER',
  message: '해당 이메일은 이미 존재합니다.',
};

export const NOT_FOUND_USER: CommonError = {
  code: 'NOT_FOUND_USER',
  message: '존재하지 않는 회원입니다.',
};
