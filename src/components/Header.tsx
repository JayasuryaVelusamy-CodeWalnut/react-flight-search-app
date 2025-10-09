import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="flex-shrink-0 text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Flight Search
          </h1>
        <nav className="hidden gap-4 md:flex">
          <a
            href="#"
            className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
          >
            Home
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
          >
            Flights
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
          >
            About
          </a>
        </nav>
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? (
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="flex flex-col gap-1 px-2 pb-3 pt-2 sm:px-3">
            <a
              href="#"
              className="text-gray-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
            >
              Flights
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
            >
              About
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
