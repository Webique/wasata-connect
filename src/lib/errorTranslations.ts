import { TFunction } from 'i18next';

/**
 * Translates common API error messages to the user's language
 * @param errorMessage - The error message from the API
 * @param t - Translation function from i18next
 * @returns Translated error message or original if no translation found
 */
export function translateErrorMessage(errorMessage: string | undefined, t: TFunction): string {
  if (!errorMessage) {
    return t('somethingWentWrong');
  }

  const errorLower = errorMessage.toLowerCase();

  // Common error message mappings
  const errorMappings: { [key: string]: string } = {
    'request failed': t('requestFailed'),
    'upload failed': t('uploadFailed'),
    'invalid credentials': t('invalidCredentials'),
    'authentication failed': t('invalidCredentials'),
    'unauthorized': t('invalidCredentials'),
    'not found': t('somethingWentWrong'),
    'server error': t('somethingWentWrong'),
    'network error': t('somethingWentWrong'),
    'passwords do not match': t('passwordsDoNotMatch'),
    'password do not match': t('passwordsDoNotMatch'),
    'this field is required': t('requiredField'),
    'field is required': t('requiredField'),
  };

  // Check for exact matches first
  for (const [key, translation] of Object.entries(errorMappings)) {
    if (errorLower.includes(key)) {
      return translation;
    }
  }

  // If no translation found, return the original message
  // This allows backend to send localized messages if needed
  return errorMessage;
}

