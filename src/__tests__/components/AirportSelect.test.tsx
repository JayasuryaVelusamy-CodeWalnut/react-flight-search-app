import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import airportReducer from '../../../src/store/slices/airportSlice';
import AirportSelect from '../../../src/components/AirportSelect';
import type { Airport } from '../../../src/types/Airport';
import type { RootState } from '../../../src/store';

const mockAirports: Airport[] = [
  { code: 'JFK', name: 'John F Kennedy', countryCode: 'US', currency: 'USD', restrictedOnDeparture: false, restrictedOnDestination: false, connections: [] },
  { code: 'LHR', name: 'London Heathrow', countryCode: 'GB', currency: 'GBP', restrictedOnDeparture: false, restrictedOnDestination: false, connections: [] },
  { code: 'CDG', name: 'Charles de Gaulle', countryCode: 'FR', currency: 'EUR', restrictedOnDeparture: false, restrictedOnDestination: false, connections: [] },
];

const renderComponent = (
  props: Partial<React.ComponentProps<typeof AirportSelect>> = {},
  preloadedState: Partial<RootState> = {}
) => {
  const store = configureStore({
    reducer: {
      airports: airportReducer,
    },
    preloadedState: {
      airports: {
        airports: mockAirports,
        loading: false,
        error: null,
        filteredDestinations: [],
        lastFetched: Date.now(),
        ...preloadedState.airports,
      },
    },
  });

  const defaultProps = {
    label: 'Test Airport',
    value: '',
    onChange: jest.fn(),
    placeholder: 'Select an airport',
  };

  return render(
    <Provider store={store}>
      <AirportSelect {...defaultProps} {...props} />
    </Provider>
  );
};

describe('AirportSelect', () => {
  it('renders with default props', () => {
    renderComponent();
    expect(screen.getByLabelText('Test Airport')).toBeInTheDocument();
    expect(screen.getByText('Select an airport')).toBeInTheDocument();
  });

  it('displays loading state and disables input', () => {
    renderComponent({}, { airports: { airports: [], loading: true, error: null, filteredDestinations: [], lastFetched: null } });
    expect(screen.getByText('Loading airports...')).toBeInTheDocument();
    expect(screen.getByLabelText('Test Airport')).toBeDisabled();
  });

  it('displays error state but remains enabled', () => {
    renderComponent({}, { airports: { airports: [], loading: false, error: 'Failed to load', filteredDestinations: [], lastFetched: null } });
    expect(screen.getByText('Select an airport')).toBeInTheDocument();
    expect(screen.getByLabelText('Test Airport')).toBeEnabled();
  });

  it('filters airports based on user input', async () => {
    renderComponent();
    const input = screen.getByLabelText('Test Airport');
    await userEvent.type(input, 'JFK');
    expect(await screen.findByText('JFK - John F Kennedy')).toBeInTheDocument();
    expect(screen.queryByText('LHR - London Heathrow')).not.toBeInTheDocument();
  });

  it('calls onChange with the selected airport object', async () => {
    const mockOnChange = jest.fn();
    renderComponent({ onChange: mockOnChange });
    const input = screen.getByLabelText('Test Airport');
    await userEvent.type(input, 'LHR');
    const option = await screen.findByText('LHR - London Heathrow');
    await userEvent.click(option);
    expect(mockOnChange).toHaveBeenCalledWith(mockAirports[1]);
  });

  it('is disabled when the disabled prop is true', () => {
    renderComponent({ disabled: true });
    expect(screen.getByLabelText('Test Airport')).toBeDisabled();
  });
});
