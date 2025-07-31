import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import FriendSearch from '../../components/Friends/FriendsSearch';
import FriendsList from '../../components/Friends/FriendsList';

const FriendsPage = () => {
  const { user, logout } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFriendAdded = () => {
    // Trigger a refresh of the friends list
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Ande</h1>
              <span className="ml-4 text-gray-600">Friends</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="btn-secondary">
                🗺️ Back to Map
              </a>
              <button onClick={logout} className="btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Friend Search */}
          <div>
            <FriendSearch onFriendAdded={handleFriendAdded} />
          </div>

          {/* Friends List */}
          <div>
            <FriendsList key={refreshKey} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FriendsPage;