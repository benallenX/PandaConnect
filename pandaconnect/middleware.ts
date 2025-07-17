import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define route matchers for protected routes
const isTeacherRoute = createRouteMatcher(['/teacher(.*)']);

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)', // Clerk webhooks
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  
  // Allow public routes without authentication
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }
  
  // Redirect to sign-in if not authenticated and trying to access protected routes
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // Check teacher routes - only users with @apsk12.org can access
  if (isTeacherRoute(req)) {
    // Try to get email from sessionClaims - it might be in different formats
    const claims = sessionClaims as Record<string, unknown>;
    const userEmail = (claims?.email as string) || 
                     (claims?.primary_email as string) || 
                     (claims?.email_address as string) ||
                     (claims?.emailAddresses as Array<{emailAddress: string}>)?.[0]?.emailAddress;
    
    if (!userEmail || typeof userEmail !== 'string') {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
    
    // Check if user has @apsk12.org email
    if (!userEmail.toLowerCase().includes('@apsk12.org')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Allow access to all other routes
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

