'use client'

import Link from 'next/link'
import { APP_CONFIG } from '@/lib/constants'
import { Mail } from 'lucide-react'

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <Link href="/" className="flex justify-center">
            <span className="text-2xl font-bold text-primary">{APP_CONFIG.name}</span>
          </Link>

          <div className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Check your email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a verification link to your email address.
          </p>
        </div>

        <div className="rounded-md bg-blue-50 p-4 text-left">
          <h3 className="text-sm font-medium text-blue-800">Next steps:</h3>
          <ol className="mt-2 list-decimal list-inside space-y-1 text-sm text-blue-700">
            <li>Check your inbox (and spam folder)</li>
            <li>Click the verification link</li>
            <li>Start receiving alerts!</li>
          </ol>
        </div>

        <div className="text-sm">
          <p className="text-gray-600">
            Didn't receive the email?{' '}
            <button className="font-medium text-primary hover:underline">
              Resend verification
            </button>
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
