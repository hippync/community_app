import { createContext, useContext, useMemo, useState, useEffect, ReactNode } from "react";

export type Language = "fr" | "en";

interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const STORAGE_KEY = "collaboro_lang";
const FALLBACK_LANG: Language = "fr";

// Basic nested lookup: "home.hero.title" → translations[lang].home.hero.title
function resolveKey(
  translationsForLang: Record<string, any>,
  key: string
): string | undefined {
  return key.split(".").reduce<any>((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return acc[part];
    }
    return undefined;
  }, translationsForLang) as string | undefined;
}

// Minimal translations object; actual content lives in translations.ts
import { translations } from "./translations";

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [lang, setLangState] = useState<Language>(FALLBACK_LANG);

  useEffect(() => {
    // Initial language: localStorage > browser > fallback
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Language | null;
      if (stored === "fr" || stored === "en") {
        setLangState(stored);
        return;
      }
    } catch {
      // ignore
    }

    if (typeof navigator !== "undefined") {
      const browserLang = navigator.language || navigator.languages?.[0];
      if (browserLang?.toLowerCase().startsWith("fr")) {
        setLangState("fr");
      } else {
        setLangState("en");
      }
    }
  }, []);

  const setLang = (next: Language) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  };

  const value = useMemo<I18nContextValue>(() => {
    const t = (key: string): string => {
      const currentTranslations = translations[lang] ?? translations[FALLBACK_LANG];
      const fallbackTranslations = translations[FALLBACK_LANG];

      const fromCurrent = resolveKey(currentTranslations, key);
      if (typeof fromCurrent === "string") return fromCurrent;

      const fromFallback = resolveKey(fallbackTranslations, key);
      if (typeof fromFallback === "string") return fromFallback;

      // Last resort: return the key itself for easier debugging
      return key;
    };

    return { lang, setLang, t };
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within a LanguageProvider");
  }
  return ctx;
}
