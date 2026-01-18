import { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  Search,
  ShieldCheck,
  Users,
  Building2,
  X,
  MessageCircle,
  Bookmark,
  Flag,
} from "lucide-react";
import { Card } from "../components/Card";
import { useI18n } from "../i18n/i18n";

type OpportunityType = "nonprofit" | "business";

interface Task {
  id: string;
  title: string;
  description: string;
  duration: string;
  when: string;
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


// Experience-level feature toggles (MVP)
const EXPERIENCE_TOGGLES = {
  showBusinessTasks: true,
  showVerifiedServicePoints: true,
  showDynamicCvTeaser: true,
  showReportButton: true,
};

const RADIUS_OPTIONS = [1, 3, 5, 10] as const;
type RadiusOption = (typeof RADIUS_OPTIONS)[number];

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

export default function Decouvrir({ onNavigate }: DecouvrirProps) {
  const { lang } = useI18n();
  const isFr = lang === "fr";

  const [search, setSearch] = useState("");
  const [radius, setRadius] = useState<RadiusOption>(3);
  const [typeFilter, setTypeFilter] = useState<"nonprofit" | "business">(
    "nonprofit"
  );
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [viewModeMobile, setViewModeMobile] = useState<"list" | "map">("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const selectedOpportunity = useMemo(
    () => OPPORTUNITIES.find((o) => o.id === selectedId) || null,
    [selectedId]
  );

  const handleOpenDetails = (id: string) => {
    setSelectedId(id);
  };

  const handleOpenContact = (id: string) => {
    setSelectedId(id);
    setShowContactModal(true);
  };

  const handleOpenReport = (id: string) => {
    setSelectedId(id);
    setShowReportModal(true);
  };

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
              {isFr ? "Découvrir où aider près de chez toi" : "Discover ways to help near you"}
            </h1>
            <p className="text-gray-600 max-w-2xl text-sm sm:text-base">
              {isFr
                ? "Soutiens des organismes locaux et des commerces de quartier. Bâtis ta confiance par des actions concrètes."
                : "Support local organizations and nearby businesses. Build trust through real actions."}
            </p>
          </div>

          <div className="flex items-center md:items-end">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-[#1e40af]">
              <ShieldCheck className="w-4 h-4" />
              Safety &amp; trust-first
            </div>
          </div>
        </div>
      </header>


      {/* Filters */}
      <section className="px-4 sm:px-6 lg:px-8 pt-4 pb-4 bg-white/80 backdrop-blur-md sticky top-20 z-30 border-b border-gray-100">
        <div className="max-w-7xl mx-auto space-y-2">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  isFr
                    ? "Nom d'organisme, mission, quartier…"
                    : "Organization name, mission, neighbourhood…"
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 focus:border-[#1e40af] focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 hidden sm:inline">
                  {isFr ? "Rayon" : "Radius"}
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
                  {isFr ? "Organismes" : "Organizations"}
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
                    {isFr ? "Commerces" : "Local businesses"}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs text-gray-500">
            <span>
              {isFr
                ? `${filteredOpportunities.length} opportunités dans un rayon de ${radius} km`
                : `${filteredOpportunities.length} opportunities within ${radius} km`}
            </span>
            <button
              type="button"
              onClick={handleUseLocation}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-[#1e40af]"
            >
              <MapPin className="w-3.5 h-3.5" />
              {locationStatus === "granted"
                ? isFr
                  ? "Affichage près de ta position"
                  : "Showing around your location"
                : isFr
                ? "Autour de Montréal • Activer ma localisation"
                : "Around Montréal • Enable my location"}
            </button>
          </div>
        </div>
      </section>


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
                {isFr ? "Liste" : "List"}
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
                {isFr ? "Carte" : "Map"}
              </button>
            </div>
          </div>

          {/* Desktop split layout */}
          <div className="hidden md:grid md:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)] gap-6">
            <OpportunityList
              opportunities={filteredOpportunities}
              selectedId={selectedId}
              onOpenDetails={handleOpenDetails}
              onOpenContact={handleOpenContact}
              onOpenReport={handleOpenReport}
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
                selectedId={selectedId}
                onOpenDetails={handleOpenDetails}
                onOpenContact={handleOpenContact}
                onOpenReport={handleOpenReport}
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

      {/* Profile & mission CV preview (prototype) */}
      <section className="px-4 sm:px-6 lg:px-8 pt-4">
        <div className="max-w-7xl mx-auto mt-4 mb-10">
          <ProfilePreview />
        </div>
      </section>

      {/* Detail drawer */}
      {selectedOpportunity && (
        <DetailDrawer
          opportunity={selectedOpportunity}
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
    </div>
  );
}

interface OpportunityListProps {
  opportunities: Opportunity[];
  selectedId: string | null;
  onOpenDetails: (id: string) => void;
  onOpenContact: (id: string) => void;
  onOpenReport: (id: string) => void;
}

function OpportunityList({
  opportunities,
  selectedId,
  onOpenDetails,
  onOpenContact,
  onOpenReport,
}: OpportunityListProps) {
  const { lang } = useI18n();
  const isFr = lang === "fr";
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (opportunities.length === 0) {
    return (
      <div className="space-y-3 mt-2">
        <Card className="border-dashed border-2 border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            {isFr ? "Aucun résultat dans ce rayon" : "No results in this radius"}
          </h2>
          <p className="text-sm text-gray-600 mb-3">
            {isFr
              ? "Essaie d'agrandir le rayon ou d'ajuster la recherche."
              : "Try increasing the radius or adjusting your search."}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-2">
      {opportunities.map((opportunity) => {
        const isSelected = selectedId === opportunity.id;
        const primaryTask = opportunity.tasks[0];

        return (
          <Card
            key={opportunity.id}
            className={`cursor-pointer transition-shadow ${
              isSelected ? "ring-2 ring-[#1e40af]/60 shadow-sm" : "hover:shadow-sm"
            }`}
            onClick={() => onOpenDetails(opportunity.id)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1.5">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-gray-900 truncate">
                    {opportunity.name}
                  </h2>
                  {opportunity.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 text-[10px] font-semibold">
                      <ShieldCheck className="w-3 h-3" />
                      {isFr ? "Vérifié" : "Verified"}
                    </span>
                  )}
                </div>
                <p className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
                  <span>{opportunity.neighborhood}</span>
                  <span>•</span>
                  <span>À {opportunity.distanceKm.toFixed(1)} km</span>
                </p>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {opportunity.shortDescription}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {opportunity.categories[0] && (
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-gray-100 text-[11px] text-gray-700">
                      {opportunity.categories[0]}
                    </span>
                  )}
                  {primaryTask && (
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-gray-100 text-[11px] text-gray-700">
                      {primaryTask.duration} • {primaryTask.when}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 pl-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full bg-[#1e40af] text-white px-3 py-1.5 text-xs font-semibold shadow-sm hover:bg-[#1e3a8a]"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDetails(opportunity.id);
                  }}
                >
                  {isFr ? "Voir les détails" : "View details"}
                </button>
                <div className="relative">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(
                        openMenuId === opportunity.id ? null : opportunity.id
                      );
                    }}
                  >
                    <span className="text-sm leading-none">···</span>
                  </button>
                  {openMenuId === opportunity.id && (
                    <div className="absolute right-0 mt-1 w-40 rounded-xl border border-gray-100 bg-white shadow-lg text-xs text-gray-700 z-10">
                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-gray-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenContact(opportunity.id);
                          setOpenMenuId(null);
                        }}
                      >
                        {isFr ? "Contacter" : "Contact"}
                      </button>
                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-gray-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenReport(opportunity.id);
                          setOpenMenuId(null);
                        }}
                      >
                        {isFr ? "Signaler" : "Report"}
                      </button>
                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-gray-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(null);
                        }}
                      >
                        {isFr ? "Sauvegarder (bientôt)" : "Save (coming soon)"}
                      </button>
                    </div>
                  )}
                </div>
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

function MapPanel({
  opportunities,
  servicePoints,
  selectedId,
  onSelect,
}: MapPanelProps) {
  const { lang } = useI18n();
  const isFr = lang === "fr";

  return (
    <Card className="h-[420px] md:h-[520px] flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            {isFr ? "Carte des missions près de toi" : "Map of missions near you"}
          </h2>
          <p className="text-xs text-gray-500">
            {isFr
              ? "Position approximative des organisations et commerces."
              : "Approximate position of organizations and businesses."}
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
          {isFr ? "Ces points de service sont des" : "These service points are"}
          <span className="font-semibold">
            {isFr ? " lieux publics recommandés " : " recommended public places "}
          </span>
          {isFr
            ? "pour des échanges solidaires (dons d'objets, etc.). Recommandations non obligatoires, mais vivement conseillées."
            : "for solidarity exchanges (donating items, etc.). Not mandatory, but highly recommended."}
        </p>
      )}
    </Card>
  );
}

interface DetailDrawerProps {
  opportunity: Opportunity;
  onClose: () => void;
  onHelp: () => void;
  onContact: () => void;
  onReport?: () => void;
}

function DetailDrawer({
  opportunity,
  onClose,
  onHelp,
  onContact,
  onReport,
}: DetailDrawerProps) {
  const { lang } = useI18n();
  const isFr = lang === "fr";
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
                      {isFr ? "Vérifié" : "Verified"}
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
                  ? isFr
                    ? "OBNL • Bénévolat"
                    : "Nonprofit • Volunteering"
                  : isFr
                  ? "Commerce • Coup de main ponctuel"
                  : "Business • One‑off help"}
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
                  {isFr ? "Tâches proposées" : "Proposed tasks"}
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
                  {isFr ? "Conseils de sécurité" : "Safety tips"}
                </h3>
                <p className="text-xs text-[#1e3a8a]">
                  {isFr
                    ? "Pour tous les gestes d'entraide (bénévolat, dons d'objets, coups de main), on recommande de se rencontrer dans un lieu public et en journée, idéalement dans un"
                    : "For all mutual‑aid actions (volunteering, donating items, giving a hand), we recommend meeting in a public place during the day, ideally in a"}
                  <span className="font-semibold">
                    {isFr ? " point de service vérifié" : " verified service point"}
                  </span>
                  {isFr
                    ? ". Ce n'est pas obligatoire, mais c'est une bonne pratique pour la sécurité de tout le monde."
                    : ". It’s not mandatory, but it’s a good practice for everyone’s safety."}
                </p>
              </div>

              {/* Dynamic CV teaser */}
              {EXPERIENCE_TOGGLES.showDynamicCvTeaser && (
                <div className="rounded-2xl border border-purple-100 bg-purple-50/60 px-3 py-2.5">
                  <h3 className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-1.5">
                    {isFr
                      ? "Capsules de réputation (prototype)"
                      : "Reputation capsules (prototype)"}
                  </h3>
                  <p className="text-xs text-purple-900/80">
                    {isFr
                      ? "Après certaines missions, l'OBNL pourra enregistrer une courte capsule (10–20 s) pour décrire ce que tu as accompli et ta fiabilité. Ces capsules viendront enrichir ton CV dynamique, vérifiable humainement."
                      : "After certain missions, the nonprofit could record a short capsule (10–20s) describing what you accomplished and your reliability. These capsules would enrich your dynamic, human‑verified CV."}
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
                  {isFr ? "Je veux aider" : "I want to help"}
                </button>
                <button
                  type="button"
                  onClick={onContact}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gray-900/90 text-white px-4 py-2 text-xs font-semibold"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  {isFr ? "Contact" : "Contact"}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-gray-200 text-gray-700 px-3 py-2 text-xs font-semibold"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  {isFr ? "Sauvegarder" : "Save"}
                </button>
                {onReport && (
                  <button
                    type="button"
                    onClick={onReport}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-red-100 text-red-600 px-3 py-2 text-xs font-semibold"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    {isFr ? "Signaler" : "Report"}
                  </button>
                )}
              </div>
              <p className="text-[11px] text-gray-400">
                {isFr
                  ? "Les fonctionnalités de contact et de sauvegarde sont en mode prototype. Aucun engagement n'est créé automatiquement."
                  : "Contact and save features are in prototype mode. No commitments are created automatically."}
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
  onClose: () => void;
}

function ContactModal({ opportunity, onClose }: ContactModalProps) {
  const { lang } = useI18n();
  const isFr = lang === "fr";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 max-w-lg w-full mx-4">
        <Card className="bg-white shadow-2xl">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {isFr
                  ? "Contact avec l'organisme / commerce"
                  : "Contact the organization / business"}
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
            {isFr
              ? "Tu peux envoyer un court message pour te présenter, préciser la mission qui t'intéresse et proposer quelques disponibilités. Pour les rencontres sur place, privilégie un lieu public et, si possible, un point de service recommandé (bibliothèque, centre communautaire, etc.)."
              : "You can send a short message to introduce yourself, mention which mission interests you and suggest a few time slots. For in‑person meetings, choose a public place and, if possible, a recommended service point (library, community centre, etc.)."}
          </p>
          <div className="space-y-3 mb-4">
            <textarea
              rows={3}
              className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-[#1e40af] focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder={
                isFr
                  ? "Présente-toi en quelques mots et précise pour quelle mission tu es intéressé·e…"
                  : "Introduce yourself in a few words and mention which mission you’re interested in…"
              }
            />
            <textarea
              rows={2}
              className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-[#1e40af] focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder={
                isFr
                  ? "Propose 1–2 plages horaires qui te conviennent…"
                  : "Suggest 1–2 time slots that work for you…"
              }
            />
          </div>
          <p className="text-[11px] text-gray-400 mb-3">
            {isFr
              ? "Cette messagerie est en version prototype. Le message n'est pas encore envoyé en temps réel, mais représente l'expérience visée."
              : "This messaging feature is a prototype. Messages are not yet sent in real time, but represent the intended experience."}
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs rounded-full text-gray-600 hover:bg-gray-100 font-semibold"
            >
              {isFr ? "Annuler" : "Cancel"}
            </button>
            <button
              type="button"
              className="px-4 py-2 text-xs rounded-full bg-[#1e40af] text-white font-semibold"
            >
              {isFr
                ? "Envoyer le message (prototype)"
                : "Send message (prototype)"}
            </button>
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
  const { lang } = useI18n();
  const isFr = lang === "fr";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 max-w-md w-full mx-4">
        <Card className="bg-white shadow-2xl">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                {isFr ? "Signaler cette opportunité" : "Report this opportunity"}
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
            {isFr ? "Si quelque chose te semble inapproprié ou risqué à propos de" : "If something seems inappropriate or risky about"}
            <span className="font-semibold"> {opportunity.name}</span>
            {isFr ? ", tu peux nous le signaler." : ", you can report it to us."}
          </p>
          <textarea
            rows={3}
            className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none mb-3"
            placeholder={
              isFr
                ? "Explique en quelques mots ce qui te préoccupe…"
                : "Explain in a few words what concerns you…"
            }
          />
          <p className="text-[11px] text-gray-400 mb-3">
            {isFr
              ? "Dans cette version de Collaboro, ton signalement est transmis à l'équipe pour revue manuelle. Nous pourrons ajuster ou retirer le contenu au besoin."
              : "In this version of Collaboro, your report is sent to the team for manual review. We may adjust or remove the content if needed."}
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs rounded-full text-gray-600 hover:bg-gray-100 font-semibold"
            >
              {isFr ? "Annuler" : "Cancel"}
            </button>
            <button
              type="button"
              className="px-4 py-2 text-xs rounded-full bg-red-600 text-white font-semibold"
            >
              {isFr
                ? "Envoyer le signalement (prototype)"
                : "Send report (prototype)"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ProfilePreview() {
  const { lang } = useI18n();
  const isFr = lang === "fr";

  const stats = {
    missions: 7,
    hours: 24,
    references: 3,
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50" hover={false}>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {isFr
              ? "Aperçu de ton profil & CV de missions (prototype)"
              : "Preview of your profile & mission CV (prototype)"}
          </h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            {isFr
              ? "Dans une prochaine version de Collaboro, chaque mission complétée pourra enrichir ton profil : heures d'entraide, références d'OBNL et capsules courtes qui décrivent ce que tu as réalisé."
              : "In a future version of Collaboro, each completed mission could enrich your profile: hours of mutual aid, references from nonprofits, and short capsules that describe what you actually did."}
          </p>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-3 text-center text-xs sm:text-sm">
          <div className="bg-white rounded-2xl px-3 py-3 shadow-sm border border-gray-100">
            <div className="text-lg sm:text-xl font-bold text-gray-900">
              {stats.missions}
            </div>
            <div className="text-gray-500">
              {isFr ? "missions complétées" : "missions completed"}
            </div>
          </div>
          <div className="bg-white rounded-2xl px-3 py-3 shadow-sm border border-gray-100">
            <div className="text-lg sm:text-xl font-bold text-gray-900">
              {stats.hours}h
            </div>
            <div className="text-gray-500">
              {isFr ? "heures estimées" : "estimated hours"}
            </div>
          </div>
          <div className="bg-white rounded-2xl px-3 py-3 shadow-sm border border-gray-100">
            <div className="text-lg sm:text-xl font-bold text-gray-900">
              {stats.references}
            </div>
            <div className="text-gray-500">
              {isFr ? "références OBNL" : "nonprofit references"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 text-sm text-gray-700">
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900">
            {isFr ? "Exemple de sections dans ton CV" : "Example sections in your CV"}
          </h3>
          <ul className="space-y-1 list-disc list-inside">
            <li>
              {isFr
                ? "Résumé des missions clés (type de mission, quartier, heures, fiabilité)"
                : "Summary of key missions (type, neighbourhood, hours, reliability)"}
            </li>
            <li>
              {isFr
                ? "Courtes références écrites par les OBNL partenaires"
                : "Short written references from partner nonprofits"}
            </li>
            <li>
              {isFr
                ? "Capsules audio/vidéo de 10–20s qui décrivent ton impact"
                : "10–20s audio/video capsules that describe your impact"}
            </li>
          </ul>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900">
            {isFr ? "Extrait de CV (prototype)" : "CV snippet (prototype)"}
          </h3>
          <div className="bg-white rounded-2xl border border-gray-100 px-4 py-3 text-xs sm:text-sm shadow-sm">
            <p className="font-semibold text-gray-900">
              {isFr
                ? "Maison des aînés du Plateau — Visites de courtoisie"
                : "Maison des aînés du Plateau — Friendly visits"}
            </p>
            <p className="text-gray-600">
              {isFr
                ? "Présence chaleureuse auprès de personnes aînées isolées (1–2h / semaine). Jeux de société, discussion et accompagnement lors de sorties de groupe."
                : "Warm presence with isolated seniors (1–2h / week). Board games, conversation and support during small group outings."}
            </p>
            <p className="mt-1 text-[11px] text-gray-500">
              {isFr
                ? "Référence (exemple) : “Toujours à l'heure, fiable et très apprécié·e des participant·e·s.”"
                : "Reference (example): “Always on time, reliable and deeply appreciated by participants.”"}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-[11px] text-gray-400">
        {isFr
          ? "Cette section est un aperçu conceptuel. Dans le pilote, ton profil sera généré à partir de vraies missions validées."
          : "This section is a conceptual preview. In the pilot, your profile would be generated from real, validated missions."}
      </p>
    </Card>
  );
}
