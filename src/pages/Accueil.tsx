import { Heart, Users, Sparkles, ArrowRight } from 'lucide-react';
import { IconCard, Card } from '../components/Card';

interface AccueilProps {
  onNavigate: (page: string) => void;
}

export default function Accueil({ onNavigate }: AccueilProps) {
  const personas = [
    {
      icon: <Users className="w-8 h-8 text-white" />,
      emoji: "👥",
      title: "Citoyens engagés",
      description: "Étudiants, travailleurs, parents, retraités : bâtissez une réputation de confiance grâce au bénévolat et aux échanges solidaires.",
      color: "bg-[#60a5fa]",
    },
    {
      icon: <Heart className="w-8 h-8 text-white" />,
      emoji: "🤝",
      title: "OBNL & Organismes",
      description: "Recrutez des bénévoles fiables et motivés pour vos missions et initiatives locales.",
      color: "bg-[#34d399]",
    },
    {
      icon: <Sparkles className="w-8 h-8 text-white" />,
      emoji: "🏪",
      title: "Commerces locaux",
      description: "Attirez une clientèle engagée tout en soutenant votre communauté avec des récompenses.",
      color: "bg-[#1e40af]",
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Donnez du temps",
      description: "Participez à des missions bénévoles auprès d'OBNL vérifiés.",
    },
    {
      step: "2",
      title: "Gagnez du local",
      description: "Accumulez des points échangeables chez des commerces partenaires.",
    },
    {
      step: "3",
      title: "Prouvez votre fiabilité",
      description: "Bâtissez une réputation humaine basée sur vos contributions réelles.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1e40af] via-[#1e3a8a] to-[#1e293b] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#60a5fa] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
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
              Projet communautaire en développement
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-8">
              Redonner du temps.<br />
              Créer de l'impact.<br />
              <span className="bg-gradient-to-r from-[#60a5fa] to-[#34d399] bg-clip-text text-transparent">
                Ensemble.
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Donnez de votre temps à des OBNL, gagnez des récompenses chez des commerces locaux, et bâtissez une réputation basée sur l'entraide authentique dans des lieux sécuritaires.
            </p>
            <button
              onClick={() => onNavigate('fonctionnement')}
              className="inline-flex items-center gap-2 bg-white text-[#1e40af] px-10 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-xl"
            >
              Découvrir Covalto
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
              Comment ça fonctionne ?
            </h2>
            <p className="text-lg text-gray-600">
              Trois étapes simples pour transformer l'entraide en impact local
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <Card key={index}>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#1e40af] to-[#60a5fa] text-white text-2xl font-bold mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
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
              Pour qui ?
            </h2>
            <p className="text-lg text-gray-600">
              Covalto connecte trois acteurs essentiels de la communauté
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {personas.map((persona, index) => (
              <Card key={index} className="text-center">
                <div className="text-5xl mb-4">{persona.emoji}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{persona.title}</h3>
                <p className="text-gray-600 leading-relaxed">{persona.description}</p>
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
                Notre vision
              </h2>
            </div>
            <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
              <p>
                Covalto est né d'un désir simple mais profond : <span className="font-semibold text-[#1e40af]">transformer l'entraide en récompenses locales</span> tout en créant un impact positif durable dans nos communautés québécoises.
              </p>
              <p>
                Nous croyons que le bénévolat devrait être valorisé concrètement. C'est pourquoi nous connectons citoyens engagés, OBNL et commerces locaux dans un écosystème où chacun gagne : vous donnez de votre temps, vous recevez des avantages chez vos commerces de quartier, et vous bâtissez une réputation basée sur l'entraide authentique.
              </p>
              <p>
                Pour garantir votre sécurité, nous recommandons des points d'échange publics vérifiés (postes de police, bibliothèques) et mettons en place un système de références transparent.
              </p>
              <div className="bg-white border-l-4 border-[#1e40af] p-6 rounded-r-2xl shadow-sm">
                <p className="font-semibold text-[#1e40af] mb-2">
                  💡 Transparence totale
                </p>
                <p className="text-gray-700">
                  Nous sommes actuellement à l'étape de prototype conceptuel. Chaque personne qui manifeste son intérêt nous aide à construire cette initiative communautaire, étape par étape, ensemble.
                </p>
              </div>
            </div>
            <div className="mt-10 text-center">
              <button
                onClick={() => onNavigate('rejoindre')}
                className="btn-primary text-lg px-10 py-4"
              >
                Faire partie de l'aventure
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
