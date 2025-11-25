import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Users, Building2, ArrowLeft } from 'lucide-react';

export default function RegisterSelection() {
  const { t } = useTranslation();
  const { language, dir } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen" dir={dir}>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col gap-8">
            {/* Back Button */}
            <Link to="/" className="self-start">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t('back')}
              </Button>
            </Link>

            {/* Header */}
            <div className="text-center flex flex-col gap-4">
              <h1 className="text-4xl md:text-5xl font-bold">{t('register')}</h1>
              <p className="text-xl text-muted-foreground">{t('chooseAccountType')}</p>
            </div>

            {/* Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Seeker Card */}
              <Card className="hover:shadow-lg transition-shadow border-2">
                <CardHeader className="flex flex-col gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-center">{t('registerAsSeeker')}</CardTitle>
                  <CardDescription className="text-center text-base">
                    {t('registerAsSeekerDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <ul className="flex flex-col gap-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>{t('seekerBenefit1')}</li>
                    <li>{t('seekerBenefit2')}</li>
                    <li>{t('seekerBenefit3')}</li>
                  </ul>
                  <Link to="/register/user" className="w-full">
                    <Button size="lg" className="w-full">
                      {t('registerAsSeeker')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Company Card */}
              <Card className="hover:shadow-lg transition-shadow border-2">
                <CardHeader className="flex flex-col gap-4">
                  <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
                    <Building2 className="h-8 w-8 text-secondary" />
                  </div>
                  <CardTitle className="text-2xl text-center">{t('registerAsCompany')}</CardTitle>
                  <CardDescription className="text-center text-base">
                    {t('registerAsCompanyDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <ul className="flex flex-col gap-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>{t('companyBenefit1')}</li>
                    <li>{t('companyBenefit2')}</li>
                    <li>{t('companyBenefit3')}</li>
                  </ul>
                  <Link to="/register/company" className="w-full">
                    <Button size="lg" variant="outline" className="w-full">
                      {t('registerAsCompany')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Already have account */}
            <div className="text-center">
              <p className="text-muted-foreground">
                {t('alreadyHaveAccount')}{' '}
                <Link to="/login/user" className="text-primary hover:underline font-medium">
                  {t('loginHere')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

