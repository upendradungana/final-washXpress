export default function Testimonials() {
    const testimonials = [
      {
        name: "Dhenish",
        rating: 5,
        quote: "WashXpress saved me so much time! Their mobile service came to my office and had my car looking brand new by the time I finished work."
      },
      {
        name: "Lhamo",
        rating: 5,
        quote: "The premium wash is worth every penny. They pay attention to every detail and my car has never looked better."
      },
      {
        name: "Dalkar Kangpo",
        rating: 5,
        quote: "I've been using WashXpress for months now. Their subscription service makes it so easy to keep my car clean."
      }
    ];
  
    return (
      <section id="testimonials" className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Do not just take our word for it - hear from our satisfied customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-900 rounded-full mr-4 flex items-center justify-center text-blue-400">
                    <i className="fas fa-user" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-400">{testimonial.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }