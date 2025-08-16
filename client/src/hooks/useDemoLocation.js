import { useEffect } from 'react';
import { useAuth } from './useAuth';

export const useDemoLocation = (setLocation) => {
  const { user } = useAuth();

  useEffect(() => {
    // If demo user, auto-set San Francisco location
    if (user?.email === 'disney@demo.gems.app') {
        setLocation({
            latitude: 33.8121,
            longitude: -117.9190,
            accuracy: 10
        });
    } else if (user?.email === 'rome@demo.gems.app') {
        setLocation({
            latitude: 41.8967,
            longitude: 12.4822,
            accuracy: 10
        });
    } else if (user?.email === 'gym@demo.gems.app') {
        setLocation({
            latitude: 33.6979,
            longitude: -117.7405,
            accuracy: 10
        });
    }
  }, [user, setLocation]);
};