import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Policies = () => {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <h1 className="text-4xl md:text-5xl font-bold">
              {language === 'ar' ? 'السياسات' : 'Policies'}
            </h1>
            
            <Tabs defaultValue="terms" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-auto">
                <TabsTrigger value="terms" className="text-base h-12">
                  {language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
                </TabsTrigger>
                <TabsTrigger value="privacy" className="text-base h-12">
                  {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="terms" className="mt-8">
                <div className="prose prose-lg max-w-none">
                  {language === 'ar' ? (
                    <>
                      <h2>الشروط والأحكام</h2>
                      <p className="text-muted-foreground">
                        باستخدام منصة وساطة، فإنك توافق على الشروط والأحكام التالية...
                      </p>
                    </>
                  ) : (
                    <>
                      <h2>Terms & Conditions</h2>
                      <p className="text-muted-foreground">
                        By using the Wasata platform, you agree to the following terms and conditions...
                      </p>
                    </>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="privacy" className="mt-8">
                <div className="prose prose-lg max-w-none">
                  {language === 'ar' ? (
                    <>
                      <h2>سياسة الخصوصية</h2>
                      <p className="text-muted-foreground">
                        نحن نلتزم بحماية خصوصيتك وأمان بياناتك الشخصية...
                      </p>
                    </>
                  ) : (
                    <>
                      <h2>Privacy Policy</h2>
                      <p className="text-muted-foreground">
                        We are committed to protecting your privacy and securing your personal data...
                      </p>
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Policies;
