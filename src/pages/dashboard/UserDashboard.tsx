import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Briefcase, 
  FileText, 
  Search, 
  LogOut, 
  User,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  DollarSign,
  Shield,
  ArrowRight,
  Download
} from 'lucide-react';

export default function UserDashboard() {
  const { t } = useTranslation();
  const { dir } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jobsData, applicationsData] = await Promise.all([
        api.getJobs(),
        api.getMyApplications(),
      ]);
      setJobs(jobsData);
      setApplications(applicationsData);
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

  const handleSearch = async () => {
    setLoading(true);
    try {
      const jobsData = await api.getJobs(search);
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

  const filteredJobs = search
    ? jobs.filter(
        (job) =>
          job.title?.toLowerCase().includes(search.toLowerCase()) ||
          job.qualification?.toLowerCase().includes(search.toLowerCase()) ||
          job.companyId?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : jobs;

  const stats = {
    totalJobs: jobs.length,
    totalApplications: applications.length,
    pendingApplications: applications.filter(a => a.status === 'submitted' || a.status === 'reviewed').length,
    shortlistedApplications: applications.filter(a => a.status === 'shortlisted').length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Clock className="h-4 w-4" />;
      case 'shortlisted':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen" dir={dir}>
      <Navbar />
      <main className="flex-1 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center shadow-lg">
                  <User className="h-7 w-7 text-white" />
                </div>
                <div className="flex flex-col gap-1">
                  <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
                  <p className="text-muted-foreground">
                    {t('welcome')}, {user?.name}
                  </p>
                </div>
              </div>
              <Button onClick={logout} variant="outline" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                {t('logout')}
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-2 hover:shadow-lg transition-all">
                <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{t('totalJobs')}</CardTitle>
                  <Briefcase className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalJobs}</div>
                  <p className="text-xs text-muted-foreground mt-2">{t('availableJobs')}</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-all">
                <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{t('myApplications')}</CardTitle>
                  <FileText className="h-5 w-5 text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalApplications}</div>
                  <p className="text-xs text-muted-foreground mt-2">{t('totalSubmitted')}</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-all">
                <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{t('pendingApplications')}</CardTitle>
                  <Clock className="h-5 w-5 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.pendingApplications}</div>
                  <p className="text-xs text-muted-foreground mt-2">{t('underReview')}</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-all">
                <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{t('shortlistedApplications')}</CardTitle>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.shortlistedApplications}</div>
                  <p className="text-xs text-muted-foreground mt-2">{t('selected')}</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="jobs" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="jobs" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" /> {t('jobs')}
                </TabsTrigger>
                <TabsTrigger value="applications" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" /> {t('myApplications')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="jobs" className="flex flex-col gap-6 mt-6">
                {/* Search Bar */}
                <Card className="border-2">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder={t('searchJobs')}
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                          className="pl-10 h-12 text-base"
                        />
                      </div>
                      <Button onClick={handleSearch} size="lg" className="px-8">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Jobs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobs.map((job) => (
                    <Card key={job._id} className="border-2 hover:shadow-xl transition-all flex flex-col group">
                      <CardHeader className="flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4" />
                              {job.companyId?.name || t('company')}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-4 flex-1">
                        <div className="flex flex-col gap-3 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            <span className="font-semibold text-foreground">{job.minSalary} ر.س</span>
                            <span>/ {t('month')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{job.workingHours}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Shield className="h-4 w-4" />
                            <span>{t('healthInsurance')}: {job.healthInsurance ? t('yes') : t('no')}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2 border-t">
                          {job.skills?.slice(0, 3).map((skill: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {job.skills?.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{job.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                        <Button
                          onClick={() => navigate(`/jobs/${job._id}`)}
                          className="w-full mt-auto bg-gradient-hero hover:opacity-90"
                        >
                          {t('viewDetails')}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  {filteredJobs.length === 0 && (
                    <div className="col-span-full text-center py-16">
                      <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                      <p className="text-lg font-medium text-muted-foreground">{t('noJobs')}</p>
                      <p className="text-sm text-muted-foreground mt-2">{t('tryDifferentSearch')}</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="applications" className="flex flex-col gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('myApplications')}</CardTitle>
                    <CardDescription>{applications.length} {t('applications')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      {applications.map((app) => (
                        <Card key={app._id} className="border-2 hover:shadow-lg transition-all">
                          <CardContent className="flex flex-col gap-4 p-6">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex flex-col gap-3 flex-1">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Briefcase className="h-6 w-6 text-primary" />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="text-lg font-semibold">{app.jobId?.title || t('job')}</h3>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                      <MapPin className="h-4 w-4" />
                                      {app.jobId?.companyId?.name || t('company')}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>{t('appliedOn')}: {new Date(app.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <Badge 
                                variant={
                                  app.status === 'submitted' ? 'default' :
                                  app.status === 'shortlisted' ? 'default' :
                                  app.status === 'rejected' ? 'destructive' : 'secondary'
                                }
                                className="flex items-center gap-2 h-fit"
                              >
                                {getStatusIcon(app.status)}
                                {t(app.status)}
                              </Badge>
                            </div>
                            <div className="flex gap-2 pt-4 border-t">
                              <Button
                                variant="outline"
                                onClick={() => window.open(app.cvUrl, '_blank')}
                                className="flex items-center gap-2"
                              >
                                <Download className="h-4 w-4" />
                                {t('downloadCV')}
                              </Button>
                              <Button
                                variant="ghost"
                                onClick={() => navigate(`/jobs/${app.jobId?._id}`)}
                                className="flex items-center gap-2"
                              >
                                {t('viewJob')}
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {applications.length === 0 && (
                        <div className="text-center py-16">
                          <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                          <p className="text-lg font-medium text-muted-foreground">{t('noApplications')}</p>
                          <p className="text-sm text-muted-foreground mt-2">{t('startApplying')}</p>
                          <Button 
                            onClick={() => navigate('/')} 
                            className="mt-4"
                            variant="outline"
                          >
                            {t('browseJobs')}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
