export interface TicketViewDTO {
  id: number;
  firstName: string;
  lastName: string;
  mail: string;
  categoryLabel: string;
  description: string;
  statusLabel: string;
  creationDate?: Date;
}