export interface Role {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  roles: Role[];
  createdAt: string;
}
