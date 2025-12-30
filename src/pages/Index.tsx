import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';
import { getDisabilityType, formatDisabilityTypeForDisplay } from '@/constants/disabilityTypes';
import { DISABILITY_TYPES } from '@/constants/disabilityTypes';
import { SAUDI_CITIES, getCityLabel } from '@/constants/saudiCities';
import { 
  UserPlus, 
  Building2, 
  FileSearch, 
  Send, 
  CheckCircle2, 
  Shield,
  Briefcase,
  Users,
  Search,
  MapPin,
  DollarSign,
  Clock,
  ArrowRight,
  Trophy,
  ExternalLink
} from 'lucide-react';

const Index = () => {
  const { t } = useTranslation();
  const { language, dir } = useLanguage();
  const navigate = useNavigate();
  const currentDir = dir || 'rtl';
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [disabilityFilter, setDisabilityFilter] = useState<string>('all');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const jobsData = await api.getJobs();
      setJobs(jobsData);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      if (
        !job.title?.toLowerCase().includes(searchLower) &&
        !job.qualification?.toLowerCase().includes(searchLower) &&
        !job.companyId?.name?.toLowerCase().includes(searchLower) &&
        !job.skills?.some((skill: string) => skill.toLowerCase().includes(searchLower))
      ) {
        return false;
      }
    }

    // Location filter (filter by company location)
    if (locationFilter !== 'all') {
      // We need to check company location, but we don't have it in the job object
      // For now, we'll skip location filtering on the frontend
      // This would need backend support to filter by company location
    }

    // Disability type filter
    if (disabilityFilter !== 'all') {
      if (!job.disabilityTypes || !job.disabilityTypes.includes(disabilityFilter)) {
        return false;
      }
    }

    return true;
  });

  const handleApply = (jobId: string) => {
    navigate(`/login/user?redirect=/jobs/${jobId}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-primary via-primary/95 to-primary/90 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px]" />
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center flex flex-col gap-10">
              {/* Main Heading */}
              <div className="flex flex-col gap-6">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] tracking-tight">
                  {t('heroTitle')}
                </h1>
                <p className="text-xl md:text-2xl lg:text-3xl text-white/90 leading-relaxed max-w-3xl mx-auto font-light mt-4 md:mt-6 lg:mt-8">
                  {t('heroSubtitle')}
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto h-16 px-10 text-lg bg-white text-primary hover:bg-white/95 shadow-2xl hover:shadow-3xl transition-all duration-300 font-semibold rounded-xl"
                  >
                    <Users className="h-5 w-5 me-2" />
                    {t('register')}
                  </Button>
                </Link>
                <Link to="/login" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full sm:w-auto h-16 px-10 text-lg bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 shadow-xl transition-all duration-300 font-semibold rounded-xl backdrop-blur-sm"
                  >
                    {t('login')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Bottom Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg className="w-full h-20 fill-background" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,0 C150,80 350,80 600,40 C850,0 1050,0 1200,40 L1200,120 L0,120 Z"></path>
            </svg>
          </div>
        </section>

        {/* How It Works - Job Seekers */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto flex flex-col gap-12">
              <div className="text-center flex flex-col gap-4">
                <h2 className="text-3xl md:text-4xl font-bold">{t('howItWorks')}</h2>
                <p className="text-xl text-muted-foreground">{t('forSeekers')}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="flex flex-col gap-6 p-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserPlus className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex flex-col gap-3">
                      <h3 className="text-xl font-semibold">{t('seeker1Title')}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {t('seeker1Desc')}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="flex flex-col gap-6 p-8">
                    <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
                      <FileSearch className="h-8 w-8 text-secondary" />
                    </div>
                    <div className="flex flex-col gap-3">
                      <h3 className="text-xl font-semibold">{t('seeker2Title')}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {t('seeker2Desc')}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="flex flex-col gap-6 p-8">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                      <Send className="h-8 w-8 text-accent" />
                    </div>
                    <div className="flex flex-col gap-3">
                      <h3 className="text-xl font-semibold">{t('seeker3Title')}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {t('seeker3Desc')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Companies */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto flex flex-col gap-12">
              <div className="text-center flex flex-col gap-4">
                <p className="text-xl text-muted-foreground">{t('forCompanies')}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="flex flex-col gap-6 p-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex flex-col gap-3">
                      <h3 className="text-xl font-semibold">{t('company1Title')}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {t('company1Desc')}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="flex flex-col gap-6 p-8">
                    <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Briefcase className="h-8 w-8 text-secondary" />
                    </div>
                    <div className="flex flex-col gap-3">
                      <h3 className="text-xl font-semibold">{t('company2Title')}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {t('company2Desc')}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="flex flex-col gap-6 p-8">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-accent" />
                    </div>
                    <div className="flex flex-col gap-3">
                      <h3 className="text-xl font-semibold">{t('company3Title')}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {t('company3Desc')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Available Jobs Section */}
        <section className="py-20 bg-background" dir={currentDir}>
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
              <div className="text-center flex flex-col gap-4">
                <h2 className="text-3xl md:text-4xl font-bold">
                  {currentDir === 'rtl' ? 'الوظائف المتاحة' : 'Available Jobs'}
                </h2>
                <p className="text-xl text-muted-foreground">
                  {currentDir === 'rtl' ? 'استعرض الوظائف من الشركات المعتمدة' : 'Browse jobs from verified companies'}
                </p>
              </div>

              {/* Filters */}
              <Card className="border-2">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm">{currentDir === 'rtl' ? 'البحث' : 'Search'}</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={currentDir === 'rtl' ? 'ابحث عن وظيفة...' : 'Search for a job...'}
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm">{t('disabilityType')}</Label>
                      <Select value={disabilityFilter} onValueChange={setDisabilityFilter}>
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
                      <Select value={locationFilter} onValueChange={setLocationFilter}>
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

              {/* Jobs Grid */}
              {loading ? (
                <div className="text-center py-16">
                  <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50 animate-pulse" />
                  <p className="text-lg font-medium text-muted-foreground">
                    {currentDir === 'rtl' ? 'جاري التحميل...' : 'Loading...'}
                  </p>
                </div>
              ) : filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobs.map((job) => (
                    <Card key={job._id} className="border-2 hover:shadow-xl transition-all flex flex-col group">
                      <CardHeader className="flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
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
                        {job.disabilityTypes && job.disabilityTypes.length > 0 && (
                          <div className="flex flex-col gap-2 pt-2 border-t">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium text-muted-foreground">{t('targetDisabilityTypes')}:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {job.disabilityTypes.slice(0, 3).map((type: string, idx: number) => {
                                const displayText = formatDisabilityTypeForDisplay(type, currentDir === 'rtl' ? 'ar' : 'en');
                                return (
                                  <Badge key={idx} variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary">
                                    {displayText}
                                  </Badge>
                                );
                              })}
                              {job.disabilityTypes.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{job.disabilityTypes.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
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
                          onClick={() => handleApply(job._id)}
                          className="w-full mt-auto bg-primary hover:bg-primary/90"
                        >
                          {currentDir === 'rtl' ? 'تقديم' : 'Apply'}
                          <ArrowRight className="h-4 w-4 ms-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <p className="text-lg font-medium text-muted-foreground">
                    {currentDir === 'rtl' ? 'لا توجد وظائف متاحة' : 'No jobs available'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {currentDir === 'rtl' ? 'جرب البحث بمعايير مختلفة' : 'Try different search criteria'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 bg-card">
                <CardContent className="flex flex-col md:flex-row gap-8 p-12 items-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-12 w-12 text-primary" />
                  </div>
                  <div className="flex flex-col gap-4 text-center md:text-start">
                    <h2 className="text-2xl md:text-3xl font-bold">{t('trustTitle')}</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {t('trustDesc')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Achievement Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5" dir={currentDir}>
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12 flex flex-col gap-4">
                <div className="flex items-center justify-center gap-3">
                  <Trophy className="h-8 w-8 text-primary" />
                  <h2 className="text-3xl md:text-4xl font-bold">{t('achievementTitle')}</h2>
                </div>
              </div>

              <div className="flex flex-col gap-8">
                {/* First Achievement */}
                <Card className="border-2 shadow-xl overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Image Section */}
                    <div className="relative bg-black p-8 flex items-center justify-center min-h-[400px]">
                      <img 
                        src="/images/achievement.png" 
                        alt={t('achievementAwardTitle')}
                        className="max-w-full h-auto object-contain drop-shadow-2xl"
                      />
                    </div>

                    {/* Content Section */}
                    <div className="p-8 md:p-12 flex flex-col justify-center gap-6">
                      <div className="flex flex-col gap-2">
                        <div className="inline-block">
                          <Badge variant="outline" className="text-sm mb-3 bg-primary/10 border-primary/30 text-primary">
                            {t('achievementEdition')}
                          </Badge>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold leading-tight">
                          {t('achievementAwardTitle')}
                        </h3>
                        <h4 className="text-xl md:text-2xl text-primary font-semibold">
                          {t('achievementAwardSubtitle')}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-2">
                          {t('achievementPatronage')}
                        </p>
                      </div>

                      <div className="flex flex-col gap-4 pt-4 border-t">
                        <p className="text-base leading-relaxed text-muted-foreground">
                          {t('achievementDescription')}
                        </p>
                      </div>

                      <div className="flex flex-col gap-4 pt-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-sm font-semibold">{currentDir === 'rtl' ? 'الرؤية:' : 'Vision:'}</span>
                          </div>
                          <p className="text-sm text-muted-foreground ms-4">
                            {t('achievementVision')}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-secondary" />
                            <span className="text-sm font-semibold">{currentDir === 'rtl' ? 'الرسالة:' : 'Mission:'}</span>
                          </div>
                          <p className="text-sm text-muted-foreground ms-4">
                            {t('achievementMission')}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-accent" />
                            <span className="text-sm font-semibold">{currentDir === 'rtl' ? 'الأهداف:' : 'Goals:'}</span>
                          </div>
                          <p className="text-sm text-muted-foreground ms-4">
                            {t('achievementGoals')}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4">
                        <a 
                          href="https://aazzm.org/excellency_award/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
                        >
                          <span>{t('achievementViewAward')}</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Second Achievement - King Khalid Foundation */}
                <Card className="border-2 shadow-xl overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Image Section */}
                    <div 
                      className="relative p-8 flex items-center justify-center min-h-[400px]"
                      style={{ backgroundColor: 'rgba(198, 194, 191)' }}
                    >
                      <img 
                        src="/images/achievement2.png" 
                        alt={currentDir === 'rtl' ? 'جائزة شركاء التنمية - مبادرة شبكة وساطة لتوظيف ذوي الاعاقة' : 'Development Partners Award - Wasata Network Initiative'}
                        className="max-w-full h-auto object-contain drop-shadow-2xl"
                      />
                    </div>

                    {/* Content Section */}
                    <div className="p-8 md:p-12 flex flex-col justify-center gap-6">
                      <div className="flex flex-col gap-2">
                        <div className="inline-block">
                          <Badge variant="outline" className="text-sm mb-3 bg-primary/10 border-primary/30 text-primary">
                            {currentDir === 'rtl' ? 'جائزة شركاء التنمية' : 'Development Partners Award'}
                          </Badge>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold leading-tight">
                          {currentDir === 'rtl' ? 'مبادرة شبكة وساطة لتوظيف ذوي الاعاقة' : 'Wasata Network Initiative for Employment of People with Disabilities'}
                        </h3>
                        <h4 className="text-xl md:text-2xl text-primary font-semibold">
                          {currentDir === 'rtl' ? 'لصاحبها احمد زايد المالكي' : 'By Ahmed Zaid Al-Maliki'}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-2">
                          {currentDir === 'rtl' ? 'فرع شركاء التنمية - مؤسسة الملك خالد' : 'Development Partners Branch - King Khalid Foundation'}
                        </p>
                      </div>

                      <div className="flex flex-col gap-4 pt-4 border-t">
                        <p className="text-base leading-relaxed text-muted-foreground">
                          {currentDir === 'rtl' 
                            ? 'المبادرة عبارة عن موقع الكتروني يسهم في الحد من البطالة لذوي الإحتياجات الخاصة عن طريق إيجاد وظائف تتناسب مع مؤهلاتهم العلمية ونوع الإعاقات التي يعانون منها. المبادرة تعمل كحلقة وصل بين الباحثين عن عمل من ذوي الإحتياجات الخاصة وأصحاب العمل الباحثين عن موظفين من تلك الفئة.'
                            : 'The initiative is a website that contributes to reducing unemployment for people with special needs by finding jobs that match their qualifications and the types of disabilities they have. The initiative serves as a bridge between job seekers with special needs and employers looking for employees from this category.'}
                        </p>
                      </div>

                      <div className="flex flex-col gap-4 pt-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-sm font-semibold">{currentDir === 'rtl' ? 'اقتصادية:' : 'Economic:'}</span>
                          </div>
                          <p className="text-sm text-muted-foreground ms-4">
                            {currentDir === 'rtl' 
                              ? 'تعمل على الحد من البطالة وإيجاد وظائف لذوي الاحتياجات الخاصة تناسب مؤهلاتهم ونوعية إعاقتهم.'
                              : 'Working to reduce unemployment and find jobs for people with special needs that match their qualifications and type of disability.'}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-secondary" />
                            <span className="text-sm font-semibold">{currentDir === 'rtl' ? 'اجتماعية:' : 'Social:'}</span>
                          </div>
                          <p className="text-sm text-muted-foreground ms-4">
                            {currentDir === 'rtl' 
                              ? 'دمج هذه الفئة في المجتمع للمشاركة في الحياة العملية كأفراد فاعلين ومنتجين ومتساوين في الحقوق والواجبات والعمل.'
                              : 'Integrating this category into society to participate in working life as active, productive individuals equal in rights, duties, and work.'}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-accent" />
                            <span className="text-sm font-semibold">{currentDir === 'rtl' ? 'توعوية:' : 'Awareness:'}</span>
                          </div>
                          <p className="text-sm text-muted-foreground ms-4">
                            {currentDir === 'rtl' 
                              ? 'توعية ذوي الاحتياجات الخاصة بحقوقهم الخاصة بتوفير بيئة عمل تكفل لهم حق الكرامة والاحترام والتقدير.'
                              : 'Raising awareness among people with special needs about their rights by providing a work environment that ensures their right to dignity, respect, and appreciation.'}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4">
                        <p className="text-sm text-muted-foreground mb-4">
                          {currentDir === 'rtl' 
                            ? 'المبادرة تخدم جميع المستهدفين من ذوي الإحتياجات الخاصة (الذهنية، الحركية، البصرية، الفكرية، النفسية وغيرها من الإعاقات الأخرى) وتوفر لهم غطاء قانوني من خلال متخصصين قانونيين متطوعين.'
                            : 'The initiative serves all targeted people with special needs (intellectual, physical, visual, mental, psychological, and other disabilities) and provides them with legal coverage through volunteer legal specialists.'}
                        </p>
                        <a 
                          href="https://kka.kkf.org.sa/ar/PreviousWinners/Pages/PartnersBranch2015-2.aspx" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
                        >
                          <span>{currentDir === 'rtl' ? 'عرض الجائزة' : 'View Award'}</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
