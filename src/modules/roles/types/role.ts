export interface Permission {
  id: string;
  resource: string;
  action: string;
  scope: string;
  description?: string;
  key: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}
