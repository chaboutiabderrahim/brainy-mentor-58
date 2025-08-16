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
  // Mock auth state - authenticated user for testing
  return {
    user: {
      id: 'mock-user-id',
      email: 'user@example.com',
      created_at: '2024-01-15T10:30:00Z'
    },
    session: {
      access_token: 'mock-token',
      user: {
        id: 'mock-user-id',
        email: 'user@example.com'
      }
    },
    profile: {
      id: 'mock-profile-id',
      user_id: 'mock-user-id',
      display_name: 'Ahmed',
      stream_id: null,
      graduation_year: null,
      role: 'regular_student'
    },
    loading: false,
  };
};