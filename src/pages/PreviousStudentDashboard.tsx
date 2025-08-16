import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, FileText, Download, Trash2, Clock, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PDF {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_size: number | null;
  download_count: number | null;
  created_at: string;
}

interface TeachingSchedule {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  description: string | null;
  subject_id: string | null;
}

export default function PreviousStudentDashboard() {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [schedule, setSchedule] = useState<TeachingSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [newPdf, setNewPdf] = useState({
    title: '',
    description: '',
    file: null as File | null
  });

  const { toast } = useToast();

  // Mock user data
  const user = {
    id: '1',
    email: 'graduate@example.com'
  };

  useEffect(() => {
    // Mock data
    setPdfs([
      {
        id: '1',
        title: 'ملخص الرياضيات - البكالوريا',
        description: 'ملخص شامل لمادة الرياضيات',
        file_url: '#',
        file_size: 2048000,
        download_count: 15,
        created_at: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        title: 'تمارين الفيزياء المحلولة',
        description: 'مجموعة تمارين محلولة في الفيزياء',
        file_url: '#',
        file_size: 3072000,
        download_count: 8,
        created_at: '2024-01-10T14:20:00Z'
      }
    ]);
    
    setSchedule([
      {
        id: '1',
        day_of_week: 1,
        start_time: '09:00:00',
        end_time: '11:00:00',
        description: 'درس الرياضيات - المجموعة الأولى',
        subject_id: '1'
      },
      {
        id: '2',
        day_of_week: 3,
        start_time: '14:00:00',
        end_time: '16:00:00',
        description: 'درس الفيزياء - المجموعة الثانية',
        subject_id: '2'
      }
    ]);
    
    setLoading(false);
  }, []);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPdf.file) return;

    setUploadLoading(true);
    
    // Mock upload
    setTimeout(() => {
      toast({
        title: "تم رفع الملف بنجاح",
        description: "تم حفظ الملف بنجاح",
      });

      // Add to pdfs list
      const newPdfData: PDF = {
        id: Date.now().toString(),
        title: newPdf.title,
        description: newPdf.description,
        file_url: '#',
        file_size: newPdf.file!.size,
        download_count: 0,
        created_at: new Date().toISOString()
      };
      
      setPdfs(prev => [newPdfData, ...prev]);
      setNewPdf({ title: '', description: '', file: null });
      setUploadLoading(false);
    }, 1500);
  };

  const handleDeletePDF = async (pdfId: string) => {
    setPdfs(prev => prev.filter(pdf => pdf.id !== pdfId));
    toast({
      title: "تم حذف الملف",
      description: "تم حذف الملف بنجاح",
    });
  };

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return 'غير محدد';
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    if (bytes === 0) return '0 بايت';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getDayName = (dayOfWeek: number): string => {
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return days[dayOfWeek] || 'غير محدد';
  };

  const formatTime = (time: string): string => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg pb-20">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Welcome Section */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-3xl font-bold text-foreground mb-2">لوحة الطالب السابق</h1>
          <p className="text-muted-foreground">مرحباً بك، {user.email}</p>
        </div>

        {/* Upload New PDF */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              رفع ملف جديد
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">عنوان الملف</label>
                <Input
                  value={newPdf.title}
                  onChange={(e) => setNewPdf(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="أدخل عنوان الملف"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">وصف الملف (اختياري)</label>
                <Textarea
                  value={newPdf.description}
                  onChange={(e) => setNewPdf(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="أدخل وصف الملف"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">الملف</label>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setNewPdf(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  الملفات المدعومة: PDF, DOC, DOCX (حد أقصى: 10MB)
                </p>
              </div>
              
              <Button 
                type="submit" 
                disabled={uploadLoading || !newPdf.title || !newPdf.file}
                className="w-full"
              >
                {uploadLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    جاري الرفع...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    رفع الملف
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Uploaded PDFs */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              الملفات المرفوعة ({pdfs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pdfs.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">لم يتم رفع أي ملفات بعد</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pdfs.map((pdf) => (
                  <div key={pdf.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground mb-1">{pdf.title}</h4>
                      {pdf.description && (
                        <p className="text-sm text-muted-foreground mb-2">{pdf.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{formatFileSize(pdf.file_size)}</span>
                        <span className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {pdf.download_count} تحميل
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(pdf.created_at).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(pdf.file_url, '_blank')}
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        عرض
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePDF(pdf.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Teaching Schedule */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              جدول التدريس
            </CardTitle>
          </CardHeader>
          <CardContent>
            {schedule.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">لا يوجد جدول تدريس محدد</p>
              </div>
            ) : (
              <div className="space-y-4">
                {schedule.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">
                          {getDayName(item.day_of_week)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatTime(item.start_time)} - {formatTime(item.end_time)}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-sm text-foreground">{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{pdfs.length}</div>
              <div className="text-sm text-muted-foreground">ملف مرفوع</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <Download className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {pdfs.reduce((sum, pdf) => sum + (pdf.download_count || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">إجمالي التحميلات</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <User className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{schedule.length}</div>
              <div className="text-sm text-muted-foreground">حصة تدريس</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}