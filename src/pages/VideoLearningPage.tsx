import { useState, useEffect } from "react";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlayCircle, Star } from "lucide-react";

interface Subject {
  id: string;
  name_ar: string;
  name_en: string;
  code: string;
}

interface Chapter {
  id: string;
  name_ar: string;
  name_en: string;
}

interface Video {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
  is_recommended: boolean;
}

export default function VideoLearningPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedChapter, setSelectedChapter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    setSubjects([
      { id: '1', name_ar: 'الرياضيات', name_en: 'Mathematics', code: 'MATH' },
      { id: '2', name_ar: 'الفيزياء', name_en: 'Physics', code: 'PHYS' }
    ]);
    
    setChapters([
      { id: '1', name_ar: 'التفاضل', name_en: 'Calculus' },
      { id: '2', name_ar: 'التكامل', name_en: 'Integration' }
    ]);
    
    setVideos([
      {
        id: '1',
        title: 'مقدمة في التفاضل',
        description: 'شرح أساسيات التفاضل',
        youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        is_recommended: true
      },
      {
        id: '2',
        title: 'التكامل المحدود',
        description: 'حل التكامل المحدود',
        youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        is_recommended: false
      }
    ]);
    
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedSubject !== "all") {
      fetchChapters(selectedSubject);
    } else {
      setChapters([]);
      setSelectedChapter("all");
    }
  }, [selectedSubject]);

  useEffect(() => {
    if (selectedChapter !== "all") {
      fetchVideos(selectedChapter);
    } else if (selectedSubject !== "all") {
      fetchAllVideosForSubject(selectedSubject);
    } else {
      setVideos([]);
    }
  }, [selectedChapter, selectedSubject]);

  const fetchChapters = (subjectId: string) => {
    // Mock function - no actual fetching
    console.log('Mock fetch chapters for:', subjectId);
  };

  const fetchVideos = (chapterId: string) => {
    // Mock function - no actual fetching
    console.log('Mock fetch videos for:', chapterId);
  };

  const fetchAllVideosForSubject = (subjectId: string) => {
    // Mock function - no actual fetching  
    console.log('Mock fetch all videos for:', subjectId);
  };

  const openYouTubeVideo = (url: string) => {
    window.open(url, '_blank');
  };

  const getYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-bg">
        <MobileHeader userName="المستخدم" />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">جاري التحميل...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg pb-20">
      <MobileHeader userName="المستخدم" />
      
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Page Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">التعلم بالفيديو</h1>
          <p className="text-muted-foreground">اختر المادة والفصل لمشاهدة الفيديوات التعليمية</p>
        </div>

        {/* Subject Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">اختر المادة</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="اختر المادة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المواد</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name_ar}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Chapter Selection */}
        {chapters.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">اختر الفصل</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفصل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الفصول</SelectItem>
                  {chapters.map((chapter) => (
                    <SelectItem key={chapter.id} value={chapter.id}>
                      {chapter.name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        {/* Videos List */}
        {videos.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">الفيديوات المتاحة</h2>
            {videos.map((video) => {
              const videoId = getYouTubeVideoId(video.youtube_url || '');
              const thumbnailUrl = videoId 
                ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                : null;

              return (
                <Card key={video.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    {thumbnailUrl && (
                      <div className="relative">
                        <img 
                          src={thumbnailUrl} 
                          alt={video.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <PlayCircle className="w-16 h-16 text-white opacity-80" />
                        </div>
                        {video.is_recommended && (
                          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs">
                            <Star className="w-3 h-3" />
                            موصى به
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-2">{video.title}</h3>
                      {video.description && (
                        <p className="text-sm text-muted-foreground mb-3">{video.description}</p>
                      )}
                      <Button 
                        onClick={() => openYouTubeVideo(video.youtube_url || '')}
                        className="w-full"
                        disabled={!video.youtube_url}
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        مشاهدة الفيديو
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {videos.length === 0 && (selectedSubject !== "all" || selectedChapter !== "all") && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">لا توجد فيديوات متاحة للاختيار الحالي</p>
            </CardContent>
          </Card>
        )}

        {selectedSubject === "all" && selectedChapter === "all" && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">اختر مادة لعرض الفيديوات المتاحة</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}