import FlightSearchForm from './components/FlightSearchForm'
import Header from './components/Header'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gradient-primary">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-2 text-center">
            <h1 className="text-3xl font-bold text-white">
              Find Your Perfect Flight
            </h1>
            <h2 className="text-white/80">
              Search flights across multiple airlines and find the best deals
            </h2>
          </div>
          <FlightSearchForm />
        </div>
      </main>
      <footer className="bg-white py-4 text-center text-sm text-gray-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Flight Search. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
