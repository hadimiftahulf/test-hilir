export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  roles: Role[];
};

export type Role = {
  id: string;
  name: string;
  description: string;
};
