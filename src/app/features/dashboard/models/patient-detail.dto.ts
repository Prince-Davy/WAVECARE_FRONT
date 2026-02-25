// Shared interface for patient detail data returned by the backend
export interface PatientDetailDto {
  id: number | string;
  firstName: string;
  lastName: string;
  ins: string;
  nss: string;
  birthDate: Date;
  birthName: string;
  maritalName: string;
  maritalStatus: string;
  birthPlace: string;
  nationality: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  trustedContact: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  healthCoverage: {
    insurance: string;
    policy: string;
  };
}