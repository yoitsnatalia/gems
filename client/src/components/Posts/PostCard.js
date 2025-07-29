import { useState } from 'react';

const PostCard = ({ post, onClose, canUnlock = false, isUnlocked = false }) => {
  const [imageLoading, setImageLoading] = useState(true);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isUnlocked && !canUnlock) {
    // Mystery post - show minimal info
    return (
      <div className="card max-w-md mx-auto">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Mystery Post
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            By {post.username}
          </p>
          <p className="text-gray-400 text-sm">
            Get closer to unlock this post!
          </p>
          {onClose && (
            <button onClick={onClose} className="btn-secondary mt-4">
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
            {(post.username && post.username.charAt(0).toUpperCase()) || '?'}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{post.username}</h4>
            <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
          </div>
        </div>
        
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        )}
      </div>

      {/* Image */}
      <div className="relative mb-4">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        )}
        <img
          src={post.image_url}
          alt="Post"
          className="w-full h-64 object-cover rounded-lg"
          onLoad={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
        />
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="mb-4">
          <p className="text-gray-800">{post.caption}</p>
        </div>
      )}

      {/* Location */}
      <div className="text-sm text-gray-500 mb-4">
        📍 {post.location_name || `${post.latitude.toFixed(4)}, ${post.longitude.toFixed(4)}`}
      </div>

      {/* Unlock Status */}
      {canUnlock && !isUnlocked && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-700 text-sm font-medium">
            🔓 You can unlock this post!
          </p>
        </div>
      )}

      {isUnlocked && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-blue-700 text-sm font-medium">
            ✨ Post unlocked! You discovered this location.
          </p>
        </div>
      )}
    </div>
  );
};

export default PostCard;