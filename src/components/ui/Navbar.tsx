"use client";

import Link from 'next/link';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const pathname = usePathname();
  const { data: session } = useSession();

  const userNavLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/#services', label: 'Services' },
    { href: '/#locations', label: 'Location' },
    { href: '/#contact', label: 'Contact' },
    { href: '/#testimonials', label: 'Testimonials' }
  ];

  const providerNavLinks = [
    { href: '/control-center', label: 'Control Centre' },
    { href: '/provider-contact', label: 'Contact' }
  ];

  const adminNavLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/control-center', label: 'Control Centre' },
    { href: '/admin/messages', label: 'Messages' }
  ];

  const getNavLinks = () => {
    if (!session?.user) return userNavLinks;
    switch (session.user.role) {
      case 'ADMIN':
        return adminNavLinks;
      case 'PROVIDER':
        return providerNavLinks;
      default:
        return userNavLinks;
    }
  };

  const navLinks = getNavLinks();

  return (
    <nav className="bg-gray-900 bg-opacity-95 backdrop-blur-md fixed w-full z-50 shadow-md left-0 right-0 top-0  rounded-b-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo (far left) */}
          <div className="flex-shrink-0">
            <Link 
              href={session?.user?.role === 'PROVIDER' ? '/control-center' : '/'} 
              className="text-3xl font-extrabold tracking-tight text-white whitespace-nowrap hover:text-blue-400 transition-colors duration-300"
            >
              <span>Wash</span>
              <span className="text-green-400 underline decoration-green-400">Xpress</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {/* Centered Navigation Links */}
              <div className="flex space-x-8">
                {navLinks.map((link) => {
                  const isActive = pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative group font-medium px-1 py-2 transition-colors duration-300 ${
                        isActive ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {link.label}
                      <span className={`absolute left-0 bottom-0 h-0.5 bg-red-500 transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}></span>
                    </Link>
                  );
                })}
              </div>

              {/* Login/User Profile (far right) */}
              {session ? (
                <Link
                  href={session.user.role === 'PROVIDER' ? '/control-center' : '/dashboard'}
                  className="flex items-center text-green-400 font-medium hover:text-green-300 transition duration-300"
                >
                  <span>{session.user.name || 'Profile'}</span>
                  <FontAwesomeIcon icon={faUserCircle} className="ml-2 text-xl" />
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center text-green-400 font-medium hover:text-green-300 transition duration-300"
                >
                  <span>Login</span>
                  <FontAwesomeIcon icon={faUserCircle} className="ml-2 text-xl" />
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              <FontAwesomeIcon 
                icon={mobileMenuOpen ? faXmark : faBars} 
                className="text-xl"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-gray-800 transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? 'max-h-screen py-2' : 'max-h-0'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={toggleMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive 
                    ? 'bg-gray-900 text-blue-400' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="block h-0.5 w-full bg-red-500 mt-1"></span>
                )}
              </Link>
            );
          })}
          {session ? (
            <Link
              href={session.user.role === 'PROVIDER' ? '/control-center' : '/dashboard'}
              onClick={toggleMenu}
              className="block px-3 py-2 rounded-md text-base font-medium text-green-400 hover:bg-gray-700 hover:text-green-300"
            >
              <div className="flex items-center">
                <span>{session.user.name || 'Profile'}</span>
                <FontAwesomeIcon icon={faUserCircle} className="ml-2" />
              </div>
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={toggleMenu}
              className="block px-3 py-2 rounded-md text-base font-medium text-green-400 hover:bg-gray-700 hover:text-green-300"
            >
              <div className="flex items-center">
                <span>Login</span>
                <FontAwesomeIcon icon={faUserCircle} className="ml-2" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

//...................................................................................

// "use client";

// import Link from 'next/link';
// import { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

// export default function Navbar() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

//   return (
//     <nav className=" bg-gray-900 bg-opacity-95 backdrop-blur-md fixed w-full z-50 shadow-md border-b border-gray-700 pt-12 top-0 left-0 right-0 rounded-2xl">
//     <div className="container mx-auto px-4 py-5 flex justify-between items-center">
//       <Link href="/" className="text-4xl font-extrabold tracking-tight text-blue-400">
//         <span className="text-white">Wash</span>Xpress
//       </Link>
  
//       {/* Desktop Menu */}
//       <div className=" hidden md:flex items-center space-x-8 text-xl font-bold">
//         <NavItem href="/dashboard">Dashboard</NavItem>
//         <NavItem href="/control-center">Control Center</NavItem>
//         <NavItem href="/#services">Services</NavItem>
//         <NavItem href="/#locations">Locations</NavItem>
//         <NavItem href="/#testimonials">Testimonials</NavItem>
//         <NavItem href="/#contact">Contact</NavItem>
//         <Link
//           href="/login"
//           className="ml-4 bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition duration-300"
//         >
//           Login / Signup
//         </Link>
//       </div>

//         {/* Mobile Menu Toggle */}
//         <div className="md:hidden">
//           <button onClick={toggleMenu} className="text-white focus:outline-none">
//             <FontAwesomeIcon icon={mobileMenuOpen ? faXmark : faBars} className="text-2xl" />
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <div
//         className={`md:hidden bg-gray-800 text-white transition-all duration-300 ease-in-out ${
//           mobileMenuOpen ? 'max-h-screen py-4 px-6' : 'max-h-0 overflow-hidden'
//         }`}
//       >
//         <div className="flex flex-col space-y-4 text-lg font-medium pt-12">
//           <NavItem href="/dashboard" onClick={toggleMenu}>Dashboard</NavItem>
//           <NavItem href="/control-center" onClick={toggleMenu}>Control Center</NavItem>
//           <NavItem href="/#services" onClick={toggleMenu}>Services</NavItem>
//           <NavItem href="/#locations" onClick={toggleMenu}>Locations</NavItem>
//           <NavItem href="/#testimonials" onClick={toggleMenu}>Testimonials</NavItem>
//           <NavItem href="/#contact" onClick={toggleMenu}>Contact</NavItem>
//           <Link
//             href="/login"
//             className="bg-blue-500 text-white px-4 py-2 rounded-md text-center hover:bg-blue-600 transition duration-300"
//             onClick={toggleMenu}
//           >
//             Login / Signup
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// }

// // Reusable Nav Item component for cleaner code
// function NavItem({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
//   return (
//     <Link
//       href={href}
//       onClick={onClick}
//       className="hover:text-blue-400 transition duration-300"
//     >
//       {children}
//     </Link>
//   );
// }
