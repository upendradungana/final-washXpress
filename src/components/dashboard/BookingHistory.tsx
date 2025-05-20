interface Booking {
  id: string
  date: string
  status: string
  service: string
}

interface BookingHistoryProps {
  bookings: Booking[]
  onCancelBooking?: (bookingId: string) => void
}

export default function BookingHistory({ bookings, onCancelBooking }: BookingHistoryProps) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Booking History</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Service</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(booking.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{booking.service}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 rounded text-sm ${
                        booking.status === 'COMPLETED'
                          ? 'bg-green-500/20 text-green-500'
                          : booking.status === 'CANCELLED'
                          ? 'bg-red-500/20 text-red-500'
                          : booking.status === 'CONFIRMED'
                          ? 'bg-blue-500/20 text-blue-500'
                          : 'bg-yellow-500/20 text-yellow-500'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {booking.status === 'PENDING' && onCancelBooking && (
                      <button
                        onClick={() => onCancelBooking(booking.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Cancel Booking"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                  No booking history available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
} 