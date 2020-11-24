export interface EventRecord {
  profileId: number;
  year: number;

  id: number;
  name: string;
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