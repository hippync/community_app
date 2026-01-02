import { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  Search,
  ShieldCheck,
  Users,
  Building2,
  Filter,
  X,
  AlertTriangle,
  MessageCircle,
  Bookmark,
  Flag,
} from "lucide-react";
import { Card } from "../components/Card";

type OpportunityType = "nonprofit" | "business";

interface Task {
  id: string;
  title: string;
  description: string;
  duration: string;
  when: string;
  youthFriendly?: boolean;
}

interface MapPosition {
  x: number; // 0–100 (%)
  y: number; // 0–100 (%)
}

interface Opportunity {
  id: string;
  name: string;
  neighborhood: string;
  type: OpportunityType;
  verified: boolean;
  distanceKm: number;
  categories: string[];
  shortDescription: string;
  tasks: Task[];
  mapPosition: MapPosition;
  hasCapsules?: boolean;
}

interface ServicePoint {
  id: string;
  name: string;
  neighborhood: string;
  verified: boolean;
  mapPosition: MapPosition;
}

interface DecouvrirProps {
  onNavigate: (page: string) => void;
}

interface UserTestimonial {
  id: string;
  orgName: string;
  orgType: OpportunityType;
  verified: boolean;
  supervisorName: string;
  quote: string;
  date: string;
  missionTitle: string;
  approxSeconds?: number;
}

interface UserMissionHistoryItem {
  id: string;
  orgName: string;
  missionTitle: string;
  date: string;
  categories: string[];
}

interface UserProfile {
  firstName: string;
  lastInitial: string;
  level: "Novice" | "Apprentice" | "Trusted Contributor";
  levelProgressPercent: number; // progression inside current level (0-100)
  missionsCompleted: number;
  trustScore: number; // 0-100
  testimonialsCount: number;
  domains: string[];
  testimonials: UserTestimonial[];
  history: UserMissionHistoryItem[];
}

// Experience-level feature toggles (MVP)
const EXPERIENCE_TOGGLES = {
  showBusinessTasks: true,
  enableAvatarMessaging: true,
  enableAdultExchanges: true,
  showVerifiedServicePoints: true,
  showDynamicCvTeaser: true,
  showReportButton: true,
  showUserProfilePreview: true,
};

const RADIUS_OPTIONS = [1, 3, 5, 10] as const;
type RadiusOption = (typeof RADIUS_OPTIONS)[number];

type AgeMode = "youth" | "adult";
type LocationStatus = "idle" | "loading" | "granted" | "denied" | "fallback";

const OPPORTUNITIES: Opportunity[] = [
  {
    id: "obnl-rosemont",
    name: "Centre d'entraide Rosemont",
    neighborhood: "Rosemont–La Petite-Patrie",
    type: "nonprofit",
    verified: true,
    distanceKm: 2.1,
    categories: ["Alimentation", "Familles"],
    shortDescription:
      "Aide à préparer et distribuer des paniers alimentaires pour des familles du quartier.",
    mapPosition: { x: 65, y: 40 },
    hasCapsules: true,
    tasks: [
      {
        id: "t1",
        title: "Préparation de paniers alimentaires",
        description:
          "Tri des aliments, montage des paniers, rangement du local.",
        duration: "~3 h",
        when: "Samedi matin, 9 h – 12 h",
        youthFriendly: true,
      },
      {
        id: "t2",
        title: "Accueil des familles",
        description:
          "Accueillir les familles, expliquer le fonctionnement, offrir un soutien chaleureux.",
        duration: "~2 h",
        when: "Mercredi, 17 h – 19 h",
      },
    ],
  },
  {
    id: "obnl-villeray",
    name: "Maisonnette Jeunesse Villeray",
    neighborhood: "Villeray",
    type: "nonprofit",
    verified: true,
    distanceKm: 3.4,
    categories: ["Jeunesse", "Animation"],
    shortDescription:
      "Activités after-school pour jeunes : aide aux devoirs, jeux coopératifs, ateliers créatifs.",
    mapPosition: { x: 55, y: 30 },
    hasCapsules: true,
    tasks: [
      {
        id: "t3",
        title: "Aide aux devoirs",
        description:
          "Soutien scolaire pour des jeunes du primaire et du secondaire.",
        duration: "~2 h",
        when: "Lundi et jeudi, 16 h – 18 h",
        youthFriendly: true,
      },
      {
        id: "t4",
        title: "Animation de jeux coopératifs",
        description: "Co-animer des activités de groupe encadrées.",
        duration: "~2 h",
        when: "Vendredi, 18 h – 20 h",
      },
    ],
  },
  {
    id: "obnl-hochelaga",
    name: "Table de quartier Hochelaga",
    neighborhood: "Hochelaga-Maisonneuve",
    type: "nonprofit",
    verified: true,
    distanceKm: 4.2,
    categories: ["Événements", "Logistique"],
    shortDescription:
      "Soutien logistique pour des événements de quartier (kiosques, montage, accueil).",
    mapPosition: { x: 80, y: 60 },
    tasks: [
      {
        id: "t5",
        title: "Montage et démontage de kiosques",
        description: "Installer les tables, chaises, tentes, banderoles.",
        duration: "~4 h",
        when: "Samedi 25 janvier, 8 h – 12 h",
      },
      {
        id: "t6",
        title: "Accueil des participant·e·s",
        description: "Orienter les gens vers les activités et kiosques.",
        duration: "~3 h",
        when: "Samedi 25 janvier, 12 h – 15 h",
        youthFriendly: true,
      },
    ],
  },
  {
    id: "obnl-plateau",
    name: "Maison des aînés du Plateau",
    neighborhood: "Plateau-Mont-Royal",
    type: "nonprofit",
    verified: true,
    distanceKm: 1.8,
    categories: ["Aînés", "Visites amicales"],
    shortDescription:
      "Présence chaleureuse auprès de personnes aînées : visites, jeux de société, accompagnement.",
    mapPosition: { x: 50, y: 45 },
    tasks: [
      {
        id: "t7",
        title: "Visites de courtoisie",
        description:
          "Passer du temps avec des aînés isolés : discussion, jeux de société.",
        duration: "1–2 h",
        when: "À convenir selon tes disponibilités",
      },
      {
        id: "t8",
        title: "Accompagnement à des sorties de groupe",
        description:
          "Accompagner un petit groupe lors d'une sortie culturelle.",
        duration: "~3 h",
        when: "Dates ponctuelles, fin de semaine",
      },
    ],
  },
  {
    id: "obnl-centresud",
    name: "Friperie communautaire Centre-Sud",
    neighborhood: "Centre-Sud",
    type: "nonprofit",
    verified: false,
    distanceKm: 2.9,
    categories: ["Réemploi", "Tri", "Accueil"],
    shortDescription:
      "Aide au tri de vêtements, à la mise en rayon et à l'accueil des personnes.",
    mapPosition: { x: 60, y: 55 },
    tasks: [
      {
        id: "t9",
        title: "Tri et mise en rayon",
        description:
          "Classer les dons, préparer les portants et les présentoirs.",
        duration: "~3 h",
        when: "Semaine, fin d'après-midi",
      },
    ],
  },
  {
    id: "obnl-parcex",
    name: "Jardin collectif Parc-Extension",
    neighborhood: "Parc-Extension",
    type: "nonprofit",
    verified: true,
    distanceKm: 4.8,
    categories: ["Environnement", "Jardinage"],
    shortDescription:
      "Entretien du jardin collectif et récolte partagée entre les participant·e·s.",
    mapPosition: { x: 40, y: 25 },
    tasks: [
      {
        id: "t10",
        title: "Entretien du jardin",
        description: "Désherbage, arrosage, entretien des bacs.",
        duration: "~2 h",
        when: "Soirs de semaine, 18 h – 20 h (saison estivale)",
        youthFriendly: true,
      },
    ],
  },
  // Businesses (if enabled)
  {
    id: "biz-cafe-amitie",
    name: "Café L'Amitié",
    neighborhood: "Plateau-Mont-Royal",
    type: "business",
    verified: true,
    distanceKm: 1.3,
    categories: ["Inventaire", "Accueil"],
    shortDescription:
      "Petit café de quartier qui cherche un coup de main ponctuel pour l'inventaire et la mise en place.",
    mapPosition: { x: 52, y: 52 },
    tasks: [
      {
        id: "b1",
        title: "Inventaire café & pâtisseries",
        description:
          "Compter les stocks, vérifier les dates, organiser la réserve.",
        duration: "4 h",
        when: "Jeudi 16 janvier, 18 h – 22 h",
      },
    ],
  },
  {
    id: "biz-epicerie-quartier",
    name: "Épicerie du Quartier",
    neighborhood: "Hochelaga-Maisonneuve",
    type: "business",
    verified: false,
    distanceKm: 4.0,
    categories: ["Logistique", "Livraison locale"],
    shortDescription:
      "Épicerie de proximité qui a besoin d'un coup de main ponctuel pour les réceptions et petites livraisons à pied.",
    mapPosition: { x: 78, y: 65 },
    tasks: [
      {
        id: "b2",
        title: "Mise en tablette après livraison",
        description: "Déballer les caisses, placer les produits en rayon.",
        duration: "3 h",
        when: "Lundi 20 janvier, 7 h – 10 h",
      },
      {
        id: "b3",
        title: "Petites livraisons à pied",
        description:
          "Livrer quelques commandes dans un rayon de 1 km (sacs légers).",
        duration: "2 h",
        when: "Horaire flexible, à définir",
      },
    ],
  },
  {
    id: "biz-librairie-laurier",
    name: "Librairie Laurier",
    neighborhood: "Mile-End",
    type: "business",
    verified: true,
    distanceKm: 2.7,
    categories: ["Vitrine", "Culture"],
    shortDescription:
      "Librairie indépendante qui cherche de l'aide pour la mise en place de vitrines thématiques.",
    mapPosition: { x: 48, y: 38 },
    tasks: [
      {
        id: "b4",
        title: "Installation de vitrine de saison",
        description:
          "Installer les livres, affiches et éléments visuels selon une thématique.",
        duration: "3 h",
        when: "Dimanche 19 janvier, 10 h – 13 h",
      },
    ],
  },
];

const SERVICE_POINTS: ServicePoint[] = [
  {
    id: "sp-plateau-biblio",
    name: "Bibliothèque du Plateau-Mont-Royal",
    neighborhood: "Plateau-Mont-Royal",
    verified: true,
    mapPosition: { x: 52, y: 48 },
  },
  {
    id: "sp-hochelaga-centre",
    name: "Centre communautaire Hochelaga",
    neighborhood: "Hochelaga-Maisonneuve",
    verified: true,
    mapPosition: { x: 82, y: 62 },
  },
  {
    id: "sp-villeray-culture",
    name: "Maison de la culture Villeray",
    neighborhood: "Villeray",
    verified: true,
    mapPosition: { x: 58, y: 28 },
  },
];

