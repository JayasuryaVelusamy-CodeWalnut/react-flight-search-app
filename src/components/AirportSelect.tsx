import React from 'react';
import Select from 'react-select';
import type { Airport } from '../types/Airport';
import { useAppSelector } from '../store/hooks';

interface AirportSelectProps {
  label: string;
  value: string;
  onChange: (airport: Airport | null) => void;
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
  disabled = false,
}) => {
  const { airports, loading } = useAppSelector(state => state.airports);
  const labelId = `airport-label-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const airportOptions = (
    allowedAirports
      ? airports.filter(airport => allowedAirports.includes(airport.code))
      : airports
  ).map(airport => ({
    value: airport.code,
    label: `${airport.code} - ${airport.name}`,
    airport,
  }));

  const selectedValue = airportOptions.find(option => option.value === value) || null;

  const handleChange = (selectedOption: typeof selectedValue) => {
    onChange(selectedOption ? selectedOption.airport : null);
  };

  const formatOptionLabel = ({ airport }: { airport: Airport }) => (
    <div>
      <div className="font-medium">
        {airport.code} - {airport.name}
      </div>
      <div className="text-sm text-gray-500">{airport.countryCode}</div>
    </div>
  );

  return (
    <div className="flex flex-col">
      <label id={labelId} className="text-gray-500 text-sm font-medium mb-1">
        {label}
      </label>
      <Select
        aria-labelledby={labelId}
        options={airportOptions}
        value={selectedValue}
        onChange={handleChange}
        placeholder={loading ? 'Loading airports...' : placeholder}
        isDisabled={disabled || loading}
        isLoading={loading}
        isClearable
        formatOptionLabel={formatOptionLabel}
        classNamePrefix="react-select"
      />
    </div>
  );
};

export default AirportSelect;
