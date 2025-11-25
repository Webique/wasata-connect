import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Languages, Menu, X } from 'lucide-react';
import { useState } from 'react';

export const Navbar = () => {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-sm" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
            aria-label={language === 'ar' ? 'وساطة - الصفحة الرئيسية' : 'Wasata - Home'}
          >
            <div className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent transition-transform group-hover:scale-105">
              {language === 'ar' ? 'وساطة' : 'Wasata'}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/about">
              <Button variant="ghost" size="lg" className="text-base">
                {t('about')}
              </Button>
            </Link>
            <Link to="/help">
              <Button variant="ghost" size="lg" className="text-base">
                {t('help')}
              </Button>
            </Link>
            <Link to="/policies">
              <Button variant="ghost" size="lg" className="text-base">
                {t('policies')}
              </Button>
            </Link>
          </div>

          {/* Auth & Language Toggle */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/login">
              <Button variant="outline" size="lg" className="text-base h-12 min-w-[120px]">
                {t('login')}
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="default" size="lg" className="text-base h-12 min-w-[120px] bg-primary hover:bg-primary/90">
                {t('register')}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="lg"
              onClick={toggleLanguage}
              aria-label={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
              className="h-12 w-12"
            >
              <Languages className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="lg"
            className="md:hidden h-12 w-12"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border" role="menu">
            <div className="flex flex-col gap-2">
              <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="lg" className="w-full justify-start text-base h-12">
                  {t('about')}
                </Button>
              </Link>
              <Link to="/help" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="lg" className="w-full justify-start text-base h-12">
                  {t('help')}
                </Button>
              </Link>
              <Link to="/policies" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="lg" className="w-full justify-start text-base h-12">
                  {t('policies')}
                </Button>
              </Link>
              <div className="h-px bg-border my-2" />
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="lg" className="w-full text-base h-12">
                  {t('login')}
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="default" size="lg" className="w-full text-base h-12 bg-primary hover:bg-primary/90">
                  {t('register')}
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => {
                  toggleLanguage();
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start text-base h-12 gap-2"
              >
                <Languages className="h-5 w-5" />
                {language === 'ar' ? 'English' : 'العربية'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
