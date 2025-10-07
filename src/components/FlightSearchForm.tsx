import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import type { Airport } from '../types/Airport';
import type { FlightSearchCriteria } from '../types/Flight';
import AirportSelect from './AirportSelect';
import PassengerSelector from './PassengerSelector';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAirports, selectAirports, selectLoading, selectError, makeSelectFilteredDestinations } from '../store/slices/airportSlice';
import { formatPassengerCount, formatDate, getAirportName } from '../utils/format';

const FlightSearchForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const airports = useAppSelector(selectAirports);
  const isLoading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const [isPassengerSelectorOpen, setIsPassengerSelectorOpen] = useState(false);
  const passengerSelectorRef = useRef<HTMLDivElement>(null);
  const [searchCriteria, setSearchCriteria] = useState<FlightSearchCriteria>({
    tripType: 'oneWay',
    origin: '',
    destination: '',
    departDate: new Date(),
    returnDate: undefined,
    passengers: {
      adults: 1,
      children: 0,
      infants: 0
    }
  });

  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (airports.length === 0 && !error) {
      dispatch(fetchAirports({}));
    }
  }, [dispatch, airports.length, error]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (passengerSelectorRef.current && !passengerSelectorRef.current.contains(event.target as Node)) {
        setIsPassengerSelectorOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    setShowSummary(true);
  };

  const handleOriginChange = (airport: Airport) => {
    setSearchCriteria(prev => ({
      ...prev,
      origin: airport.code,
      destination: ''
    }));
  };

  const handleDestinationChange = (airport: Airport) => {
    setSearchCriteria(prev => ({
      ...prev,
      destination: airport.code
    }));
  };

  const selectDestinationsForOrigin = React.useMemo(
    () => makeSelectFilteredDestinations(),
    []
  );

  const allowedDestinations = useAppSelector(
    state => searchCriteria.origin ? 
      selectDestinationsForOrigin(state, searchCriteria.origin).map(airport => airport.code) : 
      undefined
  );

  return (
    <div className="flex flex-col items-center space-y-6">
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-md p-6 max-w-6xl w-full flex justify-center">
          <div className="text-gray-600">Loading airports...</div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md flex items-center divide-x divide-gray-200 max-w-6xl w-full">
          <div className="px-4 py-4 flex flex-col">
            <label htmlFor="trip-type" className="text-gray-500 text-sm font-medium">Trip</label>
            <select 
              id="trip-type"
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0"
              value={searchCriteria.tripType}
              onChange={(e) => setSearchCriteria(prev => ({ 
                ...prev, 
                tripType: e.target.value as 'oneWay' | 'return',
                returnDate: e.target.value === 'oneWay' ? undefined : prev.returnDate
              }))}
            >
              <option value="oneWay">One way</option>
              <option value="return">Return</option>
            </select>
          </div>

          <div className="px-6 py-4">
            <AirportSelect
              label="From"
              value={searchCriteria.origin}
              onChange={handleOriginChange}
              placeholder="Country, city or airport"
            />
          </div>

          <div className="px-6 py-4">
            <AirportSelect
              label="To"
              value={searchCriteria.destination}
              onChange={handleDestinationChange}
              placeholder="Country, city or airport"
              allowedAirports={allowedDestinations}
              disabled={!searchCriteria.origin}
            />
          </div>

          <div className="px-6 py-4 flex items-center gap-4">
            <div className="flex flex-col">
              <label htmlFor="depart-date" className="text-gray-500 text-sm font-medium">Depart</label>
              <DatePicker
                id="depart-date"
                selected={searchCriteria.departDate}
                onChange={(date: Date | null) => {
                  if (date) {
                    setSearchCriteria(prev => ({
                      ...prev,
                      departDate: date,
                      returnDate: prev.returnDate && date > prev.returnDate ? undefined : prev.returnDate
                    }));
                  }
                }}
                minDate={new Date()}
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0"
                dateFormat="EEE, dd MMM"
              />
            </div>

            {searchCriteria.tripType === 'return' && (
              <div className="flex flex-col">
                <label htmlFor="return-date" className="text-gray-500 text-sm font-medium">Return</label>
                <DatePicker
                  id="return-date"
                  selected={searchCriteria.returnDate}
                  onChange={(date: Date | null) => setSearchCriteria(prev => ({
                    ...prev,
                    returnDate: date || undefined
                  }))}
                  minDate={searchCriteria.departDate}
                  placeholderText="Select date"
                  className="w-full bg-transparent border-none focus:outline-none focus:ring-0"
                  dateFormat="EEE, dd MMM"
                />
              </div>
            )}
          </div>

          <div className="px-6 py-4 flex flex-col relative" ref={passengerSelectorRef}>
            <button
              className="text-left"
              onClick={() => setIsPassengerSelectorOpen(!isPassengerSelectorOpen)}
            >
              <span className="text-gray-500 text-sm font-medium">Travellers</span>
              <span className="block text-black font-semibold">
                {formatPassengerCount(
                  searchCriteria.passengers.adults,
                  searchCriteria.passengers.children,
                  searchCriteria.passengers.infants
                )}
              </span>
            </button>

            {isPassengerSelectorOpen && (
              <div className="absolute top-full left-0 mt-2 z-50">
                <PassengerSelector
                  value={searchCriteria.passengers}
                  onChange={(passengers) => {
                    setSearchCriteria(prev => ({ ...prev, passengers }));
                  }}
                />
              </div>
            )}
          </div>

          <div className="px-4">
            <button 
              className="bg-[#0061ff] hover:bg-[#0051d1] text-white font-semibold rounded-xl px-6 py-3 transition disabled:opacity-50"
              onClick={handleSearch}
              disabled={!searchCriteria.origin || !searchCriteria.destination || 
                       (searchCriteria.tripType === 'return' && !searchCriteria.returnDate)}
            >
              Search
            </button>
          </div>
        </div>
      )}

      {showSummary && (
        <div className="bg-white rounded-xl shadow-md p-6 max-w-6xl w-full">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <p className="text-sm text-gray-500">Trip Type</p>
              <p className="font-semibold capitalize">
                {searchCriteria.tripType === 'oneWay' ? 'One way' : 'Return'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Route</p>
              <p className="font-semibold">
                {getAirportName(searchCriteria.origin, airports)} → {getAirportName(searchCriteria.destination, airports)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-semibold">{formatDate(searchCriteria.departDate)}</p>
              {searchCriteria.tripType === 'return' && searchCriteria.returnDate && (
                <p className="font-semibold">
                  Return: {formatDate(searchCriteria.returnDate)}
                </p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">Passengers</p>
              <p className="font-semibold">
                {formatPassengerCount(
                  searchCriteria.passengers.adults,
                  searchCriteria.passengers.children,
                  searchCriteria.passengers.infants
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightSearchForm;
