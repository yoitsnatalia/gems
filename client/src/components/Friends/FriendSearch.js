import { useState } from 'react';
import { friendsService } from '../../services/friends';

const FriendSearch = ({ onFriendAdded }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (searchQuery.length < 2) {
      setError('Search query must be at least 2 characters');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await friendsService.searchUsers(searchQuery);
      setSearchResults(result.users);
    } catch (error) {
      setError('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (username) => {
    try {
      await friendsService.addFriend(username);
      
      // Update search results to reflect new friendship
      setSearchResults(prev => 
        prev.map(user => 
          user.username === username 
            ? { ...user, isFriend: true }
            : user
        )
      );
      
      if (onFriendAdded) {
        onFriendAdded(username);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add friend');
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🔍 Find Friends
      </h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by username..."
          className="input-field flex-1"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={loading || searchQuery.length < 2}
          className="btn-primary"
        >
          {loading ? '...' : '🔍'}
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-2">
          {searchResults.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              
              {user.isFriend ? (
                <span className="text-green-600 text-sm font-medium">✓ Friends</span>
              ) : (
                <button
                  onClick={() => handleAddFriend(user.username)}
                  className="btn-primary text-sm"
                >
                  Add Friend
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {searchQuery.length >= 2 && searchResults.length === 0 && !loading && (
        <p className="text-gray-500 text-center py-4">
          No users found matching "{searchQuery}"
        </p>
      )}
    </div>
  );
};

export default FriendSearch;