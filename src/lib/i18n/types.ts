export type Locale = "en" | "rw" | "fr";

export const LOCALES: { code: Locale; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "rw", label: "Kinyarwanda", native: "Ikinyarwanda" },
  { code: "fr", label: "French", native: "Français" },
];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_STORAGE_KEY = "empc-locale";

export interface TranslationDict {
  [key: string]: string | TranslationDict;
}
