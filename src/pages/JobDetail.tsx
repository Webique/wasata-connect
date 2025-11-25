import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, MapPin, DollarSign, Shield } from 'lucide-react';

export default function JobDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      loadJob();
    }
  }, [id]);

  const loadJob = async () => {
    try {
      const jobData = await api.getJob(id!);
      setJob(jobData);
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || t('somethingWentWrong'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!cvFile) {
      toast({
        title: t('error'),
        description: 'Please select a CV file',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const uploadResult = await api.uploadFile(cvFile);
      await api.createApplication({
        jobId: id!,
        cvUrl: uploadResult.url,
      });
      toast({
        title: t('applicationSubmitted'),
        description: 'Your application has been submitted successfully',
      });
      setApplyDialogOpen(false);
      navigate('/dashboard/user');
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || t('somethingWentWrong'),
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div>Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div>Job not found</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            ← {t('back')}
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{job.title}</CardTitle>
              <CardDescription className="text-lg">
                {job.companyId?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('workingHours')}</p>
                    <p className="font-medium">{job.workingHours}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('minSalary')}</p>
                    <p className="font-medium">{job.minSalary} ر.س</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('healthInsurance')}</p>
                    <p className="font-medium">{job.healthInsurance ? t('yes') : t('no')}</p>
                  </div>
                </div>
                {job.companyId?.mapsUrl && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <a
                      href={job.companyId.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {t('viewLocation')}
                    </a>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold">{t('qualification')}</h3>
                <p>{job.qualification}</p>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold">{t('skills')}</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills?.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-muted rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {user?.role === 'user' && (
                <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full">
                      {t('applyNow')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t('applyForJob')}</DialogTitle>
                      <DialogDescription>
                        {t('uploadCV')}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="cv">{t('selectFile')}</Label>
                        <Input
                          id="cv"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                        />
                      </div>
                      <Button
                        onClick={handleApply}
                        disabled={!cvFile || uploading}
                        className="w-full"
                      >
                        {uploading ? '...' : t('submit')}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {!user && (
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground">
                    {t('loginToApply')}
                  </p>
                  <div className="flex gap-2">
                    <Button asChild>
                      <Link to="/login/user">{t('login')}</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to="/register/user">{t('register')}</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

