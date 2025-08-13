import { useState, useEffect } from 'react';
import { friendsService } from '../../services/friends';

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      const result = await friendsService.getFriends();
      setFriends(result.friends);
    } catch (error) {
      setError('Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFriend = async (friendId, username) => {
    if (window.confirm(`Remove ${username} from your friends?`)) {
      try {
        await friendsService.removeFriend(friendId);
        setFriends(prev => prev.filter(friend => friend.id !== friendId));
      } catch (error) {
        setError('Failed to remove friend');
      }
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center space-x-2 text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
          <span>Loading friends...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Your Friends ({friends.length})
      </h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {friends.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No friends yet. Search for users to add them!
        </p>
      ) : (
        <div className="space-y-3">
          {friends.map((friend) => (
            <div key={friend.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {friend.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{friend.username}</p>
                  <p className="text-xs text-gray-500">
                    Friends since {new Date(friend.friendship_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => handleRemoveFriend(friend.id, friend.username)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsList;