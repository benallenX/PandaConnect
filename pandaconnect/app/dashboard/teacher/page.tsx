import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Calendar, MessageSquare } from 'lucide-react';

export default async function TeacherDashboard() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Get user role from session claims
  const role = sessionClaims?.metadata?.role as string;

  // Redirect if not a teacher
  if (role && role !== 'teacher') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600">PandaConnect</h1>
              <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Teacher Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
          <p className="text-gray-600">Manage your classroom and connect with students and parents</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Button asChild className="h-auto p-6 bg-green-600 hover:bg-green-700">
            <Link href="/dashboard/teacher/students" className="flex flex-col items-center text-center">
              <Users className="w-8 h-8 mb-2" />
              <span className="text-lg font-medium">Students</span>
              <span className="text-sm opacity-90">Manage student roster</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-6">
            <Link href="/dashboard/teacher/photos" className="flex flex-col items-center text-center">
              <BookOpen className="w-8 h-8 mb-2" />
              <span className="text-lg font-medium">Photos</span>
              <span className="text-sm opacity-70">Share classroom moments</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-6">
            <Link href="/dashboard/teacher/schedule" className="flex flex-col items-center text-center">
              <Calendar className="w-8 h-8 mb-2" />
              <span className="text-lg font-medium">Schedule</span>
              <span className="text-sm opacity-70">Plan activities</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-6">
            <Link href="/dashboard/teacher/messages" className="flex flex-col items-center text-center">
              <MessageSquare className="w-8 h-8 mb-2" />
              <span className="text-lg font-medium">Messages</span>
              <span className="text-sm opacity-70">Communicate with parents</span>
            </Link>
          </Button>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Students</h3>
            <p className="text-gray-600">Your most recently added students will appear here</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h3>
            <p className="text-gray-600">Important dates and activities will be shown here</p>
          </div>
        </div>
      </main>
    </div>
  );
}
