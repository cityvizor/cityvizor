export interface PaymentRecord {
  profileId: number,
  year: number;

  paragraph: number;
  item: number;
  unit: number;
  eventId: number;
  
  amount: number;
  
  date: string;
  counterpartyId: string;
  counterpartyName: string;
  description: string;
};