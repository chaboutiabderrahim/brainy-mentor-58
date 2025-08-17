import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface AlumniFormProps {
  onClose: () => void;
}

export function AlumniForm({ onClose }: AlumniFormProps) {
  const [name, setName] = useState('');
  const [stream, setStream] = useState('');
  const [bacScore, setBacScore] = useState('');
  const [adviceText, setAdviceText] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "خطأ",
        description: "يجب تسجيل الدخول أولاً",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let resumeUrl = null;

      // Upload resume if provided
      if (resumeFile) {
        const fileName = `${user.id}/${Date.now()}_${resumeFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('alumni-resumes')
          .upload(fileName, resumeFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from('alumni-resumes')
          .getPublicUrl(fileName);

        resumeUrl = urlData.publicUrl;
      }

      // Create alumni record
      const { error } = await supabase
        .from('alumni')
        .insert({
          name,
          stream: stream as any,
          bac_score: parseFloat(bacScore),
          advice_text: adviceText,
          resume_url: resumeUrl,
          approved: false
        });

      if (error) {
        throw error;
      }

      toast({
        title: "تم إرسال طلبك بنجاح",
        description: "سيتم مراجعة طلبك والموافقة عليه قريباً",
      });

      onClose();
    } catch (error) {
      console.error('Error creating alumni profile:', error);
      toast({
        title: "خطأ في إرسال الطلب",
        description: "حدث خطأ، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>انضم كخريج متفوق</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم الكامل</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اسمك الكامل"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stream">الشعبة</Label>
            <Select value={stream} onValueChange={setStream} required>
              <SelectTrigger>
                <SelectValue placeholder="اختر الشعبة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="science_math">علوم رياضية</SelectItem>
                <SelectItem value="science_physics">علوم فيزيائية</SelectItem>
                <SelectItem value="science_life">علوم الحياة والأرض</SelectItem>
                <SelectItem value="literature">آداب</SelectItem>
                <SelectItem value="economics">اقتصاد</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bacScore">نقطة البكالوريا</Label>
            <Input
              id="bacScore"
              type="number"
              step="0.01"
              min="10"
              max="20"
              value={bacScore}
              onChange={(e) => setBacScore(e.target.value)}
              placeholder="مثال: 18.75"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="advice">نصائحك للطلاب</Label>
            <Textarea
              id="advice"
              value={adviceText}
              onChange={(e) => setAdviceText(e.target.value)}
              placeholder="شارك نصائحك وتجربتك مع الطلاب..."
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume">السيرة الذاتية (اختياري)</Label>
            <Input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}