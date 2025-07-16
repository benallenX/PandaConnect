/* eslint-disable react/no-unescaped-entities */
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, GraduationCap, Shield } from 'lucide-react';

export default async function Dashboard() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Get user role from session claims
  const role = sessionClaims?.metadata?.role as 'admin' | 'teacher' | 'parent' | undefined;

  // Auto-redirect if user has a specific role
  if (role === 'admin') {
    redirect('/dashboard/admin');
  }
  if (role === 'teacher') {
    redirect('/dashboard/teacher');
  }
  if (role === 'parent') {
    redirect('/dashboard/parent');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600">PandaConnect</h1>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to PandaConnect</h2>
          <p className="text-gray-600">Please select your role to continue to your dashboard</p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Teacher Dashboard */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <GraduationCap className="w-8 h-8 text-green-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Teacher</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Manage your students, share photos, send messages, and organize classroom activities.
            </p>
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
              <Link href="/dashboard/teacher">Teacher Dashboard</Link>
            </Button>
          </div>

          {/* Parent Dashboard */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Parent</h3>
            </div>
            <p className="text-gray-600 mb-6">
              View your child's photos, receive updates, and communicate with teachers.
            </p>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/dashboard/parent">Parent Dashboard</Link>
            </Button>
          </div>

          {/* Admin Dashboard */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <Shield className="w-8 h-8 text-purple-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Admin</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Manage users, oversee school operations, and configure system settings.
            </p>
            <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
              <Link href="/dashboard/admin">Admin Dashboard</Link>
            </Button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you're unsure about your role or need assistance, please contact your school administrator.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Teachers</h4>
              <p className="text-sm text-green-700">Create student rosters and share classroom moments</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Parents</h4>
              <p className="text-sm text-blue-700">Stay connected with your child's daily activities</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">Administrators</h4>
              <p className="text-sm text-purple-700">Manage users and configure school settings</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
