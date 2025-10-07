import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Airport } from '../../types/Airport';
import { fetchOriginsWithConnections, filterDestinations as filterAirportDestinations } from '../../services/airportService';

interface AirportState {
  airports: Airport[];
  filteredDestinations: Airport[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: AirportState = {
  airports: [],
  filteredDestinations: [],
  loading: false,
  error: null,
  lastFetched: null,
};

const CACHE_DURATION = 5 * 60 * 1000;

interface FetchAirportsParams {
  forceRefresh?: boolean;
}

export const fetchAirports = createAsyncThunk(
  'airports/fetchAirports',
  async ({ forceRefresh = false }: FetchAirportsParams = {}, { getState }) => {
    const state = getState() as { airports: AirportState };
    const now = Date.now();

    if (
      !forceRefresh &&
      state.airports.lastFetched &&
      state.airports.airports.length > 0 &&
      now - state.airports.lastFetched < CACHE_DURATION
    ) {
      return state.airports.airports;
    }

    try {
      const airports = await fetchOriginsWithConnections();
      return airports;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch airports');
    }
  }
);

const airportSlice = createSlice({
  name: 'airports',
  initialState,
  reducers: {
    setFilteredDestinations: (state, action: PayloadAction<Airport[]>) => {
      state.filteredDestinations = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAirports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAirports.fulfilled, (state, action) => {
        state.loading = false;
        state.airports = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchAirports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch airports';
      });
  },
});

export const { setFilteredDestinations, clearError } = airportSlice.actions;

const getAirportsState = (state: { airports: AirportState }) => state.airports;

export const selectAirports = createSelector(
  [getAirportsState],
  state => state.airports
);

export const selectFilteredDestinations = createSelector(
  [getAirportsState],
  state => state.filteredDestinations
);

export const selectLoading = createSelector(
  [getAirportsState],
  state => state.loading
);

export const selectError = createSelector(
  [getAirportsState],
  state => state.error
);

export const makeSelectFilteredDestinations = () =>
  createSelector(
    [selectAirports, (_: unknown, originCode: string) => originCode],
    (airports, originCode) => filterAirportDestinations(originCode, airports)
  );

export default airportSlice.reducer;
