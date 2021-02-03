/* tslint:disable:no-console */
import {ErrorRequestHandler, NextFunction, Request, Response} from 'express';
import {JsonSchemaValidation, ValidationError} from 'express-jsonschema';
import {UnauthorizedError} from 'express-jwt';
import {MulterError} from 'multer';

export const ErrorHandler: ErrorRequestHandler = (
  err: UnauthorizedError | ValidationError | MulterError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (err instanceof UnauthorizedError) {
    res.status(err.status);
    res.send('Unauthorized' + (err.message ? ': ' + err.message : ''));
  } else if (err instanceof JsonSchemaValidation) {
    console.log(
      'Request validation failed. Validation output: ' +
        JSON.stringify(err.validations)
    );
    res
      .status(400)
      .send(
        'Request validation failed. Validation output: ' +
          JSON.stringify(err.validations)
      );
  } else if (err.name === 'MulterError') {
    console.log('Upload Error: ' + err.message);
    res.status(400).send('Upload Error: ' + err.message);
  } else {
    res.status(500).send('Internal Server Error');
    console.error(err.name + ': ' + err.message);
  }
};
