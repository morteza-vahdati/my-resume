import "server-only";
import type { Locale } from "@/i18config";

const getFile = (local: Locale, collection: string) =>
  import(`../../locales/${local}/${collection}.json`).then(
    (module) => module.default
  );

export const getDictionary = async (locale: Locale, collection: string) =>
  getFile(locale, collection);
