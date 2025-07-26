import api from './api';

export const postsService = {
    // Create a new post
    createPost: async (postData) => {
      const formData = new FormData();
      formData.append('image', postData.image);
      formData.append('caption', postData.caption);
      formData.append('latitude', postData.latitude);
      formData.append('longitude', postData.longitude);
      if (postData.location_name) {
        formData.append('location_name', postData.location_name);
      }

      const response = await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },

    // Get user's posts
    getUserPosts: async () => {
        const response = await api.get('/posts/my-posts');
        return response.data;
    },

    // Get nearby posts
    getNearbyPosts: async (latitude, longitude, radius = 10000) => {
        const response = await api.get(`/posts/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`);
        return response.data;
    },

    // Check if post can be unlocked
    checkUnlockEligibility: async (postId, latitude, longitude) => {
        const response = await api.get(`/posts/${postId}/unlock-check?latitude=${latitude}&longitude=${longitude}`);
        return response.data;
    },

    // Get post by ID
    getPostById: async (postId) => {
        const response = await api.get(`/posts/${postId}`);
        return response.data;
    }
};