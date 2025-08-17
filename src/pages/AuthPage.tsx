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
import { supabase } from '@/integrations/supabase/client';

export default function AuthPage() {
  const [email, setEmail] = useState('demo@thesmart.ma');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Demo user login function
  const handleDemoLogin = async () => {

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'demo@thesmart.ma',
        password: 'demo123',
      });

      if (error) {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في التطبيق",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
              تسجيل الدخول التجريبي
            </CardTitle>
            <CardDescription className="text-center">
              اضغط الزر للدخول بحساب تجريبي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني (تجريبي)</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور (تجريبية)</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  disabled
                  className="h-12"
                />
              </div>
              
              <Button 
                onClick={handleDemoLogin}
                className="w-full h-12 bg-gradient-primary text-white font-medium"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  'دخول تجريبي'
                )}
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-center text-muted-foreground">
                هذا حساب تجريبي لاستكشاف التطبيق. جميع البيانات هي بيانات تجريبية.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}