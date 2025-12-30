import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translateErrorMessage } from '@/lib/errorTranslations';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { FileText } from 'lucide-react';
import { DISABILITY_TYPES, isCustomDisabilityType, extractCustomDisabilityText } from '@/constants/disabilityTypes';
import { SAUDI_CITIES } from '@/constants/saudiCities';

export default function UserRegister() {
  const { t } = useTranslation();
  const { dir } = useLanguage();
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const { toast } = useToast();
  
  // Ensure dir is always defined to prevent minification issues
  const currentDir = dir || 'rtl';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    disabilityType: '',
    location: '',
    cvFile: null as File | null,
  });
  const [customDisabilityText, setCustomDisabilityText] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const isOtherSelected = formData.disabilityType === 'أخرى';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: t('error'),
        description: t('passwordsDoNotMatch'),
        variant: 'destructive',
      });
      return;
    }

    if (!formData.disabilityType) {
      toast({
        title: t('error'),
        description: t('requiredField'),
        variant: 'destructive',
      });
      return;
    }

    // If "Other" is selected, require custom text
    if (isOtherSelected && !customDisabilityText.trim()) {
      toast({
        title: t('error'),
        description: currentDir === 'rtl' ? 'يرجى تحديد نوع الإعاقة' : 'Please specify the disability type',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.location) {
      toast({
        title: t('error'),
        description: t('pleaseSelectLocation'),
        variant: 'destructive',
      });
      return;
    }

    if (!formData.cvFile) {
      toast({
        title: t('error'),
        description: t('cvRequired'),
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setUploading(true);
    try {
      // Upload CV first
      const uploadResult = await api.uploadFile(formData.cvFile);
      
      // Format disability type: if "Other" is selected, combine with custom text
      const finalDisabilityType = isOtherSelected 
        ? `أخرى - ${customDisabilityText.trim()}`
        : formData.disabilityType;
      
      // Then register user with CV URL
      await registerUser({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        password: formData.password,
        disabilityType: finalDisabilityType,
        location: formData.location,
        cvUrl: uploadResult.url,
      });
      toast({
        title: t('register'),
        description: t('registrationSuccessful'),
      });
      navigate('/dashboard/user');
    } catch (error: any) {
      toast({
        title: t('error'),
        description: translateErrorMessage(error.message, t),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen" dir={currentDir}>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t('registerAsSeeker')}</CardTitle>
            <CardDescription>{t('register')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">{t('name')}</Label>
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
                <Label htmlFor="email">{t('email')} (اختياري)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="disabilityType">{t('disabilityType')}</Label>
                <Select
                  value={isCustomDisabilityType(formData.disabilityType) ? 'أخرى' : formData.disabilityType}
                  onValueChange={(value) => {
                    if (value === 'أخرى') {
                      setFormData({ ...formData, disabilityType: 'أخرى' });
                      // If there's existing custom text, extract it
                      if (isCustomDisabilityType(formData.disabilityType)) {
                        setCustomDisabilityText(extractCustomDisabilityText(formData.disabilityType));
                      }
                    } else {
                      setFormData({ ...formData, disabilityType: value });
                      setCustomDisabilityText('');
                    }
                  }}
                >
                  <SelectTrigger id="disabilityType" className="h-auto min-h-[3rem]">
                    <SelectValue placeholder={t('selectDisabilityType')}>
                      {formData.disabilityType && (() => {
                        if (isCustomDisabilityType(formData.disabilityType)) {
                          const otherType = DISABILITY_TYPES.find(t => t.value === 'أخرى');
                          return otherType ? (currentDir === 'rtl' ? otherType.labelAr : otherType.labelEn) : 'أخرى';
                        }
                        const selected = DISABILITY_TYPES.find(t => t.value === formData.disabilityType);
                        return selected ? (currentDir === 'rtl' ? selected.labelAr : selected.labelEn) : formData.disabilityType;
                      })()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {DISABILITY_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex flex-col gap-1 py-1">
                          <span className="font-medium">{currentDir === 'rtl' ? type.labelAr : type.labelEn}</span>
                          <span className="text-xs text-muted-foreground">
                            {currentDir === 'rtl' ? type.descriptionAr : type.descriptionEn}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isOtherSelected && (
                  <div className="flex flex-col gap-2 mt-2">
                    <Label htmlFor="customDisabilityText" className="text-sm">
                      {currentDir === 'rtl' ? 'يرجى تحديد نوع الإعاقة' : 'Please specify the disability type'} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="customDisabilityText"
                      type="text"
                      value={customDisabilityText}
                      onChange={(e) => setCustomDisabilityText(e.target.value)}
                      placeholder={currentDir === 'rtl' ? 'اكتب نوع الإعاقة' : 'Enter disability type'}
                      required={isOtherSelected}
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="location">{currentDir === 'rtl' ? 'الموقع' : 'Location'} <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => setFormData({ ...formData, location: value })}
                >
                  <SelectTrigger id="location" className="h-12">
                    <SelectValue placeholder={currentDir === 'rtl' ? 'اختر المدينة' : 'Select City'}>
                      {formData.location && (() => {
                        const selected = SAUDI_CITIES.find(c => c.value === formData.location);
                        return selected ? (currentDir === 'rtl' ? selected.labelAr : selected.labelEn) : formData.location;
                      })()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {SAUDI_CITIES.map((city) => (
                      <SelectItem key={city.value} value={city.value}>
                        {currentDir === 'rtl' ? city.labelAr : city.labelEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

              <div className="flex flex-col gap-2">
                <Label htmlFor="cvFile" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {t('uploadCV')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cvFile"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  required
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({ ...formData, cvFile: file });
                    }
                  }}
                  className="cursor-pointer"
                />
                {formData.cvFile && (
                  <p className="text-sm text-muted-foreground">
                    {t('selectedFile')}: {formData.cvFile.name}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={loading || uploading} className="w-full">
                {loading ? '...' : t('register')}
              </Button>

              <div className="flex flex-col gap-2">
                <p className="text-sm text-center text-muted-foreground">
                  {t('alreadyHaveAccount')}{' '}
                  <Link to="/login" className="text-primary hover:underline">
                    {t('loginHere')}
                  </Link>
                </p>
                <Link to="/register" className="text-sm text-center text-muted-foreground hover:text-primary">
                  ← {t('back')} {t('toRegisterSelection')}
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

