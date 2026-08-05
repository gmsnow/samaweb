export type AnkleFootCategory =
  | "nerves"
  | "arteries"
  | "ligaments"
  | "bones";

export interface AnkleFootStructure {
  id: string;
  label: string;
  fullName: string;
  category: AnkleFootCategory;
  description: string;
  nodes: string[];
}

export interface AnkleFootBone {
  id: string;
  fullName: string;
  category: "bones";
  description: string;
  nodes: string[];
}

export const ANKLE_FOOT_CATEGORY_COLORS: Record<AnkleFootCategory, string> = {
  nerves: "#a78bfa",
  arteries: "#f87171",
  ligaments: "#34d399",
  bones: "#60a5fa",
};

export const ANKLE_FOOT_CATEGORY_ORDER: AnkleFootCategory[] = [
  "bones",
  "ligaments",
  "nerves",
  "arteries",
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

export const ANKLE_FOOT_BONES: AnkleFootBone[] = [
  {
    id: "bone-talus",
    fullName: "Talus",
    category: "bones",
    description:
      "The keystone of the ankle. Transfers body weight from the tibia to the foot and articulates with the fibula, calcaneus and navicular.",
    nodes: ["Talus.r"],
  },
  {
    id: "bone-calcaneus",
    fullName: "Calcaneus",
    category: "bones",
    description:
      "The largest tarsal bone; forms the heel and the posterior pillar of the longitudinal arch, anchoring the Achilles tendon.",
    nodes: ["Calcaneus.r"],
  },
  {
    id: "bone-navicular",
    fullName: "Navicular Bone",
    category: "bones",
    description:
      "Boat-shaped tarsal bone articulating with the talus and the three cuneiforms; a landmark of the medial longitudinal arch.",
    nodes: ["Navicular bone.r"],
  },
  {
    id: "bone-cuboid",
    fullName: "Cuboid Bone",
    category: "bones",
    description:
      "Lateral tarsal bone that forms the lateral column and articulates with the calcaneus and the fourth and fifth metatarsals.",
    nodes: ["Cuboid bone.r"],
  },
  {
    id: "bone-medial-cuneiform",
    fullName: "Medial Cuneiform",
    category: "bones",
    description:
      "Medial cuneiform articulating with the first metatarsal, the navicular and the intermediate cuneiform.",
    nodes: ["Medial cuneiform bone.r"],
  },
  {
    id: "bone-intermediate-cuneiform",
    fullName: "Intermediate Cuneiform",
    category: "bones",
    description:
      "The middle cuneiform, wedged between the navicular and the second metatarsal.",
    nodes: ["Intermediate cuneiform bone.r"],
  },
  {
    id: "bone-lateral-cuneiform",
    fullName: "Lateral Cuneiform",
    category: "bones",
    description:
      "Lateral cuneiform articulating with the third metatarsal and the cuboid.",
    nodes: ["Lateral cuneiform bone.r"],
  },
  {
    id: "bone-tibia",
    fullName: "Tibia",
    category: "bones",
    description:
      "The main weight-bearing bone of the lower leg; its lower end forms the medial malleolus of the ankle.",
    nodes: ["Tibia.r"],
  },
  {
    id: "bone-fibula",
    fullName: "Fibula",
    category: "bones",
    description:
      "The slender lateral bone of the lower leg; its lower end forms the lateral malleolus and stabilizes the ankle.",
    nodes: ["Fibula.r"],
  },
  {
    id: "bone-mt1",
    fullName: "First Metatarsal",
    category: "bones",
    description:
      "The thickest and shortest metatarsal; bears a large share of body weight at the ball of the foot.",
    nodes: ["First metatarsal bone.r"],
  },
  {
    id: "bone-mt2",
    fullName: "Second Metatarsal",
    category: "bones",
    description:
      "Metatarsal at the apex of the transverse arch; the Lisfranc ligament attaches to its base.",
    nodes: ["Second metatarsal bone.r"],
  },
  {
    id: "bone-mt3",
    fullName: "Third Metatarsal",
    category: "bones",
    description:
      "Central metatarsal articulating with the lateral cuneiform.",
    nodes: ["Third metatarsal bone.r"],
  },
  {
    id: "bone-mt4",
    fullName: "Fourth Metatarsal",
    category: "bones",
    description:
      "Metatarsal articulating with the cuboid and the fifth metatarsal.",
    nodes: ["Fourth metatarsal bone.r"],
  },
  {
    id: "bone-mt5",
    fullName: "Fifth Metatarsal",
    category: "bones",
    description:
      "The most lateral metatarsal; its base carries the tuberosity where the peroneus brevis attaches.",
    nodes: ["Fifth metatarsal bone.r"],
  },
  {
    id: "bone-p1-1",
    fullName: "Proximal Phalanx, 1st Toe",
    category: "bones",
    description: "The first bone of the big toe, forming its proximal segment.",
    nodes: ["Proximal phalanx of first finger of foot.r"],
  },
  {
    id: "bone-p1-2",
    fullName: "Proximal Phalanx, 2nd Toe",
    category: "bones",
    description: "The proximal bone of the second toe.",
    nodes: ["Proximal phalanx of second finger of foot.r"],
  },
  {
    id: "bone-p1-3",
    fullName: "Proximal Phalanx, 3rd Toe",
    category: "bones",
    description: "The proximal bone of the third toe.",
    nodes: ["Proximal phalanx of third finger of foot.r"],
  },
  {
    id: "bone-p1-4",
    fullName: "Proximal Phalanx, 4th Toe",
    category: "bones",
    description: "The proximal bone of the fourth toe.",
    nodes: ["Proximal phalanx of fourth finger of foot.r"],
  },
  {
    id: "bone-p1-5",
    fullName: "Proximal Phalanx, 5th Toe",
    category: "bones",
    description: "The proximal bone of the fifth (little) toe.",
    nodes: ["Proximal phalanx of fifth finger of foot.r"],
  },
  {
    id: "bone-p2-2",
    fullName: "Middle Phalanx, 2nd Toe",
    category: "bones",
    description: "The middle bone of the second toe.",
    nodes: ["Middle phalanx of second finger of foot.r"],
  },
  {
    id: "bone-p2-3",
    fullName: "Middle Phalanx, 3rd Toe",
    category: "bones",
    description: "The middle bone of the third toe.",
    nodes: ["Middle phalanx of third finger of foot.r"],
  },
  {
    id: "bone-p2-4",
    fullName: "Middle Phalanx, 4th Toe",
    category: "bones",
    description: "The middle bone of the fourth toe.",
    nodes: ["Middle phalanx of fourth finger of foot.r"],
  },
  {
    id: "bone-p2-5",
    fullName: "Middle Phalanx, 5th Toe",
    category: "bones",
    description: "The middle bone of the fifth (little) toe.",
    nodes: ["Middle phalanx of fifth finger of foot.r"],
  },
  {
    id: "bone-p3-1",
    fullName: "Distal Phalanx, 1st Toe",
    category: "bones",
    description: "The terminal bone of the big toe, supporting the nail.",
    nodes: ["Distal phalanx of first finger of foot.r"],
  },
  {
    id: "bone-p3-2",
    fullName: "Distal Phalanx, 2nd Toe",
    category: "bones",
    description: "The terminal bone of the second toe, supporting the nail.",
    nodes: ["Distal phalanx of second finger of foot.r"],
  },
  {
    id: "bone-p3-3",
    fullName: "Distal Phalanx, 3rd Toe",
    category: "bones",
    description: "The terminal bone of the third toe, supporting the nail.",
    nodes: ["Distal phalanx of third finger of foot.r"],
  },
  {
    id: "bone-p3-4",
    fullName: "Distal Phalanx, 4th Toe",
    category: "bones",
    description: "The terminal bone of the fourth toe, supporting the nail.",
    nodes: ["Distal phalanx of fourth finger of foot.r"],
  },
  {
    id: "bone-p3-5",
    fullName: "Distal Phalanx, 5th Toe",
    category: "bones",
    description: "The terminal bone of the fifth (little) toe, supporting the nail.",
    nodes: ["Distal phalanx of fifth finger of foot.r"],
  },
  {
    id: "bone-sesamoid",
    fullName: "Sesamoid Bones",
    category: "bones",
    description:
      "Two small bones embedded in the flexor hallucis brevis tendon beneath the first metatarsal head; they protect the tendon and improve leverage.",
    nodes: ["Sesamoid bones of foot.r"],
  },
];

export function getAnkleFootInfo(
  id: string
): AnkleFootStructure | AnkleFootBone | undefined {
  return (
    ANKLE_FOOT_STRUCTURES.find((s) => s.id === id) ??
    ANKLE_FOOT_BONES.find((b) => b.id === id)
  );
}
