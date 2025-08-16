/**
 * StudentsPage Component
 * 
 * Purpose: Showcase of successful BAC students with their study methods and achievements
 * Features:
 * - Profile displays with academic achievements and university placements
 * - Personal study tips and methods from successful students
 * - Recommended resources and video content
 * - Booking system for private mentoring sessions (2 sessions/month)
 * - Student success metrics and BAC scores
 * - Interactive video recommendations and study guides
 */

import { useState } from "react";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  GraduationCap, 
  Calendar, 
  Star,
  Play,
  BookOpen,
  MessageCircle,
  Clock,
  Users
} from "lucide-react";

// Mock successful students data
const successfulStudents = [
  {
    id: "student-1",
    name: "Youssef Benali",
    photo: null,
    bacScore: 18.75,
    year: 2023,
    university: "École Polytechnique",
    field: "Engineering",
    specialization: "Mathematics & Physics",
    currentStatus: "2nd Year Engineering Student",
    studyTips: [
      "Practice past exams daily for 2 hours minimum",
      "Create visual mind maps for complex physics concepts",
      "Join study groups for mathematics problem-solving",
      "Use spaced repetition for formula memorization"
    ],
    achievements: [
      "Regional Mathematics Olympiad Winner",
      "Best Student in Physics - 2023",
      "Perfect score in Calculus section"
    ],
    recommendedVideos: [
      { title: "Advanced Calculus Techniques", duration: "45 min" },
      { title: "Physics Problem Solving Strategies", duration: "38 min" },
      { title: "Time Management for BAC", duration: "22 min" }
    ],
    availableSessions: 2,
    rating: 4.9,
    totalSessions: 47
  },
  {
    id: "student-2", 
    name: "Fatima Zehani",
    photo: null,
    bacScore: 19.25,
    year: 2023,
    university: "Faculté de Médecine",
    field: "Medicine",
    specialization: "Sciences & Mathematics",
    currentStatus: "1st Year Medical Student",
    studyTips: [
      "Focus on understanding concepts before memorizing",
      "Create detailed summary sheets for each chapter",
      "Practice chemistry reactions with real examples",
      "Form study partnerships with classmates"
    ],
    achievements: [
      "Highest BAC Score in Region",
      "Chemistry Excellence Award",
      "Top 1% National Ranking"
    ],
    recommendedVideos: [
      { title: "Chemistry Mastery Techniques", duration: "52 min" },
      { title: "Biology Study Methods", duration: "41 min" },
      { title: "Exam Strategy Planning", duration: "29 min" }
    ],
    availableSessions: 1,
    rating: 4.8,
    totalSessions: 32
  },
  {
    id: "student-3",
    name: "Ahmed Mansouri", 
    photo: null,
    bacScore: 18.50,
    year: 2022,
    university: "INSEA",
    field: "Statistics & Economics",
    specialization: "Mathematics",
    currentStatus: "Data Science Student",
    studyTips: [
      "Master probability and statistics fundamentals",
      "Use technology for complex calculations",
      "Practice real-world application problems",
      "Connect mathematical concepts to economics"
    ],
    achievements: [
      "Statistics Competition Champion",
      "Perfect Mathematics Score",
      "Economics Research Paper Published"
    ],
    recommendedVideos: [
      { title: "Statistics & Probability Mastery", duration: "48 min" },
      { title: "Mathematical Economics", duration: "35 min" },
      { title: "Data Analysis Techniques", duration: "44 min" }
    ],
    availableSessions: 2,
    rating: 4.7,
    totalSessions: 28
  }
];

