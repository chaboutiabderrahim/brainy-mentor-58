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

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, GraduationCap, CheckCircle, Star, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [stream, setStream] = useState<'science' | 'literature'>('science');
  const [yearOfStudy, setYearOfStudy] = useState('3');
  const [selectedPlan, setSelectedPlan] = useState('FREE');
  const [userType, setUserType] = useState<'student' | 'alumni'>('student');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [plans, setPlans] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_dzd', { ascending: true });
      
      if (data) {
        setPlans(data);
      }
    };
    
    fetchPlans();
  }, []);

  // Sign in function
  const handleSignIn = async () => {
    if (!email || !password) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
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
        description: "مرحباً بك مرة أخرى",
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

  // Sign up function
  const handleSignUp = async () => {
    if (!email || !password || !name || (!whatsapp && userType === 'student')) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمات المرور غير متطابقة",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "خطأ",
        description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        }
      });

      if (authError) {
        toast({
          title: "خطأ في إنشاء الحساب",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }

      if (authData.user) {
        // Create student or alumni profile
        if (userType === 'student') {
          const { error: studentError } = await supabase
            .from('students')
            .insert({
              user_id: authData.user.id,
              name,
              stream,
              year_of_study: parseInt(yearOfStudy),
              whatsapp,
            });

          if (studentError) {
            console.error('Error creating student profile:', studentError);
          }
        }

        // Create subscription
        const selectedPlanData = plans.find(p => p.plan_code === selectedPlan);
        const { error: subscriptionError } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: authData.user.id,
            plan_code: selectedPlan,
            quiz_limit_per_month: selectedPlanData?.features?.quiz_limit || 0,
            teacher_sessions_limit: selectedPlanData?.features?.teacher_sessions_limit || 0,
            allowed_subjects: [],
          });

        if (subscriptionError) {
          console.error('Error creating subscription:', subscriptionError);
        }

        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "مرحباً بك في التطبيق",
        });
        navigate('/');
      }
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

  // Demo login function
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

  const formatPrice = (price: number) => {
    return `${(price / 100).toLocaleString()} دج`;
  };

  const getPlanIcon = (planCode: string) => {
    switch (planCode) {
      case 'FREE': return <CheckCircle className="w-5 h-5" />;
      case 'BASIC_900': return <Star className="w-5 h-5" />;
      case 'STANDARD_2700': return <Zap className="w-5 h-5" />;
      case 'PREMIUM_5300': return <GraduationCap className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
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
          <CardHeader>
            <Tabs value={mode} onValueChange={(value) => setMode(value as 'signin' | 'signup')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signup">إنشاء حساب جديد</TabsTrigger>
                <TabsTrigger value="signin">تسجيل الدخول</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signup" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <CardTitle className="text-xl text-center">إنشاء حساب جديد</CardTitle>
                  <CardDescription className="text-center">
                    اختر نوع حسابك والخطة المناسبة لك
                  </CardDescription>
                </div>

                {/* User Type Selection */}
                <div className="space-y-2">
                  <Label>نوع الحساب</Label>
                  <Select value={userType} onValueChange={(value) => setUserType(value as 'student' | 'alumni')}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">طالب حالي</SelectItem>
                      <SelectItem value="alumni">خريج</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">كلمة المرور *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12"
                      placeholder="6 أحرف على الأقل"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">تأكيد كلمة المرور *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12"
                      placeholder="أعد إدخال كلمة المرور"
                    />
                  </div>
                </div>

                {/* Student-specific fields */}
                {userType === 'student' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp">رقم الواتساب *</Label>
                        <Input
                          id="whatsapp"
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          className="h-12"
                          placeholder="+213 XXX XXX XXX"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>التخصص</Label>
                        <Select value={stream} onValueChange={(value) => setStream(value as 'science' | 'literature')}>
                          <SelectTrigger className="h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="science">علوم تجريبية</SelectItem>
                            <SelectItem value="literature">آداب وفلسفة</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>السنة الدراسية</Label>
                        <Select value={yearOfStudy} onValueChange={setYearOfStudy}>
                          <SelectTrigger className="h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">السنة الأولى</SelectItem>
                            <SelectItem value="2">السنة الثانية</SelectItem>
                            <SelectItem value="3">السنة الثالثة</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}

                {/* Subscription Plans */}
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">اختر خطتك</h3>
                    <p className="text-sm text-muted-foreground">يمكنك تغيير الخطة لاحقاً</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {plans.map((plan) => (
                      <div
                        key={plan.plan_code}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedPlan === plan.plan_code
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedPlan(plan.plan_code)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getPlanIcon(plan.plan_code)}
                            <span className="font-medium text-sm">{plan.name}</span>
                          </div>
                          {selectedPlan === plan.plan_code && (
                            <CheckCircle className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        
                        <div className="mb-2">
                          <span className="text-lg font-bold">
                            {plan.price_dzd === 0 ? 'مجاني' : formatPrice(plan.price_dzd)}
                          </span>
                          {plan.price_dzd > 0 && (
                            <span className="text-xs text-muted-foreground">/شهر</span>
                          )}
                        </div>
                        
                        <p className="text-xs text-muted-foreground">
                          {plan.features.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleSignUp}
                  className="w-full h-12 bg-gradient-primary text-white font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      جاري إنشاء الحساب...
                    </>
                  ) : (
                    'إنشاء الحساب'
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="signin" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <CardTitle className="text-xl text-center">تسجيل الدخول</CardTitle>
                  <CardDescription className="text-center">
                    أدخل بياناتك للوصول إلى حسابك
                  </CardDescription>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">البريد الإلكتروني</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12"
                      placeholder="example@email.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">كلمة المرور</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12"
                      placeholder="أدخل كلمة المرور"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSignIn}
                    className="w-full h-12 bg-gradient-primary text-white font-medium"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        جاري تسجيل الدخول...
                      </>
                    ) : (
                      'تسجيل الدخول'
                    )}
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">أو</span>
                  </div>
                </div>

                <Button 
                  onClick={handleDemoLogin}
                  variant="outline"
                  className="w-full h-12"
                  disabled={loading}
                >
                  دخول تجريبي
                </Button>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}