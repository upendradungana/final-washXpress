'use client'
import { FaGoogle, FaFacebook } from 'react-icons/fa'
import { signIn } from 'next-auth/react'
import { Button } from '../ui/button'

export function SocialButtons() {
  const handleOAuthSignIn = (provider: 'google' | 'facebook') => {
    signIn(provider, { callbackUrl: '/dashboard' })
  }

  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      <Button
        variant="outline"
        className="w-full flex items-center gap-2"
        onClick={() => handleOAuthSignIn('google')}
      >
        <FaGoogle className="text-red-500" />
        Google
      </Button>
      <Button
        variant="outline"
        className="w-full flex items-center gap-2"
        onClick={() => handleOAuthSignIn('facebook')}
      >
        <FaFacebook className="text-blue-600" />
        Facebook
      </Button>
    </div>
  )
}