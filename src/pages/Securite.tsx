import { Shield, MapPin, Award, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '../components/Card';

interface SecuriteProps {
  onNavigate: (page: string) => void;
}

export default function Securite({ onNavigate }: SecuriteProps) {
  const trustFeatures = [
    {
      icon: <Award className="w-12 h-12 text-[#1e40af]" />,
      title: "Références vérifiées",
      description: "Chaque mission bénévole validée vous permet d'obtenir une référence écrite de l'organisme partenaire.",
    },
    {
      icon: <div className="text-5xl">🏅</div>,
      title: "Badges d'accomplissement",
      description: "Gagnez des badges automatiques en franchissant des jalons : première mission, régulier, spécialiste d'une cause.",
    },
    {
      icon: <div className="text-5xl">📊</div>,
      title: "Score de fiabilité",
      description: "Votre taux de missions honorées est affiché publiquement. Les no-shows sans préavis impactent votre score.",
    },
  ];

  const exchangePoints = [
    {
      icon: "🚔",
      title: "Postes de police",
      description: "Espaces d'échange surveillés et sécuritaires",
    },
    {
      icon: "📚",
      title: "Bibliothèques municipales",
      description: "Lieux publics avec présence et caméras",
    },
    {
      icon: "🏢",
      title: "Centres communautaires",
      description: "Espaces accueillants et bien éclairés",
    },
  ];

  const rules = [
    {
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
      title: "Toujours en public",
      description: "Ne donnez jamais rendez-vous à votre domicile ou celui d'un inconnu.",
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
      title: "Prévenez en cas d'empêchement",
      description: "Annulez 48h à l'avance pour éviter les pénalités sur votre score.",
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
      title: "Signalez les comportements inappropriés",
      description: "Notre équipe modère activement. Un signalement grave entraîne une suspension immédiate.",
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
      title: "Respectez la gratuité",
      description: "Les échanges sont des dons. Toute demande d'argent est interdite.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#1e40af] to-[#60a5fa] rounded-full mb-6">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Votre sécurité, notre priorité
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Covalto met en place plusieurs mécanismes pour créer une communauté de confiance basée sur l'entraide authentique.
          </p>
        </div>
      </section>

      {/* Système de réputation */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-4">
            Système de réputation transparent
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Bâtissez votre crédibilité grâce à vos contributions réelles à la communauté
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustFeatures.map((feature, index) => (
              <Card key={index}>
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Points d'échange sécuritaires */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-4">
            Lieux d'échange recommandés
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Pour les échanges d'objets entre citoyens, privilégiez des points de rencontre sécuritaires
          </p>
          
          <Card className="mb-8 bg-white">
            <div className="flex items-start mb-6">
              <MapPin className="w-12 h-12 text-[#1e40af] mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Échangez dans des lieux publics vérifiés
                </h3>
                <p className="text-gray-600 mb-6">
                  Covalto recommande des points de rencontre sécuritaires pour tous vos échanges :
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {exchangePoints.map((point, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 text-center border border-blue-100">
                  <div className="text-5xl mb-3">{point.icon}</div>
                  <h4 className="font-bold text-gray-900 mb-2">{point.title}</h4>
                  <p className="text-sm text-gray-600">{point.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-2xl">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Important</h4>
                  <p className="text-gray-700 text-sm">
                    Ces recommandations visent votre sécurité, mais Covalto n'est pas affilié officiellement à ces lieux. 
                    Faites toujours preuve de jugement et privilégiez les endroits publics en journée.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Règles communautaires */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-4">
            Règles communautaires
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Des règles simples pour garantir des échanges sains et respectueux
          </p>
          
          <div className="space-y-4">
            {rules.map((rule, index) => (
              <Card key={index}>
                <div className="flex items-start">
                  <div className="mr-4 flex-shrink-0">{rule.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{rule.title}</h3>
                    <p className="text-gray-600">{rule.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 bg-red-50 border-l-4 border-red-400 p-6 rounded-r-2xl">
            <div className="flex items-start">
              <XCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Conséquences des manquements</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• <strong>No-show sans avis 48h :</strong> -10 points de réputation</li>
                  <li>• <strong>3 no-shows :</strong> Suspension de 30 jours</li>
                  <li>• <strong>Comportement inapproprié :</strong> Suspension immédiate</li>
                  <li>• <strong>Demande d'argent :</strong> Bannissement permanent</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1e40af] to-[#1e3a8a]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Prêt à rejoindre une communauté de confiance ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Commencez à bâtir votre réputation dès aujourd'hui
          </p>
          <button
            onClick={() => onNavigate('rejoindre')}
            className="inline-flex items-center gap-2 bg-white text-[#1e40af] px-10 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-xl"
          >
            Manifester mon intérêt
          </button>
        </div>
      </section>
    </div>
  );
}
