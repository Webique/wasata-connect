import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { getDisabilityType } from '@/constants/disabilityTypes';
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
  BarChart3
} from 'lucide-react';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { dir } = useLanguage();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [companies, setCompanies] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [userSearch, setUserSearch] = useState('');

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

  const handleRejectJob = async (id: string) => {
    try {
      await api.rejectJob(id);
      toast({
        title: t('reject'),
        description: t('jobRejectedSuccess'),
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

  const filteredUsers = userSearch
    ? users.filter(
        (u) =>
          u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
          u.phone?.includes(userSearch) ||
          u.email?.toLowerCase().includes(userSearch.toLowerCase())
      )
    : users;

  const stats = {
    totalCompanies: companies.length,
    totalUsers: users.length,
    totalJobs: jobs.length,
    totalApplications: applications.length,
    pendingCompanies: companies.filter(c => c.approvalStatus === 'pending').length,
    approvedCompanies: companies.filter(c => c.approvalStatus === 'approved').length,
    activeJobs: jobs.filter(j => j.status === 'active').length,
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-muted/20 to-background" dir={dir}>
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
            <Button onClick={logout} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              {t('logout')}
            </Button>
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
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalCompanies}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {stats.pendingCompanies} {t('pending')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t('totalUsers')}</CardTitle>
                <Users className="h-5 w-5 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {users.filter(u => u.role === 'user').length} {t('users')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t('totalJobs')}</CardTitle>
                <Briefcase className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalJobs}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {stats.activeJobs} {t('active')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t('totalApplications')}</CardTitle>
                <FileText className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalApplications}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {t('recentActivity')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="companies" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="companies" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" /> {t('companies')}
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" /> {t('users')}
              </TabsTrigger>
              <TabsTrigger value="jobs" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> {t('jobs')}
              </TabsTrigger>
              <TabsTrigger value="applications" className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> {t('applications')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="companies" className="flex flex-col gap-6 mt-6">
              <div className="flex gap-4">
                <Select value={companyFilter} onValueChange={setCompanyFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={t('filter')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('all')}</SelectItem>
                    <SelectItem value="pending">{t('pending')}</SelectItem>
                    <SelectItem value="approved">{t('approved')}</SelectItem>
                    <SelectItem value="rejected">{t('rejected')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company) => (
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
                ))}
                {companies.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    {t('noData')}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="users" className="flex flex-col gap-6 mt-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('search')}
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{t('users')}</CardTitle>
                  <CardDescription>{filteredUsers.length} {t('users')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('name')}</TableHead>
                        <TableHead>{t('phoneNumber')}</TableHead>
                        <TableHead>{t('emailAddress')}</TableHead>
                        <TableHead>{t('status')}</TableHead>
                        <TableHead className="text-end">{t('actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((u) => (
                        <TableRow key={u._id}>
                          <TableCell className="font-medium">{u.name}</TableCell>
                          <TableCell>{u.phone}</TableCell>
                          <TableCell>{u.email || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={u.status === 'active' ? 'default' : 'secondary'}>
                              {t(u.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-end">
                            {u.role !== 'admin' && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteUser(u._id)}
                              >
                                {t('delete')}
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      {t('noData')}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="jobs" className="flex flex-col gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('jobs')}</CardTitle>
                  <CardDescription>{jobs.length} {t('jobs')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    {jobs.map((job) => (
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
                              <div className="flex flex-wrap gap-2 mt-1">
                                {job.skills?.map((skill: string, idx: number) => (
                                  <Badge key={idx} variant="outline">{skill}</Badge>
                                ))}
                              </div>
                            </div>
                            <div className="col-span-2">
                              <span className="text-muted-foreground">{t('targetDisabilityTypes')}:</span>
                              <div className="flex flex-col gap-2 mt-1">
                                {job.disabilityTypes?.map((type: string, idx: number) => {
                                  const disabilityType = getDisabilityType(type, dir === 'rtl' ? 'ar' : 'en');
                                  return (
                                    <div key={idx} className="p-2 bg-muted/50 rounded border">
                                      <div className="flex flex-col gap-1">
                                        <span className="font-medium text-sm">
                                          {disabilityType ? (dir === 'rtl' ? disabilityType.labelAr : disabilityType.labelEn) : type}
                                        </span>
                                        {disabilityType && (
                                          <span className="text-xs text-muted-foreground">
                                            {dir === 'rtl' ? disabilityType.descriptionAr : disabilityType.descriptionEn}
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
                  {jobs.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      {t('noData')}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applications" className="flex flex-col gap-6 mt-6">
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
    </div>
  );
}
