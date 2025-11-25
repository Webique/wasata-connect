import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return (
    <footer className="bg-card border-t border-border mt-auto" role="contentinfo">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              {language === 'ar' ? 'وساطة' : 'Wasata'}
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {t('trustDesc')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">{t('quickLinks')}</h3>
            <nav className="flex flex-col gap-3" aria-label="Footer navigation">
              <Link 
                to="/" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('home')}
              </Link>
              <Link 
                to="/about" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('about')}
              </Link>
              <Link 
                to="/help" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('help')}
              </Link>
              <Link 
                to="/policies" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('policies')}
              </Link>
            </nav>
          </div>

          {/* Accessibility */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">{t('accessibilityStatement')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {language === 'ar' 
                ? 'نلتزم بتوفير منصة يسهل الوصول إليها للجميع. إذا واجهت أي مشاكل، يرجى الاتصال بنا.'
                : 'We are committed to providing an accessible platform for everyone. If you experience any issues, please contact us.'}
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground">
          <p>© 2025 {language === 'ar' ? 'وساطة' : 'Wasata'}. {t('allRightsReserved')}.</p>
        </div>
      </div>
    </footer>
  );
};
