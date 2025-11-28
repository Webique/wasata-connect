import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
  UserPlus, 
  Building2, 
  FileSearch, 
  Send, 
  CheckCircle2, 
  Shield,
  Briefcase,
  Users
} from 'lucide-react';

const Index = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

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

        {/* Trust Section */}
        <section className="py-20 bg-background">
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
      </main>

      <Footer />
    </div>
  );
};

export default Index;
