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

import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Student {
  id: string;
  user_id: string;
  name: string;
  stream: string;
  year_of_study: number;
  whatsapp: string | null;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  student: Student | null;
  loading: boolean;
}

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer student profile fetching to avoid recursive calls
        if (session?.user) {
          setTimeout(() => {
            fetchStudentProfile(session.user.id);
          }, 0);
        } else {
          setStudent(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          fetchStudentProfile(session.user.id);
        }, 0);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchStudentProfile = async (userId: string) => {
    try {
      const { data: studentData, error } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching student profile:', error);
        return;
      }

      setStudent(studentData || null);
    } catch (error) {
      console.error('Error fetching student profile:', error);
    }
  };

  return {
    user,
    session,
    student,
    loading,
  };
};