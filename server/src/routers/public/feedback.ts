import express from 'express';
import environment from '../../../environment';
import schema from 'express-jsonschema';
import nodemailer from 'nodemailer';

const router = express.Router();

export const FeedbackRouter = router;

const feedbackSchema = {
  type: 'object',
  properties: {
    feedback: {
      type: 'string',
      required: true,
    },
    email: {
      type: 'string',
      required: true,
    },
  },
};

const requestCitySchema = {
  type: 'object',
  properties: {
    city: {
      type: 'string',
      required: true,
    },
    email: {
      type: 'string',
      required: true,
    },
    gdpr: {
      type: 'boolean',
      required: true,
    },
    name: {
      type: 'string',
      required: true,
    },
    psc: {
      type: 'string',
      required: true,
    },
    subscribe: {
      type: 'boolean',
      required: true,
    },
  },
};

router.post('/', schema.validate({body: feedbackSchema}), async (req, res) => {
  const content = `Zpětná vazba:
Email: ${req.body.email}
Zpráva: ${req.body.feedback}`;

  await sendToEmail('feedback', content);
  res.sendStatus(204);
});

router.post(
  '/requestcity',
  schema.validate({body: requestCitySchema}),
  async (req, res) => {
    const content = `Žádost o zapojení obce
Obec: ${req.body.city}
PSČ: ${req.body.psc}
Email: ${req.body.email}
Jméno: ${req.body.name}
GDPR souhlas: ${req.body.gdpr}
Informace o propojení: ${req.body.subscribe}
`;
    await sendToEmail('Zapojení obce', content);
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
      pass: environment.emai.password,
    },
  });

  const info = await transporter.sendMail({
    from: '"Cityvizor feedback"', // sender address
    to: environment.email.address,
    subject: type,
    text: content,
  });
  return info;
}
