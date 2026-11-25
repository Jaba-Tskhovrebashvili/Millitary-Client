export interface SignUpRequest {
  password: string;
  confirmPassword: string;
}

export interface MessageResponse {
  success: boolean;
  message: string;
}

export const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?"':;{}|<>]).{8,16}$/;
