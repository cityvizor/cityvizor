import { Request, Response } from "express";
import schema from "express-jsonschema";
import {
  createRequestCityEmailContent,
  requestCitySchema,
} from "../src/routers/public/request-city";

const validateRequest = schema.validate({ body: requestCitySchema });
const validRequest = {
  city: "Testov",
  psc: "12345",
  email: "jan.novak@example.test",
  name: "Jan Novák",
  position: "starosta",
  gdpr: true,
  subscribe: false,
};

describe("request city position", () => {
  it("rejects a missing position", () => {
    const requestWithoutPosition: Partial<typeof validRequest> = {
      ...validRequest,
    };
    delete requestWithoutPosition.position;

    expect(getValidationError(requestWithoutPosition)).toBeDefined();
  });

  it("rejects a position containing only whitespace", () => {
    expect(
      getValidationError({ ...validRequest, position: "   " })
    ).toBeDefined();
  });

  it("accepts a position and includes it in the email", () => {
    expect(getValidationError(validRequest)).toBeUndefined();
    expect(createRequestCityEmailContent(validRequest)).toContain(
      "Pozice vůči obci: starosta"
    );
  });
});

function getValidationError(body: object): Error | undefined {
  let validationError: Error | undefined;
  validateRequest(
    { body } as Request,
    {} as Response,
    error => (validationError = error)
  );
  return validationError;
}
