import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translateErrorMessage } from '@/lib/errorTranslations';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { DISABILITY_TYPES, isCustomDisabilityType, extractCustomDisabilityText } from '@/constants/disabilityTypes';
import { SAUDI_CITIES } from '@/constants/saudiCities';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Briefcase, 
  Plus, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  LogOut,
  Building2,
  TrendingUp,
  FileText,
  DollarSign,
  Clock,
  Shield,
  Trash2,
  Download,
  Eye,
  ArrowRight,
  Edit,
  AlertCircle
} from 'lucide-react';

export default function CompanyDashboard() {
  const { t } = useTranslation();
  const { dir } = useLanguage();
  const { user, company, logout } = useAuth();
  
  // Ensure dir is always defined to prevent minification issues
  const currentDir = dir || 'rtl';
  const navigate = useNavigate();
  const { toast } = useToast();

  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [allApplicants, setAllApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [applicantsDialogOpen, setApplicantsDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    workingHours: '',
    qualification: '',
    skills: '',
    minSalary: '',
    healthInsurance: false,
    natureOfWork: '',
    location: '',
    disabilityTypes: [] as string[],
  });
  const [customDisabilityText, setCustomDisabilityText] = useState('');
  
  const isOtherSelected = formData.disabilityTypes.includes('أخرى') || 
    formData.disabilityTypes.some(dt => isCustomDisabilityType(dt));

  useEffect(() => {
    if (company) {
      loadJobs();
    }
  }, [company]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const jobsData = await api.getCompanyJobs();
      setJobs(jobsData);
      
      // Load all applicants for all jobs to calculate stats (only if company is approved)
      if (company?.approvalStatus === 'approved') {
        const allApplicantsData: any[] = [];
        for (const job of jobsData) {
          try {
            const jobApplicants = await api.getJobApplicants(job._id);
            allApplicantsData.push(...jobApplicants);
          } catch (error) {
            // Skip if error loading applicants for a job
            console.error(`Failed to load applicants for job ${job._id}:`, error);
          }
        }
        setAllApplicants(allApplicantsData);
      } else {
        setAllApplicants([]);
      }
    } catch (error: any) {
      toast({
        title: t('error'),
        description: translateErrorMessage(error.message, t),
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
        description: translateErrorMessage(error.message, t),
        variant: 'destructive',
      });
    }
  };


  const handleCreateJob = async () => {
    if (formData.disabilityTypes.length === 0) {
      toast({
        title: t('error'),
        description: t('selectDisabilityTypes'),
        variant: 'destructive',
      });
      return;
    }
    
    // If "Other" is selected, require custom text
    if (isOtherSelected && !customDisabilityText.trim()) {
      toast({
        title: t('error'),
        description: currentDir === 'rtl' ? 'يرجى تحديد نوع الإعاقة' : 'Please specify the disability type',
        variant: 'destructive',
      });
      return;
    }
    if (!formData.natureOfWork) {
      toast({
        title: t('error'),
        description: t('selectNatureOfWork'),
        variant: 'destructive',
      });
      return;
    }
    if (!formData.location) {
      toast({
        title: t('error'),
        description: t('pleaseSelectJobLocation'),
        variant: 'destructive',
      });
      return;
    }
    try {
      // Format disability types: if "Other" is selected, replace it with custom text
      const formattedDisabilityTypes = formData.disabilityTypes.map(dt => {
        if (dt === 'أخرى' || isCustomDisabilityType(dt)) {
          return `أخرى - ${customDisabilityText.trim()}`;
        }
        return dt;
      });
      
      if (editingJob) {
        // Update existing job
        await api.updateJob(editingJob._id, {
          title: formData.title,
          workingHours: formData.workingHours,
          qualification: formData.qualification,
          skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
          minSalary: Number(formData.minSalary),
          healthInsurance: formData.healthInsurance,
          natureOfWork: formData.natureOfWork,
          location: formData.location,
          disabilityTypes: formattedDisabilityTypes,
        });
        toast({
          title: t('save'),
          description: t('jobUpdatedSuccess'),
        });
      } else {
        // Create new job
        await api.createJob({
          title: formData.title,
          workingHours: formData.workingHours,
          qualification: formData.qualification,
          skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
          minSalary: Number(formData.minSalary),
          healthInsurance: formData.healthInsurance,
          natureOfWork: formData.natureOfWork,
          location: formData.location,
          disabilityTypes: formattedDisabilityTypes,
        });
        toast({
          title: t('save'),
          description: t('jobCreatedSuccess'),
        });
      }
      setJobDialogOpen(false);
      setFormData({
        title: '',
        workingHours: '',
        qualification: '',
        skills: '',
        minSalary: '',
        healthInsurance: false,
        natureOfWork: '',
        location: '',
        disabilityTypes: [],
      });
      setCustomDisabilityText('');
      setEditingJob(null);
      loadJobs();
    } catch (error: any) {
      toast({
        title: t('error'),
        description: translateErrorMessage(error.message, t),
        variant: 'destructive',
      });
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm(t('confirmDelete'))) return;
    try {
      await api.deleteJob(jobId);
      toast({
        title: t('delete'),
        description: t('deleteSuccess'),
      });
      loadJobs();
    } catch (error: any) {
      toast({
        title: t('error'),
        description: translateErrorMessage(error.message, t),
        variant: 'destructive',
      });
    }
  };

  const handleToggleJobStatus = async (jobId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'closed' : 'active';
      await api.updateJob(jobId, { status: newStatus });
      toast({
        title: t('save'),
        description: currentDir === 'rtl' 
          ? `تم تغيير حالة الوظيفة إلى ${newStatus === 'active' ? 'نشط' : 'مغلق'}`
          : `Job status changed to ${newStatus === 'active' ? 'Active' : 'Closed'}`,
      });
      loadJobs();
    } catch (error: any) {
      toast({
        title: t('error'),
        description: translateErrorMessage(error.message, t),
        variant: 'destructive',
      });
    }
  };

  const handleUpdateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      await api.updateApplicationStatus(applicationId, newStatus);
      toast({
        title: t('save'),
        description: currentDir === 'rtl' ? 'تم تحديث حالة المتقدم بنجاح' : 'Application status updated successfully',
      });
      // Reload applicants for the current job
      if (selectedJob) {
        await loadApplicants(selectedJob);
      }
      // Reload all jobs to update stats
      await loadJobs();
    } catch (error: any) {
      toast({
        title: t('error'),
        description: translateErrorMessage(error.message, t),
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'approved') {
      return (
        <Badge className="bg-green-500 flex items-center gap-2">
          <CheckCircle className="h-3 w-3" /> {t('approved')}
        </Badge>
      );
    }
    if (status === 'rejected') {
      return (
        <Badge variant="destructive" className="flex items-center gap-2">
          <XCircle className="h-3 w-3" /> {t('rejected')}
        </Badge>
      );
    }
    return (
      <Badge className="flex items-center gap-2">
        <AlertCircle className="h-3 w-3" /> {t('pending')}
      </Badge>
    );
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
  
  // Split jobs into pending, active, and rejected
  const pendingJobs = jobs.filter(j => j.approvalStatus === 'pending');
  const activeApprovedJobs = jobs.filter(j => j.approvalStatus === 'approved');
  const rejectedJobs = jobs.filter(j => j.approvalStatus === 'rejected');
  const currentlyActiveJobs = jobs.filter(j => j.status === 'active' && j.approvalStatus === 'approved').length;
  
  // Calculate applicant stats
  const totalApplicants = allApplicants.length;
  const pendingApplicants = allApplicants.filter(a => a.status === 'submitted' || a.status === 'reviewed').length;
  const shortlistedApplicants = allApplicants.filter(a => a.status === 'shortlisted').length;

  const stats = {
    totalJobs: jobs.length,
    activeJobs: activeApprovedJobs.length, // All approved jobs (active + closed)
    currentlyActive: currentlyActiveJobs, // Only active approved jobs
    totalApplicants,
    pendingApplicants,
    shortlistedApplicants,
  };

  return (
    <div className="flex flex-col min-h-screen" dir={currentDir}>
      <Navbar />
      <main className="flex-1 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center shadow-lg border-2 border-secondary/20">
                  <Building2 className="h-7 w-7 text-secondary" />
                </div>
                <div className="flex flex-col gap-1">
                  <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
                  <p className="text-muted-foreground">{company.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {getStatusBadge(company.approvalStatus)}
                <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <LogOut className="h-4 w-4" />
                      {t('logout')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-md" dir={currentDir}>
                    <AlertDialogHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center border-2 border-secondary/20">
                          <LogOut className="h-6 w-6 text-secondary" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-bold">
                          {t('confirmLogout')}
                        </AlertDialogTitle>
                      </div>
                      <AlertDialogDescription className="text-base pt-2">
                        {t('logoutMessage')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex gap-3 sm:gap-0" dir={currentDir}>
                      <AlertDialogCancel className="mt-0">
                        {t('cancel')}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          logout();
                          setLogoutDialogOpen(false);
                        }}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                      >
                        {t('logout')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Status Alert */}
            {!isApproved && (
              <Alert className="border-2">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="text-base">
                  {company.approvalStatus === 'pending'
                    ? t('companyPendingMessage')
                    : t('companyRejectedMessage')}
                </AlertDescription>
              </Alert>
            )}

            {/* Stats Cards - Only show if approved */}
            {isApproved && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="border-2 hover:shadow-lg transition-all">
                    <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">{t('totalJobs')}</CardTitle>
                      <Briefcase className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats.totalJobs}</div>
                      <p className="text-xs text-muted-foreground mt-2">{stats.activeJobs} {currentDir === 'rtl' ? 'موافق عليها' : 'Approved'}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 hover:shadow-lg transition-all">
                    <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">{t('activeJobs')}</CardTitle>
                      <TrendingUp className="h-5 w-5 text-secondary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats.currentlyActive}</div>
                      <p className="text-xs text-muted-foreground mt-2">{t('currentlyActive')}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 hover:shadow-lg transition-all">
                    <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">{t('totalApplicants')}</CardTitle>
                      <Users className="h-5 w-5 text-accent" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats.totalApplicants}</div>
                      <p className="text-xs text-muted-foreground mt-2">{t('allApplications')}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 hover:shadow-lg transition-all">
                    <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">{t('companyName')}</CardTitle>
                      <Building2 className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm font-bold truncate">{company.name}</div>
                      <p className="text-xs text-muted-foreground mt-2">{t('verified')}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Jobs Section */}
                <Card className="border-2">
                  <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <CardTitle className="text-2xl">{t('myJobs')}</CardTitle>
                      <CardDescription>{jobs.length} {t('jobs')}</CardDescription>
                    </div>
                    <Dialog open={jobDialogOpen} onOpenChange={(open) => {
                      setJobDialogOpen(open);
                      if (!open) {
                        setEditingJob(null);
                        setCustomDisabilityText('');
                        setFormData({
                          title: '',
                          workingHours: '',
                          qualification: '',
                          skills: '',
                          minSalary: '',
                          healthInsurance: false,
                          natureOfWork: '',
                          location: '',
                          disabilityTypes: [],
                        });
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg">
                          <Plus className="h-5 w-5" /> {t('addNewJob')}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl">
                            {editingJob ? (currentDir === 'rtl' ? 'تعديل الوظيفة' : 'Edit Job') : t('addNewJob')}
                          </DialogTitle>
                          <DialogDescription>
                            {editingJob ? (currentDir === 'rtl' ? 'قم بتعديل تفاصيل الوظيفة' : 'Update job details') : t('fillJobDetails')}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-6">
                          <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium">{t('jobTitle')}</Label>
                            <Input
                              value={formData.title}
                              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                              className="h-12"
                              placeholder={t('jobTitle')}
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium">{t('workingHours')}</Label>
                            <Input
                              value={formData.workingHours}
                              onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                              className="h-12"
                              placeholder="8 ساعات يومياً"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium">{t('qualification')}</Label>
                            <Textarea
                              value={formData.qualification}
                              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                              rows={3}
                              placeholder={t('qualification')}
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium">{t('skills')} ({t('commaSeparated')})</Label>
                            <Input
                              value={formData.skills}
                              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                              className="h-12"
                              placeholder="مهارات التواصل, العمل الجماعي"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium">{t('minSalary')} (ر.س)</Label>
                            <Input
                              type="number"
                              value={formData.minSalary}
                              onChange={(e) => setFormData({ ...formData, minSalary: e.target.value })}
                              className="h-12"
                              placeholder="5000"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium">{t('natureOfWork')} <span className="text-destructive">*</span></Label>
                            <Select value={formData.natureOfWork} onValueChange={(value) => setFormData({ ...formData, natureOfWork: value })}>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder={t('natureOfWorkPlaceholder')} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="full-time">{t('fullTime')}</SelectItem>
                                <SelectItem value="flexible-hours">{t('flexibleHours')}</SelectItem>
                                <SelectItem value="remote-work">{t('remoteWork')}</SelectItem>
                                <SelectItem value="part-time">{t('partTime')}</SelectItem>
                                <SelectItem value="social-investment">{t('socialInvestment')}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium">{currentDir === 'rtl' ? 'الموقع' : 'Location'} <span className="text-destructive">*</span></Label>
                            <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder={currentDir === 'rtl' ? 'اختر الموقع' : 'Select location'} />
                              </SelectTrigger>
                              <SelectContent>
                                {SAUDI_CITIES.map((city) => (
                                  <SelectItem key={city.value} value={city.value}>
                                    {currentDir === 'rtl' ? city.labelAr : city.labelEn}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium">{t('targetDisabilityTypes')} <span className="text-destructive">*</span></Label>
                            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto p-3 border rounded-lg bg-muted/30">
                              {DISABILITY_TYPES.map((type) => (
                                <div key={type.value} className="flex items-start gap-2">
                                  <input
                                    type="checkbox"
                                    id={`disability-${type.value}`}
                                    checked={formData.disabilityTypes.includes(type.value) || 
                                      (type.value === 'أخرى' && formData.disabilityTypes.some(dt => isCustomDisabilityType(dt)))}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setFormData({
                                          ...formData,
                                          disabilityTypes: [...formData.disabilityTypes.filter(t => t !== 'أخرى' && !isCustomDisabilityType(t)), type.value],
                                        });
                                        if (type.value === 'أخرى') {
                                          // If there's existing custom text from editing, keep it
                                          if (!customDisabilityText) {
                                            setCustomDisabilityText('');
                                          }
                                        }
                                      } else {
                                        setFormData({
                                          ...formData,
                                          disabilityTypes: formData.disabilityTypes.filter((t) => 
                                            t !== type.value && !isCustomDisabilityType(t)
                                          ),
                                        });
                                        if (type.value === 'أخرى') {
                                          setCustomDisabilityText('');
                                        }
                                      }
                                    }}
                                    className="w-4 h-4 mt-1"
                                  />
                                  <Label htmlFor={`disability-${type.value}`} className="text-sm cursor-pointer flex-1">
                                    <div className="flex flex-col">
                                      <span className="font-medium">{currentDir === 'rtl' ? type.labelAr : type.labelEn}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {currentDir === 'rtl' ? type.descriptionAr : type.descriptionEn}
                                      </span>
                                    </div>
                                  </Label>
                                </div>
                              ))}
                            </div>
                            {isOtherSelected && (
                              <div className="flex flex-col gap-2 mt-2">
                                <Label htmlFor="customDisabilityText" className="text-sm">
                                  {currentDir === 'rtl' ? 'يرجى تحديد نوع الإعاقة' : 'Please specify the disability type'} <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                  id="customDisabilityText"
                                  type="text"
                                  value={customDisabilityText}
                                  onChange={(e) => setCustomDisabilityText(e.target.value)}
                                  placeholder={currentDir === 'rtl' ? 'اكتب نوع الإعاقة' : 'Enter disability type'}
                                  required={isOtherSelected}
                                  className="h-12"
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border">
                            <input
                              type="checkbox"
                              id="healthInsurance"
                              checked={formData.healthInsurance}
                              onChange={(e) => setFormData({ ...formData, healthInsurance: e.target.checked })}
                              className="w-5 h-5"
                            />
                            <Label htmlFor="healthInsurance" className="text-sm cursor-pointer flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              {t('healthInsurance')}
                            </Label>
                          </div>
                          <Button onClick={handleCreateJob} size="lg" className="bg-primary hover:bg-primary/90">
                            {editingJob ? (currentDir === 'rtl' ? 'حفظ التعديلات' : 'Save Changes') : t('save')}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    {jobs.length === 0 ? (
                      <div className="text-center py-16">
                        <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                        <p className="text-lg font-medium text-muted-foreground">{t('noJobs')}</p>
                        <p className="text-sm text-muted-foreground mt-2">{t('createFirstJob')}</p>
                      </div>
                    ) : (
                      <Tabs defaultValue="active" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-6">
                          <TabsTrigger value="active" className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            {currentDir === 'rtl' ? 'الوظائف النشطة' : 'Active Jobs'} ({activeApprovedJobs.length})
                          </TabsTrigger>
                          <TabsTrigger value="pending" className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {currentDir === 'rtl' ? 'قيد الانتظار' : 'Pending Jobs'} ({pendingJobs.length})
                          </TabsTrigger>
                          <TabsTrigger value="rejected" className="flex items-center gap-2">
                            <XCircle className="h-4 w-4" />
                            {currentDir === 'rtl' ? 'المرفوضة' : 'Rejected Jobs'} ({rejectedJobs.length})
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="active" className="mt-0">
                          {activeApprovedJobs.length === 0 ? (
                            <div className="text-center py-16">
                              <CheckCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                              <p className="text-lg font-medium text-muted-foreground">
                                {currentDir === 'rtl' ? 'لا توجد وظائف نشطة' : 'No active jobs'}
                              </p>
                              <p className="text-sm text-muted-foreground mt-2">
                                {currentDir === 'rtl' ? 'الوظائف الموافق عليها ستظهر هنا' : 'Approved jobs will appear here'}
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {activeApprovedJobs.map((job) => (
                          <Card key={job._id} className="border-2 hover:shadow-xl transition-all">
                            <CardHeader className="flex flex-col gap-3">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                                  <CardDescription className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    {job.minSalary} ر.س
                                  </CardDescription>
                                </div>
                                <div className="flex flex-col gap-2 items-end">
                                  {/* Approval Status Badge */}
                                  <Badge 
                                    variant={
                                      job.approvalStatus === 'approved' ? 'default' :
                                      job.approvalStatus === 'rejected' ? 'destructive' :
                                      'secondary'
                                    }
                                    className="text-xs"
                                  >
                                    {job.approvalStatus === 'approved' 
                                      ? (currentDir === 'rtl' ? 'موافق عليه' : 'Approved')
                                      : job.approvalStatus === 'rejected'
                                      ? (currentDir === 'rtl' ? 'مرفوض' : 'Declined')
                                      : (currentDir === 'rtl' ? 'قيد الانتظار' : 'Pending')
                                    }
                                  </Badge>
                                  {/* Job Status Badge - Only show if approved */}
                                  {job.approvalStatus === 'approved' && (
                                    <Badge 
                                      variant={job.status === 'active' ? 'default' : 'secondary'}
                                      className="text-xs"
                                    >
                                      {job.status === 'active' 
                                        ? (currentDir === 'rtl' ? 'نشط' : 'Active')
                                        : (currentDir === 'rtl' ? 'مغلق' : 'Closed')
                                      }
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                              <div className="flex flex-col gap-2 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  <span>{job.workingHours}</span>
                                </div>
                                {job.natureOfWork && (
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Briefcase className="h-4 w-4" />
                                    <span className="font-medium text-foreground">
                                      {job.natureOfWork === 'full-time' ? t('fullTime') :
                                       job.natureOfWork === 'flexible-hours' ? t('flexibleHours') :
                                       job.natureOfWork === 'remote-work' ? t('remoteWork') :
                                       job.natureOfWork === 'part-time' ? t('partTime') :
                                       job.natureOfWork === 'social-investment' ? t('socialInvestment') :
                                       job.natureOfWork}
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Shield className="h-4 w-4" />
                                  <span>{t('healthInsurance')}: {job.healthInsurance ? t('yes') : t('no')}</span>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 pt-4 border-t">
                                {/* Toggle Job Status - Only for approved jobs */}
                                {job.approvalStatus === 'approved' && (
                                  <Button
                                    variant={job.status === 'active' ? 'secondary' : 'outline'}
                                    size="sm"
                                    onClick={() => handleToggleJobStatus(job._id, job.status)}
                                    className="w-full"
                                  >
                                    {job.status === 'active' 
                                      ? (currentDir === 'rtl' ? 'إغلاق الوظيفة' : 'Close Job')
                                      : (currentDir === 'rtl' ? 'تفعيل الوظيفة' : 'Activate Job')
                                    }
                                  </Button>
                                )}
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => loadApplicants(job._id)}
                                    className="flex-1 flex items-center gap-2"
                                  >
                                    <Users className="h-4 w-4" />
                                    {t('viewApplicants')}
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleDeleteJob(job._id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                              ))}
                            </div>
                          )}
                        </TabsContent>
                        
                        <TabsContent value="pending" className="mt-0">
                          {pendingJobs.length === 0 ? (
                            <div className="text-center py-16">
                              <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                              <p className="text-lg font-medium text-muted-foreground">
                                {currentDir === 'rtl' ? 'لا توجد وظائف قيد الانتظار' : 'No pending jobs'}
                              </p>
                              <p className="text-sm text-muted-foreground mt-2">
                                {currentDir === 'rtl' ? 'الوظائف المعلقة ستظهر هنا' : 'Pending jobs will appear here'}
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {pendingJobs.map((job) => (
                                <Card key={job._id} className="border-2 hover:shadow-xl transition-all">
                                  <CardHeader className="flex flex-col gap-3">
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex-1">
                                        <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                                        <CardDescription className="flex items-center gap-2">
                                          <DollarSign className="h-4 w-4" />
                                          {job.minSalary} ر.س
                                        </CardDescription>
                                      </div>
                                      <div className="flex flex-col gap-2 items-end">
                                        {/* Approval Status Badge */}
                                        <Badge 
                                          variant={
                                            job.approvalStatus === 'approved' ? 'default' :
                                            job.approvalStatus === 'rejected' ? 'destructive' :
                                            'secondary'
                                          }
                                          className="text-xs"
                                        >
                                          {job.approvalStatus === 'approved' 
                                            ? (currentDir === 'rtl' ? 'موافق عليه' : 'Approved')
                                            : job.approvalStatus === 'rejected'
                                            ? (currentDir === 'rtl' ? 'مرفوض' : 'Declined')
                                            : (currentDir === 'rtl' ? 'قيد الانتظار' : 'Pending')
                                          }
                                        </Badge>
                                      </div>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2 text-sm">
                                      <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>{job.workingHours}</span>
                                      </div>
                                      {job.natureOfWork && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                          <Briefcase className="h-4 w-4" />
                                          <span className="font-medium text-foreground">
                                            {job.natureOfWork === 'full-time' ? t('fullTime') :
                                             job.natureOfWork === 'flexible-hours' ? t('flexibleHours') :
                                             job.natureOfWork === 'remote-work' ? t('remoteWork') :
                                             job.natureOfWork === 'part-time' ? t('partTime') :
                                             job.natureOfWork === 'social-investment' ? t('socialInvestment') :
                                             job.natureOfWork}
                                          </span>
                                        </div>
                                      )}
                                      <div className="flex items-center gap-2 text-muted-foreground">
                                        <Shield className="h-4 w-4" />
                                        <span>{t('healthInsurance')}: {job.healthInsurance ? t('yes') : t('no')}</span>
                                      </div>
                                    </div>
                                    <div className="flex gap-2 pt-4 border-t">
                                      <Button
                                        variant="outline"
                                        onClick={() => loadApplicants(job._id)}
                                        className="flex-1 flex items-center gap-2"
                                      >
                                        <Users className="h-4 w-4" />
                                        {t('viewApplicants')}
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleDeleteJob(job._id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </TabsContent>
                        
                        <TabsContent value="rejected" className="mt-0">
                          {rejectedJobs.length === 0 ? (
                            <div className="text-center py-16">
                              <XCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                              <p className="text-lg font-medium text-muted-foreground">
                                {currentDir === 'rtl' ? 'لا توجد وظائف مرفوضة' : 'No rejected jobs'}
                              </p>
                              <p className="text-sm text-muted-foreground mt-2">
                                {currentDir === 'rtl' ? 'الوظائف المرفوضة ستظهر هنا' : 'Rejected jobs will appear here'}
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {rejectedJobs.map((job) => (
                                <Card key={job._id} className="border-2 border-destructive/20 hover:shadow-xl transition-all">
                                  <CardHeader className="flex flex-col gap-3">
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex-1">
                                        <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                                        <CardDescription className="flex items-center gap-2">
                                          <DollarSign className="h-4 w-4" />
                                          {job.minSalary} ر.س
                                        </CardDescription>
                                      </div>
                                      <Badge variant="destructive" className="text-xs">
                                        {currentDir === 'rtl' ? 'مرفوض' : 'Rejected'}
                                      </Badge>
                                    </div>
                                    {job.rejectionReason && (
                                      <Alert className="bg-destructive/10 border-destructive/20">
                                        <AlertCircle className="h-4 w-4 text-destructive" />
                                        <AlertDescription className="text-sm">
                                          <div className="flex flex-col gap-1">
                                            <span className="font-semibold text-destructive">
                                              {currentDir === 'rtl' ? 'سبب الرفض:' : 'Rejection Reason:'}
                                            </span>
                                            <span>{job.rejectionReason}</span>
                                          </div>
                                        </AlertDescription>
                                      </Alert>
                                    )}
                                  </CardHeader>
                                  <CardContent className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2 text-sm">
                                      <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>{job.workingHours}</span>
                                      </div>
                                      {job.natureOfWork && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                          <Briefcase className="h-4 w-4" />
                                          <span className="font-medium text-foreground">
                                            {job.natureOfWork === 'full-time' ? t('fullTime') :
                                             job.natureOfWork === 'flexible-hours' ? t('flexibleHours') :
                                             job.natureOfWork === 'remote-work' ? t('remoteWork') :
                                             job.natureOfWork === 'part-time' ? t('partTime') :
                                             job.natureOfWork === 'social-investment' ? t('socialInvestment') :
                                             job.natureOfWork}
                                          </span>
                                        </div>
                                      )}
                                      <div className="flex items-center gap-2 text-muted-foreground">
                                        <Shield className="h-4 w-4" />
                                        <span>{t('healthInsurance')}: {job.healthInsurance ? t('yes') : t('no')}</span>
                                      </div>
                                    </div>
                                    <div className="flex gap-2 pt-4 border-t">
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          setEditingJob(job);
                                          const disabilityTypes = job.disabilityTypes || [];
                                          // Extract custom text if "Other" is present
                                          let customText = '';
                                          const hasOther = disabilityTypes.some((dt: string) => 
                                            dt === 'أخرى' || isCustomDisabilityType(dt)
                                          );
                                          if (hasOther) {
                                            const otherType = disabilityTypes.find((dt: string) => 
                                              dt === 'أخرى' || isCustomDisabilityType(dt)
                                            );
                                            if (otherType && isCustomDisabilityType(otherType)) {
                                              customText = extractCustomDisabilityText(otherType);
                                            }
                                            // Replace custom "Other" with just "أخرى" in the array for checkbox state
                                            const normalizedTypes = disabilityTypes.map((dt: string) => 
                                              isCustomDisabilityType(dt) ? 'أخرى' : dt
                                            );
                                            setFormData({
                                              title: job.title,
                                              workingHours: job.workingHours,
                                              qualification: job.qualification,
                                              skills: job.skills?.join(', ') || '',
                                              minSalary: job.minSalary.toString(),
                                              healthInsurance: job.healthInsurance,
                                              natureOfWork: job.natureOfWork,
                                              location: job.location,
                                              disabilityTypes: normalizedTypes,
                                            });
                                          } else {
                                            setFormData({
                                              title: job.title,
                                              workingHours: job.workingHours,
                                              qualification: job.qualification,
                                              skills: job.skills?.join(', ') || '',
                                              minSalary: job.minSalary.toString(),
                                              healthInsurance: job.healthInsurance,
                                              natureOfWork: job.natureOfWork,
                                              location: job.location,
                                              disabilityTypes: disabilityTypes,
                                            });
                                          }
                                          setCustomDisabilityText(customText);
                                          setJobDialogOpen(true);
                                        }}
                                        className="flex-1 flex items-center gap-2"
                                      >
                                        <Edit className="h-4 w-4" />
                                        {currentDir === 'rtl' ? 'تعديل' : 'Edit'}
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleDeleteJob(job._id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {/* Applicants Dialog */}
            <Dialog open={applicantsDialogOpen} onOpenChange={setApplicantsDialogOpen}>
              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">{t('applicants')}</DialogTitle>
                  <DialogDescription>{applicants.length} {t('applicants')}</DialogDescription>
                </DialogHeader>
                {applicants.length === 0 ? (
                  <div className="text-center py-16">
                    <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <p className="text-lg font-medium text-muted-foreground">{t('noApplications')}</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('applicantName')}</TableHead>
                          <TableHead>{t('phoneNumber')}</TableHead>
                          <TableHead>{t('applicantDisability')}</TableHead>
                          <TableHead>{t('status')}</TableHead>
                          <TableHead className="text-end">{t('actions')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {applicants.map((app) => (
                          <TableRow key={app._id}>
                            <TableCell className="font-medium">{app.applicantName}</TableCell>
                            <TableCell>{app.applicantPhone}</TableCell>
                            <TableCell>{app.applicantDisabilityType}</TableCell>
                            <TableCell>
                              <Select
                                value={app.status}
                                onValueChange={(value) => handleUpdateApplicationStatus(app._id, value)}
                              >
                                <SelectTrigger className="w-[180px] h-9">
                                  <SelectValue>
                                    <Badge 
                                      variant={
                                        app.status === 'submitted' ? 'secondary' :
                                        app.status === 'reviewed' ? 'default' :
                                        app.status === 'shortlisted' ? 'default' :
                                        app.status === 'rejected' ? 'destructive' : 'secondary'
                                      }
                                      className="text-xs"
                                    >
                                      {t(app.status)}
                                    </Badge>
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="submitted">
                                    <div className="flex flex-col">
                                      <span>{t('submitted')}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {currentDir === 'rtl' ? 'جديد - يحتاج مراجعة' : 'New - Needs Review'}
                                      </span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="reviewed">
                                    <div className="flex flex-col">
                                      <span>{t('reviewed')}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {currentDir === 'rtl' ? 'قيد المراجعة' : 'Under Review'}
                                      </span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="shortlisted">
                                    <div className="flex flex-col">
                                      <span>{t('shortlisted')}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {currentDir === 'rtl' ? 'مقبول ومختار' : 'Accepted & Selected'}
                                      </span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="rejected">
                                    <div className="flex flex-col">
                                      <span>{t('rejected')}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {currentDir === 'rtl' ? 'تم الرفض' : 'Not Selected'}
                                      </span>
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-end">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(app.cvUrl, '_blank')}
                                  className="flex items-center gap-2"
                                >
                                  <Download className="h-4 w-4" />
                                  {t('cv')}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
