import i18n from 'i18next';
import { get, map, split } from 'lodash';
import { initReactI18next } from 'react-i18next';

const LANGUAGE_FOLDER = import.meta.glob('./*/index.ts');

const DEFAULT_LANGUAGE = 'en';

const loadTranslations = async () => {
  const resources: Record<string, any> = {};

  const translationFiles = LANGUAGE_FOLDER

  const languages = map(Object.keys(translationFiles), file => get(split(file, '/'), '[1]'));

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
