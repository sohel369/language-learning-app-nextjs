'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  name: string;
  level: number;
  total_xp: number;
  streak: number;
  learning_language?: string;
  native_language?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    refreshUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await refreshUser();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const refreshUser = async () => {
    try {
      setLoading(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        // Get user profile from database - try profiles first, then users
        let profile = null;
        let error = null;
        
        // First try: profiles table
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email, name, level, total_xp, streak, learning_language, native_language')
          .eq('id', authUser.id)
          .single();

        if (profilesError && profilesError.code !== 'PGRST116') {
          console.log('Profiles table failed, trying users table:', profilesError.message);
          
          // Fallback: users table
          const { data: usersData, error: usersError } = await supabase
            .from('users')
            .select('id, email, name, level, total_xp, streak, learning_language, native_language')
            .eq('id', authUser.id)
            .single();
          
          profile = usersData;
          error = usersError;
        } else {
          profile = profilesData;
          error = profilesError;
        }

        console.log('Profile data:', profile, 'Error:', error);

        if (error) {
          console.error('Error fetching user profile:', error);
          // If profile doesn't exist, create it
          if (error.code === 'PGRST116') {
            console.log('Creating user profile...');
            
            // Try profiles table first, then fallback to users table
            let createError = null;
            
            // First try: profiles table
            const { error: profilesError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: authUser.id,
                  name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || "Guest",
                  email: authUser.email || "",
                  level: 1,
                  total_xp: 0,
                  streak: 0,
                  learning_language: 'ar',
                  native_language: 'en'
                }
              ]);

            if (profilesError) {
              console.log('Profiles table failed, trying users table:', profilesError.message);
              
              // Fallback: users table
              const { error: usersError } = await supabase
                .from('users')
                .insert([
                  {
                    id: authUser.id,
                    name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || "Guest",
                    email: authUser.email || "",
                    level: 1,
                    total_xp: 0,
                    streak: 0,
                    learning_language: 'ar',
                    native_language: 'en'
                  }
                ]);
              
              createError = usersError;
            }
            
            if (createError) {
              console.error('Error creating user profile:', createError);
              console.log('Continuing with auth user data despite profile creation error');
              setUser({
                id: authUser.id,
                email: authUser.email || "",
                name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || "Guest",
                level: 1,
                total_xp: 0,
                streak: 0,
                learning_language: 'ar',
                native_language: 'en'
              });
            } else {
              console.log('User profile created successfully');
              setUser({
                id: authUser.id,
                email: authUser.email || "",
                name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || "Guest",
                level: 1,
                total_xp: 0,
                streak: 0,
                learning_language: 'ar',
                native_language: 'en'
              });
            }
          } else {
            setUser(null);
          }
        } else {
          console.log('User profile found:', profile);
          setUser(profile);
        }
      } else {
        console.log('No auth user found');
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        console.log('Profile:', data);
        if (data) {
          setUser(data);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.log('Logout Error:', error.message);
      } else {
        console.log('Logged out successfully');
      }
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
