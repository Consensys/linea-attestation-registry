// eslint-disable-next-line import/no-named-as-default
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/assets/locales/en/en.json";

const resources = {
  en: {
    translation: en,
  },
};

type TranslationKeys = `${keyof typeof en}`;

i18n.use(initReactI18next).init({
  debug: true,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  returnObjects: true,
  keySeparator: ".",
  resources,
});

export type ITranslationKeys = TranslationKeys | `${TranslationKeys}.${string}`;
export default i18n;
