import { useState, useRef } from 'react';
import { postsService } from '../../services/posts';
import { useLocation } from '../../hooks/useLocation';

const PostCreator = ({ onPostCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    caption: '',
    image: null,
    location_name: ''
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const { location, loading: locationLoading, getCurrentLocation } = useLocation();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    // Trigger file input with camera
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.image) {
      setError('Please select an image');
      return;
    }

    if (!location) {
      setError('Location is required. Please enable location access.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const postData = {
        image: formData.image,
        caption: formData.caption,
        latitude: location.latitude,
        longitude: location.longitude,
        location_name: formData.location_name
      };

      const result = await postsService.createPost(postData);
      
      if (onPostCreated) {
        onPostCreated(result.post);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-lg mx-auto">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Create New Post</h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Location Status */}
      <div className="mb-4">
        {locationLoading ? (
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Getting your location...</span>
          </div>
        ) : location ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-700 text-sm">
              📍 Location captured: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </p>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-700 text-sm">
              ⚠️ Location required for posts
            </p>
            <button 
              onClick={getCurrentLocation}
              className="btn-primary text-sm mt-2"
            >
              Get Location
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photo
          </label>
          
          {!preview ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="space-y-4">
                <div className="text-gray-400">
                  <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleCameraCapture}
                    className="btn-primary"
                  >
                    📸 Take Photo
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-secondary"
                  >
                    📁 Choose File
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setFormData({ ...formData, image: null });
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Caption */}
        <div>
          <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">
            Caption
          </label>
          <textarea
            id="caption"
            name="caption"
            value={formData.caption}
            onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
            placeholder="What's happening here?"
            className="input-field h-24 resize-none"
          />
        </div>

        {/* Location Name */}
        <div>
          <label htmlFor="location_name" className="block text-sm font-medium text-gray-700 mb-1">
            Location Name (Optional)
          </label>
          <input
            type="text"
            id="location_name"
            name="location_name"
            value={formData.location_name}
            onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
            placeholder="e.g., Golden Gate Park"
            className="input-field"
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading || !formData.image || !location}
            className="btn-primary flex-1"
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostCreator;