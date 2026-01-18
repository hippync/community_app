import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useI18n } from "../i18n/i18n";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navigation({
  currentPage,
  onNavigate,
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useI18n();

  const navItems = [
    { id: "accueil", labelKey: "nav.accueil" },
    { id: "fonctionnement", labelKey: "nav.fonctionnement" },
    { id: "decouvrir", labelKey: "nav.decouvrir" },
    { id: "communaute", labelKey: "nav.communaute" },
    { id: "securite", labelKey: "nav.securite" },
    { id: "rejoindre", labelKey: "nav.rejoindre" },
  ];

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button
            onClick={() => handleNavClick("accueil")}
            className="text-3xl font-bold bg-gradient-to-r from-[#1e40af] to-[#60a5fa] bg-clip-text text-transparent hover:scale-105 transition-transform"
          >
            {t("nav.brand")}
          </button>

          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  currentPage === item.id
                    ? "bg-[#1e40af] text-white shadow-lg shadow-blue-500/30"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {t(item.labelKey)}
              </button>
            ))}

            {/* Language toggle */}
            <div className="flex items-center gap-1 rounded-full bg-gray-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLang("fr")}
                className={`px-3 py-1 rounded-full ${
                  lang === "fr" ? "bg-white text-[#1e40af] shadow-sm" : "text-gray-600"
                }`}
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-3 py-1 rounded-full ${
                  lang === "en" ? "bg-white text-[#1e40af] shadow-sm" : "text-gray-600"
                }`}
              >
                EN
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-2">
            {/* Language toggle (mobile) */}
            <div className="flex justify-end mb-2">
              <div className="flex items-center gap-1 rounded-full bg-gray-100 p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setLang("fr")}
                  className={`px-3 py-1 rounded-full ${
                    lang === "fr" ? "bg-white text-[#1e40af] shadow-sm" : "text-gray-600"
                  }`}
                >
                  FR
                </button>
                <button
                  type="button"
                  onClick={() => setLang("en")}
                  className={`px-3 py-1 rounded-full ${
                    lang === "en" ? "bg-white text-[#1e40af] shadow-sm" : "text-gray-600"
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-6 py-4 rounded-2xl text-base font-semibold transition-all ${
                  currentPage === item.id
                    ? "bg-[#1e40af] text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {t(item.labelKey)}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
