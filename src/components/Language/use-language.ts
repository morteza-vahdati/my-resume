import { Locale } from "@/i18config";
import create from "zustand";

interface Props {
  locale: Locale;
}

interface LanguageType extends Props {
  setLocale: (locale: Locale) => void;
}

const useLanguage = (initProps?: Partial<Props>) => {
  const DEFAULT_PROPS: Props = {
    locale: initProps?.locale ?? "en",
  };
  create<LanguageType>((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    setLocale: (locale) => set({ locale }),
  }));
};

export default useLanguage;
