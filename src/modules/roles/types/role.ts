export interface Permission {
  id: string;
  resource: string; // 'users', 'dashboard', 'settings'
  action: string; // 'read', 'create', 'update'
  scope: string; // 'any', 'own'
  description?: string;
  key: string; // 'users:read:any'
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[]; // Relasi: Role punya banyak permission
  createdAt: string;
  updatedAt: string;
}
