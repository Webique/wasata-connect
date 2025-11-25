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
        <section className="relative py-20 md:py-32 bg-gradient-hero overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAtMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center flex flex-col gap-8">
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                {t('heroTitle')}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
                {t('heroSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto h-14 px-8 text-lg bg-white text-primary hover:bg-white/90 shadow-xl"
                  >
                    <Users className="h-5 w-5" />
                    {t('register')}
                  </Button>
                </Link>
              </div>
            </div>
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
