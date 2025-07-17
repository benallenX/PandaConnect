'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getRoleFromEmail, getDashboardUrl } from '@/lib/role-utils';

export default function RoleRedirect() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      // Check if user already has a role in metadata
      const existingRole = user.publicMetadata?.role as string;
      
      if (existingRole) {
        // User already has a role, redirect to their dashboard
        const dashboardUrl = getDashboardUrl(existingRole as 'admin' | 'teacher' | 'parent');
        router.push(dashboardUrl);
      } else if (user.primaryEmailAddress?.emailAddress) {
        // Determine role from email and redirect immediately
        // The webhook will set the metadata asynchronously
        const role = getRoleFromEmail(user.primaryEmailAddress.emailAddress);
        const dashboardUrl = getDashboardUrl(role);
        router.push(dashboardUrl);
      }
    }
  }, [user, isLoaded, router]);

  return null; // This component doesn't render anything
}
