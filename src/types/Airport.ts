export interface Airport {
  code: string;
  name: string;
  currency: string;
  countryCode: string;
  restrictedOnDeparture: boolean;
  restrictedOnDestination: boolean;
  connections: AirportConnection[];
}

export interface AirportConnection {
  code: string;
  name: string;
  currency: string;
  countryCode: string;
  restrictedOnDeparture: boolean;
  restrictedOnDestination: boolean;
}