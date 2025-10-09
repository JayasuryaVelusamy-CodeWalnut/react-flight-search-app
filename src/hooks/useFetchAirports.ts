import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAirports, selectAirports, selectError } from '../store/slices/airportSlice';

export const useFetchAirports = () => {
  const dispatch = useAppDispatch();
  const airports = useAppSelector(selectAirports);
  const error = useAppSelector(selectError);

  useEffect(() => {
    if (airports.length === 0 && !error) {
      dispatch(fetchAirports({}));
    }
  }, [dispatch, airports.length, error]);
};