const USER_PROFILE: UserProfile = {
  firstName: "Jean",
  lastInitial: "P",
  level: "Apprenti",
  levelProgressPercent: 35,
  missionsCompleted: 5,
  trustScore: 75,
  testimonialsCount: 4,
  domains: ["Alimentation", "Jeunesse", "Jardinage"],
  testimonials: [
    {
      id: "t1",
      orgName: "Centre d'entraide Rosemont",
      orgType: "nonprofit",
      verified: true,
      supervisorName: "Marie L.",
      quote:
        "Jean a montré une grande fiabilité et beaucoup d'énergie. On va l'appeler pour les prochaines sessions!",
      date: "15 janvier 2025",
      missionTitle: "Préparation de paniers alimentaires",
      approxSeconds: 15,
    },
    {
      id: "t2",
      orgName: "Maisonnette Jeunesse Villeray",
      orgType: "nonprofit",
      verified: true,
      supervisorName: "Thomas D.",
      quote: "Très engagé auprès des jeunes. Reviens quand tu veux!",
      date: "8 janvier 2025",
      missionTitle: "Aide aux devoirs",
      approxSeconds: 20,
    },
  ],
  history: [
    {
      id: "h1",
      orgName: "Centre d'entraide Rosemont",
      missionTitle: "Préparation de paniers alimentaires",
      date: "15 janvier 2025",
      categories: ["Alimentation", "Logistique"],
    },
    {
      id: "h2",
      orgName: "Maisonnette Jeunesse Villeray",
      missionTitle: "Aide aux devoirs",
      date: "8 janvier 2025",
      categories: ["Jeunesse", "Éducation"],
    },
    {
      id: "h3",
      orgName: "Jardin collectif Parc-Extension",
      missionTitle: "Entretien du jardin",
      date: "25 décembre 2024",
      categories: ["Environnement", "Jardinage"],
    },
  ],
};

