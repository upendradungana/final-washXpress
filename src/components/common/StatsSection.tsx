export default function StatsSection() {
    const stats = [
      { icon: 'fas fa-car', value: '600+', label: 'Cars Washed' },
      { icon: 'fas fa-shield-alt', value: '97%', label: 'Satisfaction' },
      { icon: 'fas fa-clock', value: '24/7', label: 'Service Available' },
      { icon: 'fas fa-calendar-alt', value: '15 Min', label: 'Quick Service' },
    ];
  
    return (
      <section id="stats" className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="p-6 bg-gray-700 rounded-xl hover:bg-gray-600 transition duration-300 transform hover:-translate-y-2"
              >
                <i className={`${stat.icon} text-blue-400 text-4xl mx-auto mb-4`} />
                <h3 className="text-3xl font-bold mb-2 text-white">{stat.value}</h3>
                <p className="text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }