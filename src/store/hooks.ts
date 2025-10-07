import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';
import { useCallback, useEffect } from 'react';
import { fetchAirports, selectAirports, selectError, selectLoading, selectFilteredDestinations } from './slices/airportSlice';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAirports = () => {
  const dispatch = useAppDispatch();
  const airports = useAppSelector(selectAirports);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const filteredDestinations = useAppSelector(selectFilteredDestinations);

  const fetchAirportsData = useCallback(() => {
    dispatch(fetchAirports({}));
  }, [dispatch]);

  useEffect(() => {
    fetchAirportsData();
  }, [fetchAirportsData]);

  return {
    airports,
    loading,
    error,
    filteredDestinations,
    refetch: fetchAirportsData
  };
};
