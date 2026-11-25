export interface AdminProfile {
  id: number;
  name: string;
  surname: string;
  email: string;
}

export interface ProfileResponse {
  success: boolean;
  profile: AdminProfile;
}
