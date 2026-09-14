export type UserRole = 'doctor' | 'staff' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  status: 'active' | 'inactive';
}

export interface UserSession {
  user: AuthUser;
  expires: string;
}
