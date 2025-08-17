import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from '../../hooks/useLocation';
import { useDemoLocation } from '../../hooks/useDemoLocation';
import { postsService } from '../../services/posts';
import { friendsService } from '../../services/friends';
import MapView from '../../components/Map/MapView';
import PostCreator from '../../components/Posts/PostCreator';
import PostCard from '../../components/Posts/PostCard';
import Profile from '../../components/Profile/Profile';
import logo from '../../assets/crystal_white.png';
import bg from '../../assets/pics.png'; 
import FriendSearch from '../../components/Friends/FriendsSearch';
import FriendsList from '../../components/Friends/FriendsList';
import LocationsList from '../../components/Posts/LocationsList';


const HomePage = () => {
  const { user, logout } = useAuth();
  const { location, error, loading, getCurrentLocation } = useLocation();
  const [userLocation, setUserLocation] = useState(location);
  const [page, setPage] = useState("map");
  const [selectedPost, setSelectedPost] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [friendsPosts, setFriendsPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [unlockedPosts, setUnlockedPosts] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Auto-set demo location
  useDemoLocation(setUserLocation);

  // Use userLocation instead of location for API calls
  const effectiveLocation = userLocation || location;
  

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
    if (effectiveLocation) {
      const loadFriendsPosts = async () => {
        setLoadingPosts(true);
        try {
          const result = await friendsService.getFriendsPosts(
            effectiveLocation.latitude,
            effectiveLocation.longitude,
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
  }, [effectiveLocation]);

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
    setPage("map");
  };

  const handlePostClick = async (post) => {
    if (!effectiveLocation) {
      setSelectedPost(post);
      return;
    }

    try {
      const result = await postsService.checkUnlockEligibility(
        post.id,
        effectiveLocation.latitude,
        effectiveLocation.longitude
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
    if (!effectiveLocation) return;

    try {
      const result = await friendsService.unlockPost(
        postId,
        effectiveLocation.latitude,
        effectiveLocation.longitude
      );
      
      setUnlockedPosts(prev => [...prev, result.unlock]);
      setSelectedPost(prev => ({ ...prev, isUnlocked: true }));
    } catch (error) {
      console.error('Failed to unlock post:', error);
    }
  };

  const allPosts = [...userPosts, ...friendsPosts];

  const handleFriendAdded = () => {
    // Trigger a refresh of the friends list
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen font-gentium bg-center bg-cover"  style={{ backgroundImage: `url(${bg})` }}>
      <header className="top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Row */}
          <div className="flex h-14 sm:h-16 lg:h-20 items-center justify-between">
            {/* Left: Logo + Title (mobile-first sizing) */}
            <div className="flex items-center gap-2 min-w-0">
              <img src={logo} alt="Logo" className="h-8 w-auto sm:h-9" />
              <button
                onClick={() => setPage("map")}
                className="truncate text-2xl sm:text-3xl lg:text-4xl leading-none text-white"
                aria-label="Go to Map"
              >
                Gems
              </button>
            </div>

            {/* Center: Primary nav (hidden on mobile, shown ≥ sm) */}
            <nav className="hidden sm:flex items-center gap-4">
              <button onClick={() => setPage("friends")} className="btn-page">
                <span className={page === "friends" ? "underline underline-offset-4" : "no-underline"}>
                  Friends
                </span>
              </button>
              <button onClick={() => setPage("map")} className="btn-page">
                <span className={page === "map" ? "underline underline-offset-4" : "no-underline"}>
                  Map
                </span>
              </button>
              <button onClick={() => setPage("post")} className="btn-page">
                <span className={page === "post" ? "underline underline-offset-4" : "no-underline"}>
                  Post
                </span>
              </button>
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Mobile quick actions (icons) */}
              <button
                onClick={() => { setPage("map"); setShowSidebar(false); }}
                className="sm:hidden btn-primary"
                aria-label="Explore Map"
                title="Map"
              >
                Map
              </button>
              <button
                onClick={() => setPage("post")}
                className="sm:hidden btn-primary"
                aria-label="Create Post"
                title="Post"
              >
                Post
              </button>
              <button
                onClick={() => setPage("profile")}
                className="btn-page hidden sm:inline-flex"
              >
                <span className={page === "profile" ? "underline underline-offset-4" : "no-underline"}>
                  Profile
                </span>
              </button>
              <button onClick={logout} className="btn-page hidden sm:inline-flex">
                Logout
              </button>

              {/* Mobile menu toggle (only on < lg) */}
              <button
                onClick={() => { setPage("map"); setShowSidebar(true); }}
                className="lg:hidden btn-secondary text-sm"
                aria-label="Open Menu"
              >
                Menu
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        
        { page === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 justify-center items-stretch">
            
              <div>
                <Profile user={user} userPosts={userPosts} unlockedPosts={unlockedPosts} />
              </div>
              <div>
                <FriendsList key={refreshKey} />
              </div>
            
            <div>
              <LocationsList key={refreshKey} />
            </div>
          </div>
        )}

        { page === "friends" && (
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
        )}
        
        { page === "post" && (
          <PostCreator
            onPostCreated={handlePostCreated}
            onCancel={() => setPage("map")}
          />
        )} 
        
        { page === "map" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Map Section */}
            <div className={`lg:col-span-3 order-2 lg:order-1 ${showSidebar ? 'hidden lg:block' : 'block'}`}>
              <div className="home-card">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Explore Posts
                  </h3>
                  <div className="text-xs sm:text-sm text-gray-500">
                    {loadingPosts ? 'Loading...' : `${allPosts.length} posts`}
                  </div>
                </div>
                
                <div className="h-[31rem] sm:h-80 lg:h-[38rem] rounded-lg border-2 border-gray-700 overflow-hidden">
                  <MapView
                    user={user}
                    userLocation={effectiveLocation}
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
              

              {/* Stats */}
              <div className="home-card">
                <h3 className="text-base sm:text-lg font-semibold mb-4">
                  Stats
                </h3>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg sm:text-2xl font-bold text-pink-300">
                      {userPosts.length + unlockedPosts.length}
                    </div>
                    <div className="text-sm text-pink-300 font-semibold">Gem Score</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-white">
                      {userPosts.length}
                    </div>
                    <div className="text-xs text-white">Posts by me</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-white">
                      {unlockedPosts.length}
                    </div>
                    <div className="text-xs text-white">Posts I've unlocked</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="home-card">
                <h3 className="text-base sm:text-lg font-semibold mb-4">
                  Actions
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setPage("profile")}
                    className="btn-primary w-full text-sm block text-center lg:hidden"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => setPage("post")}
                    className="btn-primary w-full text-sm"
                  >
                    Post
                  </button>
                  <button
                    onClick={() => setPage("friends")}
                    className="btn-primary w-full text-sm block text-center"
                  >
                    Friends
                  </button>
                  <button onClick={logout} className="btn-secondary w-full text-sm lg:hidden">
                    Logout
                  </button>
                </div>
              </div>

              <div className="home-card">
                <h3 className="text-base sm:text-lg font-semibold mb-4">
                  Location
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
                
                {effectiveLocation && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-700 text-sm font-medium">Active</p>
                    <p className="text-green-600 text-xs mt-1">
                      ±{effectiveLocation.accuracy}m accuracy
                    </p>
                  </div>
                )}
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