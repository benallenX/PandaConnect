import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Calendar, MessageSquare } from 'lucide-react';

export default async function TeacherDashboard() {
  // Single auth call with session claims for better performance
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Get email from session claims (faster than currentUser())
  const userEmail = sessionClaims?.email as string || 
                   sessionClaims?.primary_email as string || 
                   sessionClaims?.emailAddress as string;

  // Verify the user has @apsk12.org email
  if (!userEmail || !userEmail.toLowerCase().includes('@apsk12.org')) {
    redirect('/');
  }

  // Extract teacher name from email (e.g., "john.smith@apsk12.org" -> "John Smith")
  const getTeacherName = (email: string): string => {
    const localPart = email.split('@')[0];
    const nameParts = localPart.split(/[._-]/);
    return nameParts
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  };

  const teacherName = getTeacherName(userEmail);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600">PandaConnect</h1>
              <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                {teacherName}&apos;s Classroom
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back, {teacherName}!</h2>
          <p className="text-gray-600">Ready to inspire and connect with your students and their families today?</p>
          <p className="text-sm text-green-600 mt-1">APSK12 Teacher Account: {userEmail}</p>
        </div>

        {/* Teacher Info Card */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {teacherName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-green-800">{teacherName}&apos;s Teacher Account</h3>
              <p className="text-green-700 text-sm">
                Welcome to your PandaConnect classroom! Your APSK12 account is verified and ready.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Button asChild className="h-auto p-6 bg-green-600 hover:bg-green-700">
            <Link href="/teacher/students" className="flex flex-col items-center text-center">
              <Users className="w-8 h-8 mb-2" />
              <span className="text-lg font-medium">My Students</span>
              <span className="text-sm opacity-90">Manage classroom roster</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-6">
            <Link href="/teacher/photos" className="flex flex-col items-center text-center">
              <BookOpen className="w-8 h-8 mb-2" />
              <span className="text-lg font-medium">Share Photos</span>
              <span className="text-sm opacity-70">Capture classroom moments</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-6">
            <Link href="/teacher/schedule" className="flex flex-col items-center text-center">
              <Calendar className="w-8 h-8 mb-2" />
              <span className="text-lg font-medium">My Schedule</span>
              <span className="text-sm opacity-70">Plan daily activities</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-6">
            <Link href="/teacher/messages" className="flex flex-col items-center text-center">
              <MessageSquare className="w-8 h-8 mb-2" />
              <span className="text-lg font-medium">Parent Chat</span>
              <span className="text-sm opacity-70">Connect with families</span>
            </Link>
          </Button>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{teacherName}&apos;s Students</h3>
            <p className="text-gray-600 mb-4">Manage your classroom roster and track each student&apos;s journey</p>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/teacher/students">
                View My Students
              </Link>
            </Button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{teacherName}&apos;s Classroom Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">My Students:</span>
                <span className="font-semibold text-green-600">Coming Soon</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Photos I&apos;ve Shared:</span>
                <span className="font-semibold text-blue-600">Coming Soon</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Parent Messages:</span>
                <span className="font-semibold text-purple-600">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
