import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from '../../hooks/useLocation';
import { postsService } from '../../services/posts';
import { friendsService } from '../../services/friends';
import MapView from '../../components/Map/MapView';
import PostCreator from '../../components/Posts/PostCreator';
import PostCard from '../../components/Posts/PostCard';

const HomePage = () => {
  const { user, logout } = useAuth();
  const { location, error, loading, getCurrentLocation } = useLocation();
  const [showPostCreator, setShowPostCreator] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [friendsPosts, setFriendsPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [unlockedPosts, setUnlockedPosts] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const loadUserPosts = async () => {
      try {
        const result = await postsService.getUserPosts();
        setUserPosts(result.posts);
      } catch (error) {
        console.error('Failed to load user posts:', error);
      }
    };
    loadUserPosts();
  }, []);

  useEffect(() => {
    if (location) {
      const loadFriendsPosts = async () => {
        setLoadingPosts(true);
        try {
          const result = await friendsService.getFriendsPosts(
            location.latitude,
            location.longitude,
            5000
          );
          setFriendsPosts(result.posts);
        } catch (error) {
          console.error('Failed to load friends posts:', error);
        } finally {
          setLoadingPosts(false);
        }
      };
      loadFriendsPosts();
    }
  }, [location]);

  useEffect(() => {
    const loadUnlockedPosts = async () => {
      try {
        const result = await friendsService.getUnlockedPosts();
        setUnlockedPosts(result.posts);
      } catch (error) {
        console.error('Failed to load unlocked posts:', error);
      }
    };
    loadUnlockedPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setUserPosts(prev => [newPost, ...prev]);
    setShowPostCreator(false);
  };

  const handlePostClick = async (post) => {
    if (!location) {
      setSelectedPost(post);
      return;
    }

    try {
      const result = await postsService.checkUnlockEligibility(
        post.id,
        location.latitude,
        location.longitude
      );
      
      const isAlreadyUnlocked = unlockedPosts.some(unlock => unlock.post_id === post.id);
      
      setSelectedPost({
        ...post,
        canUnlock: result.canUnlock,
        distance: result.distance,
        isUnlocked: isAlreadyUnlocked
      });
    } catch (error) {
      console.error('Failed to check unlock eligibility:', error);
      setSelectedPost(post);
    }
  };

  const handleUnlockPost = async (postId) => {
    if (!location) return;

    try {
      const result = await friendsService.unlockPost(
        postId,
        location.latitude,
        location.longitude
      );
      
      setUnlockedPosts(prev => [...prev, result.unlock]);
      setSelectedPost(prev => ({ ...prev, isUnlocked: true }));
    } catch (error) {
      console.error('Failed to unlock post:', error);
    }
  };

  const allPosts = [...userPosts, ...friendsPosts];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center lg:h-19 sm:h-16">
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl lg:text-4xl  text-gray-900">ande</h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden btn-secondary text-sm"
              >
                📊
              </button>
              
              <a href="/friends" className="btn-secondary text-sm hidden sm:inline-block">
                👥 Friends
              </a>
              
              <button
                onClick={() => setShowPostCreator(!showPostCreator)}
                className="btn-primary text-sm"
              >
                <span className="hidden sm:inline">📸 Create Post</span>
                <span className="sm:hidden">📸</span>
              </button>
              
              <button onClick={logout} className="btn-secondary text-sm hidden sm:inline-block">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        
        {showPostCreator ? (
          <PostCreator
            onPostCreated={handlePostCreated}
            onCancel={() => setShowPostCreator(false)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Map Section */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    🗺️ Explore Posts
                  </h3>
                  <div className="text-xs sm:text-sm text-gray-500">
                    {loadingPosts ? 'Loading...' : `${allPosts.length} posts`}
                  </div>
                </div>
                
                <div className="h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden">
                  <MapView
                    userLocation={location}
                    posts={allPosts}
                    onPostClick={handlePostClick}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar - Mobile Collapsible */}
            <div className={`
              order-1 lg:order-2 space-y-4 sm:space-y-6
              ${showSidebar ? 'block' : 'hidden lg:block'}
            `}>
              {/* Location Status */}
              <div className="card">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                  📍 Location
                </h3>
                
                {loading && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm">Getting location...</span>
                  </div>
                )}
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-700 font-medium text-sm">Location Error</p>
                    <p className="text-red-600 text-xs mt-1">{error}</p>
                    <button onClick={getCurrentLocation} className="btn-primary text-xs mt-2">
                      Try Again
                    </button>
                  </div>
                )}
                
                {location && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-700 text-sm font-medium">Active</p>
                    <p className="text-green-600 text-xs mt-1">
                      ±{location.accuracy}m accuracy
                    </p>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="card">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                  📊 Stats
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-primary-600">
                      {userPosts.length}
                    </div>
                    <div className="text-xs text-gray-500">Posts</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-secondary-600">
                      {friendsPosts.length}
                    </div>
                    <div className="text-xs text-gray-500">Friends'</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-green-600">
                      {unlockedPosts.length}
                    </div>
                    <div className="text-xs text-gray-500">Unlocked</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                  ⚡ Actions
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setShowPostCreator(true)}
                    className="btn-primary w-full text-sm"
                  >
                    📸 Create Post
                  </button>
                  <a
                    href="/friends"
                    className="btn-secondary w-full text-sm block text-center"
                  >
                    👥 Friends
                  </a>
                  <button onClick={logout} className="btn-secondary w-full text-sm lg:hidden">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Post Modal - Mobile Optimized */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <PostCard
                post={selectedPost}
                canUnlock={selectedPost.canUnlock}
                isUnlocked={selectedPost.isUnlocked}
                onClose={() => setSelectedPost(null)}
                onUnlock={() => handleUnlockPost(selectedPost.id)}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;