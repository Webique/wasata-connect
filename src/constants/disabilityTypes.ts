// Disability types with descriptions
export interface DisabilityType {
  value: string; // Arabic name (stored in DB)
  labelAr: string; // Arabic label
  descriptionAr: string; // Arabic description
  labelEn: string; // English label
  descriptionEn: string; // English description
}

export const DISABILITY_TYPES: DisabilityType[] = [
  {
    value: 'الإعاقة البصرية',
    labelAr: 'الإعاقة البصرية',
    descriptionAr: 'تشمل المكفوفين وضعاف البصر',
    labelEn: 'Visual Impairment',
    descriptionEn: 'Includes blind and visually impaired individuals',
  },
  {
    value: 'الإعاقة السمعية',
    labelAr: 'الإعاقة السمعية',
    descriptionAr: 'تشمل الصم والبكم، وضعاف السمع',
    labelEn: 'Hearing Impairment',
    descriptionEn: 'Includes deaf, mute, and hearing impaired individuals',
  },
  {
    value: 'الإعاقة العقلية',
    labelAr: 'الإعاقة العقلية',
    descriptionAr: 'تشمل حالات ضعف الإدراك والتطور العقلي',
    labelEn: 'Intellectual Disability',
    descriptionEn: 'Includes cases of cognitive and intellectual development impairment',
  },
  {
    value: 'الإعاقة الجسمية والحركية',
    labelAr: 'الإعاقة الجسمية والحركية',
    descriptionAr: 'تشمل حالات الشلل، وبتر الأطراف، وضمور العضلات',
    labelEn: 'Physical and Motor Disability',
    descriptionEn: 'Includes cases of paralysis, limb amputation, and muscle atrophy',
  },
  {
    value: 'اضطرابات النطق والكلام',
    labelAr: 'اضطرابات النطق والكلام',
    descriptionAr: 'تشمل مشاكل في القدرة على التحدث والتواصل',
    labelEn: 'Speech and Language Disorders',
    descriptionEn: 'Includes problems with speaking and communication abilities',
  },
  {
    value: 'صعوبات التعلم',
    labelAr: 'صعوبات التعلم',
    descriptionAr: 'تشمل صعوبات في اكتساب المهارات الأكاديمية الأساسية',
    labelEn: 'Learning Difficulties',
    descriptionEn: 'Includes difficulties in acquiring basic academic skills',
  },
  {
    value: 'الاضطرابات السلوكية والانفعالية',
    labelAr: 'الاضطرابات السلوكية والانفعالية',
    descriptionAr: 'تشمل حالات اضطرابات المزاج والسلوك',
    labelEn: 'Behavioral and Emotional Disorders',
    descriptionEn: 'Includes cases of mood and behavioral disorders',
  },
  {
    value: 'التوحد',
    labelAr: 'التوحد',
    descriptionAr: 'يشمل اضطراب طيف التوحد',
    labelEn: 'Autism',
    descriptionEn: 'Includes autism spectrum disorder',
  },
  {
    value: 'الإعاقات المزدوجة والمتعددة',
    labelAr: 'الإعاقات المزدوجة والمتعددة',
    descriptionAr: 'حالات تضم أكثر من نوع واحد من الإعاقة',
    labelEn: 'Multiple Disabilities',
    descriptionEn: 'Cases involving more than one type of disability',
  },
];

// Helper function to get disability type by value
export const getDisabilityType = (value: string, language: 'ar' | 'en' = 'ar'): DisabilityType | undefined => {
  return DISABILITY_TYPES.find(type => type.value === value);
};

// Helper function to get label with description
export const getDisabilityLabel = (value: string, language: 'ar' | 'en' = 'ar'): string => {
  const type = getDisabilityType(value, language);
  if (!type) return value;
  return language === 'ar' 
    ? `${type.labelAr}: ${type.descriptionAr}`
    : `${type.labelEn}: ${type.descriptionEn}`;
};

