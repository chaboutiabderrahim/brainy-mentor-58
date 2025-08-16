/**
 * HomePage Component
 * 
 * Purpose: Main dashboard for the educational AI app
 * Features:
 * - Student progress overview with interactive charts
 * - Daily AI advice section for personalized learning tips
 * - Recent quiz scores and performance metrics
 * - Quick access to key app features
 * - Mobile-optimized layout with smooth animations
 */

import { useState, useEffect } from "react";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Calendar, 
  TrendingUp, 
  Brain, 
  Lightbulb,
  PlayCircle,
  BookOpen,
  Target
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data - In production, this would come from API
const mockUserData = {
  name: "Ahmed",
  totalScore: 2450,
  weeklyProgress: "+15%",
  completedQuizzes: 23,
  averageScore: 85,
  streakDays: 7
};

const dailyAdviceOptions = [
  "Focus on practicing calculus limits today - your weak area from yesterday's quiz!",
  "Try solving physics dynamics problems using energy conservation methods.",
  "Review your algebra fundamentals before attempting today's quiz.",
  "Practice graphing quadratic functions to improve your math visualization skills.",
  "Study wave properties in physics - it often appears in BAC exams."
];

export default function HomePage() {
  const navigate = useNavigate();
  const [dailyAdvice, setDailyAdvice] = useState("");

  // Simulate AI generating daily advice
  useEffect(() => {
    const randomAdvice = dailyAdviceOptions[Math.floor(Math.random() * dailyAdviceOptions.length)];
    setDailyAdvice(randomAdvice);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-bg pb-20">
      <MobileHeader 
        userName={mockUserData.name}
        userScore={mockUserData.totalScore}
      />
      
      <div className="p-4 space-y-6 max-w-md mx-auto">
        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {mockUserData.name}! 🎓
          </h1>
          <p className="text-muted-foreground">
            Ready to boost your BAC preparation today?
          </p>
        </div>

        {/* Daily AI Advice Card */}
        <Card className="p-4 bg-gradient-primary text-primary-foreground shadow-glow">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Lightbulb size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Daily AI Advice</h3>
              <p className="text-sm opacity-90 leading-relaxed">
                {dailyAdvice}
              </p>
            </div>
          </div>
        </Card>

        {/* Performance Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={<Trophy size={20} />}
            title="Total Score"
            value={mockUserData.totalScore}
            subtitle={`${mockUserData.weeklyProgress} this week`}
            onClick={() => navigate("/progress")}
          />
          <StatCard
            icon={<Target size={20} />}
            title="Average Score"
            value={`${mockUserData.averageScore}%`}
            subtitle="Great progress!"
            variant="success"
          />
          <StatCard
            icon={<Calendar size={20} />}
            title="Quiz Streak"
            value={`${mockUserData.streakDays} days`}
            subtitle="Keep it up!"
          />
          <StatCard
            icon={<BookOpen size={20} />}
            title="Completed"
            value={mockUserData.completedQuizzes}
            subtitle="Quizzes solved"
          />
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
          
          <Button 
            className="w-full justify-start space-x-3 h-14 text-left"
            variant="outline"
            onClick={() => navigate("/daily-quiz")}
          >
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Today's AI Quiz</p>
              <p className="text-sm text-muted-foreground">Test your knowledge with AI-generated questions</p>
            </div>
          </Button>

          <Button 
            className="w-full justify-start space-x-3 h-14 text-left"
            variant="outline"
            onClick={() => navigate("/learn-ai")}
          >
            <div className="p-2 bg-accent/10 rounded-lg">
              <TrendingUp size={20} className="text-accent" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Learn with AI</p>
              <p className="text-sm text-muted-foreground">Get personalized explanations and summaries</p>
            </div>
          </Button>

          <Button 
            className="w-full justify-start space-x-3 h-14 text-left"
            variant="outline"
            onClick={() => navigate("/students")}
          >
            <div className="p-2 bg-secondary/10 rounded-lg">
              <PlayCircle size={20} className="text-secondary-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Success Stories</p>
              <p className="text-sm text-muted-foreground">Learn from top BAC students</p>
            </div>
          </Button>
        </div>

        {/* Recent Activity Preview */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center space-x-2">
            <TrendingUp size={18} className="text-primary" />
            <span>Recent Activity</span>
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm">Math Quiz - Functions</span>
              <span className="text-sm font-medium text-accent">92%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm">Physics Quiz - Dynamics</span>
              <span className="text-sm font-medium text-accent">88%</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm">Chemistry Quiz - Organic</span>
              <span className="text-sm font-medium text-accent">95%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}