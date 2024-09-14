export interface CommonError {
  code: string;
  message: string;
}

export interface UnexpectedError extends CommonError {
  isUnexpected: true;
}
