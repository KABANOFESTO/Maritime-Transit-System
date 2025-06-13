'use client';
import { useState } from 'react';
import Image from 'next/image';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-white-600 rounded-lg flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={80}
                  height={80}
                  className="w-80 h-70"
                />
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                Home
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                How It Works
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                Benefits
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                Mobile App
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                Testimonials
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                Contact Us
              </a>
            </div>
          </div>

          {/* Language Selector & Mobile menu button */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <select className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>🇺🇸 EN-US</option>
                <option>🇫🇷 FR-FR</option>
                <option>🇪🇸 ES-ES</option>
              </select>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gray-200 inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <a href="#" className="text-gray-900 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                Home
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                How It Works
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                Benefits
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                Mobile App
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                Testimonials
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                Contact Us
              </a>
              <div className="px-3 py-2">
                <select className="border border-gray-300 rounded-md px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>🇺🇸 EN-US</option>
                  <option>🇫🇷 FR-FR</option>
                  <option>🇪🇸 ES-ES</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
