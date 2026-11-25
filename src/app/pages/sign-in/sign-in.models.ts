export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignedInAdmin {
  id: number;
  name: string;
  surname: string;
  email: string;
}

export interface SignInResponse {
  success: boolean;
  admin: SignedInAdmin;
  token: string;
}
