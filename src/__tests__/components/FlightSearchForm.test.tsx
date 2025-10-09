import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import FlightSearchForm from '../../components/FlightSearchForm';
import airportReducer from '../../store/slices/airportSlice';
import type { Airport } from '../../types/Airport';

const mockAirports: Airport[] = [
  { code: 'JFK', name: 'John F Kennedy', countryCode: 'US', currency: 'USD', restrictedOnDeparture: false, restrictedOnDestination: false, connections: [{ code: 'LAX', name: 'Los Angeles', countryCode: 'US', currency: 'USD', restrictedOnDeparture: false, restrictedOnDestination: false }] },
  { code: 'LAX', name: 'Los Angeles', countryCode: 'US', currency: 'USD', restrictedOnDeparture: false, restrictedOnDestination: false, connections: [] },
  { code: 'LHR', name: 'London Heathrow', countryCode: 'GB', currency: 'GBP', restrictedOnDeparture: false, restrictedOnDestination: false, connections: [] }
];

const createTestStore = (airports: Airport[] = mockAirports, loading = false, error: string | null = null) => {
  return configureStore({
    reducer: {
      airports: airportReducer
    },
    preloadedState: {
      airports: {
        airports,
        loading,
        error,
        filteredDestinations: [],
        lastFetched: Date.now()
      }
    }
  });
};

describe('FlightSearchForm', () => {
  beforeEach(() => {
    const portalRoot = document.createElement('div');
    portalRoot.id = 'portal-root';
    document.body.appendChild(portalRoot);
  });

  afterEach(() => {
    const portalRoot = document.getElementById('portal-root');
    if (portalRoot) {
      document.body.removeChild(portalRoot);
    }
  });

  it('renders the form with initial values', () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <FlightSearchForm />
      </Provider>
    );

    expect(screen.getByLabelText('From')).toBeInTheDocument();
    expect(screen.getByLabelText('To')).toBeInTheDocument();
    expect(screen.getByLabelText('Depart')).toBeInTheDocument();
    expect(screen.getByText('Travelers')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('shows loading state when airports are being fetched', () => {
    const store = createTestStore([], true);
    render(
      <Provider store={store}>
        <FlightSearchForm />
      </Provider>
    );

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('shows an error message if fetching airports fails', () => {
    const store = createTestStore([], false, 'Failed to load airports');
    render(
      <Provider store={store}>
        <FlightSearchForm />
      </Provider>
    );

    expect(screen.getByText('Failed to load airports')).toBeInTheDocument();
  });

  it('enables search button when all required fields are filled', async () => {
    const user = userEvent.setup();
    const store = createTestStore();
    render(
      <Provider store={store}>
        <FlightSearchForm />
      </Provider>
    );

    await waitFor(() => expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument());

    const fromInput = screen.getByLabelText('From');
    await user.type(fromInput, 'JFK');
    await user.click(await screen.findByText('JFK - John F Kennedy'));

    const toInput = screen.getByLabelText('To');
    await waitFor(() => expect(toInput).toBeEnabled());
    await user.type(toInput, 'LAX');
    await user.click(await screen.findByText('LAX - Los Angeles'));

    expect(screen.getByRole('button', { name: /search/i })).toBeEnabled();
  });

  it('shows search summary when search button is clicked', async () => {
    const user = userEvent.setup();
    const store = createTestStore();
    render(
      <Provider store={store}>
        <FlightSearchForm />
      </Provider>
    );

    await waitFor(() => expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument());

    const fromInput = screen.getByLabelText('From');
    await user.type(fromInput, 'JFK');
    await user.click(await screen.findByText('JFK - John F Kennedy'));

    const toInput = screen.getByLabelText('To');
    await waitFor(() => expect(toInput).toBeEnabled());
    await user.type(toInput, 'LAX');
    await user.click(await screen.findByText('LAX - Los Angeles'));

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    expect(screen.getByText('Trip Type')).toBeInTheDocument();
    expect(screen.getByText('Route')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Passengers')).toBeInTheDocument();
    expect(screen.getByText('John F Kennedy → Los Angeles')).toBeInTheDocument();
  });

  it('toggles passenger selector on click', async () => {
    const user = userEvent.setup();
    const store = createTestStore();
    render(
      <Provider store={store}>
        <FlightSearchForm />
      </Provider>
    );

    await waitFor(() => expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument());

    const passengerButton = screen.getByText('Travelers');
    await user.click(passengerButton);
    expect(screen.getByText('Adults')).toBeInTheDocument();

    await user.click(passengerButton);
    expect(screen.queryByText('Adults')).not.toBeInTheDocument();
  });
});
