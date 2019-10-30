import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import common from './common.json';

export default (lng) => {
  if (!common[lng]) {
    lng = 'en';
  }

  i18n
    .use(initReactI18next)
    .init({
      lng,
      fallbackLng: 'en',
      resources: common,
      keySeparator: false,
      interpolation: {
        escapeValue: false,
      },
    });

  return i18n;
};
