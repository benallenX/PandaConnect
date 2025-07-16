import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, School, Settings, Shield } from 'lucide-react';

export default async function AdminDashboard() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Get user role from session claims
  const role = sessionClaims?.metadata?.role as string;

  // Redirect if not an admin
  if (role && role !== 'admin') {
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
              <span className="ml-4 px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                Admin Dashboard
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
          <p className="text-gray-600">Manage users, school settings, and system configuration</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Button asChild className="h-auto p-6 bg-purple-600 hover:bg-purple-700">
            <Link href="/dashboard/admin/users" className="flex flex-col items-center text-center">
              <Users className="w-8 h-8 mb-2" />
              <span className="text-lg font-medium">Users</span>
              <span className="text-sm opacity-90">Manage teachers & parents</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-6">
            <Link href="/dashboard/admin/schools" className="flex flex-col items-center text-center">
              <School className="w-8 h-8 mb-2" />
              <span className="text-lg font-medium">Schools</span>
              <span className="text-sm opacity-70">School management</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-6">
            <Link href="/dashboard/admin/settings" className="flex flex-col items-center text-center">
              <Settings className="w-8 h-8 mb-2" />
              <span className="text-lg font-medium">Settings</span>
              <span className="text-sm opacity-70">System configuration</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-6">
            <Link href="/dashboard/admin/security" className="flex flex-col items-center text-center">
              <Shield className="w-8 h-8 mb-2" />
              <span className="text-lg font-medium">Security</span>
              <span className="text-sm opacity-70">Access control</span>
            </Link>
          </Button>
        </div>

        {/* System Overview */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Users</span>
                <span className="font-medium">--</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Schools</span>
                <span className="font-medium">--</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">System Health</span>
                <span className="text-green-600 font-medium">Healthy</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <p className="text-gray-600">Recent system activities and user registrations will appear here</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Alerts</h3>
            <p className="text-gray-600">System alerts and notifications will be displayed here</p>
          </div>
        </div>
      </main>
    </div>
  );
}
