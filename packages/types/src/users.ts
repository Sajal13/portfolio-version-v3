export interface User {
  id: number,
  email: string,
  name: string,
  role: 'admin' | 'user',
  createdAt: string
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}