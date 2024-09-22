import i18n from 'i18next';
import { map } from 'lodash';
import { initReactI18next } from 'react-i18next';

const DEFAULT_LANGUAGE = 'en';

const languages = ['en', 'es', 'de'];

const loadTranslations = async () => {
  const resources: Record<string, any> = {};

  await Promise.all(
    map(languages, async (lang) => {
      const translation = (await import(`./${lang}/index.ts`)).default;
      resources[lang] = {
        translation: translation.common.default,
      };
    })
  );

  return resources;
};

const initI18n = async () => {
  const resources = await loadTranslations();

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
};

initI18n();

export default i18n;
