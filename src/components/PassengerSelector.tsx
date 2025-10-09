import { forwardRef } from 'react';
import type { Passenger } from '../types/Flight';
import Button from './Button';

export interface PassengerSelectorProps {
  passengers: Passenger;
  onChange: (passengers: Passenger) => void;
}

const PassengerSelector = forwardRef<HTMLDivElement, PassengerSelectorProps>(
  ({ passengers, onChange }, ref) => {
  const handleChange = (type: keyof Passenger, operation: 'increment' | 'decrement') => {
    const newValue = {
      ...passengers,
      [type]: operation === 'increment' ? passengers[type] + 1 : Math.max(0, passengers[type] - 1)
    };
    onChange(newValue);
  };

  const passengerTypes: { id: keyof Passenger; label: string; description: string }[] = [
    { id: 'adults', label: 'Adults', description: 'Age 12+' },
    { id: 'children', label: 'Children', description: 'Age 2-11' },
    { id: 'infants', label: 'Infants', description: 'Under 2' },
  ];

  return (
    <div
      ref={ref}
      className="p-4 bg-white rounded-lg shadow-lg"
      role="group"
      aria-labelledby="passenger-selector-heading"
    >
      <h2 id="passenger-selector-heading" className="sr-only">
        Select Passengers
      </h2>
      <div className="space-y-4">
        {passengerTypes.map(({ id, label, description }) => (
          <div key={id} className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold" id={`${id}-label`}>{label}</h3>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="icon"
                onClick={() => handleChange(id, 'decrement')}
                disabled={id === 'adults' ? passengers[id] <= 1 : passengers[id] <= 0}
                aria-label={`Decrement ${label}`}
                aria-controls={`${id}-count`}
              >
                -
              </Button>
              <span
                id={`${id}-count`}
                className="w-8 text-center"
                aria-live="polite"
                aria-atomic="true"
              >
                {passengers[id]}
              </span>
              <Button
                variant="icon"
                onClick={() => handleChange(id, 'increment')}
                aria-label={`Increment ${label}`}
                aria-controls={`${id}-count`}
              >
                +
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default PassengerSelector;
