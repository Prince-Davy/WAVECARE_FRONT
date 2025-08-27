import { JwtPayload } from "jwt-decode";

export interface ExtendedJwtPayload extends JwtPayload {
  // Custom data from keycloak
  name: string;
  given_name: string;
  family_name: string;
}
