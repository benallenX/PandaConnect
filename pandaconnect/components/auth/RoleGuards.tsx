'use client';

import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

type Role = 'admin' | 'teacher' | 'parent';

interface RoleGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// Generic role guard component
function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback 
}: RoleGuardProps & { allowedRoles: Role[] }) {
  const { user, isLoaded } = useUser();

  // Show loading state while user data is being fetched
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!user) {
    redirect('/sign-in');
  }

  const userRole = user.publicMetadata?.role as Role;

  // Check if user has required role
  if (!allowedRoles.includes(userRole)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    redirect('/unauthorized');
  }

  return <>{children}</>;
}

// Admin only component
export function AdminOnly({ children, fallback }: RoleGuardProps) {
  return (
    <RoleGuard allowedRoles={['admin']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

// Teacher and Admin component
export function TeacherOnly({ children, fallback }: RoleGuardProps) {
  return (
    <RoleGuard allowedRoles={['teacher', 'admin']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

// Parent only component
export function ParentOnly({ children, fallback }: RoleGuardProps) {
  return (
    <RoleGuard allowedRoles={['parent']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

// Any authenticated user
export function AuthenticatedOnly({ children, fallback }: RoleGuardProps) {
  return (
    <RoleGuard allowedRoles={['admin', 'teacher', 'parent']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

// Hook for checking roles in components
export function useRole(): { role: Role | null; isAdmin: boolean; isTeacher: boolean; isParent: boolean } {
  const { user } = useUser();
  const role = user?.publicMetadata?.role as Role | null;

  return {
    role,
    isAdmin: role === 'admin',
    isTeacher: role === 'teacher' || role === 'admin', // Admin can also access teacher features
    isParent: role === 'parent',
  };
}
