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

  // Load user's posts
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

  // Load friends' posts when location changes
  useEffect(() => {
    if (location) {
      const loadFriendsPosts = async () => {
        setLoadingPosts(true);
        try {
          const result = await friendsService.getFriendsPosts(
            location.latitude,
            location.longitude,
            5000 // 5km radius
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

  // Load unlocked posts
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
     
     // Check if already unlocked
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
     
     // Update unlocked posts
     setUnlockedPosts(prev => [...prev, result.unlock]);
     
     // Update selected post
     setSelectedPost(prev => ({
       ...prev,
       isUnlocked: true
     }));
     
   } catch (error) {
     console.error('Failed to unlock post:', error);
   }
 };

 const allPosts = [...userPosts, ...friendsPosts];

 return (
   <div className="min-h-screen bg-gray-50">
     {/* Header */}
     <header className="bg-white shadow-sm border-b">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex justify-between items-center h-16">
           <div className="flex items-center">
             <h1 className="text-xl font-bold text-gray-900">Ande</h1>
             <span className="ml-4 text-gray-600">Welcome, {user?.username}!</span>
           </div>
           <div className="flex items-center space-x-4">
             <a href="/friends" className="btn-secondary">
               👥 Friends
             </a>
             <button
               onClick={() => setShowPostCreator(!showPostCreator)}
               className="btn-primary"
             >
               📸 Create Post
             </button>
             <button onClick={logout} className="btn-secondary">
               Logout
             </button>
           </div>
         </div>
       </div>
     </header>

     {/* Main Content */}
     <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       {showPostCreator ? (
         <PostCreator
           onPostCreated={handlePostCreated}
           onCancel={() => setShowPostCreator(false)}
         />
       ) : (
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
           {/* Map Section */}
           <div className="lg:col-span-3">
             <div className="card">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-semibold text-gray-900">
                   🗺️ Explore Posts
                 </h3>
                 <div className="text-sm text-gray-500">
                   {loadingPosts ? 'Loading posts...' : `${allPosts.length} posts nearby`}
                 </div>
               </div>
               
               <div className="h-96 rounded-lg overflow-hidden">
                 <MapView
                   userLocation={location}
                   posts={allPosts}
                   onPostClick={handlePostClick}
                 />
               </div>
             </div>
           </div>

           {/* Sidebar */}
           <div className="space-y-6">
             {/* Location Status */}
             <div className="card">
               <h3 className="text-lg font-semibold text-gray-900 mb-4">
                 📍 Your Location
               </h3>
               
               {loading && (
                 <div className="flex items-center space-x-2 text-blue-600">
                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                   <span>Getting location...</span>
                 </div>
               )}
               
               {error && (
                 <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                   <p className="text-red-700 font-medium text-sm">Location Error</p>
                   <p className="text-red-600 text-xs mt-1">{error}</p>
                   <button onClick={getCurrentLocation} className="btn-primary text-sm mt-2">
                     Try Again
                   </button>
                 </div>
               )}
               
               {location && (
                 <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                   <p className="text-green-700 text-sm font-medium">Location Active</p>
                   <p className="text-green-600 text-xs mt-1">
                     Accuracy: {location.accuracy}m
                   </p>
                 </div>
               )}
             </div>

             {/* Stats */}
             <div className="card">
               <h3 className="text-lg font-semibold text-gray-900 mb-4">
                 📊 Your Stats
               </h3>
               <div className="space-y-3">
                 <div className="flex justify-between">
                   <span className="text-gray-600">Posts Created:</span>
                   <span className="font-semibold">{userPosts.length}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-gray-600">Friends' Posts:</span>
                   <span className="font-semibold">{friendsPosts.length}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-gray-600">Posts Unlocked:</span>
                   <span className="font-semibold">{unlockedPosts.length}</span>
                 </div>
               </div>
             </div>

             {/* Quick Actions */}
             <div className="card">
               <h3 className="text-lg font-semibold text-gray-900 mb-4">
                 ⚡ Quick Actions
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
                   👥 Manage Friends
                 </a>
                 <button
                   onClick={getCurrentLocation}
                   className="btn-secondary w-full text-sm"
                 >
                   📍 Update Location
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Post Modal */}
       {selectedPost && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
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