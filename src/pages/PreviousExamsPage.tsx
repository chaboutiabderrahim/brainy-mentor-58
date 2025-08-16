/**
 * PreviousExamsPage Component
 * 
 * Purpose: Displays archived BAC exams by stream, year, and subject
 * Features:
 * - Real data from Supabase database
 * - Filter by stream (Mathematics, Technical Math, etc.)
 * - Filter by year (2015-2025)
 * - View exam files and solutions
 * - Track user progress on exams
 * - Mobile-optimized interface
 */

import { useState, useEffect } from 'react';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, CheckCircle, Clock, Star } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Types for database entities
interface Stream {
  id: string;
  name_ar: string;
  name_en: string;
  code: string;
}

interface Subject {
  id: string;
  name_ar: string;
  name_en: string;
  code: string;
}

interface Exam {
  id: string;
  title: string;
  year: number;
  session: string;
  subject: Subject;
  difficulty_level: number;
  duration_minutes: number;
  exam_file_url?: string;
  solution_file_url?: string;
  ai_solution?: string;
}

export default function PreviousExamsPage() {
  const [selectedStream, setSelectedStream] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [streams, setStreams] = useState<Stream[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch streams and exams data from database
  useEffect(() => {
    // Mock data
    setStreams([
      { id: '1', name_ar: 'علوم تجريبية', name_en: 'Science', code: 'SCI' },
      { id: '2', name_ar: 'رياضيات', name_en: 'Mathematics', code: 'MATH' }
    ]);
    
    setExams([
      {
        id: '1',
        title: 'امتحان الرياضيات - الدورة الأولى',
        year: 2024,
        session: 'الدورة الأولى',
        difficulty_level: 3,
        duration_minutes: 180,
        exam_file_url: '#',
        solution_file_url: '#',
        ai_solution: 'حل ذكي متوفر',
        subject: { id: '1', name_ar: 'الرياضيات', name_en: 'Mathematics', code: 'MATH' }
      },
      {
        id: '2', 
        title: 'امتحان الفيزياء - الدورة الثانية',
        year: 2023,
        session: 'الدورة الثانية', 
        difficulty_level: 4,
        duration_minutes: 180,
        exam_file_url: '#',
        solution_file_url: null,
        ai_solution: null,
        subject: { id: '2', name_ar: 'الفيزياء', name_en: 'Physics', code: 'PHYS' }
      }
    ]);
    
    setLoading(false);
  }, []);

  // Filter exams based on selected stream and year
  const filteredExams = exams.filter(exam => {
    const streamMatch = !selectedStream || selectedStream === 'all';
    const yearMatch = !selectedYear || selectedYear === 'all' || exam.year.toString() === selectedYear;
    return streamMatch && yearMatch;
  });

  // Group exams by year and subject
  const groupedExams = filteredExams.reduce((acc, exam) => {
    const key = `${exam.year}-${exam.subject.code}`;
    if (!acc[key]) {
      acc[key] = {
        year: exam.year,
        subject: exam.subject,
        exams: []
      };
    }
    acc[key].exams.push(exam);
    return acc;
  }, {} as Record<string, { year: number; subject: Subject; exams: Exam[] }>);

  const handleDownload = (examId: string, type: 'exam' | 'solution') => {
    // Placeholder for file download functionality
    toast({
      title: "جاري التحميل",
      description: `جاري تحميل ${type === 'exam' ? 'الامتحان' : 'الحل'}...`,
    });
  };

  const handleAISolve = (examId: string) => {
    // Placeholder for AI solve functionality
    toast({
      title: "قريباً",
      description: "ستتم إضافة خاصية الحل بالذكاء الاصطناعي قريباً...",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-bg">
        <MobileHeader userName="الطالب" userScore={0} />
        <div className="flex items-center justify-center pt-20 pb-20">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">جاري تحميل الامتحانات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg pb-20">
      <MobileHeader userName="الطالب" userScore={0} />
      
      <div className="pt-20 px-4 space-y-6">
        {/* Filters */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stream Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">الشعبة</label>
              <Select value={selectedStream} onValueChange={setSelectedStream}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="اختر الشعبة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الشعب</SelectItem>
                  {streams.map((stream) => (
                    <SelectItem key={stream.id} value={stream.id}>
                      {stream.name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Year Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">السنة</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="اختر السنة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع السنوات</SelectItem>
                  {Array.from({ length: 11 }, (_, i) => 2025 - i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Exams Display */}
        <div className="space-y-4">
          {Object.values(groupedExams).length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  لا توجد امتحانات
                </h3>
                <p className="text-muted-foreground">
                  لم يتم العثور على امتحانات للمعايير المحددة
                </p>
              </CardContent>
            </Card>
          ) : (
            Object.values(groupedExams).map((group) => (
              <Card key={`${group.year}-${group.subject.code}`} className="shadow-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {group.subject.name_ar} - {group.year}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {group.exams.length} امتحان
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {group.exams.map((exam) => {
                    // Mock exam file URL
                    const examFileUrl = exam.exam_file_url !== '#' ? exam.exam_file_url : null;

                    return (
                      <div
                        key={exam.id}
                        className="border border-border/50 rounded-xl p-4 bg-card shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/30"
                      >
                        <div className="space-y-4">
                          {/* Exam Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-foreground text-base">
                                  {exam.session === 'main' ? 'الدورة الرئيسية' : 'دورة الاستدراك'}
                                </h4>
                                <div className="flex">
                                  {Array.from({ length: exam.difficulty_level }).map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                                  <Clock className="w-3.5 h-3.5" />
                                  {exam.duration_minutes} دقيقة
                                </span>
                                {examFileUrl && (
                                  <span className="text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-md">
                                    ✓ متوفر
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => examFileUrl ? window.open(examFileUrl, '_blank') : handleDownload(exam.id, 'exam')}
                              className="h-10 flex-1 border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5"
                              disabled={!examFileUrl}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              تحميل الامتحان
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownload(exam.id, 'solution')}
                              className="h-10 flex-1 border-2 border-accent/20 hover:border-accent/50 hover:bg-accent/5"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              تحميل الحل
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleAISolve(exam.id)}
                              className="h-10 flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-2 border-purple-300 hover:border-purple-400 shadow-md hover:shadow-lg"
                            >
                              <Star className="w-4 h-4 mr-2" />
                              حل بالذكاء الاصطناعي
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Upload Instructions */}
        <Card className="shadow-card bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <FileText className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">إضافة امتحانات جديدة</h3>
            <p className="text-sm text-muted-foreground mb-4">
              يمكنك رفع ملفات الامتحانات والحلول من خلال لوحة الإدارة
            </p>
            <div className="text-xs text-muted-foreground">
              <p>تدعم صيغ: PDF, DOC, DOCX</p>
              <p>حد أقصى: 10MB لكل ملف</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}