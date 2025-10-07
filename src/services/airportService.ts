import axios from 'axios';
import type { Airport, AirportConnection } from '../types/Airport';
import { memoize } from '../utils/memoize';

interface RawAirportConnection {
  name: string;
  code: string;
  currency: string;
  countryCode: string;
  restrictedOnDeparture: unknown;
  restrictedOnDestination: unknown;
}

interface RawAirport {
  code: string;
  name: string;
  currency: string;
  countryCode: string;
  restrictedOnDeparture: unknown;
  restrictedOnDestination: unknown;
  connections?: RawAirportConnection[];
}

const API_BASE_URL = '/api';
const TENANT_IDENTIFIER = '9d7d6eeb25cd6083e0df323a0fff258e59398a702fac09131275b6b1911e202d';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Tenant-Identifier': TENANT_IDENTIFIER,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  },
  withCredentials: false
});

export async function fetchOriginsWithConnections(): Promise<Airport[]> {
  const response = await apiClient.get('/Airport/OriginsWithConnections/en-us');
  
  const airportsData = response.data?.airports ?? response.data ?? [];
  console.log('API Response:', { total: airportsData.length });

  return (airportsData as RawAirport[]).map((item: RawAirport): Airport => ({
    code: item.code,
    name: item.name,
    currency: item.currency,
    countryCode: item.countryCode,
    restrictedOnDeparture: Boolean(item.restrictedOnDeparture),
    restrictedOnDestination: Boolean(item.restrictedOnDestination),
    connections: (item.connections || []).map((c: RawAirportConnection): AirportConnection => ({
      name: c.name,
      code: c.code,
      currency: c.currency,
      countryCode: c.countryCode,
      restrictedOnDeparture: Boolean(c.restrictedOnDeparture),
      restrictedOnDestination: Boolean(c.restrictedOnDestination)
    }))
  }));
}


export const filterDestinations = memoize((origin: string, airports: Airport[]): Airport[] => {
  const originAirport = airports.find(airport => airport.code === origin);
  if (!originAirport) return [];
  
  const allowedCodes = originAirport.connections.map(conn => conn.code);
  return airports.filter(airport => allowedCodes.includes(airport.code));
});
