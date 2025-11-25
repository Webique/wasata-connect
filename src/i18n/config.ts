import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      // Navigation
      home: "الرئيسية",
      about: "من نحن",
      help: "مركز المساعدة",
      policies: "السياسات",
      login: "تسجيل الدخول",
      register: "التسجيل",
      logout: "تسجيل الخروج",
      
      // Hero
      heroTitle: "وظّف مواهب متميزة من ذوي الإعاقة",
      heroSubtitle: "وابحث عن فرص عمل تناسبك",
      registerAsSeeker: "سجّل كباحث عن عمل",
      registerAsCompany: "سجّل كشركة",
      
      // How it Works
      howItWorks: "كيف يعمل",
      forSeekers: "للباحثين عن عمل",
      forCompanies: "للشركات",
      
      seeker1Title: "أنشئ حسابك",
      seeker1Desc: "سجّل معلوماتك ونوع الإعاقة بسهولة وأمان",
      seeker2Title: "تصفح الوظائف",
      seeker2Desc: "ابحث عن فرص العمل المناسبة لمهاراتك",
      seeker3Title: "قدّم طلبك",
      seeker3Desc: "أرسل سيرتك الذاتية وتواصل مع الشركات",
      
      company1Title: "سجّل شركتك",
      company1Desc: "قدّم مستندات التسجيل التجاري وانتظر الموافقة",
      company2Title: "انشر الوظائف",
      company2Desc: "أضف فرص العمل بتفاصيل واضحة",
      company3Title: "وظّف المواهب",
      company3Desc: "راجع المتقدمين واختر الأنسب لشركتك",
      
      // Trust
      trustTitle: "نلتزم بالشفافية والأمان",
      trustDesc: "جميع الشركات معتمدة ومراجعة. خصوصيتك وأمان بياناتك أولويتنا.",
      
      // Footer
      quickLinks: "روابط سريعة",
      accessibilityStatement: "بيان إمكانية الوصول",
      allRightsReserved: "جميع الحقوق محفوظة",
      
      // Disability Types
      visualImpairment: "الإعاقة البصرية",
      hearingImpairment: "الإعاقة السمعية",
      intellectualDisability: "الإعاقة العقلية",
      physicalDisability: "الإعاقة الجسمية والحركية",
      speechDisorder: "اضطرابات النطق والكلام",
      learningDifficulties: "صعوبات التعلم",
      behavioralDisorder: "الاضطرابات السلوكية والانفعالية",
      autism: "التوحد",
      multipleDisabilities: "الإعاقات المزدوجة والمتعددة",
    }
  },
  en: {
    translation: {
      // Navigation
      home: "Home",
      about: "About",
      help: "Help Center",
      policies: "Policies",
      login: "Login",
      register: "Register",
      logout: "Logout",
      
      // Hero
      heroTitle: "Hire Exceptional Disabled Talent",
      heroSubtitle: "Find Inclusive Opportunities That Fit You",
      registerAsSeeker: "Register as Job Seeker",
      registerAsCompany: "Register as Company",
      
      // How it Works
      howItWorks: "How It Works",
      forSeekers: "For Job Seekers",
      forCompanies: "For Companies",
      
      seeker1Title: "Create Your Account",
      seeker1Desc: "Register your information and disability type securely",
      seeker2Title: "Browse Jobs",
      seeker2Desc: "Find opportunities that match your skills",
      seeker3Title: "Apply",
      seeker3Desc: "Submit your CV and connect with companies",
      
      company1Title: "Register Your Company",
      company1Desc: "Submit commercial registration and await approval",
      company2Title: "Post Jobs",
      company2Desc: "Add job opportunities with clear details",
      company3Title: "Hire Talent",
      company3Desc: "Review applicants and choose the best fit",
      
      // Trust
      trustTitle: "Committed to Transparency and Safety",
      trustDesc: "All companies are verified and reviewed. Your privacy and data security are our priority.",
      
      // Footer
      quickLinks: "Quick Links",
      accessibilityStatement: "Accessibility Statement",
      allRightsReserved: "All Rights Reserved",
      
      // Disability Types
      visualImpairment: "Blind/Low Vision",
      hearingImpairment: "Deaf/Hard of Hearing",
      intellectualDisability: "Intellectual Disability",
      physicalDisability: "Physical/Mobility",
      speechDisorder: "Speech/Language",
      learningDifficulties: "Learning Difficulties",
      behavioralDisorder: "Behavioral/Emotional",
      autism: "Autism Spectrum",
      multipleDisabilities: "Multiple Disabilities",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'ar',
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