export default function Decouvrir({ onNavigate }: DecouvrirProps) {
  const [search, setSearch] = useState("");
  const [radius, setRadius] = useState<RadiusOption>(3);
  const [typeFilter, setTypeFilter] = useState<
    "all" | "nonprofit" | "business"
  >("nonprofit");
  const [ageMode, setAgeMode] = useState<AgeMode>("youth");
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [viewModeMobile, setViewModeMobile] = useState<"list" | "map">("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const selectedOpportunity = useMemo(
    () => OPPORTUNITIES.find((o) => o.id === selectedId) || null,
    [selectedId]
  );

  const filteredOpportunities = useMemo(() => {
    return OPPORTUNITIES.filter((opportunity) => {
      if (
        !EXPERIENCE_TOGGLES.showBusinessTasks &&
        opportunity.type === "business"
      ) {
        return false;
      }

      if (typeFilter === "nonprofit" && opportunity.type !== "nonprofit") {
        return false;
      }
      if (typeFilter === "business" && opportunity.type !== "business") {
        return false;
      }

      if (opportunity.distanceKm > radius) {
        return false;
      }

      if (!search.trim()) return true;

      const query = search.toLowerCase();
      const haystack = [
        opportunity.name,
        opportunity.neighborhood,
        opportunity.shortDescription,
        opportunity.categories.join(" "),
        ...opportunity.tasks.map((t) => `${t.title} ${t.description}`),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [radius, search, typeFilter]);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      return;
    }
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      () => {
        // For MVP we don't re-compute distances; we just acknowledge permission.
        setLocationStatus("granted");
      },
      () => {
        setLocationStatus("denied");
      }
    );
  };

  useEffect(() => {
    // Fallback to Montréal centre if the user does nothing.
    if (locationStatus === "idle") {
      setLocationStatus("fallback");
    }
  }, [locationStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-10">
      <header className="pt-28 pb-6 px-4 sm:px-6 lg:px-8 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Découvrir les missions près de chez toi
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Trouve des{" "}
              <span className="font-semibold">OBNL à aider en priorité</span>{" "}
              et, si tu le souhaites, des
              <span className="font-semibold">
                {" "}
                commerces locaux avec des besoins ponctuels
              </span>
              . Bâtis ta réputation à partir d'actions réelles.
            </p>
          </div>

          <div className="flex flex-col gap-3 items-stretch md:items-end">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-[#1e40af]">
              <ShieldCheck className="w-4 h-4" />
              Mode sécurité & réputation
            </div>
            <div className="inline-flex rounded-full bg-gray-100 p-1 text-sm font-semibold">
              <button
                type="button"
                onClick={() => setAgeMode("youth")}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1 ${
                  ageMode === "youth"
                    ? "bg-white shadow-sm text-[#1e40af]"
                    : "text-gray-600"
                }`}
              >
                <span>Jeune &lt; 18 ans</span>
              </button>
              <button
                type="button"
                onClick={() => setAgeMode("adult")}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1 ${
                  ageMode === "adult"
                    ? "bg-white shadow-sm text-[#1e40af]"
                    : "text-gray-600"
                }`}
              >
                <span>Adulte 18+ (entraide)</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Prototype Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs font-semibold">
              PROTOTYPE EN CONSTRUCTION
            </span>
            <p className="text-sm text-amber-900">
              Cette version est un MVP. Les données sont fictives et les
              fonctionnalités seront améliorées.
            </p>
          </div>
        </div>
      </div>

      {/* User profile preview */}
      {EXPERIENCE_TOGGLES.showUserProfilePreview && (
        <section className="px-4 sm:px-6 lg:px-8 pt-4">
          <div className="max-w-7xl mx-auto">
            <UserProfilePreview
              profile={USER_PROFILE}
              onOpenFullProfile={() => setShowProfileModal(true)}
            />
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="px-4 sm:px-6 lg:px-8 pt-4 pb-4 bg-white/80 backdrop-blur-md sticky top-20 z-30 border-b border-gray-100">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nom d'organisme, mission, quartier…"
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 focus:border-[#1e40af] focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 hidden sm:inline">
                Rayon
              </span>
              <div className="flex gap-1 rounded-full bg-gray-100 p-1">
                {RADIUS_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setRadius(option)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      radius === option
                        ? "bg-white text-[#1e40af] shadow-sm"
                        : "text-gray-600"
                    }`}
                  >
                    {option} km
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleUseLocation}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              <MapPin className="w-4 h-4" />
              {locationStatus === "loading"
                ? "Recherche de ta position…"
                : "Utiliser ma position"}
            </button>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTypeFilter("nonprofit")}
                className={`px-3 py-1 rounded-full flex items-center gap-1 ${
                  typeFilter === "nonprofit"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-gray-600"
                }`}
              >
                <Users className="w-3 h-3" />
                OBNL & communautaire
              </button>
              {EXPERIENCE_TOGGLES.showBusinessTasks && (
                <button
                  type="button"
                  onClick={() => setTypeFilter("business")}
                  className={`px-3 py-1 rounded-full flex items-center gap-1 ${
                    typeFilter === "business"
                      ? "bg-white text-sky-700 shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  <Building2 className="w-3 h-3" />
                  Commerces (coups de main)
                </button>
              )}
              <button
                type="button"
                onClick={() => setTypeFilter("all")}
                className={`px-3 py-1 rounded-full flex items-center gap-1 ${
                  typeFilter === "all"
                    ? "bg-white text-[#1e40af] shadow-sm"
                    : "text-gray-600"
                }`}
              >
                <Filter className="w-3 h-3" />
                Tous
              </button>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-gray-500">
              <span className="hidden sm:inline">
                {filteredOpportunities.length} opportunités dans ce rayon
              </span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  OBNL (bénévolat)
                </span>
                {EXPERIENCE_TOGGLES.showBusinessTasks && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-sm bg-sky-500" />
                    Commerce (coup de main)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fallback / permission banner */}
      {(locationStatus === "denied" || locationStatus === "fallback") && (
        <div className="px-4 sm:px-6 lg:px-8 pt-4">
          <div className="max-w-7xl mx-auto">
            <Card className="bg-amber-50 border-amber-100 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-amber-900 mb-1">
                  On part de Montréal comme point de départ
                </h2>
                <p className="text-sm text-amber-900/80 mb-2">
                  Nous n'avons pas accès à ta position. On te montre d'abord des
                  missions autour du centre de Montréal. Tu peux ajuster le
                  rayon et les filtres, ou réessayer avec ta position.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={handleUseLocation}
                    className="inline-flex items-center gap-1 rounded-full bg-amber-900 text-amber-50 px-3 py-1 font-semibold"
                  >
                    <MapPin className="w-3 h-3" />
                    Réessayer avec ma position
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-900 px-3 py-1 font-semibold"
                  >
                    Continuer avec Montréal
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="px-4 sm:px-6 lg:px-8 pt-4">
        <div className="max-w-7xl mx-auto">
          {/* Mobile mode switch */}
          <div className="md:hidden mb-4">
            <div className="inline-flex rounded-full bg-gray-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewModeMobile("list")}
                className={`px-3 py-1 rounded-full ${
                  viewModeMobile === "list"
                    ? "bg-white text-[#1e40af] shadow-sm"
                    : "text-gray-600"
                }`}
              >
                Liste
              </button>
              <button
                type="button"
                onClick={() => setViewModeMobile("map")}
                className={`px-3 py-1 rounded-full ${
                  viewModeMobile === "map"
                    ? "bg-white text-[#1e40af] shadow-sm"
                    : "text-gray-600"
                }`}
              >
                Carte
              </button>
            </div>
          </div>

          {/* Desktop split layout */}
          <div className="hidden md:grid md:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)] gap-6">
            <OpportunityList
              opportunities={filteredOpportunities}
              onSelect={setSelectedId}
              selectedId={selectedId}
              ageMode={ageMode}
            />
            <MapPanel
              opportunities={filteredOpportunities}
              servicePoints={
                EXPERIENCE_TOGGLES.showVerifiedServicePoints
                  ? SERVICE_POINTS
                  : []
              }
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>

          {/* Mobile stack */}
          <div className="md:hidden flex flex-col gap-4">
            {viewModeMobile === "list" ? (
              <OpportunityList
                opportunities={filteredOpportunities}
                onSelect={setSelectedId}
                selectedId={selectedId}
                ageMode={ageMode}
              />
            ) : (
              <MapPanel
                opportunities={filteredOpportunities}
                servicePoints={
                  EXPERIENCE_TOGGLES.showVerifiedServicePoints
                    ? SERVICE_POINTS
                    : []
                }
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            )}
          </div>
        </div>
      </main>

      {/* Detail drawer */}
      {selectedOpportunity && (
        <DetailDrawer
          opportunity={selectedOpportunity}
          ageMode={ageMode}
          onClose={() => setSelectedId(null)}
          onContact={() => setShowContactModal(true)}
          onReport={
            EXPERIENCE_TOGGLES.showReportButton
              ? () => setShowReportModal(true)
              : undefined
          }
          onHelp={() => onNavigate("rejoindre")}
        />
      )}

      {/* Contact modal */}
      {showContactModal && selectedOpportunity && (
        <ContactModal
          opportunity={selectedOpportunity}
          ageMode={ageMode}
          onClose={() => setShowContactModal(false)}
        />
      )}

      {/* Report modal */}
      {showReportModal && selectedOpportunity && (
        <ReportModal
          opportunity={selectedOpportunity}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {/* Full profile modal */}
      {showProfileModal && (
        <FullProfileModal
          profile={USER_PROFILE}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
}

interface OpportunityListProps {
  opportunities: Opportunity[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  ageMode: AgeMode;
}

function OpportunityList({
  opportunities,
  selectedId,
  onSelect,
  ageMode,
}: OpportunityListProps) {
  const userProfile = USER_PROFILE;
  if (opportunities.length === 0) {
    return (
      <div className="space-y-3 mt-2">
        <Card className="border-dashed border-2 border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Aucun résultat dans ce rayon
          </h2>
          <p className="text-sm text-gray-600 mb-3">
            Essaie d'agrandir le rayon, de changer de catégorie ou de passer
            d'OBNL à commerces (gigs).
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-semibold text-gray-700 border border-gray-200">
              5 km
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-semibold text-gray-700 border border-gray-200">
              10 km
            </span>
            <button className="inline-flex items-center gap-1 rounded-full px-3 py-1 font-semibold text-gray-500 hover:bg-white">
              Réinitialiser les filtres
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-2">
      {opportunities.map((opportunity) => {
        const isSelected = selectedId === opportunity.id;
        const isNonProfit = opportunity.type === "nonprofit";
        const overlappingDomains = userProfile.domains.filter((domain) =>
          opportunity.categories.includes(domain)
        );
        const hasRelevantExperience = overlappingDomains.length > 0;
        return (
          <Card
            key={opportunity.id}
            className={`cursor-pointer ${
              isSelected ? "ring-2 ring-[#1e40af]/60" : ""
            }`}
            onClick={() => onSelect(opportunity.id)}
          >
            <div className="flex justify-between gap-3 mb-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-semibold text-gray-900 truncate">
                    {opportunity.name}
                  </h2>
                  {opportunity.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 text-[10px] font-semibold">
                      <ShieldCheck className="w-3 h-3" />
                      Vérifié
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
                  <span>{opportunity.neighborhood}</span>
                  <span>•</span>
                  <span>À {opportunity.distanceKm.toFixed(1)} km</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  isNonProfit
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-sky-50 text-sky-700"
                }`}
              >
                {isNonProfit ? (
                  <Users className="w-3 h-3" />
                ) : (
                  <Building2 className="w-3 h-3" />
                )}
                {isNonProfit
                  ? "OBNL • Bénévolat"
                  : "Commerce • Coup de main ponctuel"}
              </span>
              {opportunity.categories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex px-2 py-0.5 rounded-full bg-gray-100 text-[11px] text-gray-600"
                >
                  {cat}
                </span>
              ))}
              {opportunity.hasCapsules && (
                <span className="inline-flex px-2 py-0.5 rounded-full bg-purple-50 text-[11px] text-purple-700 border border-purple-100">
                  Capsules possibles
                </span>
              )}
            </div>

            <p className="text-sm text-gray-700 mb-1">
              {opportunity.shortDescription}
            </p>

            {hasRelevantExperience && (
              <p className="text-[11px] text-emerald-700 mb-1 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                  {userProfile.missionsCompleted}
                </span>
                Tu as déjà réalisé {userProfile.missionsCompleted} missions
                d'entraide, dont certaines dans ces domaines :{" "}
                {overlappingDomains.join(", ")}
              </p>
            )}

            <div className="space-y-1 mb-3">
              {opportunity.tasks.slice(0, 2).map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-2 text-xs text-gray-600"
                >
                  <span className="mt-[3px] w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                  <span>
                    <span className="font-semibold">{task.title}</span> •{" "}
                    {task.duration} • {task.when}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-900 text-white text-[10px] font-semibold">
                    {userProfile.firstName.charAt(0)}
                  </span>
                  <span className="font-semibold text-gray-800 text-[11px]">
                    {userProfile.firstName} {userProfile.lastInitial}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    • {userProfile.level}
                  </span>
                  <span className="ml-1 inline-flex items-center text-[10px] text-emerald-700 font-semibold">
                    {userProfile.trustScore}% confiance
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs justify-end">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-full bg-[#1e40af] text-white px-3 py-1 font-semibold text-xs"
                >
                  Voir les tâches
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-full bg-gray-900/90 text-white px-3 py-1 font-semibold text-xs"
                >
                  Je veux aider
                </button>
                {EXPERIENCE_TOGGLES.enableAvatarMessaging && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full border border-gray-200 text-gray-700 px-3 py-1 font-semibold text-xs"
                  >
                    <MessageCircle className="w-3 h-3" />
                    {ageMode === "youth" ? "Contact (avatar)" : "Contact"}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 hover:text-gray-600"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  Sauvegarder
                </button>
                {EXPERIENCE_TOGGLES.showReportButton && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 hover:text-red-600"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    Signaler
                  </button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

interface MapPanelProps {
  opportunities: Opportunity[];
  servicePoints: ServicePoint[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

interface UserProfilePreviewProps {
  profile: UserProfile;
  onOpenFullProfile: () => void;
}

function UserProfilePreview({
  profile,
  onOpenFullProfile,
}: UserProfilePreviewProps) {
  const levelLabel = profile.level;

  return (
    <Card className="bg-gradient-to-br from-blue-50 via-white to-emerald-50 border-blue-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="mt-1">
            <div className="w-14 h-14 rounded-2xl bg-[#1e40af] text-white flex items-center justify-center text-2xl font-bold shadow-lg">
              {profile.firstName.charAt(0)}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#1e40af] mb-1">
              MON PARCOURS D'ENTRAIDE (EXEMPLE)
            </p>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              {profile.firstName} {profile.lastInitial}
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-gray-900 text-white px-2 py-0.5 text-[11px] font-medium">
                Niveau : {levelLabel}
                <span className="text-gray-300">
                  ({profile.levelProgressPercent}% → prochain palier)
                </span>
              </span>
            </h2>
            <p className="text-sm text-gray-600 mb-3 max-w-xl">
              Même sans expérience professionnelle, chaque mission terminée
              construit ton histoire : missions, témoignages, domaines de
              compétences… pour devenir progressivement une personne de
              confiance.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 text-sm">
              <div>
                <p className="text-xs text-gray-500">Missions complétées</p>
                <p className="text-lg font-semibold text-gray-900">
                  {profile.missionsCompleted}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Score de confiance</p>
                <p className="text-lg font-semibold text-emerald-700">
                  {profile.trustScore}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Témoignages reçus</p>
                <p className="text-lg font-semibold text-gray-900">
                  {profile.testimonialsCount}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Domaines qui émergent</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {profile.domains.map((domain) => (
                    <span
                      key={domain}
                      className="inline-flex px-2 py-0.5 rounded-full bg-white/80 text-[11px] text-gray-700 border border-gray-200"
                    >
                      {domain}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-gray-500">
                  Progression vers "Trusted Contributor"
                </p>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#1e40af] via-[#60a5fa] to-emerald-400"
                  style={{
                    width: `${Math.min(profile.levelProgressPercent, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-64 space-y-3">
          <div className="bg-white/80 border border-gray-100 rounded-2xl p-3 shadow-sm">
            <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <span className="inline-flex w-4 h-4 items-center justify-center rounded-full bg-[#1e40af] text-white text-[9px] font-bold">
                +
              </span>
              Derniers témoignages (exemple)
            </p>
            {profile.testimonials.slice(0, 2).map((t) => (
              <div key={t.id} className="mb-2 last:mb-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className="text-xs font-semibold text-gray-900 truncate">
                    {t.orgName}
                  </p>
                  {t.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold">
                      <ShieldCheck className="w-3 h-3" />
                      Vérifié
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-600 line-clamp-2">
                  "{t.quote}"
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {t.missionTitle} • {t.date} • Capsule ~{t.approxSeconds ?? 15}
                  s
                </p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onOpenFullProfile}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#1e40af] text-white py-2.5 text-xs font-semibold shadow-md hover:bg-[#1e3a8a]"
          >
            Voir mon profil complet & CV dynamique (prototype)
          </button>
        </div>
      </div>
    </Card>
  );
}

function MapPanel({
  opportunities,
  servicePoints,
  selectedId,
  onSelect,
}: MapPanelProps) {
  return (
    <Card className="h-[420px] md:h-[520px] flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            Carte des missions (MVP illustratif)
          </h2>
          <p className="text-xs text-gray-500">
            Affichage approximatif inspiré de Montréal. Localisation précise à
            venir.
          </p>
        </div>
      </div>
      <div className="relative flex-1 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 border border-slate-200">
        {/* Simple “map” background */}
        <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
          <MapPin className="w-40 h-40 text-slate-400" />
        </div>

        {/* Pins */}
        {opportunities.map((opportunity) => {
          const isNonProfit = opportunity.type === "nonprofit";
          const isSelected = selectedId === opportunity.id;
          return (
            <button
              key={opportunity.id}
              type="button"
              onClick={() => onSelect(opportunity.id)}
              style={{
                left: `${opportunity.mapPosition.x}%`,
                top: `${opportunity.mapPosition.y}%`,
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group`}
            >
              <div
                className={`rounded-full border-2 w-5 h-5 flex items-center justify-center shadow-sm ${
                  isNonProfit
                    ? "bg-emerald-500/80 border-emerald-700"
                    : "bg-sky-500/80 border-sky-700"
                } ${isSelected ? "ring-2 ring-offset-2 ring-[#1e40af]" : ""}`}
              >
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
              <div className="mt-1 px-2 py-0.5 rounded-full bg-white/90 text-[10px] text-gray-700 whitespace-nowrap shadow-sm border border-gray-100">
                {opportunity.name}
              </div>
            </button>
          );
        })}

        {/* Service points */}
        {servicePoints.map((point) => (
          <div
            key={point.id}
            style={{
              left: `${point.mapPosition.x}%`,
              top: `${point.mapPosition.y}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
          >
            <div className="rounded-full bg-white border-2 border-[#1e40af] w-5 h-5 flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-3 h-3 text-[#1e40af]" />
            </div>
            <div className="mt-1 px-2 py-0.5 rounded-full bg-white/90 text-[10px] text-gray-700 whitespace-nowrap shadow-sm border border-gray-100">
              {point.name}
            </div>
          </div>
        ))}
      </div>
      {servicePoints.length > 0 && (
        <p className="mt-2 text-[11px] text-gray-500">
          Ces points de service sont des
          <span className="font-semibold"> lieux publics recommandés </span>
          pour des échanges solidaires (dons d'objets, etc.) entre personnes
          majeures. Recommandations non obligatoires, mais vivement conseillées.
        </p>
      )}
    </Card>
  );
}

interface DetailDrawerProps {
  opportunity: Opportunity;
  ageMode: AgeMode;
  onClose: () => void;
  onHelp: () => void;
  onContact: () => void;
  onReport?: () => void;
}

function DetailDrawer({
  opportunity,
  ageMode,
  onClose,
  onHelp,
  onContact,
  onReport,
}: DetailDrawerProps) {
  const isNonProfit = opportunity.type === "nonprofit";

  return (
    <div className="fixed inset-0 z-40 flex items-end md:items-stretch justify-center pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 pointer-events-auto"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="relative w-full max-w-4xl mx-auto pointer-events-auto">
        <div className="md:absolute md:right-6 md:top-24 md:bottom-6 md:w-[380px]">
          <Card className="h-[80vh] md:h-full flex flex-col bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {opportunity.name}
                  </h2>
                  {opportunity.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 text-[10px] font-semibold">
                      <ShieldCheck className="w-3 h-3" />
                      Vérifié
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {opportunity.neighborhood} • À{" "}
                  {opportunity.distanceKm.toFixed(1)} km
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 hover:bg-gray-100 text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  isNonProfit
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-sky-50 text-sky-700"
                }`}
              >
                {isNonProfit ? (
                  <Users className="w-3 h-3" />
                ) : (
                  <Building2 className="w-3 h-3" />
                )}
                {isNonProfit
                  ? "OBNL • Bénévolat"
                  : "Commerce • Coup de main ponctuel"}
              </span>
              {opportunity.categories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex px-2 py-0.5 rounded-full bg-gray-100 text-[11px] text-gray-600"
                >
                  {cat}
                </span>
              ))}
              {opportunity.hasCapsules && (
                <span className="inline-flex px-2 py-0.5 rounded-full bg-purple-50 text-[11px] text-purple-700 border border-purple-100">
                  Capsules possibles
                </span>
              )}
            </div>

            <p className="text-sm text-gray-700 mb-3">
              {opportunity.shortDescription}
            </p>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Tâches proposées
                </h3>
                <div className="space-y-2">
                  {opportunity.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2"
                    >
                      <div className="flex justify-between items-start gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-gray-900">
                          {task.title}
                        </p>
                        {task.youthFriendly && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-[10px] text-blue-700 px-2 py-0.5">
                            Jeunes bienvenus
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-1.5">
                        {task.description}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {task.duration} • {task.when}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety block */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/70 px-3 py-2.5">
                <h3 className="text-xs font-semibold text-[#1e40af] uppercase tracking-wide mb-1.5">
                  {ageMode === "youth"
                    ? "Sécurité des jeunes"
                    : "Entre aide entre adultes"}
                </h3>
                {ageMode === "youth" ? (
                  <p className="text-xs text-[#1e3a8a]">
                    Si tu as moins de 18 ans, tu contactes les organismes et
                    commerces via un avatar. Ton nom, ta photo et tes
                    coordonnées ne sont jamais partagés publiquement.
                  </p>
                ) : (
                  <p className="text-xs text-[#1e3a8a]">
                    Pour les échanges solidaires entre adultes (par exemple
                    donner un manteau, un livre ou un meuble), nous recommandons
                    fortement de te donner rendez-vous dans un
                    <span className="font-semibold">
                      {" "}
                      point de service vérifié
                    </span>
                    , dans un lieu public et en journée. Ce n'est pas une règle
                    obligatoire, mais une bonne pratique pour la sécurité de
                    tout le monde.
                  </p>
                )}
              </div>

              {/* Dynamic CV teaser */}
              {EXPERIENCE_TOGGLES.showDynamicCvTeaser && (
                <div className="rounded-2xl border border-purple-100 bg-purple-50/60 px-3 py-2.5">
                  <h3 className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-1.5">
                    Capsules de réputation (prototype)
                  </h3>
                  <p className="text-xs text-purple-900/80">
                    Après certaines missions, l'OBNL pourra enregistrer une
                    courte capsule (10–20 s) pour décrire ce que tu as accompli
                    et ta fiabilité. Ces capsules viendront enrichir ton CV
                    dynamique, vérifiable humainement.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 mt-3 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={onHelp}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#1e40af] text-white px-4 py-2 text-xs font-semibold"
                >
                  Je veux aider
                </button>
                {EXPERIENCE_TOGGLES.enableAvatarMessaging && (
                  <button
                    type="button"
                    onClick={onContact}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gray-900/90 text-white px-4 py-2 text-xs font-semibold"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    {ageMode === "youth" ? "Contact (avatar)" : "Contact"}
                  </button>
                )}
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-gray-200 text-gray-700 px-3 py-2 text-xs font-semibold"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  Sauvegarder
                </button>
                {onReport && (
                  <button
                    type="button"
                    onClick={onReport}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-red-100 text-red-600 px-3 py-2 text-xs font-semibold"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    Signaler
                  </button>
                )}
              </div>
              <p className="text-[11px] text-gray-400">
                Les fonctionnalités de contact et de sauvegarde sont en mode
                prototype. Aucun engagement n'est créé automatiquement.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface ContactModalProps {
  opportunity: Opportunity;
  ageMode: AgeMode;
  onClose: () => void;
}

function ContactModal({ opportunity, ageMode, onClose }: ContactModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 max-w-lg w-full mx-4">
        <Card className="bg-white shadow-2xl">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {ageMode === "youth"
                  ? "Contact avec avatar"
                  : "Contact avec l'organisme / commerce"}
              </h2>
              <p className="text-xs text-gray-500">
                {opportunity.name} • {opportunity.neighborhood}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 hover:bg-gray-100 text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            {ageMode === "youth" ? (
              <>
                Tu envoies un message à l'organisme à partir d'un avatar. Ton
                nom complet, ta photo et tes coordonnées restent privés. Un
                adulte responsable dans l'organisme recevra ton message.
              </>
            ) : (
              <>
                Tu peux proposer des disponibilités et, si nécessaire, un lieu
                d'échange. Nous te recommandons de choisir un point de service
                vérifié (bibliothèque, centre communautaire, etc.) pour ce type
                d'entraide entre personnes majeures.
              </>
            )}
          </p>
          <div className="space-y-3 mb-4">
            <textarea
              rows={3}
              className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-[#1e40af] focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder="Présente-toi en quelques mots et précise pour quelle mission tu es intéressé·e…"
            />
            <textarea
              rows={2}
              className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-[#1e40af] focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder="Propose 1–2 plages horaires qui te conviennent…"
            />
          </div>
          <p className="text-[11px] text-gray-400 mb-3">
            Cette messagerie est en version prototype. Le message n'est pas
            encore envoyé en temps réel, mais représente l'expérience visée.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs rounded-full text-gray-600 hover:bg-gray-100 font-semibold"
            >
              Annuler
            </button>
            <button
              type="button"
              className="px-4 py-2 text-xs rounded-full bg-[#1e40af] text-white font-semibold"
            >
              Envoyer le message (prototype)
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

interface FullProfileModalProps {
  profile: UserProfile;
  onClose: () => void;
}

function FullProfileModal({ profile, onClose }: FullProfileModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 max-w-3xl w-full mx-4">
        <Card className="bg-white shadow-2xl max-h-[85vh] overflow-y-auto">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-[#1e40af] mb-1">
                PROFIL COMPLET (EXEMPLE)
              </p>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {profile.firstName} {profile.lastInitial}
              </h2>
              <p className="text-sm text-gray-600">
                Parcours d'entraide basé sur des missions réelles, des capsules
                de témoignages et des domaines de compétences qui se
                construisent au fil du temps.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 hover:bg-gray-100 text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  Niveau actuel
                </p>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-900 text-white px-3 py-1 text-xs font-semibold">
                    {profile.level}
                  </span>
                  <span className="text-xs text-gray-500">
                    Progression vers le prochain palier :{" "}
                    {profile.levelProgressPercent}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#1e40af] via-[#60a5fa] to-emerald-400"
                    style={{
                      width: `${Math.min(profile.levelProgressPercent, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Missions complétées</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {profile.missionsCompleted}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Score de confiance</p>
                  <p className="text-xl font-semibold text-emerald-700">
                    {profile.trustScore}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Témoignages reçus</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {profile.testimonialsCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 text-xs text-gray-700">
                <p className="font-semibold text-[#1e40af] mb-1">
                  CV dynamique (prototype)
                </p>
                <p className="mb-2">
                  Chaque mission validée et chaque capsule de témoignage
                  viennent enrichir un CV humain, vérifiable et compréhensible
                  par de futurs employeurs.
                </p>
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center gap-1 rounded-full bg-[#1e40af] text-white py-1.5 text-[11px] font-semibold shadow-sm"
                >
                  Voir un exemple de CV dynamique (bientôt)
                </button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Parcours de missions
            </h3>
            <div className="space-y-3">
              {profile.history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 border border-gray-100 rounded-2xl p-3 bg-gray-50"
                >
                  <div className="mt-1 w-2 h-2 rounded-full bg-[#1e40af]" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {item.missionTitle}
                    </p>
                    <p className="text-xs text-gray-600">
                      {item.orgName} • {item.date}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.categories.map((cat) => (
                        <span
                          key={cat}
                          className="inline-flex px-2 py-0.5 rounded-full bg-white text-[11px] text-gray-700 border border-gray-200"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Mes témoignages
            </h3>
            <div className="space-y-3">
              {profile.testimonials.map((t) => (
                <div
                  key={t.id}
                  className="border border-gray-100 rounded-2xl p-3 bg-white"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {t.orgName}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {t.missionTitle} • {t.date}
                      </p>
                    </div>
                    {t.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 text-[10px] font-semibold">
                        <ShieldCheck className="w-3 h-3" />
                        Témoignage vérifié
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-700 mb-1.5">"{t.quote}"</p>
                  <p className="text-[10px] text-gray-500">
                    Capsule vidéo ou audio courte (~{t.approxSeconds ?? 15}s)
                    enregistrée par {t.supervisorName}.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

interface ReportModalProps {
  opportunity: Opportunity;
  onClose: () => void;
}

function ReportModal({ opportunity, onClose }: ReportModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 max-w-md w-full mx-4">
        <Card className="bg-white shadow-2xl">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Signaler cette opportunité
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 hover:bg-gray-100 text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            Si quelque chose te semble inapproprié ou risqué à propos de
            <span className="font-semibold"> {opportunity.name}</span>, tu peux
            nous le signaler.
          </p>
          <textarea
            rows={3}
            className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none mb-3"
            placeholder="Explique en quelques mots ce qui te préoccupe…"
          />
          <p className="text-[11px] text-gray-400 mb-3">
            Dans cette version de Collaboro, ton signalement est transmis à
            l'équipe pour revue manuelle. Nous pourrons ajuster ou retirer le
            contenu au besoin.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs rounded-full text-gray-600 hover:bg-gray-100 font-semibold"
            >
              Annuler
            </button>
            <button
              type="button"
              className="px-4 py-2 text-xs rounded-full bg-red-600 text-white font-semibold"
            >
              Envoyer le signalement (prototype)
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  Search,
  ShieldCheck,
  Users,
  Building2,
  Filter,
  X,
  AlertTriangle,
  MessageCircle,
  Bookmark,
  Flag,
} from "lucide-react";
import { Card } from "../components/Card";

type OpportunityType = "nonprofit" | "business";

interface Task {
  id: string;
  title: string;
  description: string;
  duration: string;
  when: string;
  youthFriendly?: boolean;
}

interface MapPosition {
  x: number; // 0–100 (%)
  y: number; // 0–100 (%)
}

interface Opportunity {
  id: string;
  name: string;
  neighborhood: string;
  type: OpportunityType;
  verified: boolean;
  distanceKm: number;
  categories: string[];
  shortDescription: string;
  tasks: Task[];
  mapPosition: MapPosition;
  hasCapsules?: boolean;
}

interface ServicePoint {
  id: string;
  name: string;
  neighborhood: string;
  verified: boolean;
  mapPosition: MapPosition;
}

interface DecouvrirProps {
  onNavigate: (page: string) => void;
}

interface UserTestimonial {
  id: string;
  orgName: string;
  orgType: OpportunityType;
  verified: boolean;
  supervisorName: string;
  quote: string;
  date: string;
  missionTitle: string;
  approxSeconds?: number;
}

interface UserMissionHistoryItem {
  id: string;
  orgName: string;
  missionTitle: string;
  date: string;
  categories: string[];
}

interface UserProfile {
  firstName: string;
  lastInitial: string;
  level: "Novice" | "Apprentice" | "Trusted Contributor";
  levelProgressPercent: number; // progression inside current level (0-100)
  missionsCompleted: number;
  trustScore: number; // 0-100
  testimonialsCount: number;
  domains: string[];
  testimonials: UserTestimonial[];
  history: UserMissionHistoryItem[];
}

// Experience-level feature toggles (MVP)
const EXPERIENCE_TOGGLES = {
  showBusinessTasks: true,
  enableAvatarMessaging: true,
  enableAdultExchanges: true,
  showVerifiedServicePoints: true,
  showDynamicCvTeaser: true,
  showReportButton: true,
  showUserProfilePreview: true,
};

const RADIUS_OPTIONS = [1, 3, 5, 10] as const;
type RadiusOption = (typeof RADIUS_OPTIONS)[number];

type AgeMode = "youth" | "adult";
type LocationStatus = "idle" | "loading" | "granted" | "denied" | "fallback";

const OPPORTUNITIES: Opportunity[] = [
  {
    id: "obnl-rosemont",
    name: "Centre d'entraide Rosemont",
    neighborhood: "Rosemont–La Petite-Patrie",
    type: "nonprofit",
    verified: true,
    distanceKm: 2.1,
    categories: ["Alimentation", "Familles"],
    shortDescription:
      "Aide à préparer et distribuer des paniers alimentaires pour des familles du quartier.",
    mapPosition: { x: 65, y: 40 },
    hasCapsules: true,
    tasks: [
      {
        id: "t1",
        title: "Préparation de paniers alimentaires",
        description:
          "Tri des aliments, montage des paniers, rangement du local.",
        duration: "~3 h",
        when: "Samedi matin, 9 h – 12 h",
        youthFriendly: true,
      },
      {
        id: "t2",
        title: "Accueil des familles",
        description:
          "Accueillir les familles, expliquer le fonctionnement, offrir un soutien chaleureux.",
        duration: "~2 h",
        when: "Mercredi, 17 h – 19 h",
      },
    ],
  },
  {
    id: "obnl-villeray",
    name: "Maisonnette Jeunesse Villeray",
    neighborhood: "Villeray",
    type: "nonprofit",
    verified: true,
    distanceKm: 3.4,
    categories: ["Jeunesse", "Animation"],
    shortDescription:
      "Activités after-school pour jeunes : aide aux devoirs, jeux coopératifs, ateliers créatifs.",
    mapPosition: { x: 55, y: 30 },
    hasCapsules: true,
    tasks: [
      {
        id: "t3",
        title: "Aide aux devoirs",
        description:
          "Soutien scolaire pour des jeunes du primaire et du secondaire.",
        duration: "~2 h",
        when: "Lundi et jeudi, 16 h – 18 h",
        youthFriendly: true,
      },
      {
        id: "t4",
        title: "Animation de jeux coopératifs",
        description: "Co-animer des activités de groupe encadrées.",
        duration: "~2 h",
        when: "Vendredi, 18 h – 20 h",
      },
    ],
  },
  {
    id: "obnl-hochelaga",
    name: "Table de quartier Hochelaga",
    neighborhood: "Hochelaga-Maisonneuve",
    type: "nonprofit",
    verified: true,
    distanceKm: 4.2,
    categories: ["Événements", "Logistique"],
    shortDescription:
      "Soutien logistique pour des événements de quartier (kiosques, montage, accueil).",
    mapPosition: { x: 80, y: 60 },
    tasks: [
      {
        id: "t5",
        title: "Montage et démontage de kiosques",
        description: "Installer les tables, chaises, tentes, banderoles.",
        duration: "~4 h",
        when: "Samedi 25 janvier, 8 h – 12 h",
      },
      {
        id: "t6",
        title: "Accueil des participant·e·s",
        description: "Orienter les gens vers les activités et kiosques.",
        duration: "~3 h",
        when: "Samedi 25 janvier, 12 h – 15 h",
        youthFriendly: true,
      },
    ],
  },
  {
    id: "obnl-plateau",
    name: "Maison des aînés du Plateau",
    neighborhood: "Plateau-Mont-Royal",
    type: "nonprofit",
    verified: true,
    distanceKm: 1.8,
    categories: ["Aînés", "Visites amicales"],
    shortDescription:
      "Présence chaleureuse auprès de personnes aînées : visites, jeux de société, accompagnement.",
    mapPosition: { x: 50, y: 45 },
    tasks: [
      {
        id: "t7",
        title: "Visites de courtoisie",
        description:
          "Passer du temps avec des aînés isolés : discussion, jeux de société.",
        duration: "1–2 h",
        when: "À convenir selon tes disponibilités",
      },
      {
        id: "t8",
        title: "Accompagnement à des sorties de groupe",
        description:
          "Accompagner un petit groupe lors d'une sortie culturelle.",
        duration: "~3 h",
        when: "Dates ponctuelles, fin de semaine",
      },
    ],
  },
  {
    id: "obnl-centresud",
    name: "Friperie communautaire Centre-Sud",
    neighborhood: "Centre-Sud",
    type: "nonprofit",
    verified: false,
    distanceKm: 2.9,
    categories: ["Réemploi", "Tri", "Accueil"],
    shortDescription:
      "Aide au tri de vêtements, à la mise en rayon et à l'accueil des personnes.",
    mapPosition: { x: 60, y: 55 },
    tasks: [
      {
        id: "t9",
        title: "Tri et mise en rayon",
        description:
          "Classer les dons, préparer les portants et les présentoirs.",
        duration: "~3 h",
        when: "Semaine, fin d'après-midi",
      },
    ],
  },
  {
    id: "obnl-parcex",
    name: "Jardin collectif Parc-Extension",
    neighborhood: "Parc-Extension",
    type: "nonprofit",
    verified: true,
    distanceKm: 4.8,
    categories: ["Environnement", "Jardinage"],
    shortDescription:
      "Entretien du jardin collectif et récolte partagée entre les participant·e·s.",
    mapPosition: { x: 40, y: 25 },
    tasks: [
      {
        id: "t10",
        title: "Entretien du jardin",
        description: "Désherbage, arrosage, entretien des bacs.",
        duration: "~2 h",
        when: "Soirs de semaine, 18 h – 20 h (saison estivale)",
        youthFriendly: true,
      },
    ],
  },
  // Businesses (if enabled)
  {
    id: "biz-cafe-amitie",
    name: "Café L'Amitié",
    neighborhood: "Plateau-Mont-Royal",
    type: "business",
    verified: true,
    distanceKm: 1.3,
    categories: ["Inventaire", "Accueil"],
    shortDescription:
      "Petit café de quartier qui cherche un coup de main ponctuel pour l'inventaire et la mise en place.",
    mapPosition: { x: 52, y: 52 },
    tasks: [
      {
        id: "b1",
        title: "Inventaire café & pâtisseries",
        description:
          "Compter les stocks, vérifier les dates, organiser la réserve.",
        duration: "4 h",
        when: "Jeudi 16 janvier, 18 h – 22 h",
      },
    ],
  },
  {
    id: "biz-epicerie-quartier",
    name: "Épicerie du Quartier",
    neighborhood: "Hochelaga-Maisonneuve",
    type: "business",
    verified: false,
    distanceKm: 4.0,
    categories: ["Logistique", "Livraison locale"],
    shortDescription:
      "Épicerie de proximité qui a besoin d'un coup de main ponctuel pour les réceptions et petites livraisons à pied.",
    mapPosition: { x: 78, y: 65 },
    tasks: [
      {
        id: "b2",
        title: "Mise en tablette après livraison",
        description: "Déballer les caisses, placer les produits en rayon.",
        duration: "3 h",
        when: "Lundi 20 janvier, 7 h – 10 h",
      },
      {
        id: "b3",
        title: "Petites livraisons à pied",
        description:
          "Livrer quelques commandes dans un rayon de 1 km (sacs légers).",
        duration: "2 h",
        when: "Horaire flexible, à définir",
      },
    ],
  },
  {
    id: "biz-librairie-laurier",
    name: "Librairie Laurier",
    neighborhood: "Mile-End",
    type: "business",
    verified: true,
    distanceKm: 2.7,
    categories: ["Vitrine", "Culture"],
    shortDescription:
      "Librairie indépendante qui cherche de l'aide pour la mise en place de vitrines thématiques.",
    mapPosition: { x: 48, y: 38 },
    tasks: [
      {
        id: "b4",
        title: "Installation de vitrine de saison",
        description:
          "Installer les livres, affiches et éléments visuels selon une thématique.",
        duration: "3 h",
        when: "Dimanche 19 janvier, 10 h – 13 h",
      },
    ],
  },
];

const SERVICE_POINTS: ServicePoint[] = [
  {
    id: "sp-plateau-biblio",
    name: "Bibliothèque du Plateau-Mont-Royal",
    neighborhood: "Plateau-Mont-Royal",
    verified: true,
    mapPosition: { x: 52, y: 48 },
  },
  {
    id: "sp-hochelaga-centre",
    name: "Centre communautaire Hochelaga",
    neighborhood: "Hochelaga-Maisonneuve",
    verified: true,
    mapPosition: { x: 82, y: 62 },
  },
  {
    id: "sp-villeray-culture",
    name: "Maison de la culture Villeray",
    neighborhood: "Villeray",
    verified: true,
    mapPosition: { x: 58, y: 28 },
  },
];

const USER_PROFILE: UserProfile = {
  firstName: "Jean",
  lastInitial: "P",
  level: "Apprenti",
  levelProgressPercent: 35,
  missionsCompleted: 5,
  trustScore: 75,
  testimonialsCount: 4,
  domains: ["Alimentation", "Jeunesse", "Jardinage"],
  testimonials: [
    {
      id: "t1",
      orgName: "Centre d'entraide Rosemont",
      orgType: "nonprofit",
      verified: true,
      supervisorName: "Marie L.",
      quote:
        "Jean a montré une grande fiabilité et beaucoup d'énergie. On va l'appeler pour les prochaines sessions!",
      date: "15 janvier 2025",
      missionTitle: "Préparation de paniers alimentaires",
      approxSeconds: 15,
    },
    {
      id: "t2",
      orgName: "Maisonnette Jeunesse Villeray",
      orgType: "nonprofit",
      verified: true,
      supervisorName: "Thomas D.",
      quote: "Très engagé auprès des jeunes. Reviens quand tu veux!",
      date: "8 janvier 2025",
      missionTitle: "Aide aux devoirs",
      approxSeconds: 20,
    },
  ],
  history: [
    {
      id: "h1",
      orgName: "Centre d'entraide Rosemont",
      missionTitle: "Préparation de paniers alimentaires",
      date: "15 janvier 2025",
      categories: ["Alimentation", "Logistique"],
    },
    {
      id: "h2",
      orgName: "Maisonnette Jeunesse Villeray",
      missionTitle: "Aide aux devoirs",
      date: "8 janvier 2025",
      categories: ["Jeunesse", "Éducation"],
    },
    {
      id: "h3",
      orgName: "Jardin collectif Parc-Extension",
      missionTitle: "Entretien du jardin",
      date: "25 décembre 2024",
      categories: ["Environnement", "Jardinage"],
    },
  ],
};

export default function Decouvrir({ onNavigate }: DecouvrirProps) {
  const [search, setSearch] = useState("");
  const [radius, setRadius] = useState<RadiusOption>(3);
  const [typeFilter, setTypeFilter] = useState<
    "all" | "nonprofit" | "business"
  >("nonprofit");
  const [ageMode, setAgeMode] = useState<AgeMode>("youth");
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [viewModeMobile, setViewModeMobile] = useState<"list" | "map">("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const selectedOpportunity = useMemo(
    () => OPPORTUNITIES.find((o) => o.id === selectedId) || null,
    [selectedId]
  );

  const filteredOpportunities = useMemo(() => {
    return OPPORTUNITIES.filter((opportunity) => {
      if (
        !EXPERIENCE_TOGGLES.showBusinessTasks &&
        opportunity.type === "business"
      ) {
        return false;
      }

      if (typeFilter === "nonprofit" && opportunity.type !== "nonprofit") {
        return false;
      }
      if (typeFilter === "business" && opportunity.type !== "business") {
        return false;
      }

      if (opportunity.distanceKm > radius) {
        return false;
      }

      if (!search.trim()) return true;

      const query = search.toLowerCase();
      const haystack = [
        opportunity.name,
        opportunity.neighborhood,
        opportunity.shortDescription,
        opportunity.categories.join(" "),
        ...opportunity.tasks.map((t) => `${t.title} ${t.description}`),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [radius, search, typeFilter]);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      return;
    }
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      () => {
        // For MVP we don't re-compute distances; we just acknowledge permission.
        setLocationStatus("granted");
      },
      () => {
        setLocationStatus("denied");
      }
    );
  };

  useEffect(() => {
    // Fallback to Montréal centre if the user does nothing.
    if (locationStatus === "idle") {
      setLocationStatus("fallback");
    }
  }, [locationStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-10">
      <header className="pt-28 pb-6 px-4 sm:px-6 lg:px-8 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Découvrir les missions près de chez toi
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Trouve des{" "}
              <span className="font-semibold">OBNL à aider en priorité</span>{" "}
              et, si tu le souhaites, des
              <span className="font-semibold">
                {" "}
                commerces locaux avec des besoins ponctuels
              </span>
              . Bâtis ta réputation à partir d'actions réelles.
            </p>
          </div>

          <div className="flex flex-col gap-3 items-stretch md:items-end">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-[#1e40af]">
              <ShieldCheck className="w-4 h-4" />
              Mode sécurité & réputation
            </div>
            <div className="inline-flex rounded-full bg-gray-100 p-1 text-sm font-semibold">
              <button
                type="button"
                onClick={() => setAgeMode("youth")}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1 ${
                  ageMode === "youth"
                    ? "bg-white shadow-sm text-[#1e40af]"
                    : "text-gray-600"
                }`}
              >
                <span>Jeune &lt; 18 ans</span>
              </button>
              <button
                type="button"
                onClick={() => setAgeMode("adult")}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1 ${
                  ageMode === "adult"
                    ? "bg-white shadow-sm text-[#1e40af]"
                    : "text-gray-600"
                }`}
              >
                <span>Adulte 18+ (entraide)</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Prototype Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs font-semibold">
              PROTOTYPE EN CONSTRUCTION
            </span>
            <p className="text-sm text-amber-900">
              Cette version est un MVP. Les données sont fictives et les
              fonctionnalités seront améliorées.
            </p>
          </div>
        </div>
      </div>

      {/* User profile preview */}
      {EXPERIENCE_TOGGLES.showUserProfilePreview && (
        <section className="px-4 sm:px-6 lg:px-8 pt-4">
          <div className="max-w-7xl mx-auto">
            <UserProfilePreview
              profile={USER_PROFILE}
              onOpenFullProfile={() => setShowProfileModal(true)}
            />
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="px-4 sm:px-6 lg:px-8 pt-4 pb-4 bg-white/80 backdrop-blur-md sticky top-20 z-30 border-b border-gray-100">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nom d'organisme, mission, quartier…"
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 focus:border-[#1e40af] focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 hidden sm:inline">
                Rayon
              </span>
              <div className="flex gap-1 rounded-full bg-gray-100 p-1">
                {RADIUS_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setRadius(option)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      radius === option
                        ? "bg-white text-[#1e40af] shadow-sm"
                        : "text-gray-600"
                    }`}
                  >
                    {option} km
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleUseLocation}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              <MapPin className="w-4 h-4" />
              {locationStatus === "loading"
                ? "Recherche de ta position…"
                : "Utiliser ma position"}
            </button>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTypeFilter("nonprofit")}
                className={`px-3 py-1 rounded-full flex items-center gap-1 ${
                  typeFilter === "nonprofit"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-gray-600"
                }`}
              >
                <Users className="w-3 h-3" />
                OBNL & communautaire
              </button>
              {EXPERIENCE_TOGGLES.showBusinessTasks && (
                <button
                  type="button"
                  onClick={() => setTypeFilter("business")}
                  className={`px-3 py-1 rounded-full flex items-center gap-1 ${
                    typeFilter === "business"
                      ? "bg-white text-sky-700 shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  <Building2 className="w-3 h-3" />
                  Commerces (coups de main)
                </button>
              )}
              <button
                type="button"
                onClick={() => setTypeFilter("all")}
                className={`px-3 py-1 rounded-full flex items-center gap-1 ${
                  typeFilter === "all"
                    ? "bg-white text-[#1e40af] shadow-sm"
                    : "text-gray-600"
                }`}
              >
                <Filter className="w-3 h-3" />
                Tous
              </button>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-gray-500">
              <span className="hidden sm:inline">
                {filteredOpportunities.length} opportunités dans ce rayon
              </span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  OBNL (bénévolat)
                </span>
                {EXPERIENCE_TOGGLES.showBusinessTasks && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-sm bg-sky-500" />
                    Commerce (coup de main)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fallback / permission banner */}
      {(locationStatus === "denied" || locationStatus === "fallback") && (
        <div className="px-4 sm:px-6 lg:px-8 pt-4">
          <div className="max-w-7xl mx-auto">
            <Card className="bg-amber-50 border-amber-100 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-amber-900 mb-1">
                  On part de Montréal comme point de départ
                </h2>
                <p className="text-sm text-amber-900/80 mb-2">
                  Nous n'avons pas accès à ta position. On te montre d'abord des
                  missions autour du centre de Montréal. Tu peux ajuster le
                  rayon et les filtres, ou réessayer avec ta position.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={handleUseLocation}
                    className="inline-flex items-center gap-1 rounded-full bg-amber-900 text-amber-50 px-3 py-1 font-semibold"
                  >
                    <MapPin className="w-3 h-3" />
                    Réessayer avec ma position
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-900 px-3 py-1 font-semibold"
                  >
                    Continuer avec Montréal
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="px-4 sm:px-6 lg:px-8 pt-4">
        <div className="max-w-7xl mx-auto">
          {/* Mobile mode switch */}
          <div className="md:hidden mb-4">
            <div className="inline-flex rounded-full bg-gray-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewModeMobile("list")}
                className={`px-3 py-1 rounded-full ${
                  viewModeMobile === "list"
                    ? "bg-white text-[#1e40af] shadow-sm"
                    : "text-gray-600"
                }`}
              >
                Liste
              </button>
              <button
                type="button"
                onClick={() => setViewModeMobile("map")}
                className={`px-3 py-1 rounded-full ${
                  viewModeMobile === "map"
                    ? "bg-white text-[#1e40af] shadow-sm"
                    : "text-gray-600"
                }`}
              >
                Carte
              </button>
            </div>
          </div>

          {/* Desktop split layout */}
          <div className="hidden md:grid md:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)] gap-6">
            <OpportunityList
              opportunities={filteredOpportunities}
              onSelect={setSelectedId}
              selectedId={selectedId}
              ageMode={ageMode}
            />
            <MapPanel
              opportunities={filteredOpportunities}
              servicePoints={
                EXPERIENCE_TOGGLES.showVerifiedServicePoints
                  ? SERVICE_POINTS
                  : []
              }
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>

          {/* Mobile stack */}
          <div className="md:hidden flex flex-col gap-4">
            {viewModeMobile === "list" ? (
              <OpportunityList
                opportunities={filteredOpportunities}
                onSelect={setSelectedId}
                selectedId={selectedId}
                ageMode={ageMode}
              />
            ) : (
              <MapPanel
                opportunities={filteredOpportunities}
                servicePoints={
                  EXPERIENCE_TOGGLES.showVerifiedServicePoints
                    ? SERVICE_POINTS
                    : []
                }
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            )}
          </div>
        </div>
      </main>

      {/* Detail drawer */}
      {selectedOpportunity && (
        <DetailDrawer
          opportunity={selectedOpportunity}
          ageMode={ageMode}
          onClose={() => setSelectedId(null)}
          onContact={() => setShowContactModal(true)}
          onReport={
            EXPERIENCE_TOGGLES.showReportButton
              ? () => setShowReportModal(true)
              : undefined
          }
          onHelp={() => onNavigate("rejoindre")}
        />
      )}

      {/* Contact modal */}
      {showContactModal && selectedOpportunity && (
        <ContactModal
          opportunity={selectedOpportunity}
          ageMode={ageMode}
          onClose={() => setShowContactModal(false)}
        />
      )}

      {/* Report modal */}
      {showReportModal && selectedOpportunity && (
        <ReportModal
          opportunity={selectedOpportunity}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {/* Full profile modal */}
      {showProfileModal && (
        <FullProfileModal
          profile={USER_PROFILE}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
}

interface OpportunityListProps {
  opportunities: Opportunity[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  ageMode: AgeMode;
}

function OpportunityList({
  opportunities,
  selectedId,
  onSelect,
  ageMode,
}: OpportunityListProps) {
  const userProfile = USER_PROFILE;
  if (opportunities.length === 0) {
    return (
      <div className="space-y-3 mt-2">
        <Card className="border-dashed border-2 border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Aucun résultat dans ce rayon
          </h2>
          <p className="text-sm text-gray-600 mb-3">
            Essaie d'agrandir le rayon, de changer de catégorie ou de passer
            d'OBNL à commerces (gigs).
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-semibold text-gray-700 border border-gray-200">
              5 km
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-semibold text-gray-700 border border-gray-200">
              10 km
            </span>
            <button className="inline-flex items-center gap-1 rounded-full px-3 py-1 font-semibold text-gray-500 hover:bg-white">
              Réinitialiser les filtres
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-2">
      {opportunities.map((opportunity) => {
        const isSelected = selectedId === opportunity.id;
        const isNonProfit = opportunity.type === "nonprofit";
        const overlappingDomains = userProfile.domains.filter((domain) =>
          opportunity.categories.includes(domain)
        );
        const hasRelevantExperience = overlappingDomains.length > 0;
        return (
          <Card
            key={opportunity.id}
            className={`cursor-pointer ${
              isSelected ? "ring-2 ring-[#1e40af]/60" : ""
            }`}
            onClick={() => onSelect(opportunity.id)}
          >
            <div className="flex justify-between gap-3 mb-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-semibold text-gray-900 truncate">
                    {opportunity.name}
                  </h2>
                  {opportunity.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 text-[10px] font-semibold">
                      <ShieldCheck className="w-3 h-3" />
                      Vérifié
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
                  <span>{opportunity.neighborhood}</span>
                  <span>•</span>
                  <span>À {opportunity.distanceKm.toFixed(1)} km</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  isNonProfit
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-sky-50 text-sky-700"
                }`}
              >
                {isNonProfit ? (
                  <Users className="w-3 h-3" />
                ) : (
                  <Building2 className="w-3 h-3" />
                )}
                {isNonProfit
                  ? "OBNL • Bénévolat"
                  : "Commerce • Coup de main ponctuel"}
              </span>
              {opportunity.categories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex px-2 py-0.5 rounded-full bg-gray-100 text-[11px] text-gray-600"
                >
                  {cat}
                </span>
              ))}
              {opportunity.hasCapsules && (
                <span className="inline-flex px-2 py-0.5 rounded-full bg-purple-50 text-[11px] text-purple-700 border border-purple-100">
                  Capsules possibles
                </span>
              )}
            </div>

            <p className="text-sm text-gray-700 mb-1">
              {opportunity.shortDescription}
            </p>

            {hasRelevantExperience && (
              <p className="text-[11px] text-emerald-700 mb-1 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                  {userProfile.missionsCompleted}
                </span>
                Tu as déjà réalisé {userProfile.missionsCompleted} missions
                d'entraide, dont certaines dans ces domaines :{" "}
                {overlappingDomains.join(", ")}
              </p>
            )}

            <div className="space-y-1 mb-3">
              {opportunity.tasks.slice(0, 2).map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-2 text-xs text-gray-600"
                >
                  <span className="mt-[3px] w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                  <span>
                    <span className="font-semibold">{task.title}</span> •{" "}
                    {task.duration} • {task.when}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-900 text-white text-[10px] font-semibold">
                    {userProfile.firstName.charAt(0)}
                  </span>
                  <span className="font-semibold text-gray-800 text-[11px]">
                    {userProfile.firstName} {userProfile.lastInitial}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    • {userProfile.level}
                  </span>
                  <span className="ml-1 inline-flex items-center text-[10px] text-emerald-700 font-semibold">
                    {userProfile.trustScore}% confiance
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs justify-end">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-full bg-[#1e40af] text-white px-3 py-1 font-semibold text-xs"
                >
                  Voir les tâches
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-full bg-gray-900/90 text-white px-3 py-1 font-semibold text-xs"
                >
                  Je veux aider
                </button>
                {EXPERIENCE_TOGGLES.enableAvatarMessaging && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full border border-gray-200 text-gray-700 px-3 py-1 font-semibold text-xs"
                  >
                    <MessageCircle className="w-3 h-3" />
                    {ageMode === "youth" ? "Contact (avatar)" : "Contact"}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 hover:text-gray-600"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  Sauvegarder
                </button>
                {EXPERIENCE_TOGGLES.showReportButton && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 hover:text-red-600"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    Signaler
                  </button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

interface MapPanelProps {
  opportunities: Opportunity[];
  servicePoints: ServicePoint[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

interface UserProfilePreviewProps {
  profile: UserProfile;
  onOpenFullProfile: () => void;
}

function UserProfilePreview({
  profile,
  onOpenFullProfile,
}: UserProfilePreviewProps) {
  const levelLabel = profile.level;

  return (
    <Card className="bg-gradient-to-br from-blue-50 via-white to-emerald-50 border-blue-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="mt-1">
            <div className="w-14 h-14 rounded-2xl bg-[#1e40af] text-white flex items-center justify-center text-2xl font-bold shadow-lg">
              {profile.firstName.charAt(0)}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#1e40af] mb-1">
              MON PARCOURS D'ENTRAIDE (EXEMPLE)
            </p>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              {profile.firstName} {profile.lastInitial}
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-gray-900 text-white px-2 py-0.5 text-[11px] font-medium">
                Niveau : {levelLabel}
                <span className="text-gray-300">
                  ({profile.levelProgressPercent}% → prochain palier)
                </span>
              </span>
            </h2>
            <p className="text-sm text-gray-600 mb-3 max-w-xl">
              Même sans expérience professionnelle, chaque mission terminée
              construit ton histoire : missions, témoignages, domaines de
              compétences… pour devenir progressivement une personne de
              confiance.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 text-sm">
              <div>
                <p className="text-xs text-gray-500">Missions complétées</p>
                <p className="text-lg font-semibold text-gray-900">
                  {profile.missionsCompleted}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Score de confiance</p>
                <p className="text-lg font-semibold text-emerald-700">
                  {profile.trustScore}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Témoignages reçus</p>
                <p className="text-lg font-semibold text-gray-900">
                  {profile.testimonialsCount}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Domaines qui émergent</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {profile.domains.map((domain) => (
                    <span
                      key={domain}
                      className="inline-flex px-2 py-0.5 rounded-full bg-white/80 text-[11px] text-gray-700 border border-gray-200"
                    >
                      {domain}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-gray-500">
                  Progression vers "Trusted Contributor"
                </p>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#1e40af] via-[#60a5fa] to-emerald-400"
                  style={{
                    width: `${Math.min(profile.levelProgressPercent, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-64 space-y-3">
          <div className="bg-white/80 border border-gray-100 rounded-2xl p-3 shadow-sm">
            <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <span className="inline-flex w-4 h-4 items-center justify-center rounded-full bg-[#1e40af] text-white text-[9px] font-bold">
                +
              </span>
              Derniers témoignages (exemple)
            </p>
            {profile.testimonials.slice(0, 2).map((t) => (
              <div key={t.id} className="mb-2 last:mb-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className="text-xs font-semibold text-gray-900 truncate">
                    {t.orgName}
                  </p>
                  {t.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold">
                      <ShieldCheck className="w-3 h-3" />
                      Vérifié
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-600 line-clamp-2">
                  "{t.quote}"
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {t.missionTitle} • {t.date} • Capsule ~{t.approxSeconds ?? 15}
                  s
                </p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onOpenFullProfile}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#1e40af] text-white py-2.5 text-xs font-semibold shadow-md hover:bg-[#1e3a8a]"
          >
            Voir mon profil complet & CV dynamique (prototype)
          </button>
        </div>
      </div>
    </Card>
  );
}

function MapPanel({
  opportunities,
  servicePoints,
  selectedId,
  onSelect,
}: MapPanelProps) {
  return (
    <Card className="h-[420px] md:h-[520px] flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            Carte des missions (MVP illustratif)
          </h2>
          <p className="text-xs text-gray-500">
            Affichage approximatif inspiré de Montréal. Localisation précise à
            venir.
          </p>
        </div>
      </div>
      <div className="relative flex-1 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 border border-slate-200">
        {/* Simple “map” background */}
        <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
          <MapPin className="w-40 h-40 text-slate-400" />
        </div>

        {/* Pins */}
        {opportunities.map((opportunity) => {
          const isNonProfit = opportunity.type === "nonprofit";
          const isSelected = selectedId === opportunity.id;
          return (
            <button
              key={opportunity.id}
              type="button"
              onClick={() => onSelect(opportunity.id)}
              style={{
                left: `${opportunity.mapPosition.x}%`,
                top: `${opportunity.mapPosition.y}%`,
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group`}
            >
              <div
                className={`rounded-full border-2 w-5 h-5 flex items-center justify-center shadow-sm ${
                  isNonProfit
                    ? "bg-emerald-500/80 border-emerald-700"
                    : "bg-sky-500/80 border-sky-700"
                } ${isSelected ? "ring-2 ring-offset-2 ring-[#1e40af]" : ""}`}
              >
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
              <div className="mt-1 px-2 py-0.5 rounded-full bg-white/90 text-[10px] text-gray-700 whitespace-nowrap shadow-sm border border-gray-100">
                {opportunity.name}
              </div>
            </button>
          );
        })}

        {/* Service points */}
        {servicePoints.map((point) => (
          <div
            key={point.id}
            style={{
              left: `${point.mapPosition.x}%`,
              top: `${point.mapPosition.y}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
          >
            <div className="rounded-full bg-white border-2 border-[#1e40af] w-5 h-5 flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-3 h-3 text-[#1e40af]" />
            </div>
            <div className="mt-1 px-2 py-0.5 rounded-full bg-white/90 text-[10px] text-gray-700 whitespace-nowrap shadow-sm border border-gray-100">
              {point.name}
            </div>
          </div>
        ))}
      </div>
      {servicePoints.length > 0 && (
        <p className="mt-2 text-[11px] text-gray-500">
          Ces points de service sont des
          <span className="font-semibold"> lieux publics recommandés </span>
          pour des échanges solidaires (dons d'objets, etc.) entre personnes
          majeures. Recommandations non obligatoires, mais vivement conseillées.
        </p>
      )}
    </Card>
  );
}

interface DetailDrawerProps {
  opportunity: Opportunity;
  ageMode: AgeMode;
  onClose: () => void;
  onHelp: () => void;
  onContact: () => void;
  onReport?: () => void;
}

function DetailDrawer({
  opportunity,
  ageMode,
  onClose,
  onHelp,
  onContact,
  onReport,
}: DetailDrawerProps) {
  const isNonProfit = opportunity.type === "nonprofit";

  return (
    <div className="fixed inset-0 z-40 flex items-end md:items-stretch justify-center pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 pointer-events-auto"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="relative w-full max-w-4xl mx-auto pointer-events-auto">
        <div className="md:absolute md:right-6 md:top-24 md:bottom-6 md:w-[380px]">
          <Card className="h-[80vh] md:h-full flex flex-col bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {opportunity.name}
                  </h2>
                  {opportunity.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 text-[10px] font-semibold">
                      <ShieldCheck className="w-3 h-3" />
                      Vérifié
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {opportunity.neighborhood} • À{" "}
                  {opportunity.distanceKm.toFixed(1)} km
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 hover:bg-gray-100 text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  isNonProfit
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-sky-50 text-sky-700"
                }`}
              >
                {isNonProfit ? (
                  <Users className="w-3 h-3" />
                ) : (
                  <Building2 className="w-3 h-3" />
                )}
                {isNonProfit
                  ? "OBNL • Bénévolat"
                  : "Commerce • Coup de main ponctuel"}
              </span>
              {opportunity.categories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex px-2 py-0.5 rounded-full bg-gray-100 text-[11px] text-gray-600"
                >
                  {cat}
                </span>
              ))}
              {opportunity.hasCapsules && (
                <span className="inline-flex px-2 py-0.5 rounded-full bg-purple-50 text-[11px] text-purple-700 border border-purple-100">
                  Capsules possibles
                </span>
              )}
            </div>

            <p className="text-sm text-gray-700 mb-3">
              {opportunity.shortDescription}
            </p>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Tâches proposées
                </h3>
                <div className="space-y-2">
                  {opportunity.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2"
                    >
                      <div className="flex justify-between items-start gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-gray-900">
                          {task.title}
                        </p>
                        {task.youthFriendly && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-[10px] text-blue-700 px-2 py-0.5">
                            Jeunes bienvenus
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-1.5">
                        {task.description}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {task.duration} • {task.when}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety block */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/70 px-3 py-2.5">
                <h3 className="text-xs font-semibold text-[#1e40af] uppercase tracking-wide mb-1.5">
                  {ageMode === "youth"
                    ? "Sécurité des jeunes"
                    : "Entre aide entre adultes"}
                </h3>
                {ageMode === "youth" ? (
                  <p className="text-xs text-[#1e3a8a]">
                    Si tu as moins de 18 ans, tu contactes les organismes et
                    commerces via un avatar. Ton nom, ta photo et tes
                    coordonnées ne sont jamais partagés publiquement.
                  </p>
                ) : (
                  <p className="text-xs text-[#1e3a8a]">
                    Pour les échanges solidaires entre adultes (par exemple
                    donner un manteau, un livre ou un meuble), nous recommandons
                    fortement de te donner rendez-vous dans un
                    <span className="font-semibold">
                      {" "}
                      point de service vérifié
                    </span>
                    , dans un lieu public et en journée. Ce n'est pas une règle
                    obligatoire, mais une bonne pratique pour la sécurité de
                    tout le monde.
                  </p>
                )}
              </div>

              {/* Dynamic CV teaser */}
              {EXPERIENCE_TOGGLES.showDynamicCvTeaser && (
                <div className="rounded-2xl border border-purple-100 bg-purple-50/60 px-3 py-2.5">
                  <h3 className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-1.5">
                    Capsules de réputation (prototype)
                  </h3>
                  <p className="text-xs text-purple-900/80">
                    Après certaines missions, l'OBNL pourra enregistrer une
                    courte capsule (10–20 s) pour décrire ce que tu as accompli
                    et ta fiabilité. Ces capsules viendront enrichir ton CV
                    dynamique, vérifiable humainement.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 mt-3 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={onHelp}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#1e40af] text-white px-4 py-2 text-xs font-semibold"
                >
                  Je veux aider
                </button>
                {EXPERIENCE_TOGGLES.enableAvatarMessaging && (
                  <button
                    type="button"
                    onClick={onContact}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gray-900/90 text-white px-4 py-2 text-xs font-semibold"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    {ageMode === "youth" ? "Contact (avatar)" : "Contact"}
                  </button>
                )}
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-gray-200 text-gray-700 px-3 py-2 text-xs font-semibold"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  Sauvegarder
                </button>
                {onReport && (
                  <button
                    type="button"
                    onClick={onReport}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-red-100 text-red-600 px-3 py-2 text-xs font-semibold"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    Signaler
                  </button>
                )}
              </div>
              <p className="text-[11px] text-gray-400">
                Les fonctionnalités de contact et de sauvegarde sont en mode
                prototype. Aucun engagement n'est créé automatiquement.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface ContactModalProps {
  opportunity: Opportunity;
  ageMode: AgeMode;
  onClose: () => void;
}

function ContactModal({ opportunity, ageMode, onClose }: ContactModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 max-w-lg w-full mx-4">
        <Card className="bg-white shadow-2xl">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {ageMode === "youth"
                  ? "Contact avec avatar"
                  : "Contact avec l'organisme / commerce"}
              </h2>
              <p className="text-xs text-gray-500">
                {opportunity.name} • {opportunity.neighborhood}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 hover:bg-gray-100 text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            {ageMode === "youth" ? (
              <>
                Tu envoies un message à l'organisme à partir d'un avatar. Ton
                nom complet, ta photo et tes coordonnées restent privés. Un
                adulte responsable dans l'organisme recevra ton message.
              </>
            ) : (
              <>
                Tu peux proposer des disponibilités et, si nécessaire, un lieu
                d'échange. Nous te recommandons de choisir un point de service
                vérifié (bibliothèque, centre communautaire, etc.) pour ce type
                d'entraide entre personnes majeures.
              </>
            )}
          </p>
          <div className="space-y-3 mb-4">
            <textarea
              rows={3}
              className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-[#1e40af] focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder="Présente-toi en quelques mots et précise pour quelle mission tu es intéressé·e…"
            />
            <textarea
              rows={2}
              className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-[#1e40af] focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder="Propose 1–2 plages horaires qui te conviennent…"
            />
          </div>
          <p className="text-[11px] text-gray-400 mb-3">
            Cette messagerie est en version prototype. Le message n'est pas
            encore envoyé en temps réel, mais représente l'expérience visée.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs rounded-full text-gray-600 hover:bg-gray-100 font-semibold"
            >
              Annuler
            </button>
            <button
              type="button"
              className="px-4 py-2 text-xs rounded-full bg-[#1e40af] text-white font-semibold"
            >
              Envoyer le message (prototype)
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

interface FullProfileModalProps {
  profile: UserProfile;
  onClose: () => void;
}

function FullProfileModal({ profile, onClose }: FullProfileModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 max-w-3xl w-full mx-4">
        <Card className="bg-white shadow-2xl max-h-[85vh] overflow-y-auto">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-[#1e40af] mb-1">
                PROFIL COMPLET (EXEMPLE)
              </p>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {profile.firstName} {profile.lastInitial}
              </h2>
              <p className="text-sm text-gray-600">
                Parcours d'entraide basé sur des missions réelles, des capsules
                de témoignages et des domaines de compétences qui se
                construisent au fil du temps.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 hover:bg-gray-100 text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  Niveau actuel
                </p>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-900 text-white px-3 py-1 text-xs font-semibold">
                    {profile.level}
                  </span>
                  <span className="text-xs text-gray-500">
                    Progression vers le prochain palier :{" "}
                    {profile.levelProgressPercent}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#1e40af] via-[#60a5fa] to-emerald-400"
                    style={{
                      width: `${Math.min(profile.levelProgressPercent, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Missions complétées</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {profile.missionsCompleted}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Score de confiance</p>
                  <p className="text-xl font-semibold text-emerald-700">
                    {profile.trustScore}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Témoignages reçus</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {profile.testimonialsCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 text-xs text-gray-700">
                <p className="font-semibold text-[#1e40af] mb-1">
                  CV dynamique (prototype)
                </p>
                <p className="mb-2">
                  Chaque mission validée et chaque capsule de témoignage
                  viennent enrichir un CV humain, vérifiable et compréhensible
                  par de futurs employeurs.
                </p>
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center gap-1 rounded-full bg-[#1e40af] text-white py-1.5 text-[11px] font-semibold shadow-sm"
                >
                  Voir un exemple de CV dynamique (bientôt)
                </button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Parcours de missions
            </h3>
            <div className="space-y-3">
              {profile.history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 border border-gray-100 rounded-2xl p-3 bg-gray-50"
                >
                  <div className="mt-1 w-2 h-2 rounded-full bg-[#1e40af]" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {item.missionTitle}
                    </p>
                    <p className="text-xs text-gray-600">
                      {item.orgName} • {item.date}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.categories.map((cat) => (
                        <span
                          key={cat}
                          className="inline-flex px-2 py-0.5 rounded-full bg-white text-[11px] text-gray-700 border border-gray-200"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Mes témoignages
            </h3>
            <div className="space-y-3">
              {profile.testimonials.map((t) => (
                <div
                  key={t.id}
                  className="border border-gray-100 rounded-2xl p-3 bg-white"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {t.orgName}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {t.missionTitle} • {t.date}
                      </p>
                    </div>
                    {t.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 text-[10px] font-semibold">
                        <ShieldCheck className="w-3 h-3" />
                        Témoignage vérifié
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-700 mb-1.5">"{t.quote}"</p>
                  <p className="text-[10px] text-gray-500">
                    Capsule vidéo ou audio courte (~{t.approxSeconds ?? 15}s)
                    enregistrée par {t.supervisorName}.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

interface ReportModalProps {
  opportunity: Opportunity;
  onClose: () => void;
}

function ReportModal({ opportunity, onClose }: ReportModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 max-w-md w-full mx-4">
        <Card className="bg-white shadow-2xl">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Signaler cette opportunité
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 hover:bg-gray-100 text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            Si quelque chose te semble inapproprié ou risqué à propos de
            <span className="font-semibold"> {opportunity.name}</span>, tu peux
            nous le signaler.
          </p>
          <textarea
            rows={3}
            className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none mb-3"
            placeholder="Explique en quelques mots ce qui te préoccupe…"
          />
          <p className="text-[11px] text-gray-400 mb-3">
            Dans cette version de Collaboro, ton signalement est transmis à
            l'équipe pour revue manuelle. Nous pourrons ajuster ou retirer le
            contenu au besoin.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs rounded-full text-gray-600 hover:bg-gray-100 font-semibold"
            >
              Annuler
            </button>
            <button
              type="button"
              className="px-4 py-2 text-xs rounded-full bg-red-600 text-white font-semibold"
            >
              Envoyer le signalement (prototype)
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
