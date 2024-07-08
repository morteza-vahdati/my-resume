import {
  createInstance,
  InitOptions,
  TFunction,
  i18n as I18nInstance,
} from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import i18Config from "./i18config";

interface InitTranslationsReturn {
  i18n: I18nInstance;
  resources: Record<string, any>; // Adjust if you have a more specific type for resources
  t: TFunction;
}

export default function initTranslations(
  locale: string,
  namespaces: string[],
  i18nInstance?: I18nInstance,
  resources?: Record<string, any> // Adjust if you have a more specific type for resources
): Promise<InitTranslationsReturn> {
  i18nInstance = i18nInstance || createInstance();

  i18nInstance.use(initReactI18next);

  if (!resources) {
    i18nInstance.use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`../locales/${language}/${namespace}.json`)
      )
    );
  }

  const initOptions: InitOptions = {
    lng: locale,
    resources,
    fallbackLng: i18Config.defaultLocale,
    supportedLngs: i18Config.locales,
    defaultNS: namespaces[0],
    fallbackNS: namespaces[0],
    ns: namespaces,
    preload: resources ? [] : i18Config.locales,
  };

  return i18nInstance.init(initOptions).then(() => ({
    i18n: i18nInstance!,
    resources: i18nInstance.services.resourceStore.data,
    t: i18nInstance.t,
  }));
}
