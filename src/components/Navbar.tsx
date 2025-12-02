import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Languages, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const { t } = useTranslation();
  const { language, toggleLanguage, dir } = useLanguage();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const currentDir = dir || 'rtl';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav 
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-card/95 backdrop-blur-md border-b border-border/50 shadow-lg" 
          : "bg-card/80 backdrop-blur-sm border-b border-border/30 shadow-sm"
      )}
      role="navigation" 
      aria-label="Main navigation"
      dir={currentDir}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group relative z-10"
            aria-label={language === 'ar' ? 'وساطة - الصفحة الرئيسية' : 'Wasata - Home'}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img 
                src="/images/logo.png" 
                alt={language === 'ar' ? 'وساطة' : 'Wasata'}
                className="relative h-14 w-auto transition-all duration-300 group-hover:scale-110 group-hover:brightness-110"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <Link to="/about">
              <Button 
                variant="ghost" 
                size="lg" 
                className={cn(
                  "text-base font-medium px-6 h-11 rounded-lg transition-all duration-200 relative group",
                  isActive('/about')
                    ? "text-primary bg-primary/10"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                )}
              >
                {t('about')}
                {isActive('/about') && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </Button>
            </Link>
            <Link to="/help">
              <Button 
                variant="ghost" 
                size="lg" 
                className={cn(
                  "text-base font-medium px-6 h-11 rounded-lg transition-all duration-200 relative group",
                  isActive('/help')
                    ? "text-primary bg-primary/10"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                )}
              >
                {t('help')}
                {isActive('/help') && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </Button>
            </Link>
            <Link to="/policies">
              <Button 
                variant="ghost" 
                size="lg" 
                className={cn(
                  "text-base font-medium px-6 h-11 rounded-lg transition-all duration-200 relative group",
                  isActive('/policies')
                    ? "text-primary bg-primary/10"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                )}
              >
                {t('policies')}
                {isActive('/policies') && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </Button>
            </Link>
          </div>

          {/* Auth & Language Toggle */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <Link to={user.role === 'user' ? '/dashboard/user' : user.role === 'company' ? '/dashboard/company' : '/admin/dashboard'}>
                  <Button 
                    variant="ghost" 
                    size="lg" 
                    className="text-base font-medium h-11 px-6 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-200"
                  >
                    {t('dashboard')}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={logout}
                  className="text-base font-medium h-11 px-6 rounded-lg border-2 hover:bg-muted/50 transition-all duration-200"
                >
                  {t('logout')}
                </Button>
              </>
            ) : (
              <>
            <Link to="/login">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="text-base font-medium h-11 px-6 rounded-lg border-2 hover:bg-muted/50 transition-all duration-200"
                  >
                {t('login')}
              </Button>
            </Link>
            <Link to="/register">
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="text-base font-semibold h-11 px-6 rounded-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                {t('register')}
              </Button>
            </Link>
              </>
            )}
            <Button
              variant="ghost"
              size="lg"
              onClick={toggleLanguage}
              aria-label={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
              className="h-11 w-11 rounded-lg hover:bg-muted/50 transition-all duration-200 relative group"
            >
              <Languages className="h-5 w-5 transition-transform group-hover:rotate-12" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="lg"
            className="lg:hidden h-11 w-11 rounded-lg relative z-10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <div className="relative w-6 h-6">
              <X 
                className={cn(
                  "absolute inset-0 h-6 w-6 transition-all duration-300",
                  mobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-0"
                )}
              />
              <Menu 
                className={cn(
                  "absolute inset-0 h-6 w-6 transition-all duration-300",
                  mobileMenuOpen ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
                )}
              />
            </div>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
            mobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="py-4 border-t border-border/50 space-y-1">
            <Link 
              to="/about" 
              onClick={() => setMobileMenuOpen(false)}
              className="block"
            >
              <Button 
                variant="ghost" 
                size="lg" 
                className={cn(
                  "w-full justify-start text-base h-12 rounded-lg transition-all duration-200",
                  isActive('/about')
                    ? "text-primary bg-primary/10 font-medium"
                    : "text-foreground/70"
                )}
              >
                  {t('about')}
                </Button>
              </Link>
            <Link 
              to="/help" 
              onClick={() => setMobileMenuOpen(false)}
              className="block"
            >
              <Button 
                variant="ghost" 
                size="lg" 
                className={cn(
                  "w-full justify-start text-base h-12 rounded-lg transition-all duration-200",
                  isActive('/help')
                    ? "text-primary bg-primary/10 font-medium"
                    : "text-foreground/70"
                )}
              >
                  {t('help')}
                </Button>
              </Link>
            <Link 
              to="/policies" 
              onClick={() => setMobileMenuOpen(false)}
              className="block"
            >
              <Button 
                variant="ghost" 
                size="lg" 
                className={cn(
                  "w-full justify-start text-base h-12 rounded-lg transition-all duration-200",
                  isActive('/policies')
                    ? "text-primary bg-primary/10 font-medium"
                    : "text-foreground/70"
                )}
              >
                  {t('policies')}
                </Button>
              </Link>
            <div className="h-px bg-border/50 my-3" />
            {user ? (
              <>
                <Link 
                  to={user.role === 'user' ? '/dashboard/user' : user.role === 'company' ? '/dashboard/company' : '/admin/dashboard'} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block"
                >
                  <Button 
                    variant="ghost" 
                    size="lg" 
                    className="w-full justify-start text-base h-12 rounded-lg font-medium"
                  >
                    {t('dashboard')}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-base h-12 rounded-lg border-2 font-medium"
                >
                  {t('logout')}
                </Button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block"
                >
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full text-base h-12 rounded-lg border-2 font-medium"
                  >
                  {t('login')}
                </Button>
              </Link>
                <Link 
                  to="/register" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block"
                >
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="w-full text-base h-12 rounded-lg bg-gradient-to-r from-primary to-primary/90 font-semibold shadow-lg"
                  >
                  {t('register')}
                </Button>
              </Link>
              </>
            )}
            <div className="h-px bg-border/50 my-3" />
              <Button
                variant="ghost"
                size="lg"
                onClick={() => {
                  toggleLanguage();
                  setMobileMenuOpen(false);
                }}
              className="w-full justify-start text-base h-12 rounded-lg font-medium"
              >
              <Languages className="h-5 w-5 me-2" />
                {language === 'ar' ? 'English' : 'العربية'}
              </Button>
            </div>
          </div>
      </div>
    </nav>
  );
};
