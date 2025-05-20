import { User } from 'next-auth'
import { FaUser, FaEnvelope } from 'react-icons/fa'

interface AccountSummaryProps {
  user: User | undefined
}

export default function AccountSummary({ user }: AccountSummaryProps) {
  if (!user) return null

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Account Information</h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <FaUser className="text-gray-400 mr-3" />
          <div>
            <p className="text-sm text-gray-400">Name</p>
            <p className="font-medium">{user.name}</p>
          </div>
        </div>
        <div className="flex items-center">
          <FaEnvelope className="text-gray-400 mr-3" />
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 