import express from "express";
import environment from "../../../environment";
import schema from "express-jsonschema";
import nodemailer from "nodemailer";
import {
  createRequestCityEmailContent,
  requestCitySchema,
} from "./request-city";

const router = express.Router();

export const FeedbackRouter = router;

const feedbackSchema = {
  type: "object",
  properties: {
    feedback: {
      type: "string",
      required: true,
    },
    email: {
      type: "string",
      required: true,
    },
  },
};

router.post(
  "/",
  schema.validate({ body: feedbackSchema }),
  async (req, res) => {
    const content = `Zpětná vazba:
Email: ${req.body.email}
Zpráva: ${req.body.feedback}`;

    await sendToEmail("feedback", content);
    res.sendStatus(204);
  }
);

router.post(
  "/requestcity",
  schema.validate({ body: requestCitySchema }),
  async (req, res) => {
    const content = createRequestCityEmailContent(req.body);
    await sendToEmail("Zapojení obce", content);
    res.sendStatus(204);
  }
);

async function sendToEmail(type: string, content: string) {
  const transporter = nodemailer.createTransport({
    host: environment.email.smtp,
    port: Number(environment.email.port),
    secure: Number(environment.email.port) === 465, // true for 465, false for other ports
    auth: {
      user: environment.email.user,
      pass: environment.email.password,
    },
  });

  const info = await transporter.sendMail({
    from: `"Cityvizor feedback" <${environment.email.user}>`,
    to: environment.email.address,
    subject: type,
    text: content,
  });
  return info;
}
