// Description: This component creates a hero section with a background slideshow and a gradient overlay.
'use client';
import Link from 'next/link';
import { useEffect } from 'react';

export default function HeroSection() {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .slide {
        position: absolute;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        animation: slideShow 30s linear infinite;
        opacity: 0;
        animation-fill-mode: forwards;
      }
      @keyframes slideShow {
        0% { opacity: 0; }
        5% { opacity: 1; }
        25% { opacity: 1; }
        30% { opacity: 0; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <header className="relative h-screen flex items-center justify-center overflow-hidden mt-10">
      {/* Background Slideshow */}
      <div className="hero-slideshow absolute inset-0 blur-xs">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="slide"
            style={{
              backgroundImage: `url('/heroImage/hero-${i + 1}.jpg')`,
              animationDelay: `${i * 3}s`,
              zIndex: `${i + 1}`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/70" />

      <div className="container mx-auto px-4 z-10 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeInUp">
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl px-3 py-2 rounded-md bg-gradient-to-r from-red-500 to-orange-400 text-white font-bold drop-shadow-lg"> 
              Revitalize
            </span>                                                   
            <span className="text-white drop-shadow-lg">Your Ride</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 animate-fadeInUp delay-100 drop-shadow-lg">
            Premium car washing services at your doorstep or our facility
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fadeInUp delay-200">
            <Link 
              href="#services" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
            <Link 
              href="/booking" 
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8 z-10 animate-bounce">
        <Link href="#services" className="text-white text-2xl hover:text-blue-300 transition">
          <i className="fas fa-chevron-down" />
        </Link>
      </div>
    </header>
  );
}
