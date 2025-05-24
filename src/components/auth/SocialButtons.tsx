'use client'
import { FaGoogle, FaFacebook } from 'react-icons/fa'
import { signIn } from 'next-auth/react'
import { ButtonOutline } from '../ui/button'
import { useRouter } from 'next/navigation'

export function SocialButtons() {
  const router = useRouter()

  const handleOAuthSignIn = async (provider: 'google' | 'facebook') => {
    const result = await signIn(provider, { redirect: false })
    
    if (!result?.error) {
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
  }

  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      <ButtonOutline
        className="w-full flex items-center gap-2"
        onClick={() => handleOAuthSignIn('google')}
      >
        <FaGoogle className="text-red-500" />
        Google
      </ButtonOutline>
      <ButtonOutline
        className="w-full flex items-center gap-2"
        onClick={() => handleOAuthSignIn('facebook')}
      >
        <FaFacebook className="text-blue-600" />
        Facebook
      </ButtonOutline>
    </div>
  )
}