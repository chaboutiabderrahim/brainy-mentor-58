/**
 * ProfilePage Component
 * 
 * Purpose: User profile management page for viewing and editing profile information
 * Features:
 * - View/edit user display name
 * - Display user statistics (quizzes, scores, streaks)
 * - Account management (logout functionality)
 * - Mobile-optimized interface
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { Edit3, Save, X, LogOut, User, Trophy, Zap, Clock, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('مستخدم تجريبي');
  const [loading, setLoading] = useState(false);
  const [stats] = useState({
    totalQuizzes: 15,
    averageScore: 85,
    streak: 7,
    totalStudyTime: 24
  });

  // Mock user data
  const user = {
    email: 'user@example.com',
    created_at: '2024-01-15T10:30:00Z'
  };
  
  const profile = {
    display_name: displayName,
    role: 'regular_student'
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    
    setTimeout(() => {
      toast({
        title: "تم حفظ التغييرات",
        description: "تم تحديث الملف الشخصي بنجاح",
      });
      setIsEditing(false);
      setLoading(false);
    }, 1000);
  };

  const handleLogout = async () => {
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح",
    });
    navigate('/get-started');
  };

  const getUserRole = (role: string) => {
    const roles = {
      regular_student: 'طالب',
      previous_student: 'طالب سابق',
      admin: 'مدير'
    };
    return roles[role as keyof typeof roles] || 'مستخدم';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-bg pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-2xl font-bold text-foreground">الملف الشخصي</h1>
          <p className="text-muted-foreground mt-1">إدارة حسابك ومعلوماتك الشخصية</p>
        </div>

        {/* Profile Card */}
        <Card className="shadow-elevated">
          <CardHeader className="text-center pb-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                  {getInitials(profile.display_name || 'مستخدم')}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-2">
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="displayName" className="text-sm font-medium">الاسم</Label>
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="text-center mt-1"
                        placeholder="أدخل اسمك"
                      />
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        {loading ? 'جاري الحفظ...' : 'حفظ'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setDisplayName(profile.display_name || '');
                        }}
                        disabled={loading}
                      >
                        <X className="w-4 h-4 mr-1" />
                        إلغاء
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-foreground">{profile.display_name}</h2>
                    <Badge variant="secondary" className="text-xs">
                      <User className="w-3 h-3 mr-1" />
                      {getUserRole(profile.role)}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditing(true)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      تعديل الاسم
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{stats.totalQuizzes}</div>
              <div className="text-xs text-muted-foreground">اختبار مكتمل</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">{stats.averageScore}%</div>
              <div className="text-xs text-muted-foreground">متوسط النتائج</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{stats.streak}</div>
              <div className="text-xs text-muted-foreground">سلسلة نجاح</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{stats.totalStudyTime}</div>
              <div className="text-xs text-muted-foreground">ساعة دراسة</div>
            </CardContent>
          </Card>
        </div>

        {/* Account Management */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5" />
              إدارة الحساب
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                تاريخ الانضمام
              </span>
              <span className="text-sm font-medium text-foreground">
                {formatJoinDate(user.created_at)}
              </span>
            </div>
            
            <Separator />
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <LogOut className="w-4 h-4 mr-2" />
                  تسجيل الخروج
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>تأكيد تسجيل الخروج</AlertDialogTitle>
                  <AlertDialogDescription>
                    هل أنت متأكد من أنك تريد تسجيل الخروج من حسابك؟
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout} className="bg-destructive hover:bg-destructive/90">
                    تسجيل الخروج
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}