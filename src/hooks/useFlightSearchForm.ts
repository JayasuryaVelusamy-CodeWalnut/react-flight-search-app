import { useState, useCallback } from 'react';
import type { Airport } from '../types/Airport';
import type { FlightSearchCriteria } from '../types/Flight';

const initialSearchCriteria: FlightSearchCriteria = {
  tripType: 'oneWay',
  origin: '',
  destination: '',
  departDate: new Date(),
  returnDate: undefined,
  passengers: {
    adults: 1,
    children: 0,
    infants: 0,
  },
};

export const useFlightSearchForm = () => {
  const [searchCriteria, setSearchCriteria] = useState<FlightSearchCriteria>(initialSearchCriteria);
  const [errors, setErrors] = useState<Partial<Record<keyof FlightSearchCriteria | 'returnDate', string>>>({});
  const [showSummary, setShowSummary] = useState(false);

  const handleSearch = useCallback(() => {
    const newErrors: Partial<Record<keyof FlightSearchCriteria | 'returnDate', string>> = {};
    if (!searchCriteria.origin) {
      newErrors.origin = 'Origin airport is required.';
    }
    if (!searchCriteria.destination) {
      newErrors.destination = 'Destination airport is required.';
    }
    if (searchCriteria.tripType === 'return' && !searchCriteria.returnDate) {
      newErrors.returnDate = 'Return date is required for a return trip.';
    }
    if (
      searchCriteria.tripType === 'return' &&
      searchCriteria.returnDate &&
      searchCriteria.departDate > searchCriteria.returnDate
    ) {
      newErrors.returnDate = 'Return date must be after departure date.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShowSummary(false);
    } else {
      setErrors({});
      setShowSummary(true);
    }
  }, [searchCriteria]);

  const handleReset = useCallback(() => {
    setSearchCriteria(initialSearchCriteria);
    setErrors({});
    setShowSummary(false);
  }, []);

  const handleOriginChange = useCallback((airport: Airport | null) => {
    setSearchCriteria(prev => ({
      ...prev,
      origin: airport ? airport.code : '',
      destination: '',
    }));
  }, [setSearchCriteria]);

  const handleDestinationChange = useCallback((airport: Airport | null) => {
    setSearchCriteria(prev => ({
      ...prev,
      destination: airport ? airport.code : '',
    }));
  }, [setSearchCriteria]);

  const handleDateChange = useCallback((date: Date | null, field: 'departDate' | 'returnDate') => {
    setSearchCriteria(prev => {
      const newCriteria = { ...prev, [field]: date };
      if (field === 'departDate' && newCriteria.returnDate && date && date > newCriteria.returnDate) {
        newCriteria.returnDate = undefined;
      }
      return newCriteria;
    });
  }, [setSearchCriteria]);

  const handleTripTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchCriteria(prev => ({
      ...prev,
      tripType: e.target.value as 'oneWay' | 'return',
      returnDate: e.target.value === 'oneWay' ? undefined : prev.returnDate,
    }));
  }, [setSearchCriteria]);

  const handlePassengerChange = useCallback((passengers: FlightSearchCriteria['passengers']) => {
    setSearchCriteria(prev => ({ ...prev, passengers }));
  }, [setSearchCriteria]);

  return {
    searchCriteria,
    errors,
    showSummary,
    handleSearch,
    handleReset,
    handleOriginChange,
    handleDestinationChange,
    handleDateChange,
    handleTripTypeChange,
    handlePassengerChange,
  };
};
