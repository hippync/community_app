import { Heart, Users, Sparkles, ArrowRight } from 'lucide-react';
import { IconCard, Card } from '../components/Card';

interface AccueilProps {
  onNavigate: (page: string) => void;
}

export default function Accueil({ onNavigate }: AccueilProps) {
  const pillars = [
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: "S'impliquer localement",
      description: "Rejoignez une communauté engagée et participez à des actions concrètes près de chez vous.",
      color: "bg-[#60a5fa]",
    },
    {
      icon: <Heart className="w-8 h-8 text-white" />,
      title: "Soutenir des causes humaines",
      description: "Contribuez à des initiatives qui ont du sens et qui changent réellement la vie des gens.",
      color: "bg-[#34d399]",
    },
    {
      icon: <Sparkles className="w-8 h-8 text-white" />,
      title: "Créer un impact collectif",
      description: "Ensemble, nous pouvons accomplir ce qu'aucun d'entre nous ne pourrait faire seul.",
      color: "bg-[#1e40af]",
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
              Covalto est une initiative communautaire qui rassemble des personnes engagées autour de l'entraide et de l'action collective.
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

      {/* Section Piliers - 3 cartes arrondies */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
              <IconCard
                key={index}
                icon={pillar.icon}
                title={pillar.title}
                description={pillar.description}
                color={pillar.color}
              />
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
                Covalto est né d'un désir simple mais profond : <span className="font-semibold text-[#1e40af]">créer du lien et générer un impact positif à long terme</span> dans nos communautés.
              </p>
              <p>
                Nous croyons que chaque personne a quelque chose à offrir et que, ensemble, nous pouvons transformer notre façon de vivre en collectivité. Ce projet est en cours de développement, porté par une vision d'entraide authentique et d'engagement citoyen.
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
