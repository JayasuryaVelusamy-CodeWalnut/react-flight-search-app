import React, { useState, useEffect, useRef } from 'react';
import type { Airport } from '../types/Airport';
import { useAppSelector } from '../store/hooks';

interface AirportSelectProps {
  label: string;
  value: string;
  onChange: (airport: Airport) => void;
  placeholder?: string;
  allowedAirports?: string[];
  disabled?: boolean;
}

const AirportSelect: React.FC<AirportSelectProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Select airport',
  allowedAirports,
  disabled = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredAirports, setFilteredAirports] = useState<Airport[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listboxId = `airport-listbox-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const { airports, loading } = useAppSelector(state => state.airports);

  useEffect(() => {
    if (!airports || !Array.isArray(airports)) {
      setFilteredAirports([]);
      return;
    }

    let availableAirports = airports;
    
    if (allowedAirports && allowedAirports.length > 0) {
      availableAirports = airports.filter(airport => 
        allowedAirports.includes(airport.code)
      );
    }

    const filtered = availableAirports
      .filter(airport => {
        if (searchTerm === '') return true;
        const term = searchTerm.toLowerCase();
        return airport.name.toLowerCase().includes(term) ||
               airport.code.toLowerCase().includes(term) ||
               airport.countryCode.toLowerCase().includes(term);
      });
      
    setFilteredAirports(filtered);
    setActiveIndex(-1);
  }, [searchTerm, airports, allowedAirports]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (airport: Airport) => {
    onChange(airport);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev < filteredAirports.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex > -1 && filteredAirports[activeIndex]) {
          handleSelect(filteredAirports[activeIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const selectedAirport = value && Array.isArray(airports) ? airports.find(a => a.code === value) : null;
  const displayValue = selectedAirport ? `${selectedAirport.code} - ${selectedAirport.name}` : '';

  return (
    <div className="flex flex-col" ref={dropdownRef}>
      <label htmlFor={`airport-${label.toLowerCase()}`} className="text-gray-500 text-sm font-medium mb-1">{label}</label>
      <div 
        className="relative" 
        role="combobox" 
        aria-expanded={isOpen} 
        aria-haspopup="listbox"
      >
        <input
          id={`airport-${label.toLowerCase()}`}
          type="text"
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
            loading ? 'bg-gray-100' : ''
          }`}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={loading ? 'Loading airports...' : displayValue || placeholder}
          disabled={disabled || loading}
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={activeIndex > -1 ? `option-${activeIndex}` : undefined}
        />
        
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
          </div>
        )}
        
        {isOpen && filteredAirports.length > 0 && (
          <ul 
            id={listboxId}
            role="listbox"
            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {filteredAirports.map((airport, index) => (
              <li
                key={airport.code}
                id={`option-${index}`}
                role="option"
                aria-selected={activeIndex === index}
                className={`px-4 py-2 cursor-pointer ${activeIndex === index ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                onClick={() => handleSelect(airport)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <div className="font-medium">{airport.code} - {airport.name}</div>
                <div className="text-sm text-gray-500">{airport.countryCode}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AirportSelect;
