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
    labelEn: 'Visual disability',
    descriptionEn: 'Includes individuals who are blind or have low vision',
  },
  {
    value: 'الإعاقة السمعية',
    labelAr: 'الإعاقة السمعية',
    descriptionAr: 'تشمل الصم والبكم، وضعاف السمع',
    labelEn: 'Hearing disability',
    descriptionEn: 'Includes individuals who are deaf, mute, or hard of hearing',
  },
  {
    value: 'الإعاقة العقلية',
    labelAr: 'الإعاقة العقلية',
    descriptionAr: 'تشمل حالات ضعف الإدراك والتطور العقلي',
    labelEn: 'Intellectual disability',
    descriptionEn: 'Includes cases of cognitive and developmental impairments',
  },
  {
    value: 'الإعاقة الجسمية والحركية',
    labelAr: 'الإعاقة الجسمية والحركية',
    descriptionAr: 'تشمل حالات الشلل، وبتر الأطراف، وضمور العضلات',
    labelEn: 'Physical and motor disability',
    descriptionEn: 'Includes cases such as paralysis, limb amputation, and muscular atrophy',
  },
  {
    value: 'اضطرابات النطق والكلام',
    labelAr: 'اضطرابات النطق والكلام',
    descriptionAr: 'تشمل مشاكل في القدرة على التحدث والتواصل',
    labelEn: 'Speech and language disorders',
    descriptionEn: 'Includes difficulties related to speaking and communication',
  },
  {
    value: 'صعوبات التعلم',
    labelAr: 'صعوبات التعلم',
    descriptionAr: 'تشمل صعوبات في اكتساب المهارات الأكاديمية الأساسية',
    labelEn: 'Learning disabilities',
    descriptionEn: 'Includes difficulties in acquiring basic academic skills',
  },
  {
    value: 'الاضطرابات السلوكية والانفعالية',
    labelAr: 'الاضطرابات السلوكية والانفعالية',
    descriptionAr: 'تشمل حالات اضطرابات المزاج والسلوك',
    labelEn: 'Behavioral and emotional disorders',
    descriptionEn: 'Includes cases involving mood or behavioral disorders',
  },
  {
    value: 'التوحد',
    labelAr: 'التوحد',
    descriptionAr: 'يشمل اضطراب طيف التوحد',
    labelEn: 'Autism',
    descriptionEn: 'Includes Autism Spectrum Disorder',
  },
  {
    value: 'الإعاقات المزدوجة والمتعددة',
    labelAr: 'الإعاقات المزدوجة والمتعددة',
    descriptionAr: 'حالات تضم أكثر من نوع واحد من الإعاقة',
    labelEn: 'Multiple or combined disabilities',
    descriptionEn: 'Cases that involve more than one type of disability',
  },
  {
    value: 'أخرى',
    labelAr: 'أخرى',
    descriptionAr: 'يرجى تحديد نوع الإعاقة',
    labelEn: 'Other',
    descriptionEn: 'Please specify the disability type',
  },
];

// Helper function to check if value is a custom "Other" value
export const isCustomDisabilityType = (value: string): boolean => {
  return value.startsWith('أخرى - ') || value.startsWith('Other - ');
};

// Helper function to extract custom text from "Other" value
export const extractCustomDisabilityText = (value: string): string => {
  if (value.startsWith('أخرى - ')) {
    return value.replace('أخرى - ', '');
  }
  if (value.startsWith('Other - ')) {
    return value.replace('Other - ', '');
  }
  return value;
};

// Helper function to get disability type by value
export const getDisabilityType = (value: string, language: 'ar' | 'en' = 'ar'): DisabilityType | undefined => {
  // If it's a custom "Other" value, return the "Other" type
  if (isCustomDisabilityType(value)) {
    return DISABILITY_TYPES.find(type => type.value === 'أخرى');
  }
  return DISABILITY_TYPES.find(type => type.value === value);
};

// Helper function to get label with description
export const getDisabilityLabel = (value: string, language: 'ar' | 'en' = 'ar'): string => {
  const type = getDisabilityType(value, language);
  if (!type) return value;
  
  // If it's a custom "Other" value, show "Other: [custom text]"
  if (isCustomDisabilityType(value)) {
    const customText = extractCustomDisabilityText(value);
    return language === 'ar' 
      ? `${type.labelAr}: ${customText}`
      : `${type.labelEn}: ${customText}`;
  }
  
  return language === 'ar' 
    ? `${type.labelAr}: ${type.descriptionAr}`
    : `${type.labelEn}: ${type.descriptionEn}`;
};

// Helper function to format disability type for display
export const formatDisabilityTypeForDisplay = (value: string, language: 'ar' | 'en' = 'ar'): string => {
  if (isCustomDisabilityType(value)) {
    const customText = extractCustomDisabilityText(value);
    const otherType = DISABILITY_TYPES.find(type => type.value === 'أخرى');
    if (otherType) {
      return language === 'ar' 
        ? `${otherType.labelAr}: ${customText}`
        : `${otherType.labelEn}: ${customText}`;
    }
    return customText;
  }
  
  const type = getDisabilityType(value, language);
  if (!type) return value;
  return language === 'ar' ? type.labelAr : type.labelEn;
};

