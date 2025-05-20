import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCar, 
  faMapMarkerAlt, 
  faPhone, 
  faEnvelope 
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebookF, 
  faTwitter, 
  faInstagram, 
  faLinkedinIn 
} from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2B2B29] text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FontAwesomeIcon icon={faCar} className="text-blue-500 text-2xl" />
              <span className="text-xl font-bold text-white">WashXpress</span>
            </div>
            <p className="mb-4">
              Premium car washing services for individuals and fleets.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FontAwesomeIcon icon={faFacebookF} className="text-lg" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FontAwesomeIcon icon={faTwitter} className="text-lg" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FontAwesomeIcon icon={faInstagram} className="text-lg" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FontAwesomeIcon icon={faLinkedinIn} className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-blue-500 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-blue-500 transition-colors">Services</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500 mt-1" />
                <span>C-B-22 Road, Main Street, Phuentsholing</span>
              </li>
              <li className="flex items-center gap-3">
                <FontAwesomeIcon icon={faPhone} className="text-blue-500" />
                <span>(+175) 77884488</span>
              </li>
              <li className="flex items-center gap-3">
                <FontAwesomeIcon icon={faEnvelope} className="text-blue-500" />
                <span>supportTeam@washXpress.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Newsletter</h3>
            <p className="mb-4">Subscribe for offers and updates</p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                required
                className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
              />
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center text-gray-500">
          <p>&copy; {currentYear} WashXpress. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}