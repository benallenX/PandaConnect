import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join PandaConnect
          </h1>
          <p className="text-gray-600">
            Create your account to get started
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <SignUp 
            routing="path" 
            path="/sign-up"
            signInUrl="/sign-in"
            forceRedirectUrl="/"
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-none border-0",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
