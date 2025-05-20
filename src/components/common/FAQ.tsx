"use client";

import { useState } from 'react';

export default function FAQ() {
  const faqs = [
    {
      question: "How long does a car wash take?",
      answer: "Our basic wash typically takes about 15-20 minutes, while premium services may take 30-45 minutes. Full detailing can take 1-2 hours depending on the package you choose."
    },
    {
      question: "Do you use eco-friendly products?",
      answer: "Yes! We're committed to environmental sustainability. All our cleaning products are biodegradable and water-efficient. We also recycle water in our facilities to minimize waste."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Absolutely. There are no long-term contracts with WashXpress. You can cancel your subscription at any time through your account dashboard or by contacting our support team."
    },
    {
      question: "What areas do you serve for mobile washing?",
      answer: "We currently serve the greater metropolitan area within a 20-mile radius of our headquarters. You can enter your address during booking to confirm availability in your area."
    }
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Find answers to common questions about our services
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <button 
                className="w-full flex justify-between items-center text-left"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                <i className={`fas fa-chevron-down text-blue-400 transition-transform duration-300 ${activeIndex === index ? 'transform rotate-180' : ''}`} />
              </button>
              <div className={`mt-4 ${activeIndex === index ? 'block' : 'hidden'}`}>
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}