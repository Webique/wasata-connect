import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Plus, Users, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function CompanyDashboard() {
  const { t } = useTranslation();
  const { user, company, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [applicantsDialogOpen, setApplicantsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    workingHours: '',
    qualification: '',
    skills: '',
    minSalary: '',
    healthInsurance: false,
  });

  useEffect(() => {
    if (company) {
      loadJobs();
    }
  }, [company]);

  const loadJobs = async () => {
    try {
      const jobsData = await api.getCompanyJobs();
      setJobs(jobsData);
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

  const loadApplicants = async (jobId: string) => {
    try {
      const applicantsData = await api.getJobApplicants(jobId);
      setApplicants(applicantsData);
      setSelectedJob(jobId);
      setApplicantsDialogOpen(true);
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || t('somethingWentWrong'),
        variant: 'destructive',
      });
    }
  };

  const handleCreateJob = async () => {
    try {
      await api.createJob({
        title: formData.title,
        workingHours: formData.workingHours,
        qualification: formData.qualification,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        minSalary: Number(formData.minSalary),
        healthInsurance: formData.healthInsurance,
      });
      toast({
        title: t('save'),
        description: 'Job created successfully',
      });
      setJobDialogOpen(false);
      setFormData({
        title: '',
        workingHours: '',
        qualification: '',
        skills: '',
        minSalary: '',
        healthInsurance: false,
      });
      loadJobs();
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || t('somethingWentWrong'),
        variant: 'destructive',
      });
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      await api.deleteJob(jobId);
      toast({
        title: t('delete'),
        description: 'Job deleted successfully',
      });
      loadJobs();
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || t('somethingWentWrong'),
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'approved') {
      return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3" /> {t('approved')}</Badge>;
    }
    if (status === 'rejected') {
      return <Badge variant="destructive"><XCircle className="h-3 w-3" /> {t('rejected')}</Badge>;
    }
    return <Badge><AlertCircle className="h-3 w-3" /> {t('pending')}</Badge>;
  };

  if (!company) {
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

  const isApproved = company.approvalStatus === 'approved';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
              <p className="text-muted-foreground">{company.name}</p>
            </div>
            <div className="flex items-center gap-4">
              {getStatusBadge(company.approvalStatus)}
              <Button onClick={logout} variant="outline">
                {t('logout')}
              </Button>
            </div>
          </div>

          {!isApproved && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {company.approvalStatus === 'pending'
                  ? t('companyPendingMessage')
                  : t('companyRejectedMessage')}
              </AlertDescription>
            </Alert>
          )}

          {isApproved && (
            <Tabs defaultValue="jobs" className="w-full">
              <TabsList>
                <TabsTrigger value="jobs">{t('myJobs')}</TabsTrigger>
              </TabsList>

              <TabsContent value="jobs" className="flex flex-col gap-4">
                <Dialog open={jobDialogOpen} onOpenChange={setJobDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4" /> {t('addNewJob')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{t('addNewJob')}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <Label>{t('jobTitle')}</Label>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>{t('workingHours')}</Label>
                        <Input
                          value={formData.workingHours}
                          onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>{t('qualification')}</Label>
                        <Textarea
                          value={formData.qualification}
                          onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>{t('skills')} (comma-separated)</Label>
                        <Input
                          value={formData.skills}
                          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>{t('minSalary')}</Label>
                        <Input
                          type="number"
                          value={formData.minSalary}
                          onChange={(e) => setFormData({ ...formData, minSalary: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="healthInsurance"
                          checked={formData.healthInsurance}
                          onChange={(e) => setFormData({ ...formData, healthInsurance: e.target.checked })}
                        />
                        <Label htmlFor="healthInsurance">{t('healthInsurance')}</Label>
                      </div>
                      <Button onClick={handleCreateJob}>{t('save')}</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {jobs.map((job) => (
                    <Card key={job._id}>
                      <CardHeader>
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription>
                          {job.minSalary} ر.س - {job.healthInsurance ? t('yes') : t('no')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          onClick={() => loadApplicants(job._id)}
                        >
                          <Users className="h-4 w-4" /> {t('viewApplicants')}
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteJob(job._id)}
                        >
                          {t('delete')}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}

          <Dialog open={applicantsDialogOpen} onOpenChange={setApplicantsDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t('applicants')}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                {applicants.map((app) => (
                  <Card key={app._id}>
                    <CardContent className="flex flex-col gap-4 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-2">
                          <h3 className="font-semibold">{app.applicantName}</h3>
                          <p className="text-sm text-muted-foreground">{app.applicantPhone}</p>
                          <p className="text-sm">{t('applicantDisability')}: {app.applicantDisabilityType}</p>
                        </div>
                        <Badge>{t(app.status)}</Badge>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => window.open(app.cvUrl, '_blank')}
                      >
                        {t('downloadCV')}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                {applicants.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    {t('noApplications')}
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      <Footer />
    </div>
  );
}

