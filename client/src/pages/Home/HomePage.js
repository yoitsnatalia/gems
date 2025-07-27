import { useAuth } from '../../hooks/useAuth';
import { useLocation } from '../../hooks/useLocation';

const HomePage = () => {
  const { user, logout } = useAuth();
  const { location, error, loading, getCurrentLocation } = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Ande
              </h1>
              <span className="ml-4 text-gray-600">
                Welcome, {user?.username}!
              </span>
            </div>
            <button 
              onClick={logout} 
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Location Section */}
          <div className="lg:col-span-2">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📍 Your Location
              </h3>
              
              {loading && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Getting your location...</span>
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 font-medium">Location Error</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                  <button 
                    onClick={getCurrentLocation} 
                    className="mt-3 btn-primary text-sm"
                  >
                    Try Again
                  </button>
                </div>
              )}
              
              {location && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-green-800">Latitude:</span>
                      <p className="text-green-700">{location.latitude.toFixed(6)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-green-800">Longitude:</span>
                      <p className="text-green-700">{location.longitude.toFixed(6)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-green-800">Accuracy:</span>
                      <p className="text-green-700">{location.accuracy}m</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Coming Soon Section */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🚀 Coming Soon
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <span className="text-2xl">📸</span>
                <span className="text-gray-700">Create location-based posts</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-2xl">🗺️</span>
                <span className="text-gray-700">Interactive map view</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-2xl">👥</span>
                <span className="text-gray-700">Add friends and discover posts</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-2xl">🔓</span>
                <span className="text-gray-700">Unlock posts by visiting locations</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="btn-primary disabled:opacity-50" disabled>
                📸 Create Post
              </button>
              <button className="btn-secondary disabled:opacity-50" disabled>
                🗺️ View Map
              </button>
              <button className="btn-secondary disabled:opacity-50" disabled>
                👥 Find Friends
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              These features will be available starting tomorrow!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;