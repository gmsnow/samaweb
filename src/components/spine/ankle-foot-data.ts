export type AnkleFootCategory = "nerves" | "arteries" | "ligaments";

export interface AnkleFootStructure {
  id: string;
  label: string;
  fullName: string;
  category: AnkleFootCategory;
  description: string;
  nodes: string[];
}

export const ANKLE_FOOT_CATEGORY_COLORS: Record<AnkleFootCategory, string> = {
  nerves: "#a78bfa",
  arteries: "#f87171",
  ligaments: "#34d399",
};

export const ANKLE_FOOT_CATEGORY_ORDER: AnkleFootCategory[] = [
  "nerves",
  "arteries",
  "ligaments",
];

export const ANKLE_FOOT_STRUCTURES: AnkleFootStructure[] = [
  {
    id: "tibial-nerve",
    label: "TN",
    fullName: "Tibial Nerve",
    category: "nerves",
    description:
      "Main nerve of the posterior leg; reaches the foot through the medial and lateral plantar branches.",
    nodes: [
      "Tibial nerve.r",
      "Medial plantar nerve.r",
      "Lateral plantar nerve.r",
      "Medial calcaneal branches of Tibial nerve.r",
    ],
  },
  {
    id: "deep-fibular-nerve",
    label: "DF",
    fullName: "Deep Fibular Nerve",
    category: "nerves",
    description:
      "Innervates the muscles of the anterior leg and the dorsum of the foot, supplying sensation to the first toe web space.",
    nodes: [
      "Deep fibular nerve.r",
      "Medial branch of deep fibular nerve.r",
      "Lateral branch of deep fibular nerve.r",
      "Dorsal digital branches of deep fibular nerve.r",
    ],
  },
  {
    id: "superficial-fibular-nerve",
    label: "SF",
    fullName: "Superficial Fibular Nerve",
    category: "nerves",
    description:
      "Supplies the lateral lower leg and most of the dorsal surface of the foot with sensation.",
    nodes: [
      "Superficial fibular nerve.r",
      "Medial dorsal cutaneous nerve.r",
      "Dorsal digital branches of superficial fibular nerve.r",
    ],
  },
  {
    id: "sural-nerve",
    label: "SuN",
    fullName: "Sural Nerve",
    category: "nerves",
    description:
      "Sensory nerve running along the lateral ankle and foot; frequently used as a donor for nerve grafts.",
    nodes: ["Sural nerve.r", "Lateral dorsal cutaneous nerve.r"],
  },
  {
    id: "saphenous-nerve",
    label: "SaN",
    fullName: "Saphenous Nerve",
    category: "nerves",
    description:
      "Sensory branch of the femoral nerve that descends to the medial ankle and foot.",
    nodes: ["Saphenous nerve (Medial crural cutaneous branches).r"],
  },
  {
    id: "anterior-tibial-artery",
    label: "AT",
    fullName: "Anterior Tibial Artery",
    category: "arteries",
    description:
      "Supplies the anterior compartment of the leg and continues as the dorsalis pedis artery.",
    nodes: ["Anterior tibial artery.r"],
  },
  {
    id: "dorsalis-pedis-artery",
    label: "DP",
    fullName: "Dorsalis Pedis Artery",
    category: "arteries",
    description:
      "Palpable on the dorsum of the foot; its pulse is used to assess distal circulation.",
    nodes: ["Dorsal pedis artery.r"],
  },
  {
    id: "posterior-tibial-artery",
    label: "PT",
    fullName: "Posterior Tibial Artery",
    category: "arteries",
    description:
      "Primary source of blood supply to the plantar foot; its pulse is felt behind the medial malleolus.",
    nodes: [
      "Posterior tibial artery.r",
      "Medial plantar artery.r",
      "Lateral plantar artery.r",
      "Medial calcaneal artery.r",
    ],
  },
  {
    id: "fibular-artery",
    label: "FA",
    fullName: "Fibular (Peroneal) Artery",
    category: "arteries",
    description:
      "Runs along the fibula, supplying the lateral compartment and the calcaneal region.",
    nodes: [
      "Fibular artery.r",
      "Perforating branches of fibular artery.r",
      "Lateral malleolar branches of Fibular artery.r",
    ],
  },
  {
    id: "arcuate-artery",
    label: "ArA",
    fullName: "Arcuate Artery",
    category: "arteries",
    description:
      "Arches across the midfoot and gives rise to the dorsal metatarsal arteries.",
    nodes: ["Arcuate artery.r", "Dorsal metatarsal arteries.r"],
  },
  {
    id: "deltoid-ligament",
    label: "DL",
    fullName: "Deltoid (Medial Collateral) Ligament",
    category: "ligaments",
    description:
      "Strong, fan-shaped medial stabilizer of the ankle that resists eversion forces.",
    nodes: [
      "Tibionavicular ligament.r",
      "Tibiocalcaneal ligament.r",
      "Anterior tibiotalar ligament (Tibiospring lig.).r",
      "Posterior tibiotalar ligament.r",
    ],
  },
  {
    id: "atfl",
    label: "ATFL",
    fullName: "Anterior Talofibular Ligament",
    category: "ligaments",
    description:
      "The most commonly sprained ankle ligament; resists forward displacement of the talus.",
    nodes: ["Anterior talofibular ligament.r"],
  },
  {
    id: "cfl",
    label: "CFL",
    fullName: "Calcaneofibular Ligament",
    category: "ligaments",
    description:
      "Lateral cord connecting the fibula to the calcaneus; injured in inversion (lateral) ankle sprains.",
    nodes: ["Calcaneofibular ligament.r"],
  },
  {
    id: "ptfl",
    label: "PTFL",
    fullName: "Posterior Talofibular Ligament",
    category: "ligaments",
    description:
      "Strong posterior lateral ligament of the ankle; rarely injured compared with the ATFL and CFL.",
    nodes: ["Posterior talofibular ligament.r"],
  },
  {
    id: "spring-ligament",
    label: "SL",
    fullName: "Spring (Plantar Calcaneonavicular) Ligament",
    category: "ligaments",
    description:
      "Supports the head of the talus and is essential for maintaining the medial longitudinal arch.",
    nodes: ["Plantar calcaneonavicular ligament.r"],
  },
  {
    id: "lisfranc",
    label: "Lisf",
    fullName: "Lisfranc Ligament",
    category: "ligaments",
    description:
      "Links the medial cuneiform to the base of the second metatarsal; key to midfoot stability.",
    nodes: ["Cuneometatarsal interosseus ligaments.r"],
  },
];

export function getAnkleFootInfo(
  id: string
): AnkleFootStructure | undefined {
  return ANKLE_FOOT_STRUCTURES.find((s) => s.id === id);
}
