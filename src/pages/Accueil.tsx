import { Heart, Users, Sparkles, ArrowRight } from "lucide-react";
import { Card } from "../components/Card";
import { useI18n } from "../i18n/i18n";

interface AccueilProps {
  onNavigate: (page: string) => void;
}

export default function Accueil({ onNavigate }: AccueilProps) {
  const { lang, t } = useI18n();
  const isFr = lang === "fr";

  const personas = [
    {
      icon: <Users className="w-8 h-8 text-white" />,
      emoji: "👥",
      title: isFr ? "Citoyens engagés" : "Engaged citizens",
      description: isFr
        ? "Étudiants, travailleurs, parents, retraités : bâtissez une réputation de confiance grâce au bénévolat et aux échanges solidaires."
        : "Students, workers, parents, retirees: build a trusted reputation through volunteering and mutual aid.",
      color: "bg-[#60a5fa]",
    },
    {
      icon: <Heart className="w-8 h-8 text-white" />,
      emoji: "🤝",
      title: isFr ? "OBNL & Organismes" : "Nonprofits & organizations",
      description: isFr
        ? "Recrutez des bénévoles fiables et motivés pour vos missions et initiatives locales."
        : "Recruit reliable, motivated volunteers for your missions and local initiatives.",
      color: "bg-[#34d399]",
    },
    {
      icon: <Sparkles className="w-8 h-8 text-white" />,
      emoji: "🏪",
      title: isFr ? "Commerces locaux" : "Local businesses",
      description: isFr
        ? "Attirez une clientèle engagée tout en soutenant votre communauté avec des récompenses."
        : "Attract engaged customers while supporting your community with local rewards.",
      color: "bg-[#1e40af]",
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: isFr ? "Donnez du temps" : "Give your time",
      description: isFr
        ? "Participez à des missions bénévoles auprès d'OBNL vérifiés."
        : "Take part in volunteer missions with verified nonprofits.",
    },
    {
      step: "2",
      title: isFr ? "Gagnez du local" : "Earn local rewards",
      description: isFr
        ? "Accumulez des points échangeables chez des commerces partenaires."
        : "Collect points you can redeem at local partner businesses.",
    },
    {
      step: "3",
      title: isFr ? "Prouvez votre fiabilité" : "Show your reliability",
      description: isFr
        ? "Bâtissez une réputation humaine basée sur vos contributions réelles."
        : "Build a human reputation based on real contributions.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1e40af] via-[#1e3a8a] to-[#1e293b] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-[#60a5fa] rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* Illustration/Image humaine représentant la communauté */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 flex items-center justify-center">
            <Users className="w-96 h-96 text-white" />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-semibold border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              {isFr ? "Projet communautaire en développement" : "Community project in development"}
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-8">
              {isFr ? "Redonner du temps." : "Give back your time."}
              <br />
              {isFr ? "Créer de l'impact." : "Create local impact."}
              <br />
              <span className="bg-gradient-to-r from-[#60a5fa] to-[#34d399] bg-clip-text text-transparent">
                {isFr ? "Ensemble." : "Together."}
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              {isFr
                ? "Donnez de votre temps à des OBNL, gagnez des récompenses chez des commerces locaux, et bâtissez une réputation basée sur l'entraide authentique dans des lieux sécuritaires."
                : "Give your time to nonprofits, earn rewards at local businesses, and build a reputation based on genuine mutual aid in safe spaces."}
            </p>
            <button
              onClick={() => onNavigate("decouvrir")}
              className="inline-flex items-center gap-2 bg-white text-[#1e40af] px-10 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-xl"
            >
              {t("common.ctaDiscover")}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Section Comment ça marche - 3 étapes */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {isFr ? "Comment ça fonctionne ?" : "How does it work?"}
            </h2>
            <p className="text-lg text-gray-600">
              {isFr
                ? "Trois étapes simples pour transformer l'entraide en impact local"
                : "Three simple steps to turn mutual aid into local impact"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <Card key={index}>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#1e40af] to-[#60a5fa] text-white text-2xl font-bold mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section Pour qui - 3 personas */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {isFr ? "Pour qui ?" : "Who is it for?"}
            </h2>
            <p className="text-lg text-gray-600">
              {isFr
                ? "Collaboro connecte trois acteurs essentiels de la communauté"
                : "Collaboro connects three essential actors in the community"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {personas.map((persona, index) => (
              <Card key={index} className="text-center">
                <div className="text-5xl mb-4">{persona.emoji}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {persona.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {persona.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section Vision */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-blue-50 to-green-50">
            <div className="text-center mb-8">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                {isFr ? "Notre vision" : "Our vision"}
              </h2>
            </div>
            <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
              <p>
                {isFr ? (
                  <>
                    Collaboro est né d'un désir simple mais profond :{" "}
                    <span className="font-semibold text-[#1e40af]">
                      transformer l'entraide en récompenses locales
                    </span>{" "}
                    tout en créant un impact positif durable dans nos communautés
                    québécoises.
                  </>
                ) : (
                  <>
                    Collaboro was born from a simple but deep desire: {""}
                    <span className="font-semibold text-[#1e40af]">
                      turning mutual aid into local rewards
                    </span>{" "}
                    while creating lasting positive impact in Québec communities.
                  </>
                )}
              </p>
              <p>
                {isFr
                  ? "Nous croyons que le bénévolat devrait être valorisé concrètement. C'est pourquoi nous connectons citoyens engagés, OBNL et commerces locaux dans un écosystème où chacun gagne : vous donnez de votre temps, vous recevez des avantages chez vos commerces de quartier, et vous bâtissez une réputation basée sur l'entraide authentique."
                  : "We believe volunteering should be valued in a concrete way. That’s why we connect engaged citizens, nonprofits and local businesses in an ecosystem where everyone wins: you give your time, you receive perks at neighborhood businesses, and you build a reputation based on genuine mutual aid."}
              </p>
              <p>
                {isFr
                  ? "Pour garantir votre sécurité, nous recommandons des points d'échange publics vérifiés (postes de police, bibliothèques) et mettons en place un système de références transparent."
                  : "To keep you safe, we recommend verified public exchange points (police stations, libraries) and are designing a transparent reference system."}
              </p>
              <div className="bg-white border-l-4 border-[#1e40af] p-6 rounded-r-2xl shadow-sm">
                <p className="font-semibold text-[#1e40af] mb-2">
                  {isFr ? "💡 Transparence totale" : "💡 Full transparency"}
                </p>
                <p className="text-gray-700">
                  {isFr
                    ? "Nous sommes actuellement à l'étape de prototype conceptuel. Chaque personne qui manifeste son intérêt nous aide à construire cette initiative communautaire, étape par étape, ensemble."
                    : "We’re currently at the conceptual prototype stage. Every person who shows interest helps us build this community initiative, step by step, together."}
                </p>
              </div>
            </div>
            <div className="mt-10 text-center">
              <button
                onClick={() => onNavigate("rejoindre")}
                className="btn-primary text-lg px-10 py-4"
              >
                {isFr ? "Faire partie de l'aventure" : "Be part of the journey"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
