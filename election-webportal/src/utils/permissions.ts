// Permission definitions for role-based access control
export type Permission = 
  | 'create_candidate' 
  | 'read_candidate' 
  | 'update_candidate' 
  | 'delete_candidate'
  | 'create_party' 
  | 'read_party' 
  | 'update_party' 
  | 'delete_party'
  | 'close_vote'
  | 'manage_districts'
  | 'manage_users'
  | 'view_results'
  | 'vote';

export type Role = 'voter' | 'ec' | 'admin';

// Role-based permissions mapping
export const rolePermissions: Record<Role, Permission[]> = {
  voter: [
    'read_candidate',
    'read_party', 
    'vote',
    'view_results'
  ],
  ec: [
    // EC Staff now has admin-level CRUD permissions
    'create_candidate',
    'read_candidate', 
    'update_candidate',
    'delete_candidate',
    'create_party',
    'read_party',
    'update_party', 
    'delete_party',
    'close_vote',
    'view_results'
  ],
  admin: [
    // Admin has all permissions
    'create_candidate',
    'read_candidate', 
    'update_candidate',
    'delete_candidate',
    'create_party',
    'read_party',
    'update_party', 
    'delete_party',
    'close_vote',
    'manage_districts',
    'manage_users',
    'view_results'
  ]
};

// Utility function to check if a role has a specific permission
export const hasPermission = (role: Role, permission: Permission): boolean => {
  return rolePermissions[role].includes(permission);
};

// Check multiple permissions
export const hasPermissions = (role: Role, permissions: Permission[]): boolean => {
  return permissions.every(permission => hasPermission(role, permission));
};

// Check if role can perform CRUD operations on a resource
export const canManageResource = (role: Role, resource: 'candidate' | 'party'): {
  create: boolean;
  read: boolean; 
  update: boolean;
  delete: boolean;
} => {
  return {
    create: hasPermission(role, `create_${resource}` as Permission),
    read: hasPermission(role, `read_${resource}` as Permission),
    update: hasPermission(role, `update_${resource}` as Permission), 
    delete: hasPermission(role, `delete_${resource}` as Permission)
  };
};

export default {
  hasPermission,
  hasPermissions, 
  canManageResource,
  rolePermissions
};