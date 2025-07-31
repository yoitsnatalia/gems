import api from './api';

export const friendsService = {
  // Add a friend by username
  addFriend: async (username) => {
    const response = await api.post('/friends/add', { username });
    return response.data;
  },

  // Get user's friends list
  getFriends: async () => {
    const response = await api.get('/friends');
    return response.data;
  },

  // Remove a friend
  removeFriend: async (friendId) => {
    const response = await api.delete(`/friends/${friendId}`);
    return response.data;
  },

  // Get friends' posts within radius
  getFriendsPosts: async (latitude, longitude, radius = 10000) => {
    const response = await api.get(`/friends/posts?latitude=${latitude}&longitude=${longitude}&radius=${radius}`);
    return response.data;
  },

  // Search users by username
  searchUsers: async (query) => {
    const response = await api.get(`/friends/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Unlock a post
  unlockPost: async (postId, latitude, longitude) => {
    const response = await api.post(`/posts/${postId}/unlock`, { latitude, longitude });
    return response.data;
  },

  // Get unlocked posts
  getUnlockedPosts: async () => {
    const response = await api.get('/posts/unlocked');
    return response.data;
  }
};