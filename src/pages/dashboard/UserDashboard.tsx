import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
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
import { Briefcase, FileText, Search } from 'lucide-react';

export default function UserDashboard() {
  const { t } = useTranslation();
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
          job.qualification?.toLowerCase().includes(search.toLowerCase())
      )
    : jobs;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
              <p className="text-muted-foreground">
                {t('welcome')}, {user?.name}
              </p>
            </div>
            <Button onClick={logout} variant="outline">
              {t('logout')}
            </Button>
          </div>

          <Tabs defaultValue="jobs" className="w-full">
            <TabsList>
              <TabsTrigger value="jobs">{t('jobs')}</TabsTrigger>
              <TabsTrigger value="applications">{t('myApplications')}</TabsTrigger>
            </TabsList>

            <TabsContent value="jobs" className="flex flex-col gap-4">
              <div className="flex gap-4">
                <Input
                  placeholder={t('search')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredJobs.map((job) => (
                  <Card key={job._id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle>{job.title}</CardTitle>
                      <CardDescription>
                        {job.companyId?.name || 'Company'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 flex-1">
                      <div className="flex flex-col gap-2 text-sm">
                        <p>
                          <strong>{t('qualification')}:</strong> {job.qualification}
                        </p>
                        <p>
                          <strong>{t('minSalary')}:</strong> {job.minSalary} ر.س
                        </p>
                        <p>
                          <strong>{t('healthInsurance')}:</strong>{' '}
                          {job.healthInsurance ? t('yes') : t('no')}
                        </p>
                      </div>
                      <Button
                        onClick={() => navigate(`/jobs/${job._id}`)}
                        className="w-full"
                      >
                        {t('viewDetails')}
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
                          <h3 className="text-lg font-semibold">
                            {app.jobId?.title || 'Job'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {app.jobId?.companyId?.name || 'Company'}
                          </p>
                        </div>
                        <Badge variant={
                          app.status === 'submitted' ? 'default' :
                          app.status === 'shortlisted' ? 'default' :
                          app.status === 'rejected' ? 'destructive' : 'secondary'
                        }>
                          {t(app.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          onClick={() => window.open(app.cvUrl, '_blank')}
                        >
                          {t('downloadCV')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {applications.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    {t('noApplications')}
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}

