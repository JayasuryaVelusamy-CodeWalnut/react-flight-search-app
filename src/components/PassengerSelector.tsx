import React from 'react';
import type { Passenger } from '../types/Flight';

interface PassengerSelectorProps {
  value: Passenger;
  onChange: (passengers: Passenger) => void;
}

const PassengerSelector: React.FC<PassengerSelectorProps> = ({ value, onChange }) => {
  const handleChange = (type: keyof Passenger, operation: 'increment' | 'decrement') => {
    const newValue = {
      ...value,
      [type]: operation === 'increment' ? value[type] + 1 : Math.max(0, value[type] - 1)
    };
    onChange(newValue);
  };

  const passengerTypes: { id: keyof Passenger; label: string; description: string }[] = [
    { id: 'adults', label: 'Adults', description: 'Age 12+' },
    { id: 'children', label: 'Children', description: 'Age 2-11' },
    { id: 'infants', label: 'Infants', description: 'Under 2' },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div className="space-y-4">
        {passengerTypes.map(({ id, label, description }) => (
          <div key={id} className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold" id={`${id}-label`}>{label}</h3>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleChange(id, 'decrement')}
                disabled={id === 'adults' ? value[id] <= 1 : value[id] <= 0}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 disabled:opacity-50"
                aria-label={`Decrement ${label}`}
                aria-controls={`${id}-count`}
              >
                -
              </button>
              <span 
                id={`${id}-count`}
                className="w-8 text-center" 
                aria-live="polite"
                aria-atomic="true"
              >
                {value[id]}
              </span>
              <button
                onClick={() => handleChange(id, 'increment')}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600"
                aria-label={`Increment ${label}`}
                aria-controls={`${id}-count`}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PassengerSelector;
