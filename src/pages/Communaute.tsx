import { Clock, MapPin, Heart, Users, ArrowRight } from "lucide-react";
import { Card } from "../components/Card";
import { useI18n } from "../i18n/i18n";

interface CommunauteProps {
  onNavigate: (page: string) => void;
}

export default function Communaute({ onNavigate }: CommunauteProps) {
  const { lang } = useI18n();
  const isFr = lang === "fr";

  const testimonials = [
    {
      name: "Sophie",
      role: isFr ? "Membre de la communauté" : "Community member",
      quote: isFr
        ? "L'entraide crée des liens authentiques que j'avais perdus dans notre société moderne. J'ai hâte de voir Collaboro prendre vie."
        : "Mutual aid creates authentic bonds I had lost in our modern society. I can’t wait to see Collaboro come to life.",
      image:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Marc",
      role: isFr ? "Contributeur actif" : "Active contributor",
      quote: isFr
        ? "Donner de son temps pour aider les autres donne un sens profond à mes journées. Ce projet répond à un vrai besoin."
        : "Giving my time to help others gives deep meaning to my days. This project answers a real need.",
      image:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Amina",
      role: isFr ? "Ambassadrice" : "Ambassador",
      quote: isFr
        ? "Ensemble, nous pouvons vraiment changer les choses. Collaboro incarne l'espoir d'une communauté plus solidaire."
        : "Together, we can really change things. Collaboro embodies the hope of a more caring community.",
      image:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ];

  const projectedImpact = [
    {
      icon: Clock,
      value: "5,000+",
      label: "Heures de bénévolat",
      description: "Objectif de la première année à Montréal",
      color: "bg-gradient-to-br from-[#60a5fa] to-[#3b82f6]",
    },
    {
      icon: MapPin,
      value: "5+",
      label: "OBNL partenaires",
      description: "Organismes vérifiés pour le pilote",
      color: "bg-gradient-to-br from-[#34d399] to-[#10b981]",
    },
    {
      icon: Heart,
      value: "10+",
      label: "Commerces locaux",
      description: "Partenaires offrant des récompenses",
      color: "bg-gradient-to-br from-[#1e40af] to-[#1e3a8a]",
    },
    {
      icon: Users,
      value: "50+",
      label: "Bénévoles actifs",
      description: "Objectif pour lancer le pilote",
      color: "bg-gradient-to-br from-[#10b981] to-[#059669]",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            {isFr ? "Notre communauté" : "Our community"}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-6">
            {isFr
              ? "Découvrez l'écosystème tripartite qui unit bénévoles, OBNL et commerces locaux autour d'un système de récompenses basé sur l'entraide."
              : "Discover the three-way ecosystem that connects volunteers, nonprofits and local businesses around a reward system based on mutual aid."}
          </p>
          <div className="inline-block bg-blue-50 border border-blue-200 rounded-2xl px-6 py-3">
            <p className="text-sm text-[#1e40af] font-medium">
              <span className="font-bold">{isFr ? "Note importante :" : "Important note:"}</span>{" "}
              {isFr
                ? "Les contenus suivants sont illustratifs et représentent notre vision future. Collaboro est actuellement en phase de prototype."
                : "The following content is illustrative and represents our future vision. Collaboro is currently in a prototype phase."}
            </p>
          </div>
        </div>

        {/* Bloc 1: Témoignages illustratifs */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            {isFr ? "Témoignages illustratifs" : "Illustrative testimonials"}
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
                    <h3 className="font-bold text-lg text-gray-900">
                      {testimonial.name}
                    </h3>
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
            {isFr ? "Impact projeté" : "Projected impact"}
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            {isFr
              ? "Nos objectifs pour le pilote montréalais : 5 OBNL, 10 commerces et 50 bénévoles actifs."
              : "Our goals for the Montréal pilot: 5 nonprofits, 10 businesses and 50 active volunteers."}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {projectedImpact.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div
                    className={`${item.color} w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-[#1e40af] to-[#60a5fa] bg-clip-text text-transparent mb-2">
                    {item.value}
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-2">
                    {item.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {item.description}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-center text-sm text-gray-600 mt-8 italic">
            {isFr
              ? "Ces chiffres représentent nos objectifs pour le lancement du pilote à Montréal en 2026."
              : "These numbers represent our goals for the pilot launch in Montréal in 2026."}
          </p>
        </div>

        {/* Bloc 3: Message collectif fort */}
        <div className="bg-gradient-to-br from-[#1e40af] to-[#1e3a8a] text-white rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {isFr ? "La force du collectif" : "The strength of the collective"}
          </h2>
          <div className="max-w-3xl mx-auto space-y-6 text-lg leading-relaxed mb-8">
            <p>
              {isFr
                ? "Collaboro repose sur une conviction profonde : ensemble, nous sommes plus forts. Chaque geste compte, chaque contribution fait la différence."
                : "Collaboro is built on a deep belief: together, we are stronger. Every gesture matters, every contribution makes a difference."}
            </p>
            <p>
              {isFr
                ? "Notre communauté sera construite sur des valeurs de solidarité, de respect et d'engagement authentique. Nous croyons en un modèle d'entraide où chacun apporte ce qu'il peut, selon ses moyens et ses capacités."
                : "Our community is built on solidarity, respect and authentic commitment. We believe in a model of mutual aid where everyone brings what they can, according to their means and capacities."}
            </p>
            <p className="font-semibold text-blue-100">
              {isFr
                ? "Ce projet n'existe que grâce aux personnes qui croient en cette vision et qui souhaitent faire partie de ce mouvement collectif."
                : "This project exists only thanks to people who believe in this vision and want to be part of this collective movement."}
            </p>
          </div>
          <button
            onClick={() => onNavigate("rejoindre")}
            className="inline-flex items-center gap-2 bg-white text-[#1e40af] px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-xl"
          >
            {isFr ? "Rejoindre le mouvement" : "Join the movement"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
