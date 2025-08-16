/**
 * GetStartedPage Component
 * 
 * Purpose: Attractive landing page that welcomes users to the educational app
 * Features:
 * - Hero section with stunning visuals and gradients
 * - Feature highlights with animated cards
 * - Call-to-action buttons for signup/login
 * - Modern mobile-first design with beautiful colors
 * - Particle background animation
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Brain, Trophy, Users, GraduationCap, Star, Zap, Target } from 'lucide-react';
import heroImage from '@/assets/hero-education.jpg';

export default function GetStartedPage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'تعلم بالذكاء الاصطناعي',
      description: 'احصل على شرح مخصص لك مع مساعد الذكاء الاصطناعي',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: BookOpen,
      title: 'اختبارات يومية',
      description: 'اختبر معلوماتك واحصل على تقييم فوري لأدائك',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Trophy,
      title: 'نتائج الامتحانات',
      description: 'تابع درجاتك وحلول الامتحانات السابقة',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Users,
      title: 'مجتمع الطلاب',
      description: 'تفاعل مع زملائك وشارك في التعلم الجماعي',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const stats = [
    { number: '10K+', label: 'طالب نشط' },
    { number: '500+', label: 'درس تفاعلي' },
    { number: '98%', label: 'معدل النجاح' },
    { number: '24/7', label: 'دعم مستمر' }
  ];

  return (
    <div className="min-h-screen bg-gradient-bg overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-primary p-4 rounded-full shadow-glow">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            THE SMART
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            MATHEMATICS & PHYSICS
          </p>
        </header>

        {/* Hero Section */}
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <img 
              src={heroImage} 
              alt="Educational Hero" 
              className="w-full max-w-2xl mx-auto rounded-2xl shadow-elevated mb-8"
            />
            <h2 className="text-3xl font-bold text-foreground mb-4">
              🚀 ابدأ رحلتك التعليمية معنا
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              انضم إلى آلاف الطلاب الذين يحققون التفوق في الرياضيات والفيزياء من خلال منصتنا التعليمية المتقدمة
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-gradient-primary text-white px-8 py-6 text-lg font-semibold rounded-2xl shadow-glow hover:scale-105 transition-all duration-300"
                size="lg"
              >
                <Star className="w-5 h-5 mr-2" />
                ابدأ الآن مجاناً
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/auth')}
                className="border-2 border-primary text-primary px-8 py-6 text-lg font-semibold rounded-2xl hover:bg-primary hover:text-white transition-all duration-300"
                size="lg"
              >
                <Zap className="w-5 h-5 mr-2" />
                لديك حساب؟ ادخل
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border-0 shadow-card hover:shadow-elevated transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`group bg-card/50 backdrop-blur-sm border-0 shadow-card hover:shadow-elevated transition-all duration-500 hover:scale-105 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <CardContent className="p-6">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-primary rounded-3xl p-8 shadow-glow">
          <Target className="w-16 h-16 text-white mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">
            🎯 جاهز لتحقيق التفوق؟
          </h3>
          <p className="text-white/90 mb-6 max-w-lg mx-auto">
            انضم إلينا اليوم واحصل على أفضل تجربة تعليمية تفاعلية
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            variant="secondary"
            className="bg-white text-primary px-8 py-6 text-lg font-semibold rounded-2xl hover:scale-105 transition-all duration-300"
            size="lg"
          >
            <GraduationCap className="w-5 h-5 mr-2" />
            ابدأ رحلتك الآن
          </Button>
        </div>
      </div>
    </div>
  );
}