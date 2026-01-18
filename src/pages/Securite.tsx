import {
  Shield,
  MapPin,
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card } from "../components/Card";
import { useI18n } from "../i18n/i18n";

interface SecuriteProps {
  onNavigate: (page: string) => void;
}

export default function Securite({ onNavigate }: SecuriteProps) {
  const { lang } = useI18n();
  const isFr = lang === "fr";

  const trustFeatures = [
    {
      icon: <Award className="w-12 h-12 text-[#1e40af]" />,
      title: isFr ? "Références vérifiées" : "Verified references",
      description: isFr
        ? "Chaque mission bénévole validée vous permet d'obtenir une référence écrite de l'organisme partenaire."
        : "Each validated volunteer mission can earn you a written reference from the partner organization.",
    },
    {
      icon: <div className="text-5xl">🏅</div>,
      title: isFr ? "Badges d'accomplissement" : "Achievement badges",
      description: isFr
        ? "Gagnez des badges automatiques en franchissant des jalons : première mission, régulier, spécialiste d'une cause."
        : "Earn automatic badges as you cross milestones: first mission, regular contributor, cause specialist, and more.",
    },
    {
      icon: <div className="text-5xl">📊</div>,
      title: isFr ? "Score de fiabilité" : "Reliability score",
      description: isFr
        ? "Votre taux de missions honorées est affiché publiquement. Les no-shows sans préavis impactent votre score."
        : "Your honored mission rate is shown publicly. No‑shows without notice negatively impact your score.",
    },
  ];

  const exchangePoints = [
    {
      icon: "🚔",
      title: isFr ? "Postes de police" : "Police stations",
      description: isFr
        ? "Espaces d'échange surveillés et sécuritaires"
        : "Supervised, safer exchange spaces",
    },
    {
      icon: "📚",
      title: isFr ? "Bibliothèques municipales" : "Public libraries",
      description: isFr
        ? "Lieux publics avec présence et caméras"
        : "Public places with staff and cameras",
    },
    {
      icon: "🏢",
      title: isFr ? "Centres communautaires" : "Community centres",
      description: isFr
        ? "Espaces accueillants et bien éclairés"
        : "Welcoming, well‑lit community spaces",
    },
  ];

  const rules = [
    {
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
      title: isFr ? "Toujours en public" : "Always meet in public",
      description: isFr
        ? "Ne donnez jamais rendez-vous à votre domicile ou celui d'un inconnu."
        : "Never meet at your home or someone else’s home.",
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
      title: isFr ? "Prévenez en cas d'empêchement" : "Cancel if you can’t make it",
      description: isFr
        ? "Annulez 48h à l'avance pour éviter les pénalités sur votre score."
        : "Cancel at least 48 hours in advance to avoid penalties to your score.",
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
      title: isFr
        ? "Signalez les comportements inappropriés"
        : "Report inappropriate behaviour",
      description: isFr
        ? "Notre équipe modère activement. Un signalement grave entraîne une suspension immédiate."
        : "Our team actively moderates. Serious reports lead to immediate suspension.",
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
      title: isFr ? "Respectez la gratuité" : "Keep exchanges free of charge",
      description: isFr
        ? "Les échanges sont des dons. Toute demande d'argent est interdite."
        : "Exchanges are donations. Any request for money is forbidden.",
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
            {isFr ? "Votre sécurité, notre priorité" : "Your safety, our priority"}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            {isFr
              ? "Collaboro met en place plusieurs mécanismes pour créer une communauté de confiance basée sur l'entraide authentique."
              : "Collaboro puts several mechanisms in place to build a trusted community grounded in genuine mutual aid."}
          </p>
        </div>
      </section>

      {/* Système de réputation */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-4">
            {isFr ? "Système de réputation transparent" : "Transparent reputation system"}
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            {isFr
              ? "Bâtissez votre crédibilité grâce à vos contributions réelles à la communauté"
              : "Build your credibility based on your real contributions to the community."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustFeatures.map((feature, index) => (
              <Card key={index}>
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Points d'échange sécuritaires */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-4">
            {isFr ? "Lieux d'échange recommandés" : "Recommended exchange spots"}
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            {isFr
              ? "Pour les échanges d'objets entre citoyens, privilégiez des points de rencontre sécuritaires"
              : "For peer‑to‑peer exchanges, choose safe, public meeting points."}
          </p>

          <Card className="mb-8 bg-white">
            <div className="flex items-start mb-6">
              <MapPin className="w-12 h-12 text-[#1e40af] mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {isFr
                    ? "Échangez dans des lieux publics vérifiés"
                    : "Meet in verified public places"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {isFr
                    ? "Collaboro recommande des points de rencontre sécuritaires pour tous vos échanges :"
                    : "Collaboro recommends safe meeting points for all your exchanges:"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {exchangePoints.map((point, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 text-center border border-blue-100"
                >
                  <div className="text-5xl mb-3">{point.icon}</div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    {point.title}
                  </h4>
                  <p className="text-sm text-gray-600">{point.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-2xl">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    {isFr ? "Important" : "Important"}
                  </h4>
                  <p className="text-gray-700 text-sm">
                    {isFr
                      ? "Ces recommandations visent votre sécurité, mais Collaboro n'est pas affilié officiellement à ces lieux. Faites toujours preuve de jugement et privilégiez les endroits publics en journée."
                      : "These recommendations are for your safety, but Collaboro is not officially affiliated with these places. Always use your judgment and favour public locations during the day."}
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
            {isFr ? "Règles communautaires" : "Community rules"}
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            {isFr
              ? "Des règles simples pour garantir des échanges sains et respectueux"
              : "Simple rules to keep exchanges healthy and respectful"}
          </p>

          <div className="space-y-4">
            {rules.map((rule, index) => (
              <Card key={index}>
                <div className="flex items-start">
                  <div className="mr-4 flex-shrink-0">{rule.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {rule.title}
                    </h3>
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
                <h4 className="font-bold text-gray-900 mb-2">
                  {isFr ? "Conséquences des manquements" : "Consequences"}
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>
                    • <strong>{isFr ? "No-show sans avis 48h :" : "No‑show without 48h notice:"}</strong>{" "}
                    {isFr ? "-10 points de réputation" : "-10 reputation points"}
                  </li>
                  <li>
                    • <strong>{isFr ? "3 no-shows :" : "3 no‑shows:"}</strong>{" "}
                    {isFr ? "Suspension de 30 jours" : "30‑day suspension"}
                  </li>
                  <li>
                    • <strong>{isFr ? "Comportement inapproprié :" : "Inappropriate behaviour:"}</strong>{" "}
                    {isFr ? "Suspension immédiate" : "Immediate suspension"}
                  </li>
                  <li>
                    • <strong>{isFr ? "Demande d'argent :" : "Requesting money:"}</strong>{" "}
                    {isFr ? "Bannissement permanent" : "Permanent ban"}
                  </li>
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
            {isFr
              ? "Prêt à rejoindre une communauté de confiance ?"
              : "Ready to join a trusted community?"}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {isFr
              ? "Commencez à bâtir votre réputation dès aujourd'hui"
              : "Start building your reputation today"}
          </p>
          <button
            onClick={() => onNavigate("rejoindre")}
            className="inline-flex items-center gap-2 bg-white text-[#1e40af] px-10 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-xl"
          >
            {isFr ? "Manifester mon intérêt" : "Express my interest"}
          </button>
        </div>
      </section>
    </div>
  );
}
