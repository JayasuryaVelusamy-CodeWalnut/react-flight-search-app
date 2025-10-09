# Flight Search App

A modern React flight search application with integration to the Sabre API for airport data.

## Quick Demo

Check out the quick demo video of the application in action: [Watch Demo](https://drive.google.com/file/d/1JaxBCi8wQBi9r_MkBwCJCcHuCCdpTwdX/view?usp=sharing)

## Features

-  **Trip Type Selection**: Toggle between one-way and return flights.
-  **Airport Selection**: Origin and destination dropdowns populated from Sabre API.
-  **Date Selection**: Departure and return date pickers with conditional visibility.
-  **Passenger Count**: Adults, children, and infants selection with +/- controls.
-  **Search Functionality**: Displays search criteria upon submission.
-  **Modern UI**: Clean and intuitive design using Tailwind CSS.
-  **Responsive Design**: Works on desktop, tablet, and mobile devices.
-  **TypeScript Support**: Full type safety throughout the application.
-  **State Management**: Centralized state management with Redux Toolkit.

## API Integration

The app integrates with the Sabre API to fetch airport data:
- **Endpoint**: `GET https://api-cert.ezycommerce.sabre.com/api/v1/Airport/OriginsWithConnections/en-us`
- **Headers**: Includes the required `Tenant-Identifier` header.
- **CORS**: Configured to work with a localhost development server.

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone or download this project.
2. Navigate to the project directory.
3. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at the address shown in the terminal (usually `http://localhost:5173` for Vite).

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Testing

Run the test suite:

```bash
npm run test
```

## Project Structure

```
src/
├── assets/
│   └── react.svg               # React logo
├── components/
│   ├── AirportSelect.tsx       # Airport selection dropdown
│   ├── Button.tsx              # Reusable button component
│   ├── ErrorBoundary.tsx       # Error handling component
│   ├── FlightSearchForm.tsx    # Main search form component
│   ├── Header.tsx              # Application header
│   ├── PassengerSelector.tsx   # Passenger count selector
│   ├── Portal.tsx              # Portal for modals and popovers
│   └── Skeleton.tsx            # Skeleton loader for loading states
├── hooks/
│   ├── useClickOutside.ts      # Hook for detecting clicks outside an element
│   ├── useFetchAirports.ts     # Hook for fetching airport data
│   └── useFlightSearchForm.ts  # Hook for managing flight search form state
├── services/
│   └── airportService.ts       # API service for Sabre integration
├── store/
│   ├── slices/
│   │   └── airportSlice.ts     # Redux slice for airport data
│   ├── hooks.ts                # Typed Redux hooks
│   └── index.ts                # Redux store configuration
├── types/
│   ├── Airport.ts              # TypeScript types for Airport data
│   └── Flight.ts               # TypeScript types for Flight data
├── utils/
│   ├── format.ts               # Formatting utility functions
│   └── memoize.ts              # Memoization utility
├── App.tsx                     # Main app component
├── main.tsx                    # App entry point
├── index.css                   # Global CSS styles
└── App.css                     # App-specific CSS styles
```

## Technical Details

- **Framework**: React 19 with Hooks
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Testing**: Jest, React Testing Library, Jest DOM, User Event
- **UI Implementation**: Custom designed and implemented without Figma or design mockups, focusing on modern UI/UX principles and best practices

## Development Notes

- The app is configured to run on a localhost development server.
- Airport data is fetched on component mount and managed by Redux.
- Form validation ensures all required fields are filled before search.
- The project uses custom typed hooks for Redux to ensure type safety.
- Responsive design adapts to different screen sizes using Tailwind's utility classes.

## Next Steps for Full Implementation

1. **Flight Search API**: Integrate with Sabre's flight search endpoints.
2. **Real-time Pricing**: Display actual flight prices and availability.
3. **Booking Flow**: Add booking functionality.
4. **User Authentication**: Implement user accounts.
5. **Flight Details**: Show detailed flight information, stops, and airlines.
6. **Advanced Filters**: Add filters for price range, airline preference, and departure times.
7. **Search History**: Save and display previous searches.
8. **Enhanced Error Handling**: Implement better error messages and fallback UI states.

## 10-Hour Implementation Plan

Here is a detailed breakdown of the development process, estimated to take 12 hours:

- **Hour 1: Project Setup & Configuration (1 hour)**
  - Initialize React project with Vite and TypeScript.
  - Install and configure Tailwind CSS for styling.
  - Set up project structure (folders for components, services, store, types, etc.).
  - Configure Jest and React Testing Library for unit testing.

- **Hour 2-3: Core UI Components (2 hours)**
  - Implement trip type selection using a standard `<select>` element.
  - Integrate `react-datepicker` for selecting dates.
  - Build `PassengerSelector` component for managing adults, children, and infants.
  - Develop a reusable `Button` component with loading and disabled states.

- **Hour 4-5: API Integration & State Management (3 hours)**
  - Set up Redux Toolkit store and an `airportSlice`.
  - Create an API service using Axios to fetch airport data from the Sabre API.
  - Implement the `AirportSelect` component with searchable dropdowns.
  - Dispatch async thunks to fetch and populate airport data into the Redux store.
  - Handle loading and error states for the API call within the slice.

- **Hour 6-7: Main View & Form Logic (3 hours)**
  - Assemble the main `FlightSearchForm.tsx` view by combining all the smaller components.
  - Implement the main form logic using custom hooks (`useFlightSearchForm`).
  - Add form validation to ensure all required fields are filled.
  - Manage the state for trip type, dates, passengers, and selected airports.

- **Hour 8: Styling & Responsiveness (1 hour)**
  - Apply Tailwind CSS utility classes to style all components.
  - Ensure the layout is fully responsive and works well on mobile, tablet, and desktop screens.
  - Add subtle animations and transitions for a better user experience.
  - Create a cohesive visual language through consistent spacing, colors, and typography.

- **Hour 9: Search Results & Finalizing State (1 hour)**
  - Implement a search results display section.
  - Simulate a search action and display a summary of the selected criteria.
  - Refine state management for search status (e.g., `searching`, `succeeded`, `failed`).

- **Hour 10: Final Touches & Documentation (1 hour)**
  - Write unit tests for key components and Redux logic.
  - Perform final testing and bug fixes.
  - Write and finalize the `README.md` documentation.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is created for demonstration purposes.
