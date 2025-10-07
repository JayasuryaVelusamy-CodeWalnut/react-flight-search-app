import reducer, { setFilteredDestinations, clearError, selectAirports, selectLoading, selectError, makeSelectFilteredDestinations, fetchAirports } from '../../../store/slices/airportSlice';

describe('airportSlice', () => {
  const initialState = {
    airports: [],
    filteredDestinations: [],
    loading: false,
    error: null,
    lastFetched: null,
  };

  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setFilteredDestinations', () => {
    const mockAirports = [
      { code: 'JFK', name: 'John F Kennedy', countryCode: 'US', currency: 'USD', restrictedOnDeparture: false, restrictedOnDestination: false, connections: [] }
    ];
    const actual = reducer(initialState, setFilteredDestinations(mockAirports));
    expect(actual.filteredDestinations).toEqual(mockAirports);
  });

  it('should handle clearError', () => {
    const stateWithError = {
      ...initialState,
      error: 'Test error'
    };
    const actual = reducer(stateWithError, clearError());
    expect(actual.error).toBeNull();
  });

  it('should handle fetchAirports.pending', () => {
    const actual = reducer(initialState, { type: fetchAirports.pending.type });
    expect(actual.loading).toBe(true);
    expect(actual.error).toBeNull();
  });

  it('should handle fetchAirports.fulfilled', () => {
    const mockAirports = [
      { code: 'JFK', name: 'John F Kennedy', countryCode: 'US', currency: 'USD', restrictedOnDeparture: false, restrictedOnDestination: false, connections: [] }
    ];
    const actual = reducer(initialState, { 
      type: fetchAirports.fulfilled.type, 
      payload: mockAirports 
    });
    expect(actual.loading).toBe(false);
    expect(actual.airports).toEqual(mockAirports);
    expect(actual.lastFetched).toBeDefined();
  });

  it('should handle fetchAirports.rejected', () => {
    const actual = reducer(initialState, { 
      type: fetchAirports.rejected.type,
      error: { message: 'Test error' }
    });
    expect(actual.loading).toBe(false);
    expect(actual.error).toBe('Test error');
  });

  describe('fetchAirports caching', () => {
    const mockAirport = { 
      code: 'JFK', 
      name: 'John F Kennedy', 
      countryCode: 'US', 
      currency: 'USD', 
      restrictedOnDeparture: false, 
      restrictedOnDestination: false, 
      connections: [] 
    };

    it('should not fetch if cache is valid and forceRefresh is false', async () => {
      const now = Date.now();
      const stateWithCache = {
        ...initialState,
        airports: [mockAirport],
        lastFetched: now
      };
      
      const thunkAction = fetchAirports({});
      const dispatch = jest.fn();
      const getState = () => ({ airports: stateWithCache });
      
      await thunkAction(dispatch, getState, undefined);
      
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: fetchAirports.fulfilled.type,
        payload: [mockAirport]
      }));
    });

    it('should fetch even with valid cache if forceRefresh is true', async () => {
      const now = Date.now();
      const stateWithCache = {
        ...initialState,
        airports: [mockAirport],
        lastFetched: now
      };
      
      const thunkAction = fetchAirports({ forceRefresh: true });
      const dispatch = jest.fn();
      const getState = () => ({ airports: stateWithCache });
      
      try {
        await thunkAction(dispatch, getState, undefined);
      } catch (_error) {
      }
      
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: fetchAirports.pending.type
      }));
    });
  });

  describe('selectors', () => {
    const mockState = {
      airports: {
        ...initialState,
        airports: [
          { 
            code: 'JFK', 
            name: 'John F Kennedy',
            countryCode: 'US',
            currency: 'USD',
            restrictedOnDeparture: false,
            restrictedOnDestination: false,
            connections: [
              {
                code: 'LAX',
                name: 'Los Angeles International',
                countryCode: 'US',
                currency: 'USD',
                restrictedOnDeparture: false,
                restrictedOnDestination: false
              }
            ]
          },
          { 
            code: 'LAX', 
            name: 'Los Angeles International',
            countryCode: 'US',
            currency: 'USD',
            restrictedOnDeparture: false,
            restrictedOnDestination: false,
            connections: []
          }
        ],
        loading: false,
        error: 'test error'
      }
    };

    it('should select airports', () => {
      expect(selectAirports(mockState)).toBe(mockState.airports.airports);
    });

    it('should select loading state', () => {
      expect(selectLoading(mockState)).toBe(false);
    });

    it('should select error state', () => {
      expect(selectError(mockState)).toBe('test error');
    });

    it('should filter destinations for origin', () => {
      const selectDestinations = makeSelectFilteredDestinations();
      const filteredDestinations = selectDestinations(mockState, 'JFK');
      
      expect(filteredDestinations).toHaveLength(1);
      expect(filteredDestinations[0].code).toBe('LAX');
    });

    it('should return empty array for invalid origin', () => {
      const selectDestinations = makeSelectFilteredDestinations();
      const filteredDestinations = selectDestinations(mockState, 'INVALID');
      
      expect(filteredDestinations).toHaveLength(0);
    });
  });
});
