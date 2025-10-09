import React, { useState, useMemo, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AirportSelect from './AirportSelect';
import PassengerSelector from './PassengerSelector';
import Portal from './Portal';
import Skeleton from './Skeleton';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectAirports, selectLoading, selectError, makeSelectFilteredDestinations, fetchAirports } from '../store/slices/airportSlice';
import { formatPassengerCount, formatDate, getAirportName } from '../utils/format';
import { useFetchAirports } from '../hooks/useFetchAirports';
import { useClickOutside } from '../hooks/useClickOutside';
import { useFlightSearchForm } from '../hooks/useFlightSearchForm';

const FlightSearchForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const airports = useAppSelector(selectAirports);
  const isLoading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const [isErrorVisible, setIsErrorVisible] = useState(!!error);

  useEffect(() => {
    setIsErrorVisible(!!error);
  }, [error]);

  useFetchAirports();
  const [isPassengerSelectorOpen, setIsPassengerSelectorOpen] = useState(false);
  const [passengerSelectorPosition, setPassengerSelectorPosition] = useState({ top: 0, left: 0 });
  const passengerButtonRef = useRef<HTMLButtonElement>(null);
  const passengerSelectorRef = useClickOutside(() => {
    setIsPassengerSelectorOpen(false);
  }, passengerButtonRef);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPassengerSelectorOpen(false);
      }
    };

    if (isPassengerSelectorOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPassengerSelectorOpen]);

  const {
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
  } = useFlightSearchForm();

  const selectDestinationsForOrigin = useMemo(
    () => makeSelectFilteredDestinations(),
    []
  );

  const allowedDestinations = useAppSelector(
    state => searchCriteria.origin ? 
      selectDestinationsForOrigin(state, searchCriteria.origin).map(airport => airport.code) : 
      undefined
  );

  return (
    <div className="flex flex-col items-center gap-6">
      {isErrorVisible && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-4">
          <p>{error}</p>
          <button onClick={() => dispatch(fetchAirports({ forceRefresh: true }))} className="text-sm font-semibold underline">
            Retry
          </button>
          <button onClick={() => setIsErrorVisible(false)} className="text-lg font-bold">
            &times;
          </button>
        </div>
      )}
      {isLoading ? (
        <Skeleton />
      ) : (
        <form
          className="bg-white rounded-xl shadow-lg flex flex-col lg:flex-row lg:items-center divide-y lg:divide-y-0 lg:divide-x divide-gray-200 w-full"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <div className="p-4 flex flex-col w-full lg:w-auto">
            <label htmlFor="trip-type" className="text-gray-500 text-sm font-medium">Trip</label>
            <select
              id="trip-type"
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0"
              value={searchCriteria.tripType}
              onChange={handleTripTypeChange}
              aria-controls="return-date-container"
            >
              <option value="oneWay">One way</option>
              <option value="return">Return</option>
            </select>
          </div>

          <div className="p-4 w-full lg:w-auto">
            <AirportSelect
              label="From"
              value={searchCriteria.origin}
              onChange={handleOriginChange}
              placeholder="Country, city or airport"
            />
            {errors.origin && <p className="text-red-500 text-xs mt-1">{errors.origin}</p>}
          </div>

          <div className="p-4 w-full lg:w-auto">
            <AirportSelect
              label="To"
              value={searchCriteria.destination}
              onChange={handleDestinationChange}
              placeholder="Country, city or airport"
              allowedAirports={allowedDestinations}
              disabled={!searchCriteria.origin}
            />
            {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination}</p>}
          </div>

          <div className="px-6 py-4 flex flex-col md:flex-row items-center gap-4">
            <div className="flex flex-col w-full md:w-auto">
              <label htmlFor="depart-date" className="text-gray-500 text-sm font-medium">Depart</label>
              <DatePicker
                id="depart-date"
                selected={searchCriteria.departDate}
                onChange={(date: Date | null) => handleDateChange(date, 'departDate')}
                minDate={new Date()}
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0"
                dateFormat="EEE, dd MMM"
              />
            </div>

            {searchCriteria.tripType === 'return' && (
              <div className="flex flex-col w-full md:w-auto">
                <label htmlFor="return-date" className="text-gray-500 text-sm font-medium">Return</label>
                <DatePicker
                id="return-date"
                selected={searchCriteria.returnDate}
                onChange={(date: Date | null) => handleDateChange(date, 'returnDate')}
                  minDate={searchCriteria.departDate}
                  placeholderText="Select date"
                  className="w-full bg-transparent border-none focus:outline-none focus:ring-0"
                  dateFormat="EEE, dd MMM"
                />
                {errors.returnDate && <p className="text-red-500 text-xs mt-1">{errors.returnDate}</p>}
              </div>
            )}
          </div>

          <div className="px-6 py-4 flex flex-col relative">
            <button
              type="button"
              ref={passengerButtonRef}
              className="text-left"
              onClick={() => {
                if (passengerButtonRef.current) {
                  const rect = passengerButtonRef.current.getBoundingClientRect();
                  setPassengerSelectorPosition({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                  });
                }
                setIsPassengerSelectorOpen(!isPassengerSelectorOpen);
              }}
              aria-expanded={isPassengerSelectorOpen}
              aria-controls="passenger-selector"
            >
              <span className="text-gray-500 text-sm font-medium">Travelers</span>
              <span className="block text-black font-semibold">
                {formatPassengerCount(
                  searchCriteria.passengers.adults,
                  searchCriteria.passengers.children,
                  searchCriteria.passengers.infants
                )}
              </span>
            </button>

            {isPassengerSelectorOpen && (
              <Portal>
                <div
                  style={{
                    position: 'absolute',
                    top: `${passengerSelectorPosition.top}px`,
                    left: `${passengerSelectorPosition.left}px`,
                    zIndex: 50,
                  }}
                >
                  <PassengerSelector
                    ref={passengerSelectorRef}
                    passengers={searchCriteria.passengers}
                    onChange={handlePassengerChange}
                  />
                </div>
              </Portal>
            )}
          </div>

          <div className="p-4 lg:px-4 w-full lg:w-auto flex items-center gap-4">
            <button 
              className="bg-[#0061ff] hover:bg-[#0051d1] text-white font-semibold rounded-xl px-6 py-3 transition disabled:opacity-50 w-full"
              onClick={handleSearch}
              disabled={!searchCriteria.origin || !searchCriteria.destination || 
                       (searchCriteria.tripType === 'return' && !searchCriteria.returnDate)}
            >
              Search
            </button>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 font-semibold px-4 py-3 transition"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </form>
      )}

      {showSummary && (
        <div className="bg-white rounded-xl shadow-md p-6 max-w-6xl w-full" role="region" aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="sr-only">Flight Search Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
