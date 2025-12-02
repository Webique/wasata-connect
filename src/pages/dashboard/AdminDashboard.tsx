import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getDisabilityType, DISABILITY_TYPES } from '@/constants/disabilityTypes';
import { SAUDI_CITIES, getCityLabel } from '@/constants/saudiCities';
import { 
  Building2, 
  Users, 
  Briefcase, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Search,
  LogOut,
  TrendingUp,
  Clock,
  Shield,
  BarChart3,
  Languages
} from 'lucide-react';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { dir, language, toggleLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  // Ensure dir is always defined to prevent minification issues
  const currentDir = dir || 'rtl';

  const [companies, setCompanies] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedJobToReject, setSelectedJobToReject] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  
  // Company filters
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [companyLocationFilter, setCompanyLocationFilter] = useState<string>('all');
  const [companySearch, setCompanySearch] = useState('');
  
  // Job Seeker filters
  const [seekerDisabilityFilter, setSeekerDisabilityFilter] = useState<string>('all');
  const [seekerLocationFilter, setSeekerLocationFilter] = useState<string>('all');
  const [seekerStatusFilter, setSeekerStatusFilter] = useState<string>('all');
  const [seekerSearch, setSeekerSearch] = useState('');
  
  // Employer filters
  const [employerLocationFilter, setEmployerLocationFilter] = useState<string>('all');
  const [employerStatusFilter, setEmployerStatusFilter] = useState<string>('all');
  const [employerSearch, setEmployerSearch] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (companyFilter !== 'all') {
      loadCompanies(companyFilter);
    } else {
      loadCompanies();
    }
  }, [companyFilter]);

  const loadData = async () => {
    try {
      await Promise.all([
        loadCompanies(),
        loadUsers(),
        loadJobs(),
        loadApplications(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadCompanies = async (status?: string) => {
    try {
      const data = await api.getCompanies(status);
      setCompanies(data);
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || t('somethingWentWrong'),
        variant: 'destructive',
      });
    }
  };

  const loadUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || t('somethingWentWrong'),
        variant: 'destructive',
      });
    }
  };

  const loadJobs = async () => {
    try {
      const data = await api.getAdminJobs();
      setJobs(data);
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || t('somethingWentWrong'),
        variant: 'destructive',
      });
    }
  };

  const loadApplications = async () => {
    try {
      const data = await api.getAdminApplications();
      setApplications(data);
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || t('somethingWentWrong'),
        variant: 'destructive',
      });
    }
  };

  const handleApproveCompany = async (id: string) => {
    try {
      await api.approveCompany(id);
      toast({
        title: t('approve'),
        description: t('approveSuccess'),
      });
      loadCompanies(companyFilter);
      loadData();
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || t('somethingWentWrong'),
        variant: 'destructive',
      });
    }
  };

  const handleApproveJob = async (id: string) => {
    try {
      await api.approveJob(id);
      toast({
        title: t('approve'),
        description: t('jobApprovedSuccess'),
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

  const handleRejectJob = (id: string) => {
    setSelectedJobToReject(id);
    setRejectionReason('');
    setRejectDialogOpen(true);
  };

  const handleConfirmRejectJob = async () => {
    if (!selectedJobToReject) return;
    if (!rejectionReason.trim()) {
      toast({
        title: t('error'),
        description: currentDir === 'rtl' ? 'يرجى إدخال سبب الرفض' : 'Please enter rejection reason',
        variant: 'destructive',
      });
      return;
    }
    try {
      await api.rejectJob(selectedJobToReject, rejectionReason);
      toast({
        title: t('reject'),
        description: t('jobRejectedSuccess'),
      });
      setRejectDialogOpen(false);
      setSelectedJobToReject(null);
      setRejectionReason('');
      loadJobs();
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || t('somethingWentWrong'),
        variant: 'destructive',
      });
    }
  };

  const handleRejectCompany = async (id: string) => {
    try {
      await api.rejectCompany(id);
      toast({
        title: t('reject'),
        description: t('rejectSuccess'),
      });
      loadCompanies(companyFilter);
      loadData();
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || t('somethingWentWrong'),
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return;
    try {
      await api.deleteUser(id);
      toast({
        title: t('delete'),
        description: t('deleteSuccess'),
      });
      loadUsers();
      loadData();
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || t('somethingWentWrong'),
        variant: 'destructive',
      });
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return;
    try {
      await api.deleteJobAdmin(id);
      toast({
        title: t('delete'),
        description: t('deleteSuccess'),
      });
      loadJobs();
      loadData();
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || t('somethingWentWrong'),
        variant: 'destructive',
      });
    }
  };

  // Separate job seekers and employers
  const jobSeekers = users.filter(u => u.role === 'user');
  const employers = users.filter(u => u.role === 'company');
  
  // Filter job seekers
  const filteredJobSeekers = jobSeekers.filter((seeker) => {
    // Search filter
    if (seekerSearch && !(
      seeker.name?.toLowerCase().includes(seekerSearch.toLowerCase()) ||
      seeker.phone?.includes(seekerSearch) ||
      seeker.email?.toLowerCase().includes(seekerSearch.toLowerCase())
    )) return false;
    
    // Disability type filter
    if (seekerDisabilityFilter !== 'all' && seeker.disabilityType !== seekerDisabilityFilter) return false;
    
    // Location filter
    if (seekerLocationFilter !== 'all' && seeker.location !== seekerLocationFilter) return false;
    
    // Status filter
    if (seekerStatusFilter !== 'all' && seeker.status !== seekerStatusFilter) return false;
    
    return true;
  });
  
  // Filter employers
  const filteredEmployers = employers.filter((employer) => {
    // Search filter
    if (employerSearch && !(
      employer.name?.toLowerCase().includes(employerSearch.toLowerCase()) ||
      employer.phone?.includes(employerSearch) ||
      employer.email?.toLowerCase().includes(employerSearch.toLowerCase())
    )) return false;
    
    // Location filter
    if (employerLocationFilter !== 'all' && employer.location !== employerLocationFilter) return false;
    
    // Status filter
    if (employerStatusFilter !== 'all' && employer.status !== employerStatusFilter) return false;
    
    return true;
  });
  
  // Filter companies
  const filteredCompanies = companies.filter((company) => {
    // Search filter
    if (companySearch && !(
      company.name?.toLowerCase().includes(companySearch.toLowerCase()) ||
      company.email?.toLowerCase().includes(companySearch.toLowerCase()) ||
      company.phone?.includes(companySearch) ||
      company.crNumber?.includes(companySearch)
    )) return false;
    
    // Approval status filter
    if (companyFilter !== 'all' && company.approvalStatus !== companyFilter) return false;
    
    // Location filter - need to get location from owner user
    if (companyLocationFilter !== 'all') {
      const owner = employers.find(e => e._id === company.ownerUserId?._id || e._id === company.ownerUserId);
      if (!owner || owner.location !== companyLocationFilter) return false;
    }
    
    return true;
  });

  // Split jobs into pending and reviewed (approved/rejected)
  const pendingJobs = jobs.filter(j => j.approvalStatus === 'pending');
  const reviewedJobs = jobs.filter(j => j.approvalStatus === 'approved' || j.approvalStatus === 'rejected');

  const stats = {
    totalCompanies: companies.length,
    totalJobSeekers: jobSeekers.length,
    totalEmployers: employers.length,
    totalJobs: jobs.length,
    totalApplications: applications.length,
    pendingCompanies: companies.filter(c => c.approvalStatus === 'pending').length,
    approvedCompanies: companies.filter(c => c.approvalStatus === 'approved').length,
    activeJobs: jobs.filter(j => j.status === 'active').length,
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-muted/20 to-background" dir={currentDir}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">{t('adminDashboard')}</h1>
                <p className="text-sm text-muted-foreground">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="lg"
                onClick={toggleLanguage}
                aria-label={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
                className="h-12 w-12"
              >
                <Languages className="h-5 w-5" />
              </Button>
              <Button onClick={logout} variant="outline" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                {t('logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t('totalCompanies')}</CardTitle>
                <Building2 className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="text-3xl font-bold">{stats.totalCompanies}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingCompanies} {t('pending')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{currentDir === 'rtl' ? 'الباحثون عن عمل' : 'Job Seekers'}</CardTitle>
                <Users className="h-5 w-5 text-secondary" />
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="text-3xl font-bold">{stats.totalJobSeekers}</div>
                <p className="text-xs text-muted-foreground">
                  {currentDir === 'rtl' ? 'إجمالي الباحثين' : 'Total Seekers'}
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{currentDir === 'rtl' ? 'أصحاب العمل' : 'Employers'}</CardTitle>
                <Building2 className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="text-3xl font-bold">{stats.totalEmployers}</div>
                <p className="text-xs text-muted-foreground">
                  {currentDir === 'rtl' ? 'إجمالي أصحاب العمل' : 'Total Employers'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t('totalJobs')}</CardTitle>
                <Briefcase className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="text-3xl font-bold">{stats.totalJobs}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeJobs} {t('active')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t('totalApplications')}</CardTitle>
                <FileText className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="text-3xl font-bold">{stats.totalApplications}</div>
                <p className="text-xs text-muted-foreground">
                  {t('recentActivity')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="jobSeekers" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="jobSeekers" className="flex items-center gap-2">
                <Users className="h-4 w-4" /> {currentDir === 'rtl' ? 'الباحثون عن عمل' : 'Job Seekers'}
              </TabsTrigger>
              <TabsTrigger value="employers" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" /> {currentDir === 'rtl' ? 'أصحاب العمل' : 'Employers'}
              </TabsTrigger>
              <TabsTrigger value="companies" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" /> {t('companies')}
              </TabsTrigger>
              <TabsTrigger value="jobs" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> {t('jobs')}
              </TabsTrigger>
              <TabsTrigger value="applications" className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> {t('applications')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="companies" className="flex flex-col gap-6">
              {/* Filters */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg">{currentDir === 'rtl' ? 'الفلاتر' : 'Filters'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm">{currentDir === 'rtl' ? 'البحث' : 'Search'}</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={currentDir === 'rtl' ? 'البحث بالاسم، البريد، الهاتف، السجل...' : 'Search by name, email, phone, CR...'}
                          value={companySearch}
                          onChange={(e) => setCompanySearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm">{t('status')}</Label>
                      <Select value={companyFilter} onValueChange={setCompanyFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder={currentDir === 'rtl' ? 'حالة الموافقة' : 'Approval Status'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('all')}</SelectItem>
                          <SelectItem value="pending">{t('pending')}</SelectItem>
                          <SelectItem value="approved">{t('approved')}</SelectItem>
                          <SelectItem value="rejected">{t('rejected')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm">{currentDir === 'rtl' ? 'الموقع' : 'Location'}</Label>
                      <Select value={companyLocationFilter} onValueChange={setCompanyLocationFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder={currentDir === 'rtl' ? 'جميع المدن' : 'All Cities'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{currentDir === 'rtl' ? 'جميع المدن' : 'All Cities'}</SelectItem>
                          {SAUDI_CITIES.map((city) => (
                            <SelectItem key={city.value} value={city.value}>
                              {currentDir === 'rtl' ? city.labelAr : city.labelEn}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('companies')}</CardTitle>
                  <CardDescription>{filteredCompanies.length} {currentDir === 'rtl' ? 'شركة' : 'companies'} ({companies.length} {currentDir === 'rtl' ? 'إجمالي' : 'total'})</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCompanies.map((company) => {
                      const owner = employers.find(e => e._id === company.ownerUserId?._id || e._id === company.ownerUserId);
                      return (
                  <Card key={company._id} className="border-2 hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-2 flex-1">
                          <CardTitle className="text-lg">{company.name}</CardTitle>
                          <CardDescription>{company.email}</CardDescription>
                        </div>
                        <Badge variant={
                          company.approvalStatus === 'approved' ? 'default' :
                          company.approvalStatus === 'rejected' ? 'destructive' : 'secondary'
                        }>
                          {t(company.approvalStatus)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">{t('crNumber')}:</span>
                          <span className="font-medium">{company.crNumber}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">{t('phoneNumber')}:</span>
                          <span className="font-medium">{company.phone}</span>
                        </div>
                        {owner?.location && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">{currentDir === 'rtl' ? 'الموقع' : 'Location'}:</span>
                            <Badge variant="secondary">
                              {getCityLabel(owner.location, currentDir === 'rtl' ? 'ar' : 'en')}
                            </Badge>
                          </div>
                        )}
                      </div>
                      {company.approvalStatus === 'pending' && (
                        <div className="flex gap-2 pt-2 border-t">
                          <Button
                            size="sm"
                            onClick={() => handleApproveCompany(company._id)}
                            className="flex-1"
                          >
                            <CheckCircle className="h-4 w-4" /> {t('approve')}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectCompany(company._id)}
                            className="flex-1"
                          >
                            <XCircle className="h-4 w-4" /> {t('reject')}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                      );
                    })}
                    {filteredCompanies.length === 0 && (
                      <div className="col-span-full text-center py-12 text-muted-foreground">
                        {t('noData')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Job Seekers Tab */}
            <TabsContent value="jobSeekers" className="flex flex-col gap-6">
              {/* Filters */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg">{currentDir === 'rtl' ? 'الفلاتر' : 'Filters'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm">{currentDir === 'rtl' ? 'البحث' : 'Search'}</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={currentDir === 'rtl' ? 'البحث بالاسم، الهاتف، البريد...' : 'Search by name, phone, email...'}
                          value={seekerSearch}
                          onChange={(e) => setSeekerSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm">{t('disabilityType')}</Label>
                      <Select value={seekerDisabilityFilter} onValueChange={setSeekerDisabilityFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder={currentDir === 'rtl' ? 'جميع الأنواع' : 'All Types'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{currentDir === 'rtl' ? 'جميع الأنواع' : 'All Types'}</SelectItem>
                          {DISABILITY_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {currentDir === 'rtl' ? type.labelAr : type.labelEn}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm">{currentDir === 'rtl' ? 'الموقع' : 'Location'}</Label>
                      <Select value={seekerLocationFilter} onValueChange={setSeekerLocationFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder={currentDir === 'rtl' ? 'جميع المدن' : 'All Cities'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{currentDir === 'rtl' ? 'جميع المدن' : 'All Cities'}</SelectItem>
                          {SAUDI_CITIES.map((city) => (
                            <SelectItem key={city.value} value={city.value}>
                              {currentDir === 'rtl' ? city.labelAr : city.labelEn}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm">{t('status')}</Label>
                      <Select value={seekerStatusFilter} onValueChange={setSeekerStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder={currentDir === 'rtl' ? 'جميع الحالات' : 'All Status'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{currentDir === 'rtl' ? 'جميع الحالات' : 'All Status'}</SelectItem>
                          <SelectItem value="active">{t('active')}</SelectItem>
                          <SelectItem value="disabled">{currentDir === 'rtl' ? 'معطل' : 'Disabled'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{currentDir === 'rtl' ? 'الباحثون عن عمل' : 'Job Seekers'}</CardTitle>
                  <CardDescription>{filteredJobSeekers.length} {currentDir === 'rtl' ? 'باحث' : 'seekers'} ({jobSeekers.length} {currentDir === 'rtl' ? 'إجمالي' : 'total'})</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('name')}</TableHead>
                        <TableHead>{t('phoneNumber')}</TableHead>
                        <TableHead>{t('emailAddress')}</TableHead>
                        <TableHead>{t('disabilityType')}</TableHead>
                        <TableHead>{currentDir === 'rtl' ? 'الموقع' : 'Location'}</TableHead>
                        <TableHead>{t('status')}</TableHead>
                        <TableHead className="text-end">{t('actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredJobSeekers.map((seeker) => (
                        <TableRow key={seeker._id}>
                          <TableCell className="font-medium">{seeker.name}</TableCell>
                          <TableCell>{seeker.phone}</TableCell>
                          <TableCell>{seeker.email || '-'}</TableCell>
                          <TableCell>
                            {seeker.disabilityType ? (
                              <Badge variant="outline">
                                {(() => {
                                  const dt = getDisabilityType(seeker.disabilityType, currentDir === 'rtl' ? 'ar' : 'en');
                                  return dt ? (currentDir === 'rtl' ? dt.labelAr : dt.labelEn) : seeker.disabilityType;
                                })()}
                              </Badge>
                            ) : '-'}
                          </TableCell>
                          <TableCell>
                            {seeker.location ? (
                              <Badge variant="secondary">
                                {getCityLabel(seeker.location, currentDir === 'rtl' ? 'ar' : 'en')}
                              </Badge>
                            ) : '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={seeker.status === 'active' ? 'default' : 'secondary'}>
                              {t(seeker.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-end">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteUser(seeker._id)}
                            >
                              {t('delete')}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredJobSeekers.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      {t('noData')}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Employers Tab */}
            <TabsContent value="employers" className="flex flex-col gap-6">
              {/* Filters */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg">{currentDir === 'rtl' ? 'الفلاتر' : 'Filters'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm">{currentDir === 'rtl' ? 'البحث' : 'Search'}</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={currentDir === 'rtl' ? 'البحث بالاسم، الهاتف، البريد...' : 'Search by name, phone, email...'}
                          value={employerSearch}
                          onChange={(e) => setEmployerSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm">{currentDir === 'rtl' ? 'الموقع' : 'Location'}</Label>
                      <Select value={employerLocationFilter} onValueChange={setEmployerLocationFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder={currentDir === 'rtl' ? 'جميع المدن' : 'All Cities'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{currentDir === 'rtl' ? 'جميع المدن' : 'All Cities'}</SelectItem>
                          {SAUDI_CITIES.map((city) => (
                            <SelectItem key={city.value} value={city.value}>
                              {currentDir === 'rtl' ? city.labelAr : city.labelEn}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm">{t('status')}</Label>
                      <Select value={employerStatusFilter} onValueChange={setEmployerStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder={currentDir === 'rtl' ? 'جميع الحالات' : 'All Status'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{currentDir === 'rtl' ? 'جميع الحالات' : 'All Status'}</SelectItem>
                          <SelectItem value="active">{t('active')}</SelectItem>
                          <SelectItem value="disabled">{currentDir === 'rtl' ? 'معطل' : 'Disabled'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{currentDir === 'rtl' ? 'أصحاب العمل' : 'Employers'}</CardTitle>
                  <CardDescription>{filteredEmployers.length} {currentDir === 'rtl' ? 'صاحب عمل' : 'employers'} ({employers.length} {currentDir === 'rtl' ? 'إجمالي' : 'total'})</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('name')}</TableHead>
                        <TableHead>{t('phoneNumber')}</TableHead>
                        <TableHead>{t('emailAddress')}</TableHead>
                        <TableHead>{currentDir === 'rtl' ? 'الموقع' : 'Location'}</TableHead>
                        <TableHead>{t('status')}</TableHead>
                        <TableHead className="text-end">{t('actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmployers.map((employer) => (
                        <TableRow key={employer._id}>
                          <TableCell className="font-medium">{employer.name}</TableCell>
                          <TableCell>{employer.phone}</TableCell>
                          <TableCell>{employer.email || '-'}</TableCell>
                          <TableCell>
                            {employer.location ? (
                              <Badge variant="secondary">
                                {getCityLabel(employer.location, currentDir === 'rtl' ? 'ar' : 'en')}
                              </Badge>
                            ) : '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={employer.status === 'active' ? 'default' : 'secondary'}>
                              {t(employer.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-end">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteUser(employer._id)}
                            >
                              {t('delete')}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredEmployers.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      {t('noData')}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="jobs" className="flex flex-col gap-6">
              <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="pending" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {currentDir === 'rtl' ? 'قيد المراجعة' : 'Pending Jobs'} ({pendingJobs.length})
                  </TabsTrigger>
                  <TabsTrigger value="reviewed" className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    {currentDir === 'rtl' ? 'تمت المراجعة' : 'Reviewed Jobs'} ({reviewedJobs.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>{currentDir === 'rtl' ? 'الوظائف قيد المراجعة' : 'Pending Jobs'}</CardTitle>
                      <CardDescription>{pendingJobs.length} {currentDir === 'rtl' ? 'وظيفة تحتاج مراجعة' : 'jobs need review'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {pendingJobs.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          {currentDir === 'rtl' ? 'لا توجد وظائف قيد المراجعة' : 'No pending jobs'}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4">
                          {pendingJobs.map((job) => (
                      <Card key={job._id} className="border-2">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex flex-col gap-2 flex-1">
                              <CardTitle className="text-lg">{job.title}</CardTitle>
                              <CardDescription>{job.companyId?.name}</CardDescription>
                            </div>
                            <Badge variant={
                              job.approvalStatus === 'approved' ? 'default' :
                              job.approvalStatus === 'rejected' ? 'destructive' : 'secondary'
                            }>
                              {t(job.approvalStatus || 'pending')}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">{t('workingHours')}:</span>
                              <p className="font-medium">{job.workingHours}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">{t('minSalary')}:</span>
                              <p className="font-medium">{job.minSalary} ر.س</p>
                            </div>
                            <div className="col-span-2">
                              <span className="text-muted-foreground">{t('qualification')}:</span>
                              <p className="font-medium">{job.qualification}</p>
                            </div>
                            <div className="col-span-2">
                              <span className="text-muted-foreground">{t('skills')}:</span>
                              <div className="flex flex-wrap gap-2">
                                {job.skills?.map((skill: string, idx: number) => (
                                  <Badge key={idx} variant="outline">{skill}</Badge>
                                ))}
                              </div>
                            </div>
                            <div className="col-span-2">
                              <span className="text-muted-foreground">{t('targetDisabilityTypes')}:</span>
                              <div className="flex flex-col gap-2">
                                {job.disabilityTypes?.map((type: string, idx: number) => {
                                  const disabilityType = getDisabilityType(type, currentDir === 'rtl' ? 'ar' : 'en');
                                  return (
                                    <div key={idx} className="p-2 bg-muted/50 rounded border">
                                      <div className="flex flex-col gap-1">
                                        <span className="font-medium text-sm">
                                          {disabilityType ? (currentDir === 'rtl' ? disabilityType.labelAr : disabilityType.labelEn) : type}
                                        </span>
                                        {disabilityType && (
                                          <span className="text-xs text-muted-foreground">
                                            {currentDir === 'rtl' ? disabilityType.descriptionAr : disabilityType.descriptionEn}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="col-span-2">
                              <span className="text-muted-foreground">{t('healthInsurance')}:</span>
                              <p className="font-medium">{job.healthInsurance ? t('yes') : t('no')}</p>
                            </div>
                            {job.location && (
                              <div className="col-span-2">
                                <span className="text-muted-foreground">{currentDir === 'rtl' ? 'الموقع' : 'Location'}:</span>
                                <p className="font-medium">{getCityLabel(job.location, currentDir === 'rtl' ? 'ar' : 'en')}</p>
                              </div>
                            )}
                            {job.natureOfWork && (
                              <div className="col-span-2">
                                <span className="text-muted-foreground">{t('natureOfWork')}:</span>
                                <p className="font-medium">{t(job.natureOfWork)}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 pt-2 border-t">
                            {job.approvalStatus === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveJob(job._id)}
                                  className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 me-2" />
                                  {t('approve')}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleRejectJob(job._id)}
                                  className="flex-1"
                                >
                                  <XCircle className="h-4 w-4 me-2" />
                                  {t('reject')}
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteJob(job._id)}
                              className="flex-1"
                            >
                              {t('delete')}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviewed" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>{currentDir === 'rtl' ? 'الوظائف التي تمت مراجعتها' : 'Reviewed Jobs'}</CardTitle>
                      <CardDescription>{reviewedJobs.length} {currentDir === 'rtl' ? 'وظيفة تمت مراجعتها' : 'jobs reviewed'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {reviewedJobs.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          {currentDir === 'rtl' ? 'لا توجد وظائف تمت مراجعتها' : 'No reviewed jobs'}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4">
                          {reviewedJobs.map((job) => (
                            <Card key={job._id} className="border-2">
                              <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex flex-col gap-2 flex-1">
                                    <CardTitle className="text-lg">{job.title}</CardTitle>
                                    <CardDescription>{job.companyId?.name}</CardDescription>
                                  </div>
                                  <Badge variant={
                                    job.approvalStatus === 'approved' ? 'default' :
                                    job.approvalStatus === 'rejected' ? 'destructive' : 'secondary'
                                  }>
                                    {t(job.approvalStatus || 'pending')}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="flex flex-col gap-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">{t('workingHours')}:</span>
                                    <p className="font-medium">{job.workingHours}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">{t('minSalary')}:</span>
                                    <p className="font-medium">{job.minSalary} ر.س</p>
                                  </div>
                                  <div className="col-span-2">
                                    <span className="text-muted-foreground">{t('qualification')}:</span>
                                    <p className="font-medium">{job.qualification}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <span className="text-muted-foreground">{t('skills')}:</span>
                                    <div className="flex flex-wrap gap-2">
                                      {job.skills?.map((skill: string, idx: number) => (
                                        <Badge key={idx} variant="outline">{skill}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="col-span-2">
                                    <span className="text-muted-foreground">{t('targetDisabilityTypes')}:</span>
                                    <div className="flex flex-col gap-2">
                                      {job.disabilityTypes?.map((type: string, idx: number) => {
                                        const disabilityType = getDisabilityType(type, currentDir === 'rtl' ? 'ar' : 'en');
                                        return (
                                          <div key={idx} className="p-2 bg-muted/50 rounded border">
                                            <div className="flex flex-col gap-1">
                                              <span className="font-medium text-sm">
                                                {disabilityType ? (currentDir === 'rtl' ? disabilityType.labelAr : disabilityType.labelEn) : type}
                                              </span>
                                              {disabilityType && (
                                                <span className="text-xs text-muted-foreground">
                                                  {currentDir === 'rtl' ? disabilityType.descriptionAr : disabilityType.descriptionEn}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                  <div className="col-span-2">
                                    <span className="text-muted-foreground">{t('healthInsurance')}:</span>
                                    <p className="font-medium">{job.healthInsurance ? t('yes') : t('no')}</p>
                                  </div>
                                  {job.location && (
                                    <div className="col-span-2">
                                      <span className="text-muted-foreground">{currentDir === 'rtl' ? 'الموقع' : 'Location'}:</span>
                                      <p className="font-medium">{getCityLabel(job.location, currentDir === 'rtl' ? 'ar' : 'en')}</p>
                                    </div>
                                  )}
                                  {job.natureOfWork && (
                                    <div className="col-span-2">
                                      <span className="text-muted-foreground">{t('natureOfWork')}:</span>
                                      <p className="font-medium">{t(job.natureOfWork)}</p>
                                    </div>
                                  )}
                                  {job.rejectionReason && (
                                    <div className="col-span-2">
                                      <span className="text-muted-foreground">{currentDir === 'rtl' ? 'سبب الرفض' : 'Rejection Reason'}:</span>
                                      <p className="font-medium text-destructive">{job.rejectionReason}</p>
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-2 pt-2 border-t">
                                  {job.approvalStatus === 'approved' && (
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleRejectJob(job._id)}
                                      className="flex-1"
                                    >
                                      <XCircle className="h-4 w-4 me-2" />
                                      {t('reject')}
                                    </Button>
                                  )}
                                  {job.approvalStatus === 'rejected' && (
                                    <Button
                                      size="sm"
                                      onClick={() => handleApproveJob(job._id)}
                                      className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="h-4 w-4 me-2" />
                                      {t('approve')}
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteJob(job._id)}
                                    className="flex-1"
                                  >
                                    {t('delete')}
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="applications" className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('applications')}</CardTitle>
                  <CardDescription>{applications.length} {t('applications')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    {applications.map((app) => (
                      <Card key={app._id} className="border-2">
                        <CardContent className="flex flex-col gap-4 p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-2">
                              <h3 className="font-semibold text-lg">{app.applicantName}</h3>
                              <p className="text-sm text-muted-foreground">
                                {app.jobId?.title} - {app.jobId?.companyId?.name}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{app.applicantPhone}</span>
                                <span>•</span>
                                <span>{app.applicantDisabilityType}</span>
                              </div>
                            </div>
                            <Badge variant={
                              app.status === 'submitted' ? 'default' :
                              app.status === 'shortlisted' ? 'default' :
                              app.status === 'rejected' ? 'destructive' : 'secondary'
                            }>
                              {t(app.status)}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {applications.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      {t('noData')}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Rejection Reason Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="max-w-2xl" dir={currentDir}>
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {currentDir === 'rtl' ? 'رفض الوظيفة' : 'Reject Job'}
            </DialogTitle>
            <DialogDescription>
              {currentDir === 'rtl' ? 'يرجى إدخال سبب رفض الوظيفة' : 'Please provide a reason for rejecting this job'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">
                {currentDir === 'rtl' ? 'سبب الرفض' : 'Rejection Reason'} <span className="text-destructive">*</span>
              </Label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder={currentDir === 'rtl' ? 'اكتب سبب رفض الوظيفة...' : 'Enter rejection reason...'}
                rows={5}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {currentDir === 'rtl' ? 'سيتم إرسال هذا السبب إلى الشركة' : 'This reason will be sent to the company'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectionReason('');
                setSelectedJobToReject(null);
              }}
            >
              {currentDir === 'rtl' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmRejectJob}
              disabled={!rejectionReason.trim()}
            >
              {currentDir === 'rtl' ? 'رفض الوظيفة' : 'Reject Job'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
