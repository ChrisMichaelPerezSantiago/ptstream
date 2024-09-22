import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import es from './es'
import en from './en'

const DEFAULT_LANGUAGE = 'en';

const resources = {
  en: {
    translation: en.common.default,
  },
  es: {
    translation: es.common.default,
  },
};
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    lng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;