export interface UserViewDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  locked: boolean;
  creationDate?: Date;
}
