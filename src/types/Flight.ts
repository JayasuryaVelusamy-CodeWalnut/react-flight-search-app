export interface Passenger {
  adults: number;
  children: number;
  infants: number;
}

export interface FlightSearchCriteria {
  tripType: 'oneWay' | 'return';
  origin: string;
  destination: string;
  departDate: Date;
  returnDate?: Date;
  passengers: Passenger;
}