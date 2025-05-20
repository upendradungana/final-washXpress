import Link from 'next/link'
import { FaCalendarPlus, FaHistory, FaCog } from 'react-icons/fa'

export default function QuickActions() {
  const actions = [
    {
      title: 'New Booking',
      description: 'Schedule a new laundry service',
      icon: <FaCalendarPlus className="w-6 h-6" />,
      href: '/booking',
    },
    {
      title: 'Booking History',
      description: 'View your past bookings',
      icon: <FaHistory className="w-6 h-6" />,
      href: '/history',
    },
    {
      title: 'Settings',
      description: 'Manage your account settings',
      icon: <FaCog className="w-6 h-6" />,
      href: '/settings',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {actions.map((action) => (
        <Link
          key={action.title}
          href={action.href}
          className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition"
        >
          <div className="text-blue-500 mb-4">{action.icon}</div>
          <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
          <p className="text-gray-400">{action.description}</p>
        </Link>
      ))}
    </div>
  )
} 