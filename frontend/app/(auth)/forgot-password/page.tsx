'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { validateEmail, getErrorMessage } from '@/lib/utils'
import { APP_CONFIG } from '@/lib/constants'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${APP_CONFIG.url}/reset-password`,
      })

      if (resetError) throw resetError

      setSuccess(true)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 text-center">
          <div>
            <Link href="/" className="flex justify-center">
              <span className="text-2xl font-bold text-primary">{APP_CONFIG.name}</span>
            </Link>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Check your email
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
          </div>

          <div className="rounded-md bg-green-50 p-4 text-left">
            <p className="text-sm text-green-800">
              If an account exists with that email, you'll receive a password reset link shortly.
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <Link href="/" className="flex justify-center">
            <span className="text-2xl font-bold text-primary">{APP_CONFIG.name}</span>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email and we'll send you reset instructions
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleReset}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="relative block w-full rounded-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              placeholder="Email address"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send reset instructions'}
            </button>
          </div>

          <div className="text-center text-sm">
            <Link href="/login" className="font-medium text-gray-600 hover:text-gray-900">
              ← Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
