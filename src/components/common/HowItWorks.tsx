export default function HowItWorks() {
    const steps = [
      {
        number: '1',
        title: 'Book Online',
        description: 'Schedule your wash at your preferred time and location'
      },
      {
        number: '2',
        title: 'You Arrive',
        description: 'You visit our facility, Our professional washers'
      },
      {
        number: '3',
        title: 'Enjoy Your Clean Car',
        description: 'Relax while we make your car shine like new'
      }
    ];
  
    return (
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How WashXpress Works</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get your car washed in just a few simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="text-center p-6 bg-gray-700 rounded-xl hover:bg-gray-600 transition duration-300 transform hover:-translate-y-2"
              >
                <div className="bg-blue-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-400 text-2xl font-bold">{step.number}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }