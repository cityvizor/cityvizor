import { FeedbackRouter } from "../src/routers/public/feedback";
import environment from "../environment";
import nodemailer from "nodemailer";

jest.mock("../environment", () => ({
  email: {
    address: "office@cityvizor.test",
    smtp: "smtp.cityvizor.test",
    port: "587",
    user: "feedback@cityvizor.test",
    password: "test-password",
  },
}));

jest.mock("nodemailer", () => ({
  __esModule: true,
  default: {
    createTransport: jest.fn(),
  },
}));

describe("public feedback", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    environment.email.user = "feedback@cityvizor.test";
  });

  it("sends requests to join with a standard sender address", async () => {
    const sendMail = jest.fn().mockResolvedValue({ messageId: "test-message" });
    jest.mocked(nodemailer.createTransport).mockReturnValue({
      sendMail,
    } as never);

    const requestCityRoute = (FeedbackRouter as any).stack.find(
      (layer: any) => layer.route?.path === "/requestcity"
    );
    const handler = requestCityRoute.route.stack.at(-1).handle;
    const sendStatus = jest.fn();

    await handler(
      {
        body: {
          city: "Testov",
          psc: "12345",
          email: "user@example.test",
          name: "Test User",
          gdpr: true,
          subscribe: false,
        },
      },
      { sendStatus }
    );

    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: '"Cityvizor feedback" <feedback@cityvizor.test>',
      })
    );
    expect(sendStatus).toHaveBeenCalledWith(204);
  });

  it("rejects requests when the sender address is missing", async () => {
    environment.email.user = "  ";

    const requestCityRoute = (FeedbackRouter as any).stack.find(
      (layer: any) => layer.route?.path === "/requestcity"
    );
    const handler = requestCityRoute.route.stack.at(-1).handle;

    await expect(
      handler(
        {
          body: {
            city: "Testov",
            psc: "12345",
            email: "user@example.test",
            name: "Test User",
            gdpr: true,
            subscribe: false,
          },
        },
        { sendStatus: jest.fn() }
      )
    ).rejects.toThrow("EMAIL_USER is not configured");

    expect(nodemailer.createTransport).not.toHaveBeenCalled();
  });
});
