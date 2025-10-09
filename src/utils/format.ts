export const pluralize = (count: number, singular: string, plural: string) => {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural}`;
};

export const formatPassengerCount = (
  adults: number,
  children: number,
  infants: number
): string => {
  const segments: string[] = [];

  if (adults > 0) {
    segments.push(pluralize(adults, 'Adult', 'Adults'));
  }
  if (children > 0) {
    segments.push(pluralize(children, 'Child', 'Children'));
  }
  if (infants > 0) {
    segments.push(pluralize(infants, 'Infant', 'Infants'));
  }

  if (segments.length === 0) {
    return '1 Adult';
  }

  return segments.join(', ');
};

import { format } from 'date-fns';

export const getTotalPassengers = (
  adults: number,
  children: number,
  infants: number
): string => {
  const total = adults + children + infants;
  return pluralize(total, 'Traveler', 'Travelers');
};

export const formatDate = (date: Date | undefined | null): string => {
  if (!date) return '';
  return format(date, 'EEE, dd MMM');
};

export const getAirportName = (
  code: string,
  airports: { code: string; name: string }[]
): string => {
  return airports.find(a => a.code === code)?.name || code;
};
