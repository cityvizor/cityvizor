export interface RequestCityBody {
  city: string;
  email: string;
  gdpr: boolean;
  name: string;
  psc: string;
  position: string;
  subscribe: boolean;
}

export const requestCitySchema = {
  type: "object",
  properties: {
    city: {
      type: "string",
      required: true,
    },
    email: {
      type: "string",
      required: true,
    },
    gdpr: {
      type: "boolean",
      required: true,
    },
    name: {
      type: "string",
      required: true,
    },
    psc: {
      type: "string",
      required: true,
    },
    position: {
      type: "string",
      pattern: "\\S",
      required: true,
    },
    subscribe: {
      type: "boolean",
      required: true,
    },
  },
};

export function createRequestCityEmailContent(body: RequestCityBody): string {
  return `Žádost o zapojení obce
Obec: ${body.city}
PSČ: ${body.psc}
Email: ${body.email}
Jméno: ${body.name}
Pozice vůči obci: ${body.position}
GDPR souhlas: ${body.gdpr}
Informace o propojení: ${body.subscribe}
`;
}
