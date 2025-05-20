interface Booking {
  id: string
  date: string
  status: string
  service: string
}

interface UpcomingBookingProps {
  bookings: Booking[]
}

export default function UpcomingBooking({ bookings }: UpcomingBookingProps) {
  const upcomingBooking = bookings?.find(booking => booking.status === 'PENDING' || booking.status === 'CONFIRMED')

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Upcoming Booking</h2>
      {upcomingBooking ? (
        <div>
          <p className="text-sm text-gray-400 mb-2">Next Service</p>
          <p className="font-medium mb-3">{upcomingBooking.service}</p>
          <p className="text-sm text-gray-400 mb-2">Date</p>
          <p className="font-medium mb-3">{new Date(upcomingBooking.date).toLocaleDateString()}</p>
          <p className="text-sm text-gray-400 mb-2">Status</p>
          <span className={`inline-block px-2 py-1 rounded text-sm ${
            upcomingBooking.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
          }`}>
            {upcomingBooking.status}
          </span>
        </div>
      ) : (
        <p className="text-gray-400">No upcoming bookings</p>
      )}
    </div>
  )
} 