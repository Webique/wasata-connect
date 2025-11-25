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
      
      // Auth
      name: "الاسم",
      phone: "رقم الهاتف",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      disabilityType: "نوع الإعاقة",
      selectDisabilityType: "اختر نوع الإعاقة",
      companyName: "اسم الشركة",
      crNumber: "رقم السجل التجاري",
      crDocument: "وثيقة السجل التجاري",
      mapsUrl: "رابط موقع الشركة (Google Maps)",
      mowaamaDoc: "شهادة المواءمة (اختياري)",
      uploadDocument: "رفع المستند",
      register: "التسجيل",
      alreadyHaveAccount: "لديك حساب؟",
      dontHaveAccount: "ليس لديك حساب؟",
      loginHere: "سجّل الدخول هنا",
      registerHere: "سجّل هنا",
      
      // Dashboard
      dashboard: "لوحة التحكم",
      myApplications: "طلباتي",
      myJobs: "وظائفي",
      applicants: "المتقدمون",
      addNewJob: "إضافة وظيفة جديدة",
      jobTitle: "المسمى الوظيفي",
      workingHours: "ساعات العمل",
      qualification: "المؤهل المطلوب",
      skills: "المهارات المطلوبة",
      minSalary: "الحد الأدنى للراتب",
      healthInsurance: "تأمين صحي",
      yes: "نعم",
      no: "لا",
      save: "حفظ",
      cancel: "إلغاء",
      edit: "تعديل",
      delete: "حذف",
      viewApplicants: "عرض المتقدمين",
      applicantName: "اسم المتقدم",
      applicantPhone: "هاتف المتقدم",
      applicantDisability: "نوع الإعاقة",
      cv: "السيرة الذاتية",
      downloadCV: "تحميل السيرة الذاتية",
      status: "الحالة",
      submitted: "مقدمة",
      reviewed: "قيد المراجعة",
      shortlisted: "قائمة مختصرة",
      rejected: "مرفوضة",
      active: "نشط",
      closed: "مغلق",
      pending: "قيد الانتظار",
      approved: "موافق عليه",
      rejected: "مرفوض",
      
      // Company Status
      companyPending: "قيد الموافقة",
      companyPendingMessage: "شركتك قيد المراجعة. سنتواصل معك قريباً.",
      companyRejected: "تم رفض الشركة",
      companyRejectedMessage: "تم رفض طلب تسجيل شركتك. يرجى التواصل مع الإدارة.",
      companyApproved: "شركة موافق عليها",
      companyApprovedMessage: "يمكنك الآن نشر الوظائف وإدارة المتقدمين.",
      
      // Admin
      adminDashboard: "لوحة تحكم الإدارة",
      companies: "الشركات",
      users: "المستخدمون",
      jobs: "الوظائف",
      applications: "الطلبات",
      approve: "موافقة",
      reject: "رفض",
      search: "بحث",
      filter: "تصفية",
      all: "الكل",
      
      // Job Details
      jobDetails: "تفاصيل الوظيفة",
      applyNow: "تقديم الآن",
      uploadCV: "رفع السيرة الذاتية",
      selectFile: "اختر ملف",
      applyForJob: "التقديم على الوظيفة",
      applicationSubmitted: "تم تقديم الطلب بنجاح",
      
      // Profile
      profile: "الملف الشخصي",
      editProfile: "تعديل الملف الشخصي",
      updateProfile: "تحديث الملف الشخصي",
      profileUpdated: "تم تحديث الملف الشخصي بنجاح",
      
      // Errors
      error: "خطأ",
      requiredField: "هذا الحقل مطلوب",
      invalidCredentials: "بيانات الدخول غير صحيحة",
      somethingWentWrong: "حدث خطأ ما",
      
      // Common
      welcome: "مرحباً",
      viewDetails: "عرض التفاصيل",
      noApplications: "لا توجد طلبات",
      noJobs: "لا توجد وظائف",
      back: "رجوع",
      submit: "إرسال",
      loginToApply: "سجّل الدخول للتقديم على الوظيفة",
      viewLocation: "عرض الموقع",
      
      // Register Selection
      chooseAccountType: "اختر نوع الحساب",
      registerAsSeekerDesc: "ابحث عن فرص عمل مناسبة لك",
      registerAsCompanyDesc: "انشر الوظائف ووظّف المواهب",
      seekerBenefit1: "تصفح الوظائف المتاحة",
      seekerBenefit2: "تقديم طلبات بسهولة",
      seekerBenefit3: "تتبع حالة طلباتك",
      companyBenefit1: "نشر الوظائف بسهولة",
      companyBenefit2: "إدارة المتقدمين",
      companyBenefit3: "البحث عن المواهب المناسبة",
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
      
      // Auth
      name: "Name",
      phone: "Phone Number",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      disabilityType: "Disability Type",
      selectDisabilityType: "Select Disability Type",
      companyName: "Company Name",
      crNumber: "Commercial Registration Number",
      crDocument: "CR Document",
      mapsUrl: "Company Location (Google Maps URL)",
      mowaamaDoc: "Mowa'ama Certificate (Optional)",
      uploadDocument: "Upload Document",
      register: "Register",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      loginHere: "Login here",
      registerHere: "Register here",
      
      // Dashboard
      dashboard: "Dashboard",
      myApplications: "My Applications",
      myJobs: "My Jobs",
      applicants: "Applicants",
      addNewJob: "Add New Job",
      jobTitle: "Job Title",
      workingHours: "Working Hours",
      qualification: "Required Qualification",
      skills: "Required Skills",
      minSalary: "Minimum Salary",
      healthInsurance: "Health Insurance",
      yes: "Yes",
      no: "No",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      viewApplicants: "View Applicants",
      applicantName: "Applicant Name",
      applicantPhone: "Applicant Phone",
      applicantDisability: "Disability Type",
      cv: "CV",
      downloadCV: "Download CV",
      status: "Status",
      submitted: "Submitted",
      reviewed: "Reviewed",
      shortlisted: "Shortlisted",
      rejected: "Rejected",
      active: "Active",
      closed: "Closed",
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      
      // Company Status
      companyPending: "Pending Approval",
      companyPendingMessage: "Your company is under review. We will contact you soon.",
      companyRejected: "Company Rejected",
      companyRejectedMessage: "Your company registration has been rejected. Please contact administration.",
      companyApproved: "Company Approved",
      companyApprovedMessage: "You can now post jobs and manage applicants.",
      
      // Admin
      adminDashboard: "Admin Dashboard",
      companies: "Companies",
      users: "Users",
      jobs: "Jobs",
      applications: "Applications",
      approve: "Approve",
      reject: "Reject",
      search: "Search",
      filter: "Filter",
      all: "All",
      
      // Job Details
      jobDetails: "Job Details",
      applyNow: "Apply Now",
      uploadCV: "Upload CV",
      selectFile: "Select File",
      applyForJob: "Apply for Job",
      applicationSubmitted: "Application submitted successfully",
      
      // Profile
      profile: "Profile",
      editProfile: "Edit Profile",
      updateProfile: "Update Profile",
      profileUpdated: "Profile updated successfully",
      
      // Errors
      error: "Error",
      requiredField: "This field is required",
      invalidCredentials: "Invalid credentials",
      somethingWentWrong: "Something went wrong",
      
      // Common
      welcome: "Welcome",
      viewDetails: "View Details",
      noApplications: "No applications",
      noJobs: "No jobs",
      back: "Back",
      submit: "Submit",
      loginToApply: "Login to apply for this job",
      viewLocation: "View Location",
      
      // Register Selection
      chooseAccountType: "Choose Account Type",
      registerAsSeekerDesc: "Find job opportunities that fit you",
      registerAsCompanyDesc: "Post jobs and hire talent",
      seekerBenefit1: "Browse available jobs",
      seekerBenefit2: "Apply easily",
      seekerBenefit3: "Track your applications",
      companyBenefit1: "Post jobs easily",
      companyBenefit2: "Manage applicants",
      companyBenefit3: "Find the right talent",
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
