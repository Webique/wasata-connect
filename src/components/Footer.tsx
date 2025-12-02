import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  ArrowRight,
  Heart,
  Shield,
  Users,
  Briefcase,
  FileText,
  HelpCircle,
  Award,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export const Footer = () => {
  const { t } = useTranslation();
  const { language, dir } = useLanguage();
  const currentDir = dir || 'rtl';

  return (
    <footer 
      className="relative bg-gradient-to-br from-background via-muted/20 to-background border-t border-border/50 mt-auto overflow-hidden" 
      role="contentinfo"
      dir={currentDir}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10">
        {/* Top Section */}
        <div className="container mx-auto px-4 lg:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <Link to="/" className="group inline-flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <img 
                      src="/images/logo.png" 
                      alt={language === 'ar' ? 'وساطة' : 'Wasata'}
                      className="relative h-14 w-auto transition-transform group-hover:scale-110"
                    />
                  </div>
                </Link>
                <p className="text-muted-foreground leading-relaxed text-sm max-w-xs">
                  {t('trustDesc')}
                </p>
              </div>

              {/* Social Media Links */}
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-foreground/80">
                  {currentDir === 'rtl' ? 'تابعنا' : 'Follow Us'}
                </p>
                <div className="flex items-center gap-3">
                  <a 
                    href="#" 
                    className="w-10 h-10 rounded-lg bg-muted/50 hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110 group"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  </a>
                  <a 
                    href="#" 
                    className="w-10 h-10 rounded-lg bg-muted/50 hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110 group"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  </a>
                  <a 
                    href="#" 
                    className="w-10 h-10 rounded-lg bg-muted/50 hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110 group"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  </a>
                  <a 
                    href="#" 
                    className="w-10 h-10 rounded-lg bg-muted/50 hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110 group"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold">{t('quickLinks')}</h3>
              </div>
              <nav className="flex flex-col gap-3" aria-label="Footer navigation">
                <Link 
                  to="/" 
                  className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-200 text-sm"
                >
                  <ArrowRight className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    currentDir === 'rtl' ? 'rotate-180' : '',
                    "group-hover:translate-x-1"
                  )} />
                  {t('home')}
                </Link>
                <Link 
                  to="/about" 
                  className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-200 text-sm"
                >
                  <ArrowRight className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    currentDir === 'rtl' ? 'rotate-180' : '',
                    "group-hover:translate-x-1"
                  )} />
                  {t('about')}
                </Link>
                <Link 
                  to="/help" 
                  className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-200 text-sm"
                >
                  <ArrowRight className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    currentDir === 'rtl' ? 'rotate-180' : '',
                    "group-hover:translate-x-1"
                  )} />
                  {t('help')}
                </Link>
                <Link 
                  to="/policies" 
                  className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-200 text-sm"
                >
                  <ArrowRight className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    currentDir === 'rtl' ? 'rotate-180' : '',
                    "group-hover:translate-x-1"
                  )} />
                  {t('policies')}
                </Link>
              </nav>
            </div>

            {/* Resources */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-secondary" />
                </div>
                <h3 className="text-lg font-bold">
                  {currentDir === 'rtl' ? 'الموارد' : 'Resources'}
                </h3>
              </div>
              <nav className="flex flex-col gap-3">
                <Link 
                  to="/register" 
                  className="group flex items-center gap-2 text-muted-foreground hover:text-secondary transition-all duration-200 text-sm"
                >
                  <Users className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    "group-hover:scale-110"
                  )} />
                  {currentDir === 'rtl' ? 'التسجيل كباحث عن عمل' : 'Register as Job Seeker'}
                </Link>
                <Link 
                  to="/register" 
                  className="group flex items-center gap-2 text-muted-foreground hover:text-secondary transition-all duration-200 text-sm"
                >
                  <Briefcase className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    "group-hover:scale-110"
                  )} />
                  {currentDir === 'rtl' ? 'التسجيل كشركة' : 'Register as Company'}
                </Link>
                <Link 
                  to="/help" 
                  className="group flex items-center gap-2 text-muted-foreground hover:text-secondary transition-all duration-200 text-sm"
                >
                  <HelpCircle className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    "group-hover:scale-110"
                  )} />
                  {currentDir === 'rtl' ? 'مركز المساعدة' : 'Help Center'}
                </Link>
                <a 
                  href="https://aazzm.org/excellency_award/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-muted-foreground hover:text-secondary transition-all duration-200 text-sm"
                >
                  <Award className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    "group-hover:scale-110"
                  )} />
                  {currentDir === 'rtl' ? 'جائزة التميز' : 'Excellence Award'}
                </a>
              </nav>
            </div>

            {/* Contact & Newsletter */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-lg font-bold">
                  {currentDir === 'rtl' ? 'تواصل معنا' : 'Contact Us'}
                </h3>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3 text-sm">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">
                      {currentDir === 'rtl' ? 'البريد الإلكتروني' : 'Email'}
                    </span>
                    <a 
                      href="mailto:support@wasata.com" 
                      className="text-foreground hover:text-primary transition-colors font-medium"
                    >
                      support@wasata.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">
                      {currentDir === 'rtl' ? 'الهاتف' : 'Phone'}
                    </span>
                    <a 
                      href="tel:+966XXXXXXXXX" 
                      className="text-foreground hover:text-primary transition-colors font-medium"
                    >
                      +966 XX XXX XXXX
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">
                      {currentDir === 'rtl' ? 'الموقع' : 'Location'}
                    </span>
                    <span className="text-foreground font-medium">
                      {currentDir === 'rtl' ? 'المملكة العربية السعودية' : 'Kingdom of Saudi Arabia'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
                <p className="text-sm font-semibold">
                  {currentDir === 'rtl' ? 'اشترك في النشرة الإخبارية' : 'Newsletter'}
                </p>
                <div className="flex gap-2">
                  <Input 
                    type="email" 
                    placeholder={currentDir === 'rtl' ? 'بريدك الإلكتروني' : 'Your email'}
                    className="h-10 text-sm"
                  />
                  <Button 
                    size="sm" 
                    className="h-10 px-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                  >
                    <ArrowRight className={cn(
                      "h-4 w-4",
                      currentDir === 'rtl' ? 'rotate-180' : ''
                    )} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Copyright */}
              <div className="flex flex-col md:flex-row items-center gap-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  © {new Date().getFullYear()} {language === 'ar' ? 'وساطة' : 'Wasata'}. {t('allRightsReserved')}.
                </p>
                <div className="hidden md:block w-1 h-1 rounded-full bg-muted-foreground/30" />
                <p className="flex items-center gap-1">
                  {currentDir === 'rtl' ? 'صنع بـ' : 'Made with'} 
                  <Heart className="h-3 w-3 text-primary fill-primary mx-1 animate-pulse" />
                  {currentDir === 'rtl' ? 'في السعودية' : 'in Saudi Arabia'}
                </p>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>{currentDir === 'rtl' ? 'آمن ومحمي' : 'Secure & Protected'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Globe className="h-4 w-4 text-secondary" />
                  <span>{currentDir === 'rtl' ? 'متاح بالعربية والإنجليزية' : 'Available in AR & EN'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
