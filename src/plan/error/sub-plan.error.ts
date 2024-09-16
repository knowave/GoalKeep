import { CommonError } from 'src/common/error.interface';

export const NOT_FOUND_SUB_PLAN: CommonError = {
  code: 'NOT_FOUND_SUB_PLAN',
  message: '존재하는 세부 계획이 없습니다.',
};

export const SUB_PLANS_NOT_FOUND = (subPlanIds: string[]): CommonError => ({
  code: 'SUB_PLANS_NOT_FOUND',
  message: `[${subPlanIds}] 세부 계획이 존재하지 않습니다.`,
});
