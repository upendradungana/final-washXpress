'use client'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa'
import BookingHistory from '@/components/dashboard/BookingHistory'
import { getMyBookings } from '@/lib/actions'
import { Booking as PrismaBooking, BookingStatus, ServiceType, Role } from '@prisma/client'
import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { handleNetworkError } from '@/lib/utils'
import { Booking } from '@prisma/client'

// Type for the BookingHistory and UpcomingBooking components
interface FormattedBooking {
  id: string
  date: string
  status: string
  service: string
  total?: number
}

interface DashboardUser {
  id: string
  name?: string | null
  email?: string | null
  role: Role
}

export default function BookingsPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login?callbackUrl=/bookings')
    },
  })

  const [bookings, setBookings] = useState<PrismaBooking[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated' && session.user.role === 'PROVIDER') {
      redirect('/control-center')
    }

    let mounted = true
    const fetchBookings = async () => {
      if (!session?.user?.id) return
      
      setIsLoading(true)
      setError(null)
      try {
        const data = await getMyBookings(session.user.id)
        if (mounted) {
          setBookings(data)
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error)
        if (mounted) {
          setError('Failed to load your bookings. Please try again later.')
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    if (session?.user?.id) {
      fetchBookings()
    }

    return () => {
      mounted = false
    }
  }, [session, status])

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const formatBookings = (bookings: PrismaBooking[]): FormattedBooking[] => {
    return bookings.map(booking => ({
      id: booking.id,
      date: booking.date.toISOString(),
      status: booking.status,
      service: booking.serviceType,
      total: 0 // You might want to add this to your booking model or calculate it
    }))
  }

  const formattedBookings = formatBookings(bookings)

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <Link
            href="/dashboard"
            className="mr-4 text-gray-400 hover:text-white transition-colors"
          >
            <FaArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Booking History</h1>
            <p className="text-gray-400">View all your past and upcoming bookings</p>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/20 text-red-500 rounded-lg">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <BookingHistory bookings={formattedBookings} />
        )}
      </div>
    </div>
  )
} 