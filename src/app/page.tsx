import HeroSection from '../components/common/HeroSection';
import StatsSection from '../components/common/StatsSection';
import ServicesSection from '../components/common/ServicesSection';
import HowItWorks from '../components/common/HowItWorks';
import Testimonials from '../components/common/Testimonials';
import FAQ from '../components/common/FAQ';
import LocationSection from '../components/common/LocationSection';
import ContactSection from '../components/common/ContactSection';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/globals.css';


export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-gray-100">
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <LocationSection />
      <ContactSection />
    </main>
  );
}