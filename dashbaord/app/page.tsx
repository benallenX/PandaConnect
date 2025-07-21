import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import Link from "next/link";

export default function Home() {
 
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-green-300 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Hero Section */}
      <section className="px-4 py-20 lg:px-8 lg:py-28 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Empower Teachers.
            <br />
            <span className="bg-gradient-to-r from-green-500 to-gray-500 bg-clip-text text-transparent">
              Engage Parents.
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            PandaConnect bridges communication between schools and families — all in one secure dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
           <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 text-lg">
              <Link href="/sign-up" className="flex items-center">
                <UserPlus className="w-5 h-5 mr-2" />
                Get Started
              </Link>
            </Button> 
          </div>
        </div>
      </section>
    </main>
  );
}