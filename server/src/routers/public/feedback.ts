import axios from 'axios';
import express from 'express';
import environment from '../../../environment';
import schema from 'express-jsonschema';

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

  sendToProductboard('feedback', content);
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
    sendToProductboard('Zapojení obce', content);
    res.sendStatus(204);
  }
);

function sendToProductboard(type: string, content: string) {
  axios
    .post(
      'https://api.productboard.com/notes',
      {
        title: `Cityvizor - ${type}`,
        content,
        customer_email: 'landing@cityvizor.cz',
      },
      {
        headers: {
          Authorization: `Bearer ${environment.keys.productboard.token}`,
        },
      }
    )
    .catch(err => {
      throw err;
    });
}
