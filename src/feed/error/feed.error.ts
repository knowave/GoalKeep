import { CommonError } from 'src/common/error.interface';

export const NOT_FOUND_FEED: CommonError = {
  code: 'NOT_FOUND_FEED',
  message: '존재하는 게시물이 없습니다.',
};

export const NOT_FOUND_PUBLIC_FEED: CommonError = {
  code: 'NOT_FOUND_PUBLIC_FEED',
  message: '존재하는 공개 게시물이 없습니다.',
};
