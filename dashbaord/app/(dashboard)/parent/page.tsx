import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Camera, MessageSquare, Calendar,} from 'lucide-react';
import Header from '@/components/Header';

export default async function ParentDashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/parent');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600">PandaConnect</h1>
              <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Parent Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Header />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 justify-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
          <p className="text-gray-600">Stay connected with your child&apos;s daily activities and progress</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4  justify-center gap-6 mb-8">
          <Button asChild className="h-auto p-6 bg-blue-600 hover:bg-blue-700">
            <Link href="/parent/photos" className="flex flex-col items-center text-center">
              <Camera className="w-8 h-8 mb-2" />
              <span className="text-lg font-medium">Photos</span>
              <span className="text-sm opacity-90">View classroom moments</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-6">
            <Link href="/parent/messages" className="flex flex-col items-center text-center">
              <MessageSquare className="w-8 h-8 mb-2" />
              <span className="text-lg font-medium">Messages</span>
              <span className="text-sm opacity-70">Chat with teachers</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-6">
            <Link href="/parent/schedule" className="flex flex-col items-center text-center">
              <Calendar className="w-8 h-8 mb-2" />
              <span className="text-lg font-medium">Calendar</span>
              <span className="text-sm opacity-70">View activities</span>
            </Link>
          </Button>
        </div>

        {/* Recent Updates */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Photos</h3>
            <p className="text-gray-600">Latest photos of your child&apos;s activities will appear here</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Updates from Teacher</h3>
            <p className="text-gray-600">Messages and updates from your child&apos;s teacher will be shown here</p>
          </div>
        </div>
      </main>
    </div>
  );
}