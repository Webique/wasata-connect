import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

export default function UserLogin() {
  const { t } = useTranslation();
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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t('login')}</CardTitle>
            <CardDescription>Login as Job Seeker</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="useEmail"
                  checked={formData.useEmail}
                  onChange={(e) => setFormData({ ...formData, useEmail: e.target.checked })}
                />
                <Label htmlFor="useEmail">Use Email instead of Phone</Label>
              </div>

              {formData.useEmail ? (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone">{t('phone')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">{t('password')}</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? '...' : t('login')}
              </Button>

              <div className="flex flex-col gap-2">
                <p className="text-sm text-center text-muted-foreground">
                  {t('dontHaveAccount')}{' '}
                  <Link to="/register" className="text-primary hover:underline">
                    {t('registerHere')}
                  </Link>
                </p>
                <Link to="/login" className="text-sm text-center text-muted-foreground hover:text-primary">
                  ← {t('back')} {t('toLoginSelection')}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

