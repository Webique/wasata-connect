import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, MessageCircle } from 'lucide-react';

const Help = () => {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col gap-12">
            <h1 className="text-4xl md:text-5xl font-bold">
              {language === 'ar' ? 'مركز المساعدة' : 'Help Center'}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="flex flex-col gap-4 p-8">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  </h3>
                  <p className="text-muted-foreground">
                    support@wasata.com
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col gap-4 p-8">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    {language === 'ar' ? 'واتساب' : 'WhatsApp'}
                  </h3>
                  <p className="text-muted-foreground">
                    +966 XX XXX XXXX
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Help;
