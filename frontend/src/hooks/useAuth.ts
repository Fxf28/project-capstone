import { useState, useEffect } from 'react';
import { onAuthStateChange } from '../services/firebase';
import { authAPI } from '../services/api';
import type { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔥 useAuth: Setting up auth state listener');

    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      console.log('🔥 useAuth: Firebase auth state changed:', {
        hasUser: !!firebaseUser,
        email: firebaseUser?.email,
        uid: firebaseUser?.uid
      });

      if (firebaseUser) {
        try {
          console.log('🔗 useAuth: Fetching user profile from backend...');

          // Get user profile from backend
          const userProfile = await authAPI.getUserProfile();
          console.log('✅ useAuth: Got user profile:', {
            email: userProfile.email,
            displayName: userProfile.displayName,
            photoURL: userProfile.photoURL,
            isAdmin: userProfile.isAdmin
          });

          setUser(userProfile);
        } catch (error: any) {
          console.error('❌ useAuth: Error fetching user profile:', error);

          // Fallback to Firebase user data
          const fallbackUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            isAdmin: false
          };

          console.log('⚠️ useAuth: Using fallback user data:', fallbackUser);
          setUser(fallbackUser);
        }
      } else {
        console.log('👤 useAuth: No Firebase user, setting user to null');
        setUser(null);
      }

      setLoading(false);
      console.log('✅ useAuth: Auth state updated, loading = false');
    });

    return () => {
      console.log('🔥 useAuth: Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  return { user, loading };
};