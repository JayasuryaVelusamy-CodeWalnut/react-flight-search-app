import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Flight Search
              </h1>
            </div>
          </div>
          <nav className="flex space-x-4">
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
        </div>
      </div>
    </header>
  );
};

export default Header;