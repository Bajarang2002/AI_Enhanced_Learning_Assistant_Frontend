export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  profile_image: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface SignupRequest {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  remember?: boolean;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}
