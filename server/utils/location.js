// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth's radius in meters
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance; // Distance in meters
};

const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
};
  
// Check if user is within unlock radius of a post
const canUnlockPost = (userLat, userLon, postLat, postLon, radiusMeters = 100) => {
    const distance = calculateDistance(userLat, userLon, postLat, postLon);
    return distance <= radiusMeters;
};
  
// Validate latitude and longitude
const isValidCoordinate = (lat, lon) => {
    return (
      typeof lat === 'number' && 
      typeof lon === 'number' &&
      lat >= -90 && lat <= 90 &&
      lon >= -180 && lon <= 180
    );
};

module.exports = {
    calculateDistance,
    canUnlockPost,
    isValidCoordinate
};
  