export default function StudentsPage() {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const handleBookSession = (studentId: string) => {
    // In production, this would open a booking modal or navigate to booking page
    alert(`Booking session with ${successfulStudents.find(s => s.id === studentId)?.name}`);
  };

  const handleWatchVideo = (videoTitle: string) => {
    // In production, this would open video player
    alert(`Playing: ${videoTitle}`);
  };

  if (selectedStudent) {
    const student = successfulStudents.find(s => s.id === selectedStudent)!;
    
    return (
      <div className="min-h-screen bg-gradient-bg pb-20">
        <MobileHeader userName="Ahmed" userScore={2450} />
        
        <div className="p-4 max-w-md mx-auto space-y-6">
          {/* Student Profile Header */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedStudent(null)}
              >
                Back
              </Button>
              <div className="flex items-center space-x-1">
                <Star size={16} className="text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{student.rating}</span>
                <span className="text-xs text-muted-foreground">({student.totalSessions} sessions)</span>
              </div>
            </div>

            <div className="text-center space-y-4">
              <Avatar className="w-20 h-20 mx-auto">
                <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h2 className="text-2xl font-bold">{student.name}</h2>
                <p className="text-muted-foreground">{student.currentStatus}</p>
              </div>

              <div className="flex items-center justify-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{student.bacScore}</div>
                  <div className="text-xs text-muted-foreground">BAC Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{student.year}</div>
                  <div className="text-xs text-muted-foreground">Graduation</div>
                </div>
              </div>

              <Badge variant="secondary" className="text-sm">
                {student.university} - {student.field}
              </Badge>
            </div>
          </Card>

          {/* Session Booking */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center space-x-2">
                <Calendar size={18} className="text-primary" />
                <span>Private Sessions</span>
              </h3>
              <Badge variant={student.availableSessions > 0 ? "default" : "secondary"}>
                {student.availableSessions} available
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Book a private mentoring session to get personalized guidance and solve exams together.
            </p>
            <Button 
              className="w-full"
              disabled={student.availableSessions === 0}
              onClick={() => handleBookSession(student.id)}
            >
              <MessageCircle size={16} className="mr-2" />
              Book Session
            </Button>
          </Card>

          {/* Study Tips */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center space-x-2">
              <BookOpen size={18} className="text-primary" />
              <span>Study Tips & Methods</span>
            </h3>
            <div className="space-y-3">
              {student.studyTips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-1 bg-primary/10 rounded-full mt-1">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  </div>
                  <p className="text-sm leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Achievements */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center space-x-2">
              <Trophy size={18} className="text-primary" />
              <span>Achievements</span>
            </h3>
            <div className="space-y-2">
              {student.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-accent/10">
                  <Trophy size={16} className="text-accent flex-shrink-0" />
                  <span className="text-sm font-medium">{achievement}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recommended Videos */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center space-x-2">
              <Play size={18} className="text-primary" />
              <span>Recommended Videos</span>
            </h3>
            <div className="space-y-3">
              {student.recommendedVideos.map((video, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleWatchVideo(video.title)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Play size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{video.title}</p>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock size={12} />
                        <span>{video.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg pb-20">
      <MobileHeader userName="Ahmed" userScore={2450} />
      
      <div className="p-4 max-w-md mx-auto space-y-6">
        {/* Welcome Section */}
        <Card className="p-6 text-center bg-gradient-success text-accent-foreground">
          <div className="p-4 bg-white/20 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
            <GraduationCap size={28} />
          </div>
          <h1 className="text-2xl font-bold mb-2">Success Stories</h1>
          <p className="opacity-90">
            Learn from students who achieved excellence in their BAC exams
          </p>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center">
            <div className="text-xl font-bold text-primary mb-1">150+</div>
            <div className="text-xs text-muted-foreground">Success Stories</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xl font-bold text-accent mb-1">18.5</div>
            <div className="text-xs text-muted-foreground">Avg. Score</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xl font-bold text-secondary-foreground mb-1">95%</div>
            <div className="text-xs text-muted-foreground">Success Rate</div>
          </Card>
        </div>

        {/* Featured Students */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Featured Students</h2>
          <div className="space-y-4">
            {successfulStudents.map((student) => (
              <Card 
                key={student.id}
                className="p-4 cursor-pointer hover:shadow-elevated transition-all duration-200"
                onClick={() => setSelectedStudent(student.id)}
              >
                <div className="flex items-start space-x-4">
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-base truncate">{student.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star size={14} className="text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{student.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">{student.currentStatus}</p>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-1">
                        <Trophy size={14} className="text-accent" />
                        <span className="text-sm font-bold text-accent">{student.bacScore}/20</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <GraduationCap size={14} className="text-primary" />
                        <span className="text-sm">{student.university}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {student.specialization}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Users size={12} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{student.totalSessions} sessions</span>
                        </div>
                        <Badge variant={student.availableSessions > 0 ? "default" : "secondary"} className="text-xs">
                          {student.availableSessions} available
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">How Private Sessions Work</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-primary/10 rounded-full mt-1">
                <div className="w-2 h-2 bg-primary rounded-full" />
              </div>
              <div>
                <p className="text-sm font-medium">Choose Your Mentor</p>
                <p className="text-xs text-muted-foreground">Select from our top-performing BAC graduates</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-primary/10 rounded-full mt-1">
                <div className="w-2 h-2 bg-primary rounded-full" />
              </div>
              <div>
                <p className="text-sm font-medium">Book 1-on-1 Sessions</p>
                <p className="text-xs text-muted-foreground">Up to 2 private sessions per month</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-primary/10 rounded-full mt-1">
                <div className="w-2 h-2 bg-primary rounded-full" />
              </div>
              <div>
                <p className="text-sm font-medium">Get Personalized Help</p>
                <p className="text-xs text-muted-foreground">Ask questions and solve exams together</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}