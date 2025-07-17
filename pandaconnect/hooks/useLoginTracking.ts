import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function useLoginTracking() {
  const { user, isSignedIn } = useUser();
  const logLoginEvent = useMutation(api.myFunctions.logLoginEvent);

  useEffect(() => {
    if (isSignedIn && user) {
      // Determine user role based on email domain
      const email = user.emailAddresses[0]?.emailAddress || '';
      const isTeacher = email.endsWith('@apsk12.org');
      const role = isTeacher ? 'teacher' : 'parent';
      
      // Get user agent and other browser info
      const userAgent = navigator.userAgent;
      
      // Log the login event
      logLoginEvent({
        clerkId: user.id,
        email: email,
        role: role,
        schoolId: 'apsk12', // You can make this dynamic based on email domain
        userAgent: userAgent,
        // Note: IP address would need to be obtained server-side for security
      }).catch(console.error);
    }
  }, [isSignedIn, user, logLoginEvent]);
}
