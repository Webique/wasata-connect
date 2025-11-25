import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Building2, Users, Briefcase, FileText, CheckCircle, XCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { t } = useTranslation();
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
        description: 'Company approved successfully',
      });
      loadCompanies(companyFilter);
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
        description: 'Company rejected',
      });
      loadCompanies(companyFilter);
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || t('somethingWentWrong'),
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.deleteUser(id);
      toast({
        title: t('delete'),
        description: 'User deleted successfully',
      });
      loadUsers();
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || t('somethingWentWrong'),
        variant: 'destructive',
      });
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      await api.deleteJobAdmin(id);
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

  const filteredUsers = userSearch
    ? users.filter(
        (u) =>
          u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
          u.phone?.includes(userSearch) ||
          u.email?.toLowerCase().includes(userSearch.toLowerCase())
      )
    : users;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('adminDashboard')}</h1>
          <Button onClick={logout} variant="outline">
            {t('logout')}
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Tabs defaultValue="companies" className="w-full">
          <TabsList>
            <TabsTrigger value="companies">
              <Building2 className="h-4 w-4" /> {t('companies')}
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4" /> {t('users')}
            </TabsTrigger>
            <TabsTrigger value="jobs">
              <Briefcase className="h-4 w-4" /> {t('jobs')}
            </TabsTrigger>
            <TabsTrigger value="applications">
              <FileText className="h-4 w-4" /> {t('applications')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="companies" className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('all')}</SelectItem>
                  <SelectItem value="pending">{t('pending')}</SelectItem>
                  <SelectItem value="approved">{t('approved')}</SelectItem>
                  <SelectItem value="rejected">{t('rejected')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {companies.map((company) => (
                <Card key={company._id}>
                  <CardHeader>
                    <CardTitle>{company.name}</CardTitle>
                    <CardDescription>{company.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 text-sm">
                      <p><strong>CR:</strong> {company.crNumber}</p>
                      <p><strong>Status:</strong></p>
                      <Badge variant={
                        company.approvalStatus === 'approved' ? 'default' :
                        company.approvalStatus === 'rejected' ? 'destructive' : 'secondary'
                      }>
                        {t(company.approvalStatus)}
                      </Badge>
                    </div>
                    {company.approvalStatus === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveCompany(company._id)}
                        >
                          <CheckCircle className="h-4 w-4" /> {t('approve')}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectCompany(company._id)}
                        >
                          <XCircle className="h-4 w-4" /> {t('reject')}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Input
                placeholder={t('search')}
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((u) => (
                <Card key={u._id}>
                  <CardHeader>
                    <CardTitle>{u.name}</CardTitle>
                    <CardDescription>{u.phone}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    <Badge>{u.role}</Badge>
                    {u.role !== 'admin' && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteUser(u._id)}
                      >
                        {t('delete')}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <Card key={job._id}>
                  <CardHeader>
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription>{job.companyId?.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      size="sm"
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

          <TabsContent value="applications" className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              {applications.map((app) => (
                <Card key={app._id}>
                  <CardContent className="flex flex-col gap-4 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-2">
                        <h3 className="font-semibold">{app.applicantName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {app.jobId?.title} - {app.jobId?.companyId?.name}
                        </p>
                      </div>
                      <Badge>{t(app.status)}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

