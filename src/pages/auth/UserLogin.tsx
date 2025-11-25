import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { Users, Phone, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

export default function UserLogin() {
  const { t } = useTranslation();
  const { dir } = useLanguage();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: '',
    useEmail: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(
        formData.useEmail ? undefined : formData.phone,
        formData.useEmail ? formData.email : undefined,
        formData.password
      );
      toast({
        title: t('login'),
        description: 'Login successful!',
      });
      navigate('/dashboard/user');
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || t('invalidCredentials'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen" dir={dir}>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="w-full max-w-md">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </Link>
          
          <Card className="border-2 shadow-2xl">
            <CardHeader className="flex flex-col gap-6 pb-8">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-center flex flex-col gap-2">
                <CardTitle className="text-3xl">{t('loginAsSeeker')}</CardTitle>
                <CardDescription className="text-base">{t('loginAsSeekerDesc')}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
                  <input
                    type="checkbox"
                    id="useEmail"
                    checked={formData.useEmail}
                    onChange={(e) => setFormData({ ...formData, useEmail: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="useEmail" className="text-sm cursor-pointer">
                    {t('useEmailInstead')}
                  </Label>
                </div>

                {formData.useEmail ? (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {t('email')}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-12 text-base"
                      placeholder={t('email')}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {t('phone')}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-12 text-base"
                      placeholder={t('phone')}
                    />
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    {t('password')}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-12 text-base"
                    placeholder={t('password')}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full h-12 text-base font-semibold bg-gradient-hero hover:opacity-90 shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span>
                      {t('login')}...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {t('login')}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>

                <div className="flex flex-col gap-3 pt-4 border-t">
                  <p className="text-sm text-center text-muted-foreground">
                    {t('dontHaveAccount')}{' '}
                    <Link to="/register" className="text-primary hover:underline font-medium">
                      {t('registerHere')}
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
