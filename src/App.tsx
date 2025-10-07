import FlightSearchForm from './components/FlightSearchForm'
import Header from './components/Header'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gradient-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Find Your Perfect Flight
            </h1>
            <h2 className="text-white/80">
              Search flights across multiple airlines and find the best deals
            </h2>
          </div>
          <FlightSearchForm />
        </div>
      </main>
      <footer className="bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Flight Search. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
