'use client'
import { useSession, signOut } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaPlus, FaSignOutAlt, FaTrash, FaUser, FaUserTie, FaUsers } from 'react-icons/fa'
import AccountSummary from '@/components/dashboard/AccountSummary'
import UpcomingBooking from '@/components/dashboard/UpcomingBooking'
import QuickActions from '@/components/dashboard/QuickActions'
import BookingHistory from '@/components/dashboard/BookingHistory'
import { getMyBookings } from '@/lib/actions'
import { Booking as PrismaBooking, Role } from '@prisma/client'

// Type for the BookingHistory and UpcomingBooking components
interface FormattedBooking {
  id: string
  date: string
  status: string
  service: string
  total?: number
}

interface User {
  id: string
  name: string | null
  email: string | null
  role: Role
  createdAt: Date
}

export default function DashboardPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login?callbackUrl=/dashboard')
    },
  })

  const [bookings, setBookings] = useState<PrismaBooking[]>([])
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'users'>('overview')
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    if (status === 'authenticated') {
      // Redirect providers to control center
      if (session.user.role === 'PROVIDER') {
        redirect('/control-center')
      }
      // Set active tab based on user role
      if (session.user.role === 'USER') {
        setActiveTab('overview')
      } else if (session.user.role === 'ADMIN') {
        setActiveTab('users')
      }
    }

    let mounted = true
    const fetchData = async () => {
      try {
        if (session?.user?.role === 'ADMIN') {
          // Fetch users for admin
          const response = await fetch('/api/users')
          if (!response.ok) throw new Error('Failed to fetch users')
          const data = await response.json()
          setUsers(data)
        } else if (session?.user?.role === 'USER') {
          // Fetch bookings for regular users
          const data = await getMyBookings(session.user.id)
          if (mounted) {
            setBookings(data)
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load data')
      }
    }

    if (session?.user?.id) {
      fetchData()
    }

    return () => {
      mounted = false
    }
  }, [session, status])

  const handleRemoveUser = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this user?')) return

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to remove user')

      setUsers(users.filter(user => user.id !== userId))
    } catch (error) {
      console.error('Failed to remove user:', error)
      setError('Failed to remove user. Please try again later.')
    }
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const user = session?.user

  const formatBookings = (bookings: PrismaBooking[]): FormattedBooking[] => {
    return bookings.map(booking => ({
      id: booking.id,
      date: booking.date.toISOString(),
      status: booking.status,
      service: booking.serviceType
    }))
  }

  const formattedBookings = formatBookings(bookings)

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to cancel booking')

      // Update the bookings list by removing the cancelled booking
      setBookings(bookings.filter(booking => booking.id !== bookingId))
    } catch (error) {
      console.error('Failed to cancel booking:', error)
      setError('Failed to cancel booking. Please try again later.')
    }
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <div className="pt-24 pb-12 min-h-screen bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}
            </h1>
            <p className="text-gray-400">Here's what's happening with your WashXpress account</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
            {user?.role !== 'ADMIN' && (
              <Link
                href="/booking"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center"
              >
                <FaPlus className="mr-2" />
                New Booking
              </Link>
            )}
          </div>
        </div>

        {session?.user?.role === 'ADMIN' ? (
          // Admin Dashboard
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaUsers className="mr-2" />
                User Management
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="py-3 px-4 text-left">Name</th>
                      <th className="py-3 px-4 text-left">Email</th>
                      <th className="py-3 px-4 text-left">Role</th>
                      <th className="py-3 px-4 text-left">Joined</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-700/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {user.role === 'PROVIDER' ? (
                              <FaUserTie className="text-blue-400 mr-2" />
                            ) : (
                              <FaUser className="text-green-400 mr-2" />
                            )}
                            {user.name}
                          </div>
                        </td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'PROVIDER' 
                              ? 'bg-blue-100 text-blue-800'
                              : user.role === 'ADMIN'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleRemoveUser(user.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            disabled={user.role === 'ADMIN'}
                            title={user.role === 'ADMIN' ? 'Cannot remove admin users' : 'Remove user'}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          // Regular User Dashboard
          <div className="flex border-b border-gray-700 mb-8">
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'overview' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'bookings' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('bookings')}
            >
              Bookings
            </button>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-500/20 text-red-500 rounded-lg">
            {error}
          </div>
        )}

        {activeTab === 'overview' && user?.role !== 'ADMIN' && (
          <>
            <AccountSummary user={user} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <UpcomingBooking bookings={formattedBookings} />
              <QuickActions />
            </div>
            <div className="mt-8">
              <BookingHistory 
                bookings={formattedBookings} 
                onCancelBooking={handleCancelBooking}
              />
            </div>
          </>
        )}

        {activeTab === 'bookings' && user?.role !== 'ADMIN' && (
          <div className="mt-8">
            <BookingHistory 
              bookings={formattedBookings} 
              onCancelBooking={handleCancelBooking}
            />
          </div>
        )}
      </div>
    </div>
  )
}


