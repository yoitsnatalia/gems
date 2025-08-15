import { useEffect } from 'react';
import { useAuth } from './useAuth';

export const useDemoLocation = (setLocation) => {
  const { user } = useAuth();

  useEffect(() => {
    // If demo user, auto-set San Francisco location
    if (user?.email === 'demo@gems.app') {
      setLocation({
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 10
      });
    }
  }, [user, setLocation]);
};