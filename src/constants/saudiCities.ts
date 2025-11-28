export interface SaudiCity {
  value: string;
  labelAr: string;
  labelEn: string;
}

export const SAUDI_CITIES: SaudiCity[] = [
  { value: 'riyadh', labelAr: 'الرياض', labelEn: 'Riyadh' },
  { value: 'jeddah', labelAr: 'جدة', labelEn: 'Jeddah' },
  { value: 'mecca', labelAr: 'مكة المكرمة', labelEn: 'Mecca' },
  { value: 'medina', labelAr: 'المدينة المنورة', labelEn: 'Medina' },
  { value: 'dammam', labelAr: 'الدمام', labelEn: 'Dammam' },
  { value: 'taif', labelAr: 'الطائف', labelEn: 'Taif' },
  { value: 'tabuk', labelAr: 'تبوك', labelEn: 'Tabuk' },
  { value: 'buraydah', labelAr: 'بريدة', labelEn: 'Buraydah' },
  { value: 'abha', labelAr: 'أبها', labelEn: 'Abha' },
  { value: 'hail', labelAr: 'حائل', labelEn: 'Hail' },
  { value: 'najran', labelAr: 'نجران', labelEn: 'Najran' },
  { value: 'jazan', labelAr: 'جازان', labelEn: 'Jazan' },
  { value: 'sakaka', labelAr: 'سكاكا', labelEn: 'Sakaka' },
  { value: 'arar', labelAr: 'عرعر', labelEn: 'Arar' },
  { value: 'al-baha', labelAr: 'الباحة', labelEn: 'Al-Baha' },
  { value: 'hofuf', labelAr: 'الهفوف', labelEn: 'Hofuf' },
  { value: 'dhahran', labelAr: 'الظهران', labelEn: 'Dhahran' },
  { value: 'yanbu', labelAr: 'ينبع', labelEn: 'Yanbu' },
  { value: 'al-kharj', labelAr: 'الخرج', labelEn: 'Al-Kharj' },
  { value: 'qatif', labelAr: 'القطيف', labelEn: 'Qatif' },
  { value: 'khobar', labelAr: 'الخبر', labelEn: 'Khobar' },
  { value: 'jubail', labelAr: 'الجبيل', labelEn: 'Jubail' },
  { value: 'al-mubarraz', labelAr: 'المبرز', labelEn: 'Al-Mubarraz' },
  { value: 'khamis-mushait', labelAr: 'خميس مشيط', labelEn: 'Khamis Mushait' },
  { value: 'al-qunfudhah', labelAr: 'القنفذة', labelEn: 'Al-Qunfudhah' },
  { value: 'sharurah', labelAr: 'شرورة', labelEn: 'Sharurah' },
  { value: 'sabya', labelAr: 'صبيا', labelEn: 'Sabya' },
  { value: 'al-wajh', labelAr: 'الوجه', labelEn: 'Al-Wajh' },
  { value: 'duba', labelAr: 'ضباء', labelEn: 'Duba' },
  { value: 'al-ula', labelAr: 'العلا', labelEn: 'Al-Ula' },
  { value: 'al-jawf', labelAr: 'الجوف', labelEn: 'Al-Jawf' },
  { value: 'rafha', labelAr: 'رفحاء', labelEn: 'Rafha' },
  { value: 'turaif', labelAr: 'طريف', labelEn: 'Turaif' },
  { value: 'al-qurayyat', labelAr: 'القريات', labelEn: 'Al-Qurayyat' },
  { value: 'al-zulfi', labelAr: 'الزلفي', labelEn: 'Al-Zulfi' },
  { value: 'al-majmaah', labelAr: 'المجمعة', labelEn: 'Al-Majmaah' },
  { value: 'shaqra', labelAr: 'شقراء', labelEn: 'Shaqra' },
  { value: 'dawadmi', labelAr: 'الدوادمي', labelEn: 'Dawadmi' },
  { value: 'afif', labelAr: 'عفيف', labelEn: 'Afif' },
  { value: 'al-gwayiyyah', labelAr: 'القويعية', labelEn: 'Al-Gwayiyyah' },
  { value: 'wadi-al-dawasir', labelAr: 'وادي الدواسر', labelEn: 'Wadi Al-Dawasir' },
  { value: 'al-sulayyil', labelAr: 'السليل', labelEn: 'Al-Sulayyil' },
  { value: 'al-hariq', labelAr: 'الحريق', labelEn: 'Al-Hariq' },
  { value: 'al-dilam', labelAr: 'الدلم', labelEn: 'Al-Dilam' },
  { value: 'al-khafji', labelAr: 'الخفجي', labelEn: 'Al-Khafji' },
  { value: 'al-nuayriyah', labelAr: 'النعيرية', labelEn: 'Al-Nuayriyah' },
  { value: 'al-lith', labelAr: 'الليث', labelEn: 'Al-Lith' },
  { value: 'al-mandaq', labelAr: 'المندق', labelEn: 'Al-Mandaq' },
  { value: 'al-mukhwah', labelAr: 'المخواة', labelEn: 'Al-Mukhwah' },
  { value: 'haql', labelAr: 'حقل', labelEn: 'Haql' },
];

export const getCityLabel = (cityValue: string, language: 'ar' | 'en'): string => {
  const city = SAUDI_CITIES.find(c => c.value === cityValue);
  if (!city) return cityValue;
  return language === 'ar' ? city.labelAr : city.labelEn;
};
