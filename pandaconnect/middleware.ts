import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define route matchers for different role-based routes
const isAdminRoute = createRouteMatcher(['/dashboard/admin(.*)']);
const isTeacherRoute = createRouteMatcher(['/dashboard/teacher(.*)']);
const isParentRoute = createRouteMatcher(['/dashboard/parent(.*)']);

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

  const role = sessionClaims?.metadata?.role as 'admin' | 'teacher' | 'parent' | undefined;

  // Check admin routes
  if (isAdminRoute(req) && role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // Check teacher routes (allow both teacher and admin)
  if (isTeacherRoute(req) && !['teacher', 'admin'].includes(role ?? '')) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // Check parent routes
  if (isParentRoute(req) && role !== 'parent') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

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

