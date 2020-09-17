import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
  constructor(public errors: ValidationError[]) {
    super('Invalid signup request params');

    // Only needed because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  statusCode = 400;

  serializeErrors() {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });
  }
}
