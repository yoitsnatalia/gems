import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import crystal from '../../assets/crystal3.png'; 

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const MapView = ({ userLocation, posts = [], onPostClick, onMapClick }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [loading, setLoading] = useState(true);
  const markers = useRef([]);

  useEffect(() => {

    const defaultLocation = userLocation || { latitude: 37.7749, longitude: -122.4194 };

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [defaultLocation.longitude, defaultLocation.latitude],
      zoom: window.innerWidth < 768 ? 12 : 13, // Zoom out on mobile
      maxZoom: 18,
      
    });

    map.current.on('load', () => {
      setLoading(false);
    });

    // Add click handler for map
    map.current.on('click', (e) => {
      if (onMapClick) {
        onMapClick({
          latitude: e.lngLat.lat,
          longitude: e.lngLat.lng
        });
      }
    });

    // Add navigation controls - positioned for mobile
    const nav = new mapboxgl.NavigationControl({
      showCompass: window.innerWidth >= 768, // Hide compass on mobile
      showZoom: true
    });
    map.current.addControl(nav, window.innerWidth < 768 ? 'bottom-right' : 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [onMapClick, userLocation]);

  // Update map center when user location changes
  useEffect(() => {
    if (map.current && userLocation) {
      map.current.easeTo({
        center: [userLocation.longitude, userLocation.latitude],
        duration: 1000
      });
    }
  }, [userLocation]);

  // Add user location marker with better mobile styling
  useEffect(() => {
    if (map.current && userLocation) {
      const existingUserMarker = document.querySelector('.user-location-marker');
      if (existingUserMarker) {
        existingUserMarker.remove();
      }

      const userMarkerEl = document.createElement('div');
      userMarkerEl.className = 'user-location-marker';
      userMarkerEl.innerHTML = `
        <div class="w-5 h-5 md:w-4 md:h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
      `;

      new mapboxgl.Marker(userMarkerEl)
        .setLngLat([userLocation.longitude, userLocation.latitude])
        .addTo(map.current);
    }
  }, [userLocation]);

  // Add post markers with mobile-optimized sizing
  useEffect(() => {
    if (!map.current) return;

    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    posts.forEach(post => {
      const markerEl = document.createElement('div');
      markerEl.className = 'post-marker cursor-pointer';
      const size = window.innerWidth < 768 ? 'w-10 h-10' : 'w-11 h-11';
      markerEl.innerHTML = `<img src=${crystal} alt="gem" class="${size} hover:scale-150 transition-transform" />`;

      markerEl.addEventListener('click', (e) => {
        e.stopPropagation();
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
    <div className="relative w-full h-[700px]">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      
      {loading && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="flex items-center space-x-2 text-gray-600">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
            <span className="hidden sm:inline">Loading map...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;