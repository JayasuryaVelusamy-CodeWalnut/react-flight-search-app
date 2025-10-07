import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import airportReducer from '../../../src/store/slices/airportSlice';
import { useAirports } from '../../../src/store/hooks';
import type { PropsWithChildren } from 'react';

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      airports: airportReducer
    },
    preloadedState
  });
};

const Wrapper = ({ children }: PropsWithChildren) => {
  const store = createTestStore();
  return <Provider store={store}>{children}</Provider>;
};

describe('useAirports', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useAirports(), { wrapper: Wrapper });

    expect(result.current).toEqual({
      airports: [],
      loading: true,
      error: null,
      filteredDestinations: [],
      refetch: expect.any(Function)
    });
  });

  it('should fetch airports on mount', () => {
    const { result } = renderHook(() => useAirports(), { wrapper: Wrapper });
    
    expect(result.current.loading).toBe(true);
  });

  it('should allow manual refetch', async () => {
    const { result } = renderHook(() => useAirports(), { wrapper: Wrapper });

    await act(async () => {
      result.current.refetch();
    });

    expect(result.current.loading).toBe(true);
  });
});
