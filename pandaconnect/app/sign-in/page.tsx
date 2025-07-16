/* eslint-disable react/no-unescaped-entities */
import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SignInPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your PandaConnect account</p>
        </div>

        {/* Clerk Sign In Component */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <SignIn 
            routing="path"
            path="/sign-in"
            redirectUrl="/dashboard"
            signUpUrl="/sign-up"
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

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-green-600 hover:text-green-700 font-medium">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
