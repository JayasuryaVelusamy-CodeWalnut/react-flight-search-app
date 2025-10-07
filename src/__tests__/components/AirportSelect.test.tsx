import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import airportReducer from '../../../src/store/slices/airportSlice';
import AirportSelect from '../../../src/components/AirportSelect';

const mockStore = configureStore({
  reducer: {
    airports: airportReducer
  }
});

describe('AirportSelect', () => {
  const defaultProps = {
    label: 'Test Airport',
    value: '',
    onChange: jest.fn(),
    placeholder: 'Select an airport'
  };

  it('renders with basic props', () => {
    render(
      <Provider store={mockStore}>
        <AirportSelect {...defaultProps} />
      </Provider>
    );

    expect(screen.getByLabelText('Test Airport')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Select an airport')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    const loadingStore = configureStore({
      reducer: {
        airports: airportReducer
      },
      preloadedState: {
        airports: {
          airports: [],
          loading: true,
          error: null,
          filteredDestinations: [],
          lastFetched: null
        }
      }
    });

    render(
      <Provider store={loadingStore}>
        <AirportSelect {...defaultProps} />
      </Provider>
    );

    expect(screen.getByPlaceholderText('Loading airports...')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('filters airports based on search term', async () => {
    const mockAirports = [
      { code: 'JFK', name: 'John F Kennedy', countryCode: 'US', currency: 'USD', restrictedOnDeparture: false, restrictedOnDestination: false, connections: [] },
      { code: 'LHR', name: 'London Heathrow', countryCode: 'GB', currency: 'GBP', restrictedOnDeparture: false, restrictedOnDestination: false, connections: [] }
    ];

    const storeWithAirports = configureStore({
      reducer: {
        airports: airportReducer
      },
      preloadedState: {
        airports: {
          airports: mockAirports,
          loading: false,
          error: null,
          filteredDestinations: [],
          lastFetched: Date.now()
        }
      }
    });

    render(
      <Provider store={storeWithAirports}>
        <AirportSelect {...defaultProps} />
      </Provider>
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'JFK' } });
    fireEvent.focus(input);

    const option = await screen.findByText('JFK - John F Kennedy');
    expect(option).toBeInTheDocument();
    expect(screen.queryByText('LHR - London Heathrow')).not.toBeInTheDocument();
  });

  it('shows error state when there is an error in Redux store', () => {
    const storeWithError = configureStore({
      reducer: {
        airports: airportReducer
      },
      preloadedState: {
        airports: {
          airports: [],
          loading: false,
          error: 'Failed to load airports',
          filteredDestinations: [],
          lastFetched: null
        }
      }
    });

    render(
      <Provider store={storeWithError}>
        <AirportSelect {...defaultProps} />
      </Provider>
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeEnabled();
  });
});
