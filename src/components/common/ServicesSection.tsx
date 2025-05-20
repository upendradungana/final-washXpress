import Link from 'next/link';

export default function ServicesSection() {
  const services = [
    {
      icon: 'fas fa-car',
      title: 'Car Wash',
      description: 'Complete exterior wash and interior cleaning for all car types',
      price: 'From Nu.150'
    },
    {
      icon: 'fas fa-motorcycle',
      title: 'Motorcycle Wash',
      description: 'Specialized cleaning for motorcycles with attention to details',
      price: 'From Nu.100'
    },
    {
      icon: 'fas fa-bicycle',
      title: 'Bicycle Wash',
      description: 'Gentle cleaning and degreasing for bicycles and components',
      price: 'From Nu.80'
    },
    {
      icon: 'fas fa-spa',
      title: 'Premium Detailing',
      description: 'Showroom-quality detailing for all vehicle types',
      price: 'From Nu.500'
    },
    {
      icon: 'fas fa-truck-moving',
      title: 'Fleet Services',
      description: 'Custom packages for multiple vehicles or business fleets',
      price: 'Custom Pricing'
    },
    {
      icon: 'fas fa-truck-pickup',
      title: 'Other Vehicle Types',
      description: 'Custom cleaning for special vehicles (trucks, buses, boats, etc.)',
      price: 'Custom Pricing',
      note: 'Contact us for vehicle-specific quote'
    }
  ];

  return (
    <section id="services" className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Premium Services</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We offer a range of services for all types of vehicles
          </p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-500 transform hover:-translate-y-2 group"
            >
              <div className="h-48 bg-gradient-to-br from-blue-900 to-gray-800 flex items-center justify-center">
                <i className={`${service.icon} text-blue-400 text-6xl transition duration-300 ease-in-out group-hover:text-white`} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-white">{service.title}</h3>
                <p className="text-gray-400 mb-4">{service.description}</p>
                <div className="text-blue-400 font-bold">{service.price}</div>
                {service.note && (
                  <div className="mt-3 text-xs text-blue-300">
                    <i className="fas fa-info-circle mr-1" /> {service.note}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
  
        <div className="text-center mt-12">
          <Link
            href="booking"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition duration-300 transform hover:scale-105"
          >
            <i className="fas fa-calendar-alt mr-2" /> Book Your Service Now
          </Link>
          <p className="text-gray-400 mt-4">Select your preferred service during booking</p>
        </div>
      </div>
    </section>
  );  
}