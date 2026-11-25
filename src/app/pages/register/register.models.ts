export interface RegisterRequest {
  name: string;
  surname: string;
  email: string;
}

export interface MessageResponse {
  success: boolean;
  message: string;
}
