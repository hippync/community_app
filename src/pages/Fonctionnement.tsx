import { UserPlus, HandHeart, TrendingUp, ArrowRight } from "lucide-react";
import { Card } from "../components/Card";
import { useI18n } from "../i18n/i18n";

interface FonctionnementProps {
  onNavigate: (page: string) => void;
}

export default function Fonctionnement({ onNavigate }: FonctionnementProps) {
  const { lang } = useI18n();
  const isFr = lang === "fr";

  const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: isFr ? "Inscrivez-vous selon votre rôle" : "Sign up according to your role",
      description: isFr
        ? "Que vous soyez bénévole, OBNL ou commerce local, créez votre profil et rejoignez l'écosystème Collaboro."
        : "Whether you’re a volunteer, nonprofit or local business, create your profile and join the Collaboro ecosystem.",
      color: "from-[#1e40af] to-[#60a5fa]",
    },
    {
      number: "02",
      icon: HandHeart,
      title: isFr ? "Donnez du temps, gagnez des points" : "Give your time, earn points",
      description: isFr
        ? "Bénévoles : participez à des missions vérifiées. OBNL : publiez vos besoins. Commerces : offrez des récompenses."
        : "Volunteers: join verified missions. Nonprofits: publish your needs. Businesses: offer rewards.",
      color: "from-[#60a5fa] to-[#34d399]",
    },
    {
      number: "03",
      icon: TrendingUp,
      title: isFr ? "Bâtissez votre réputation locale" : "Build your local reputation",
      description: isFr
        ? "Échangez vos points contre des avantages locaux et construisez une réputation humaine basée sur l'entraide authentique."
        : "Redeem your points for local perks and build a human reputation based on genuine mutual aid.",
      color: "from-[#34d399] to-[#10b981]",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            {isFr ? "Comment ça fonctionne" : "How it works"}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            {isFr
              ? "Le système Collaboro transforme votre temps en récompenses locales. Voici comment bénévoles, OBNL et commerces collaborent ensemble."
              : "The Collaboro system turns your time into local rewards. Here’s how volunteers, nonprofits and businesses work together."}
          </p>
        </div>

        <div className="relative">
          {/* Ligne de progression */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#1e40af] via-[#60a5fa] to-[#34d399] transform -translate-y-1/2 opacity-20"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <Card className="p-6 sm:p-8 lg:p-10 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <span className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-100">
                        {step.number}
                      </span>
                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                      >
                        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                      </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                      {step.title}
                    </h3>

                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed flex-grow">
                      {step.description}
                    </p>

                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute -right-6 top-1/2 transform -translate-y-1/2">
                        <ArrowRight className="w-8 h-8 text-[#60a5fa]" />
                      </div>
                    )}
                  </Card>

                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center my-6">
                      <div className="w-1 h-12 bg-gradient-to-b from-[#60a5fa] to-[#34d399]"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 sm:mt-20 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            {isFr ? "Prêt à commencer ?" : "Ready to get started?"}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            {isFr
              ? "Rejoignez dès maintenant notre communauté en manifestant votre intérêt. Chaque nouvelle personne nous rapproche de notre vision collective."
              : "Join our community by expressing your interest now. Every new person brings us closer to our shared vision."}
          </p>
          <button
            onClick={() => onNavigate("rejoindre")}
            className="inline-flex items-center gap-2 bg-[#1e40af] text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-[#1e3a8a] transition-all hover:scale-105 shadow-lg"
          >
            {isFr ? "Manifester mon intérêt" : "Express my interest"}
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-600 px-4">
            <span className="font-semibold">{isFr ? "Note :" : "Note:"}</span>{" "}
            {isFr
              ? "Collaboro est actuellement en phase de prototype. Votre participation nous aide à construire cette initiative ensemble."
              : "Collaboro is currently in a prototype phase. Your participation helps us build this initiative together."}
          </p>
        </div>
      </div>
    </div>
  );
}
