import { UserPlus, HandHeart, TrendingUp, ArrowRight } from 'lucide-react';
import { Card } from '../components/Card';

export default function Fonctionnement() {
  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: 'Rejoindre une communauté engagée',
      description: "Manifestez votre intérêt et faites partie d'un réseau de personnes qui partagent vos valeurs d'entraide et de solidarité.",
      color: 'from-[#1e40af] to-[#60a5fa]',
    },
    {
      number: '02',
      icon: HandHeart,
      title: 'Participer à des actions solidaires',
      description: "Donnez de votre temps, partagez vos compétences ou soutenez des initiatives locales qui créent un impact réel dans votre communauté.",
      color: 'from-[#60a5fa] to-[#34d399]',
    },
    {
      number: '03',
      icon: TrendingUp,
      title: 'Contribuer à un impact collectif',
      description: "Ensemble, nous construisons un mouvement d'entraide durable qui transforme nos communautés, une action à la fois.",
      color: 'from-[#34d399] to-[#10b981]',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Comment ça fonctionne
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Covalto rend l'entraide accessible et significative en trois étapes simples. Découvrez comment vous pouvez faire partie de ce mouvement collectif.
          </p>
        </div>

        <div className="relative">
          {/* Ligne de progression */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#1e40af] via-[#60a5fa] to-[#34d399] transform -translate-y-1/2 opacity-20"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <Card className="p-8 sm:p-10 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-7xl font-bold text-gray-100">{step.number}</span>
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                      {step.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed flex-grow">
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

        <div className="mt-20 bg-gradient-to-br from-blue-50 to-green-50 rounded-3xl p-8 sm:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Rejoignez dès maintenant notre communauté en manifestant votre intérêt. Chaque nouvelle personne nous rapproche de notre vision collective.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 bg-[#1e40af] text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-[#1e3a8a] transition-all hover:scale-105 shadow-lg"
          >
            Manifester mon intérêt
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="mt-6 text-sm text-gray-600">
            <span className="font-semibold">Note :</span> Covalto est actuellement en phase de prototype. Votre participation nous aide à construire cette initiative ensemble.
          </p>
        </div>
      </div>
    </div>
  );
}
