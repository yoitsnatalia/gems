import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set your mapbox access token
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const MapView = ({ userLocation, posts = [], onPostClick, onMapClick }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [loading, setLoading] = useState(true);
  const markers = useRef([]);

  useEffect(() => {
    if (map.current || !mapContainer.current) return; // initialize map only once

    // Default to San Francisco if no user location
    const defaultLocation = userLocation || { latitude: 37.7749, longitude: -122.4194 };

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [defaultLocation.longitude, defaultLocation.latitude],
      zoom: 13
    });

    map.current.on('load', () => {
      setLoading(false);
    });

    if (onMapClick) {
        // Add click handler for map
        map.current.on('click', (e) => {
            onMapClick({
            latitude: e.lngLat.lat,
            longitude: e.lngLat.lng
            });
        });
    }

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [onMapClick, userLocation]);

  // Update map center when user location changes
  useEffect(() => {
    if (map.current && userLocation) {
      map.current.setCenter([userLocation.longitude, userLocation.latitude]);
    }
  }, [userLocation]);

  // Add user location marker
  useEffect(() => {
    if (map.current && userLocation) {
      // Remove existing user marker
      const existingUserMarker = document.querySelector('.user-location-marker');
      if (existingUserMarker) {
        existingUserMarker.remove();
      }

      // Create user location marker
      const userMarkerEl = document.createElement('div');
      userMarkerEl.className = 'user-location-marker';
      userMarkerEl.innerHTML = `
        <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
      `;

      new mapboxgl.Marker(userMarkerEl)
        .setLngLat([userLocation.longitude, userLocation.latitude])
        .addTo(map.current);
    }
  }, [userLocation]);

  // Add post markers
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers for posts
    posts.forEach(post => {
      const markerEl = document.createElement('div');
      markerEl.className = 'post-marker cursor-pointer';
      markerEl.innerHTML = `
        <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-sm font-bold hover:scale-110 transition-transform">
          📸
        </div>
      `;

      markerEl.addEventListener('click', () => {
        if (onPostClick) {
          onPostClick(post);
        }
      });

      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([post.longitude, post.latitude])
        .addTo(map.current);

      markers.current.push(marker);
    });
  }, [posts, onPostClick]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      
      {loading && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="flex items-center space-x-2 text-gray-600">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
            <span>Loading map...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;