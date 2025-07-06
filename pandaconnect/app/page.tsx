import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, Image as ImageIcon, MessageSquareText, ShieldCheck, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: <MessageSquareText className="w-8 h-8 text-green-600" />,
    title: 'Instant Communication',
    description: 'Send quick updates and messages to parents securely and in real time.',
  },
  {
    icon: <ImageIcon className="w-8 h-8 text-green-600" />,
    title: 'Classroom Gallery',
    description: 'Share classroom moments with image uploads parents can view anytime.',
  },
  {
    icon: <Calendar className="w-8 h-8 text-green-600" />,
    title: 'Events & Reminders',
    description: 'Keep everyone on the same page with scheduled events and important notices.',
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-green-600" />,
    title: 'Secure & Private',
    description: 'All communication is protected with enterprise-level security',
  },
];

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-green-100">
      {/* Hero Section */}
      <section className="px-4 py-20 lg:px-8 lg:py-28 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Empower Teachers.
            <br />
            <span className="bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent">
              Engage Parents.
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            PandaConnect bridges communication between schools and families — all in one secure dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 text-lg">
              <Link href="/sign-up" className="flex items-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50 px-6 py-4 text-lg">
              <Link href="/sign-in">Already Registered?</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 lg:px-8 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Why PandaConnect?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-green-100 p-6 rounded-xl shadow hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
