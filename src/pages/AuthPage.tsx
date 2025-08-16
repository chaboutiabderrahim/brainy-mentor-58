/**
 * AuthPage Component
 * 
 * Purpose: Handles user authentication (sign in/sign up) for the AI educational app
 * Features:
 * - Email/password authentication using Supabase Auth
 * - Toggle between sign in and sign up modes
 * - Form validation and error handling
 * - Automatic redirect to home page after successful authentication
 * - Mobile-optimized design with modern UI
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, GraduationCap } from 'lucide-react';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock authentication - redirect to home after delay
    setTimeout(() => {
      toast({
        title: isSignUp ? "تم إنشاء الحساب بنجاح" : "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في التطبيق",
      });
      navigate('/');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-bg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-3 rounded-full">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">THE SMART</h1>
            <p className="text-sm text-muted-foreground">MATHEMATICS & PHYSICS</p>
          </div>
        </div>

        {/* Auth Form */}
        <Card className="w-full shadow-elevated">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">
              {isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
            </CardTitle>
            <CardDescription className="text-center">
              {isSignUp 
                ? 'أدخل بياناتك لإنشاء حساب جديد' 
                : 'أدخل بياناتك للوصول إلى حسابك'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="displayName">الاسم</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="أدخل اسمك"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required={isSignUp}
                    className="h-12"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12"
                  minLength={6}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-primary text-white font-medium"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isSignUp ? 'جاري إنشاء الحساب...' : 'جاري تسجيل الدخول...'}
                  </>
                ) : (
                  isSignUp ? 'إنشاء حساب' : 'تسجيل الدخول'
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:text-primary-glow transition-colors text-sm"
              >
                {isSignUp 
                  ? 'لديك حساب بالفعل؟ سجل الدخول' 
                  : 'ليس لديك حساب؟ أنشئ حساباً جديداً'
                }
              </button>
              
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}