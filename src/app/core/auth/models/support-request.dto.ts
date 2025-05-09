export interface SupportRequestDto {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  description: string;
  status?: string;
}
