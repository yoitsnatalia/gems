import { useState, useEffect } from 'react';
import { postsService } from '../../services/posts';

const LocationsList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const result = await postsService.getUserPosts();
      setPosts(result.posts);
    } catch (error) {
      setError('Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center space-x-2 text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
          <span>Loading locations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="home-card">
      <h3 className="text-lg font-semibold text-white mb-4">
        Your Hidden Gems ({posts.length})
      </h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No gems yet. Make a post to hide a gem!
        </p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">{post.location_name}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(post.created_at)}
                  </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationsList;