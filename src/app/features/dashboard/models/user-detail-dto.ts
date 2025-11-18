export interface UserDetailDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  locked: boolean;
  creationDate?: Date;
}
