import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <h1 className="text-4xl md:text-5xl font-bold">
              {language === 'ar' ? 'من نحن' : 'About Us'}
            </h1>
            <div className="prose prose-lg max-w-none">
              {language === 'ar' ? (
                <>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    وساطة هي منصة رائدة تربط بين الأشخاص ذوي الإعاقة وفرص العمل المناسبة، مع التزام كامل بالشفافية والأمان والشمولية.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-6">
                    نؤمن بأن كل شخص يستحق فرصة عادلة في سوق العمل. مهمتنا هي إزالة الحواجز وبناء جسور الثقة بين الباحثين عن عمل والشركات.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Wasata is a leading platform connecting people with disabilities to suitable job opportunities, with full commitment to transparency, security, and inclusion.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-6">
                    We believe everyone deserves a fair chance in the job market. Our mission is to remove barriers and build trust bridges between job seekers and companies.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
