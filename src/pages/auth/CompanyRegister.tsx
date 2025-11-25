import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

export default function CompanyRegister() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { registerCompany } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    crNumber: '',
    crDocUrl: '',
    mapsUrl: '',
    mowaamaDocUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (file: File, field: 'crDocUrl' | 'mowaamaDocUrl') => {
    setUploading(true);
    try {
      const result = await api.uploadFile(file);
      setFormData({ ...formData, [field]: result.url });
      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || 'Upload failed',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: t('error'),
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.crDocUrl) {
      toast({
        title: t('error'),
        description: 'Please upload CR document',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await registerCompany({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        crNumber: formData.crNumber,
        crDocUrl: formData.crDocUrl,
        mapsUrl: formData.mapsUrl,
        mowaamaDocUrl: formData.mowaamaDocUrl || undefined,
      });
      toast({
        title: t('register'),
        description: 'Registration successful! Awaiting admin approval.',
      });
      navigate('/dashboard/company');
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>{t('registerAsCompany')}</CardTitle>
            <CardDescription>{t('register')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">{t('companyName')}</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

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

              <div className="flex flex-col gap-2">
                <Label htmlFor="crNumber">{t('crNumber')}</Label>
                <Input
                  id="crNumber"
                  type="text"
                  required
                  value={formData.crNumber}
                  onChange={(e) => setFormData({ ...formData, crNumber: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="crDocument">{t('crDocument')}</Label>
                <Input
                  id="crDocument"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'crDocUrl');
                  }}
                  disabled={uploading}
                />
                {formData.crDocUrl && (
                  <p className="text-sm text-muted-foreground">✓ Document uploaded</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="mapsUrl">{t('mapsUrl')}</Label>
                <Input
                  id="mapsUrl"
                  type="url"
                  required
                  value={formData.mapsUrl}
                  onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })}
                  placeholder="https://maps.google.com/?q=..."
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="mowaamaDoc">{t('mowaamaDoc')}</Label>
                <Input
                  id="mowaamaDoc"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'mowaamaDocUrl');
                  }}
                  disabled={uploading}
                />
                {formData.mowaamaDocUrl && (
                  <p className="text-sm text-muted-foreground">✓ Document uploaded</p>
                )}
              </div>

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

              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>

              <Button type="submit" disabled={loading || uploading} className="w-full">
                {loading ? '...' : t('register')}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                {t('alreadyHaveAccount')}{' '}
                <Link to="/login/company" className="text-primary hover:underline">
                  {t('loginHere')}
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

