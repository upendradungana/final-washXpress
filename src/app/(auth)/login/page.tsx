'use client'
import React, { Suspense } from 'react';
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { FaEnvelope, FaLock, FaGoogle, FaArrowLeft } from 'react-icons/fa'
import { FiAlertCircle } from 'react-icons/fi'
import Link from 'next/link'
import { handleNetworkError } from '@/lib/utils'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        // Get the user's role from the session
        const response = await fetch('/api/auth/session')
        const session = await response.json()
        
        // Redirect based on role
        if (session?.user?.role === 'PROVIDER') {
          router.push('/control-center')
        } else if (session?.user?.role === 'ADMIN') {
          router.push('/dashboard')
        } else {
          router.push('/dashboard')
        }
      }
    } catch (err) {
      setError(handleNetworkError(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    setError("")
    
    try {
      const result = await signIn('google', { 
        redirect: false 
      })
      
      if (result?.error) {
        setError(result.error)
      } else {
        // Get the user's role from the session
        const response = await fetch('/api/auth/session')
        const session = await response.json()
        
        // Redirect based on role
        if (session?.user?.role === 'PROVIDER') {
          router.push('/control-center')
        } else if (session?.user?.role === 'ADMIN') {
          router.push('/dashboard')
        } else {
          router.push('/dashboard')
        }
      }
    } catch (err) {
      setError(handleNetworkError(err))
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <Link 
        href="/" 
        className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <FaArrowLeft className="mr-2" />
        <span>Back to main page</span>
      </Link>

      <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Login to access your account</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded mb-4 flex items-center">
              <FiAlertCircle className="mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-500" />
                </div>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                  placeholder="your@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-500" />
                </div>
                <input
                  type="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-700 transition duration-200"
              >
                <FaGoogle className="text-red-500 mr-2" /> 
                {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
              </button>
            </div>
          </form>
        </div>
        <div className="px-8 py-4 bg-gray-700 text-center border-t border-gray-600">
          <p className="text-gray-400 text-sm">
            Don&apos;t have an account?{' '}
            <a
              href="/register"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-20">
      <Suspense fallback={
        <div className="w-full max-w-md">
          <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-700 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
              <div className="space-y-3">
                <div className="h-10 bg-gray-700 rounded"></div>
                <div className="h-10 bg-gray-700 rounded"></div>
                <div className="h-10 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </main>
  )
}