export interface Ticket {
  id: number;
  firstName: string;
  lastName: string;
  mail: string;
  category: string;
  description: string;
  status: string;
  creationDate?: Date;
  adminComment?: string;
}
