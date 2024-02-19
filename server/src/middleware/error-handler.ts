import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { JsonSchemaValidation } from "express-jsonschema";
import { UnauthorizedError } from "express-jwt";

export const ErrorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (err instanceof UnauthorizedError) {
    res.status(err.status);
    res.send("Unauthorized" + (err.message ? ": " + err.message : ""));
  } else if (err instanceof JsonSchemaValidation) {
    console.log(
      "Request validation failed. Validation output: " +
        JSON.stringify((err as JsonSchemaValidation).validations)
    );
    res
      .status(400)
      .send(
        "Request validation failed. Validation output: " +
          JSON.stringify((err as JsonSchemaValidation).validations)
      );
  } else if (err.name === "MulterError") {
    console.log("Upload Error: " + err.message);
    res.status(400).send("Upload Error: " + err.message);
  } else {
    res.status(500).send("Internal Server Error");
    console.error(err);
  }
};
