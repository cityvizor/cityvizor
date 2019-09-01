export interface EventRecord {
  profile_id: number;
  year: number;

  id: number;
  name: string;

  budgetAmount: number;
  amount: number;
}

export interface EventDescriptionRecord {
  profileId: number;
  eventId: number
  year: number;

  description: string;
  
  category?: string;
  eventName?: string;
  organizationName?: string;
}