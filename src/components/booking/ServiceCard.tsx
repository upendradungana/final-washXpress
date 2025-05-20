import { FaCheckCircle } from 'react-icons/fa'
import { cn } from '@/lib/utils'

interface ServiceCardProps {
  service: {
    type: string
    name: string
    price: string
    description: string
    features: string[]
  }
  selected: boolean
  onSelect: () => void
}

export function ServiceCard({ service, selected, onSelect }: ServiceCardProps) {
  return (
    <div
      className={cn(
        "p-5 rounded-lg bg-gray-700 cursor-pointer border-2 border-transparent transition-all duration-300",
        selected ? "border-blue-500 bg-blue-500/10 transform -translate-y-1 shadow-lg" : "",
        "hover:border-blue-500 hover:transform hover:-translate-y-1 hover:shadow-lg"
      )}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-lg">{service.name}</h4>
        <span className="bg-blue-600 text-xs px-2 py-1 rounded">
          {service.price}
        </span>
      </div>
      <p className="text-gray-400 text-sm mb-3">{service.description}</p>
      <ul className="text-gray-400 text-xs space-y-1">
        {service.features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <FaCheckCircle className="text-blue-400 mr-1 mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}