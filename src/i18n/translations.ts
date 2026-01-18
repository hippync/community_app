import type { Language } from "./i18n";

// Central translations registry. Start with navigation + a few common strings,
// then extend as we internationalize each page.

interface TranslationsPerLang {
  nav: {
    brand: string;
    accueil: string;
    fonctionnement: string;
    decouvrir: string;
    communaute: string;
    securite: string;
    rejoindre: string;
    languageToggleLabel: string;
  };
  common: {
    ctaDiscover: string;
    ctaJoin: string;
  };
}

export const translations: Record<Language, TranslationsPerLang & Record<string, any>> = {
  fr: {
    nav: {
      brand: "Collaboro",
      accueil: "Accueil",
      fonctionnement: "Comment ça fonctionne",
      decouvrir: "Découvrir",
      communaute: "Communauté",
      securite: "Sécurité",
      rejoindre: "Rejoindre",
      languageToggleLabel: "Langue",
    },
    common: {
      ctaDiscover: "Découvrir Collaboro",
      ctaJoin: "Rejoindre le mouvement",
    },
  },
  en: {
    nav: {
      brand: "Collaboro",
      accueil: "Home",
      fonctionnement: "How it works",
      decouvrir: "Explore",
      communaute: "Community",
      securite: "Safety",
      rejoindre: "Join",
      languageToggleLabel: "Language",
    },
    common: {
      ctaDiscover: "Discover Collaboro",
      ctaJoin: "Join the movement",
    },
  },
};
