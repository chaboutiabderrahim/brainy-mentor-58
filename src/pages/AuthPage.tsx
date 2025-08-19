/**
 * AuthPage Component - Optimized Registration System
 * 
 * Features:
 * - Bulletproof authentication with comprehensive validation
 * - Google authentication support
 * - Student/Alumni role selection with subscription plans
 * - Mobile-optimized design with semantic tokens
 * - Clear error messages and loading states
 * - Guaranteed reliable registration flow
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/auth/AuthForm';

export default function AuthPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users
  useEffect(() => {
    if (!loading && user) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is already authenticated
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-bg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-3 rounded-full shadow-glow">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">THE SMART</h1>
            <p className="text-sm text-muted-foreground">MATHEMATICS & PHYSICS</p>
          </div>
        </div>

        {/* Optimized Auth Form */}
        <AuthForm />
      </div>
    </div>
  );
}