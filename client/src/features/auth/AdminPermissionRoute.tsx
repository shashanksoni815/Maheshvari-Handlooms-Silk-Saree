import type { ReactNode } from 'react';
import { usePermissions } from '../../hooks/usePermissions';

interface AdminPermissionRouteProps {
  permission: string;
  children: ReactNode;
}

export const AdminPermissionRoute = ({ permission, children }: AdminPermissionRouteProps) => {
  const { hasPermission } = usePermissions();
  if (hasPermission(permission)) return <>{children}</>;
  return (
    <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-6 text-sm text-red-800">
      Your admin role does not have permission to view this page.
    </div>
  );
};