import { useState } from "react";
import { Send, Heart, CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "../components/Card";
import { manifestationsService } from "../services/manifestations";
import { useI18n } from "../i18n/i18n";

export default function Rejoindre() {
  const { lang } = useI18n();
  const isFr = lang === "fr";
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    role: "",
    quartier: "",
    motivation: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    firstName?: string;
    role?: string;
    motivation?: string;
    general?: string;
  }>({});

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Validation du prénom
    if (formData.firstName.trim().length < 2) {
      newErrors.firstName = isFr
        ? "Le prénom doit contenir au moins 2 caractères"
        : "First name must be at least 2 characters";
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = isFr
        ? "Veuillez entrer une adresse courriel valide"
        : "Please enter a valid email address";
    }

    // Validation du rôle
    if (!formData.role) {
      newErrors.role = isFr
        ? "Veuillez sélectionner votre rôle"
        : "Please select your role";
    }

    // Validation de la motivation
    if (formData.motivation.trim().length < 20) {
      newErrors.motivation = isFr
        ? "Veuillez partager au moins 20 caractères sur votre motivation"
        : "Please share at least 20 characters about your motivation";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Réinitialiser les erreurs
    setErrors({});

    // Valider le formulaire
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Envoyer les données à Supabase
      await manifestationsService.create({
        firstName: formData.firstName,
        email: formData.email,
        role: formData.role,
        quartier: formData.quartier,
        motivation: formData.motivation,
      });

      // Succès
      setIsSubmitted(true);
      setTimeout(() => {
        setFormData({
          firstName: "",
          email: "",
          role: "",
          quartier: "",
          motivation: "",
        });
      }, 3000);
    } catch (error: any) {
      // Gérer l'erreur de doublon d'email
      if (error.message === "EMAIL_DUPLICATE") {
        setErrors({
          email: isFr
            ? "Cette adresse courriel est déjà enregistrée. Merci de votre intérêt !"
            : "This email address is already registered. Thank you for your interest!",
        });
      } else {
        // Autres erreurs
        console.error("Erreur lors de l'envoi:", error);
        console.error("Détails de l'erreur:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        setErrors({
          general: isFr
            ? "Une erreur est survenue. Veuillez réessayer plus tard."
            : "Something went wrong. Please try again later.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Effacer l'erreur du champ modifié
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-20">
        <Card className="max-w-2xl w-full text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-[#34d399] to-[#10b981] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <CheckCircle className="w-14 h-14 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {isFr ? "Merci pour votre intérêt !" : "Thank you for your interest!"}
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            {isFr
              ? "Votre manifestation d'intérêt a été enregistrée avec succès. Nous vous contacterons lors des prochaines étapes du développement de Collaboro."
              : "Your expression of interest has been recorded successfully. We’ll contact you as Collaboro moves to the next steps."}
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6">
            <p className="text-gray-700 font-semibold text-lg">
              {isFr
                ? "Ensemble, nous construisons quelque chose de beau. 💙"
                : "Together, we’re building something beautiful. 💙"}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            {isFr ? "Rejoindre Collaboro" : "Join Collaboro"}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-6">
            {isFr
              ? "Que vous soyez citoyen engagé, organisme ou commerce local, rejoignez notre mouvement pour transformer l'entraide en impact concret."
              : "Whether you’re an engaged citizen, nonprofit or local business, join our movement to turn mutual aid into concrete impact."}
          </p>
          <div className="inline-block bg-blue-50 border border-blue-200 rounded-2xl px-6 py-3">
            <p className="text-sm text-[#1e40af] font-medium">
              <span className="font-bold">
                {isFr ? "Phase pilote à Montréal :" : "Montréal pilot phase:"}
              </span>{" "}
              {isFr
                ? "Collaboro est en développement. Nous recherchons 5 OBNL, 10 commerces et 50 bénévoles pour lancer le projet en 2026."
                : "Collaboro is in development. We’re looking for 5 nonprofits, 10 businesses and 50 volunteers to launch the pilot in 2026."}
            </p>
          </div>
        </div>

        {/* Formulaire minimaliste */}
        <Card className="mb-16">
          {/* Message d'erreur général */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm font-medium">
                {errors.general}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-semibold text-gray-900 mb-3"
              >
                {isFr ? "Prénom" : "First name"}
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className={`w-full px-6 py-4 border-2 ${
                  errors.firstName
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-[#1e40af]"
                } rounded-2xl focus:ring-4 ${
                  errors.firstName ? "focus:ring-red-50" : "focus:ring-blue-50"
                } outline-none transition-all text-gray-900 placeholder-gray-400`}
                placeholder={isFr ? "Votre prénom" : "Your first name"}
              />
              {errors.firstName && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-900 mb-3"
              >
                {isFr ? "Courriel" : "Email"}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-6 py-4 border-2 ${
                  errors.email
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-[#1e40af]"
                } rounded-2xl focus:ring-4 ${
                  errors.email ? "focus:ring-red-50" : "focus:ring-blue-50"
                } outline-none transition-all text-gray-900 placeholder-gray-400`}
                placeholder={isFr ? "votre@courriel.com" : "your@email.com"}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-semibold text-gray-900 mb-3"
              >
                {isFr ? "Je suis..." : "I am..."}
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className={`w-full px-6 py-4 border-2 ${
                  errors.role
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-[#1e40af]"
                } rounded-2xl focus:ring-4 ${
                  errors.role ? "focus:ring-red-50" : "focus:ring-blue-50"
                } outline-none transition-all text-gray-900 bg-white`}
              >
                <option value="">
                  {isFr ? "Sélectionnez votre rôle" : "Select your role"}
                </option>
                <option value="volunteer">
                  {isFr
                    ? "Citoyen engagé (étudiant, travailleur, parent, retraité)"
                    : "Engaged citizen (student, worker, parent, retiree)"}
                </option>
                <option value="nonprofit">
                  {isFr
                    ? "OBNL / Organisme communautaire"
                    : "Nonprofit / community organization"}
                </option>
                <option value="business">
                  {isFr
                    ? "Commerce local / Entreprise"
                    : "Local business / Company"}
                </option>
              </select>
              {errors.role && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.role}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="quartier"
                className="block text-sm font-semibold text-gray-900 mb-3"
              >
                {isFr ? "Quartier (Montréal)" : "Neighbourhood (Montréal)"}{" "}
                <span className="text-gray-400 text-xs">
                  {isFr ? "optionnel" : "optional"}
                </span>
              </label>
              <input
                type="text"
                id="quartier"
                name="quartier"
                value={formData.quartier}
                onChange={handleChange}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-[#1e40af] focus:ring-4 focus:ring-blue-50 outline-none transition-all text-gray-900 placeholder-gray-400"
                placeholder={
                  isFr
                    ? "Ex: Plateau, Rosemont, Villeray, Hochelaga..."
                    : "e.g. Plateau, Rosemont, Villeray, Hochelaga..."
                }
              />
            </div>

            <div>
              <label
                htmlFor="motivation"
                className="block text-sm font-semibold text-gray-900 mb-3"
              >
                {isFr
                  ? "Pourquoi souhaitez-vous rejoindre une initiative communautaire ?"
                  : "Why do you want to join a community initiative?"}
              </label>
              <textarea
                id="motivation"
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                required
                rows={6}
                className={`w-full px-6 py-4 border-2 ${
                  errors.motivation
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-[#1e40af]"
                } rounded-2xl focus:ring-4 ${
                  errors.motivation ? "focus:ring-red-50" : "focus:ring-blue-50"
                } outline-none transition-all text-gray-900 placeholder-gray-400 resize-none`}
                placeholder={
                  isFr
                    ? "Partagez ce qui vous motive à participer à un projet d'entraide collective..."
                    : "Share what motivates you to take part in a collective mutual‑aid project..."
                }
              />
              {errors.motivation && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.motivation}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#1e40af] to-[#1e3a8a] text-white px-8 py-5 rounded-2xl font-semibold text-lg hover:from-[#1e3a8a] hover:to-[#1e293b] transition-all hover:scale-[1.02] shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isFr ? "Envoi en cours..." : "Sending..."}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {isFr ? "Manifester mon intérêt" : "Express my interest"}
                </>
              )}
            </button>
          </form>
        </Card>

        {/* Message final inspirant */}
        <Card className="bg-gradient-to-br from-green-50 to-blue-50 text-center">
          <Heart className="w-14 h-14 text-[#34d399] mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            {isFr ? "Ensemble, nous créons du sens" : "Together, we create meaning"}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto mb-6">
            {isFr
              ? "Chaque personne qui manifeste son intérêt nous aide à construire Collaboro. Votre participation dès maintenant contribue à façonner une plateforme qui reflète les besoins et les valeurs de notre communauté."
              : "Every person who expresses interest helps us build Collaboro. Your participation now helps shape a platform that reflects our community’s needs and values."}
          </p>
          <div className="bg-white rounded-2xl p-6 max-w-xl mx-auto">
            <p className="text-gray-800 font-semibold">
              {isFr
                ? "Merci de croire en l'entraide et en l'impact collectif. 🌟"
                : "Thank you for believing in mutual aid and collective impact. 🌟"}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
