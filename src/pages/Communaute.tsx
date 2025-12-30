import { Clock, MapPin, Heart, Users, ArrowRight } from 'lucide-react';
import { Card } from '../components/Card';

interface CommunauteProps {
  onNavigate: (page: string) => void;
}

export default function Communaute({ onNavigate }: CommunauteProps) {
  const testimonials = [
    {
      name: 'Sophie',
      role: 'Membre de la communauté',
      quote: "L'entraide crée des liens authentiques que j'avais perdus dans notre société moderne. J'ai hâte de voir Covalto prendre vie.",
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      name: 'Marc',
      role: 'Contributeur actif',
      quote: "Donner de son temps pour aider les autres donne un sens profond à mes journées. Ce projet répond à un vrai besoin.",
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      name: 'Amina',
      role: 'Ambassadrice',
      quote: "Ensemble, nous pouvons vraiment changer les choses. Covalto incarne l'espoir d'une communauté plus solidaire.",
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  const projectedImpact = [
    {
      icon: Clock,
      value: '5,000+',
      label: "Heures de bénévolat",
      description: 'Objectif de la première année à Montréal',
      color: 'bg-gradient-to-br from-[#60a5fa] to-[#3b82f6]',
    },
    {
      icon: MapPin,
      value: '5+',
      label: 'OBNL partenaires',
      description: 'Organismes vérifiés pour le pilote',
      color: 'bg-gradient-to-br from-[#34d399] to-[#10b981]',
    },
    {
      icon: Heart,
      value: '10+',
      label: 'Commerces locaux',
      description: 'Partenaires offrant des récompenses',
      color: 'bg-gradient-to-br from-[#1e40af] to-[#1e3a8a]',
    },
    {
      icon: Users,
      value: '50+',
      label: 'Bénévoles actifs',
      description: 'Objectif pour lancer le pilote',
      color: 'bg-gradient-to-br from-[#10b981] to-[#059669]',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Notre communauté
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-6">
            Découvrez l'écosystème tripartite qui unit bénévoles, OBNL et commerces locaux autour d'un système de récompenses basé sur l'entraide.
          </p>
          <div className="inline-block bg-blue-50 border border-blue-200 rounded-2xl px-6 py-3">
            <p className="text-sm text-[#1e40af] font-medium">
              <span className="font-bold">Note importante :</span> Les contenus suivants sont illustratifs et représentent notre vision future. Covalto est actuellement en phase de prototype.
            </p>
          </div>
        </div>

        {/* Bloc 1: Témoignages illustratifs */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Témoignages illustratifs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-blue-100 shadow-lg"
                  />
                  <div className="ml-4">
                    <h3 className="font-bold text-lg text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <blockquote className="text-gray-700 leading-relaxed italic">
                  "{testimonial.quote}"
                </blockquote>
              </Card>
            ))}
          </div>
        </div>

        {/* Bloc 2: Impact projeté */}
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-3xl p-8 sm:p-12 mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Impact projeté
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Nos objectifs pour le pilote montréalais : 5 OBNL, 10 commerces et 50 bénévoles actifs.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {projectedImpact.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className={`${item.color} w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-[#1e40af] to-[#60a5fa] bg-clip-text text-transparent mb-2">
                    {item.value}
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-2">{item.label}</div>
                  <div className="text-sm text-gray-600">{item.description}</div>
                </div>
              );
            })}
          </div>
          <p className="text-center text-sm text-gray-600 mt-8 italic">
            Ces chiffres représentent nos objectifs pour le lancement du pilote à Montréal en 2026.
          </p>
        </div>

        {/* Bloc 3: Message collectif fort */}
        <div className="bg-gradient-to-br from-[#1e40af] to-[#1e3a8a] text-white rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            La force du collectif
          </h2>
          <div className="max-w-3xl mx-auto space-y-6 text-lg leading-relaxed mb-8">
            <p>
              Covalto repose sur une conviction profonde : ensemble, nous sommes plus forts. Chaque geste compte, chaque contribution fait la différence.
            </p>
            <p>
              Notre communauté sera construite sur des valeurs de solidarité, de respect et d'engagement authentique. Nous croyons en un modèle d'entraide où chacun apporte ce qu'il peut, selon ses moyens et ses capacités.
            </p>
            <p className="font-semibold text-blue-100">
              Ce projet n'existe que grâce aux personnes qui croient en cette vision et qui souhaitent faire partie de ce mouvement collectif.
            </p>
          </div>
          <button
            onClick={() => onNavigate('rejoindre')}
            className="inline-flex items-center gap-2 bg-white text-[#1e40af] px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-xl"
          >
            Rejoindre le mouvement
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
