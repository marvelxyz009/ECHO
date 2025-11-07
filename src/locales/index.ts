import en from "@/locales/en";
import vi from "@/locales/vi";

export const supportedLocales = ["vi", "en"] as const;
export type LocaleCode = (typeof supportedLocales)[number];

export const dictionaries: Record<LocaleCode, typeof en> = {
  en,
  vi,
};

export const defaultLocale: LocaleCode = "vi";

