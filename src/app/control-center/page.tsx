'use client'
import { useSession, signOut } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaTachometerAlt, FaSignOutAlt, FaCheck, FaTimes, FaClock, FaPhoneAlt, FaEnvelope, FaEye } from 'react-icons/fa'
import { getBookings, updateBookingStatus } from '@/lib/actions'
import { BookingStatus } from '@prisma/client'

export default function ControlCenterPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login?callbackUrl=/control-center')
    },
  })

  const [bookings, setBookings] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'pending' | 'completed' | 'history' | 'didntMakeOut' | 'settings'>('pending')
  const [isLoading, setIsLoading] = useState(true)
  const [activeSettingsTab, setActiveSettingsTab] = useState<'profile' | 'security'>('profile')
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [viewBooking, setViewBooking] = useState<any | null>(null)

  const isToday = (date: Date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
  }

  const isWithin24Hours = (date: Date) => {
    const now = new Date()
    const bookingDate = new Date(date)
    const diffInHours = (now.getTime() - bookingDate.getTime()) / (1000 * 60 * 60)
    return diffInHours <= 24
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Pending: all pending/confirmed bookings with today or future date
  const pendingBookings = bookings.filter(booking => 
    (booking.status === 'PENDING' || booking.status === 'CONFIRMED') &&
    new Date(booking.date) >= startOfToday
  );

  // Didn't Make Out: all pending/confirmed bookings with a past date
  const didntMakeOutBookings = bookings.filter(booking => 
    (booking.status === 'PENDING' || booking.status === 'CONFIRMED') &&
    new Date(booking.date) < startOfToday
  );

  // Completed: completed bookings marked as completed within the last 24 hours
  const completedBookings = bookings.filter(booking => 
    booking.status === 'COMPLETED' &&
    booking.completedAt &&
    (new Date().getTime() - new Date(booking.completedAt).getTime()) <= 24 * 60 * 60 * 1000
  );

  // History: completed bookings older than 24 hours and all other historical bookings, but NOT the didn't make out ones
  const historyBookings = bookings.filter(booking => 
    (booking.status === 'COMPLETED' && !isWithin24Hours(new Date(booking.date))) ||
    (!isToday(new Date(booking.date)) && booking.status !== 'PENDING' && booking.status !== 'CONFIRMED')
  );

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'PROVIDER' && session?.user?.role !== 'ADMIN') {
      redirect('/dashboard')
    }

    const fetchBookings = async () => {
      setIsLoading(true)
      try {
        let filter: 'pending' | 'completed' | 'all' = 'all';
        if (activeTab === 'pending') filter = 'pending';
        else if (activeTab === 'history' || activeTab === 'completed') filter = 'completed';
        
        const data = await getBookings(filter)
        setBookings(data)
      } catch (error) {
        console.error('Failed to fetch bookings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [activeTab, session, status])

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || ''
      }))
    }
  }, [session])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setUpdateMessage(null)

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone
        })
      })

      if (!response.ok) throw new Error('Failed to update profile')

      setUpdateMessage({
        type: 'success',
        message: 'Profile updated successfully'
      })
    } catch (error) {
      setUpdateMessage({
        type: 'error',
        message: 'Failed to update profile'
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setUpdateMessage(null)

    if (formData.newPassword !== formData.confirmPassword) {
      setUpdateMessage({
        type: 'error',
        message: 'New passwords do not match'
      })
      setIsUpdating(false)
      return
    }

    try {
      const response = await fetch('/api/user/security', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      })

      if (!response.ok) throw new Error('Failed to update password')

      setUpdateMessage({
        type: 'success',
        message: 'Password updated successfully'
      })
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } catch (error) {
      setUpdateMessage({
        type: 'error',
        message: 'Failed to update password'
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await updateBookingStatus(bookingId, newStatus as BookingStatus)
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      ))
    } catch (error) {
      console.error('Failed to update booking status:', error)
    }
  }

  const handleContactCustomer = (type: 'email' | 'phone', contact: string) => {
    if (type === 'email') {
      window.location.href = `mailto:${contact}`
    } else {
      window.location.href = `tel:${contact}`
    }
  }

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const data = await getBookings('all')
        setBookings(data)
      } catch (error) {
        console.error('Failed to fetch all bookings:', error)
      }
    }

    fetchAllBookings()
  }, [session])

  const handleError = (error: Error) => {
    console.error('Error:', error);
    // Handle error appropriately
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center">
                <FaTachometerAlt className="text-blue-400 mr-2" />
                {session?.user?.role === 'ADMIN' ? 'Admin Dashboard' : 'Provider Dashboard'}
                {session?.user?.role === 'ADMIN' && (
                  <span className="ml-3 px-3 py-1 text-sm bg-red-500 text-white rounded-full">Admin View</span>
                )}
              </h1>
              <p className="text-gray-400">
                Today: {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Today's Bookings</p>
                <p className="text-2xl font-bold">{bookings.length}</p>
              </div>
              <div className="text-blue-400">
                <FaClock className="text-2xl" />
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {pendingBookings.length}
                </p>
              </div>
              <div className="text-yellow-400">
                <FaClock className="text-2xl" />
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-400">
                  {completedBookings.length}
                </p>
              </div>
              <div className="text-green-400">
                <FaCheck className="text-2xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex border-b border-gray-700 mb-8">
          <div className="flex-grow">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'pending' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'didntMakeOut' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('didntMakeOut')}
          >
            Didn't Make Out
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'completed' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'history' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'settings' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {activeTab === 'settings' ? (
            <div className="p-6">
              <div className="flex border-b border-gray-700 mb-6">
                <button
                  className={`px-6 py-3 font-medium ${
                    activeSettingsTab === 'profile' 
                      ? 'text-blue-400 border-b-2 border-blue-400' 
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                  onClick={() => setActiveSettingsTab('profile')}
                >
                  Profile
                </button>
                <button
                  className={`px-6 py-3 font-medium ${
                    activeSettingsTab === 'security' 
                      ? 'text-blue-400 border-b-2 border-blue-400' 
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                  onClick={() => setActiveSettingsTab('security')}
                >
                  Security
                </button>
              </div>

              {updateMessage && (
                <div className={`mb-4 p-4 rounded-lg ${
                  updateMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {updateMessage.message}
                </div>
              )}

              {activeSettingsTab === 'profile' ? (
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg opacity-50 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? 'Updating...' : 'Update Profile'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              )}
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left">Booking ID</th>
                  <th className="py-3 px-4 text-left">Customer</th>
                  <th className="py-3 px-4 text-left">Vehicle</th>
                  <th className="py-3 px-4 text-left">Service</th>
                  <th className="py-3 px-4 text-left">Time</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  {activeTab === 'pending' && session?.user?.role === 'PROVIDER' && (
                    <th className="py-3 px-4 text-left">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {(activeTab === 'pending' ? pendingBookings : activeTab === 'completed' ? completedBookings : activeTab === 'didntMakeOut' ? didntMakeOutBookings : historyBookings).map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="py-3 px-4">{booking.id}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{booking.user.name}</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <button
                            onClick={() => handleContactCustomer('email', booking.user.email)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <FaEnvelope />
                          </button>
                          <button
                            onClick={() => handleContactCustomer('phone', booking.user.phone)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <FaPhoneAlt />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{booking.vehicle.model}</td>
                    <td className="py-3 px-4">{booking.serviceType}</td>
                    <td className="py-3 px-4">
                      {new Date(booking.date).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : booking.status === 'CANCELLED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    {activeTab === 'pending' && session?.user?.role === 'PROVIDER' && (
                      <td className="py-3 px-4">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleStatusChange(booking.id, 'COMPLETED')}
                              className="group relative flex items-center justify-center w-9 h-9 rounded-full bg-green-500/10 hover:bg-green-500/20 transition duration-200 shadow-sm border border-green-500 hover:scale-110"
                              aria-label="Mark as Completed"
                            >
                              <FaCheck className="text-green-500 group-hover:text-white text-lg" />
                              <span className="absolute bottom-[-2.2rem] left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded bg-gray-900 text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-lg z-10">Mark as Completed</span>
                            </button>
                            <button
                              onClick={() => handleStatusChange(booking.id, 'CANCELLED')}
                              className="group relative flex items-center justify-center w-9 h-9 rounded-full bg-red-500/10 hover:bg-red-500/20 transition duration-200 shadow-sm border border-red-500 hover:scale-110"
                              aria-label="Cancel Booking"
                            >
                              <FaTimes className="text-red-500 group-hover:text-white text-lg" />
                              <span className="absolute bottom-[-2.2rem] left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded bg-gray-900 text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-lg z-10">Cancel Booking</span>
                            </button>
                          </div>
                          <button
                            onClick={() => setViewBooking(booking)}
                            className="group relative flex items-center justify-center w-9 h-9 rounded-full bg-blue-500/10 hover:bg-blue-500/20 transition duration-200 shadow-sm border border-blue-500 hover:scale-110 mt-1"
                            aria-label="View Details"
                          >
                            <FaEye className="text-blue-500 group-hover:text-white text-lg" />
                            <span className="absolute bottom-[-2.2rem] left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded bg-gray-900 text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-lg z-10">View Details</span>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {viewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 rounded-lg shadow-xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setViewBooking(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
              aria-label="Close"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-white">Booking Details</h2>
            <div className="space-y-2 text-gray-200">
              <div><span className="font-semibold">Booking ID:</span> {viewBooking.id}</div>
              <div><span className="font-semibold">Customer:</span> {viewBooking.user?.name}</div>
              <div><span className="font-semibold">Email:</span> {viewBooking.user?.email}</div>
              <div><span className="font-semibold">Phone:</span> {viewBooking.user?.phone}</div>
              <div><span className="font-semibold">Vehicle Model:</span> {viewBooking.vehicle?.model || 'N/A'}</div>
              <div><span className="font-semibold">Vehicle Make:</span> {viewBooking.vehicle?.make || 'N/A'}</div>
              <div><span className="font-semibold">Vehicle Year:</span> {viewBooking.vehicle?.year || 'N/A'}</div>
              <div><span className="font-semibold">Number Plate:</span> {viewBooking.vehicle?.license || viewBooking.vehicle?.numberPlate || viewBooking.vehicle?.number_plate || 'N/A'}</div>
              <div><span className="font-semibold">Vehicle Type:</span> {viewBooking.vehicle?.type || 'N/A'}</div>
              <div><span className="font-semibold">Service:</span> {viewBooking.serviceType}</div>
              <div><span className="font-semibold">Date:</span> {new Date(viewBooking.date).toLocaleDateString()}</div>
              <div><span className="font-semibold">Time:</span> {new Date(viewBooking.date).toLocaleTimeString()}</div>
              <div><span className="font-semibold">Status:</span> {viewBooking.status}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}