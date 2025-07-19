'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 px-4">
      <div className="text-center space-y-6">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src="/"
            alt="PandaConnect"
            width={100}
            height={100}
            className="rounded-full"
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/100x100?text=PC'
            }}
            priority
          />
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-bold text-green-800">
          Well, this is embarrassing…
        </h1>
        <p className="text-xl text-gray-600">
          Give me a minute to find my bamboo and reload.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button onClick={() => router.push('/')}>
            Return Home
          </Button>
        </div>

        {/* Footer */}
        <p className="text-sm text-gray-500 mt-8">
          Error 404 – Page Not Found
        </p>
      </div>
    </div>
  )
}