import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Back to Home Link */}
        <Link 
          href="/" 
          className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join PandaConnect</h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        {/* Clerk Sign Up Component */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <SignUp 
            routing="path"
            path="/sign-up"
            redirectUrl="/dashboard"
            signInUrl="/sign-in"
            appearance={{
              elements: {
                formButtonPrimary: 
                  'bg-green-600 hover:bg-green-700 text-sm normal-case',
                card: 'shadow-none',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
              },
            }}
          />
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-green-600 hover:text-green-700 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
