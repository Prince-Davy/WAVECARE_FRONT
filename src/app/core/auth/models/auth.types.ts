export interface LoginCredentials {
  username: string;
  password: string;
  grant_type: string;
  client_id: string;
}

export interface LoginResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
  scope: string;
  role: string
}