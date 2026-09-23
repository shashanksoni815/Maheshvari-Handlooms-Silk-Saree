import { useAuthStore } from '../store/authStore';

export const usePermissions = () => {
  const { user } = useAuthStore();

  const hasPermission = (permission: string) => {
    if (!user) return false;
    
    // Super Admin has unrestricted access
    if (user.role === 'SUPER_ADMIN') return true;
    
    // Check if the user has a custom role with the specific permission
    if (user.customRole && Array.isArray(user.customRole.permissions)) {
      return user.customRole.permissions.includes(permission);
    }
    
    return false;
  };

  const hasAnyPermission = (permissions: string[]) => {
    return permissions.some(hasPermission);
  };

  return { hasPermission, hasAnyPermission, isSuperAdmin: user?.role === 'SUPER_ADMIN' };
};
