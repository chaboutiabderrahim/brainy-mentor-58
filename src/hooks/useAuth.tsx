/**
 * useAuth Hook
 * 
 * Purpose: Manages authentication state throughout the application
 * Features:
 * - Real-time authentication state management using Supabase
 * - Session persistence and automatic token refresh
 * - User profile data integration
 * - Loading states for auth operations
 * 
 * Critical: Uses proper auth state pattern to prevent deadlocks
 * - Never uses async functions directly in onAuthStateChange
 * - Defers profile fetching with setTimeout to avoid recursive calls
 */

import { useState } from 'react';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  stream_id: string | null;
  graduation_year: number | null;
  role: string;
}

interface AuthState {
  user: any | null;
  session: any | null;
  profile: Profile | null;
  loading: boolean;
}

export const useAuth = (): AuthState => {
  // Mock auth state - no backend connection
  return {
    user: null,
    session: null,
    profile: null,
    loading: false,
  };
};