export type BodyCategory = "bones" | "muscles" | "connective";

export const BODY_CATEGORY_ORDER: BodyCategory[] = [
  "bones",
  "muscles",
  "connective",
];

export const BODY_CATEGORY_COLORS: Record<BodyCategory, string> = {
  bones: "#FFEDB1",
  muscles: "#f87171",
  connective: "#a78bfa",
};

export const BODY_REGION_KEYS = [
  "head",
  "neck",
  "chest",
  "abdomen",
  "back",
  "upperLimb",
  "lowerLimb",
] as const;

export type BodyRegion = (typeof BODY_REGION_KEYS)[number];

export function categoryForType(type: string | undefined): BodyCategory {
  if (type === "bone") return "bones";
  if (type === "muscle") return "muscles";
  return "connective";
}

export function regionForStructure(raw: string): BodyRegion | "other" {
  const n = raw.toLowerCase().trim();
  const re = (p: RegExp) => p.test(n);

  if (
    re(
      /ear|eye|ocular|oculi|palpebr|tarsus|eyelid|epicran|frontalis|occipitalis|auricular|orbicular|temporoparietalis|labii|anguli|septi|procerus|risorius|mentalis|corrugator|zygomaticus|buccinator|masseter|temporalis|pterygoid|genioglossus|hyoglossus|tongue|palate|stapes|incus|malleus|alar cartilage|septal cartilage|nasal cartilage|auditory|frontal bone|parietal|occipital|sphenoid|ethmoid|nasal bone|nasalis|concha|vomer|maxilla|mandib|zygomatic|temporal|lacrimal|palatine|tooth|teeth|molar|incisor|canine|premolar|^(inferior|superior|medial|lateral) rectus$|^(inferior|superior) oblique$|tendinous ring/
    )
  )
    return "head";

  if (
    re(
      /hyoid|thyro|cricoid|arytenoid|corniculate|laryng|pharyng|mylohyoid|stylohyoid|geniohyoid|omohyoid|sternohyoid|sternothyroid|digastric|platysma|scalen|sternocleidomastoid|longus capitis|longus colli|rectus capitis|capitis|colli|cervicis|atlas|axis|cervical/
    )
  )
    return "neck";

  if (
    re(
      /rib|costal cartilage|xiphoid|sternum|clavicle|clavicular|pectoral|intercostal|serratus anterior|subclavius|transversus thoracis|diaphragm|levatores|thorax/
    )
  )
    return "chest";

  if (
    re(
      /vertebra|sacrum|coccyx|spinalis|erector|longissimus|iliocostalis|splenius|multifidus|semispinalis|rotatores|interspinales|intertransversarii|trapezius|latissimus|rhomboid|levator scapulae|suboccipital|epaxial|hypaxial|serratus posterior/
    )
  )
    return "back";

  if (
    re(
      /abdomen|abdominal|rectus abdominis|transversus abdominis|linea alba|pyramidalis|quadratus lumborum|iliac|ilium|hip bone|ischium|ischial|pubis|pubic|acetabulum|obturator (foramen|crest|groove|tubercle|notch)|pelvic|sacropelvic|psoas|iliacus|iliopectineal|inguinal/
    )
  )
    return "abdomen";

  if (
    re(
      /femur|femoris|femoral|tibia|tibial|fibula|fibular|peroneus|patella|patellar|meniscus|tarsal|metatarsal|calcaneus|calcaneal|talus|navicular|cuboid|cuneiform|sesamoid|gluteus|gluteal|piriformis|gemellus|gemelli|quadratus femoris|sartorius|gracilis|pectineus|vastus|rectus femoris|gastrocnemius|soleus|plantaris|popliteus|hallucis|digitorum longus|adductor(?! pollicis)|trochanteric|anserine|malleolus|quadriceps|semimembranosus|semitendinosus|biceps femoris|obturator|thigh|foot/
    )
  )
    return "lowerLimb";

  if (
    re(
      /scapula|acromion|acromial|glenoid|coracoid|humerus|humeral|radial|radius|ulna|ulnar|carpal|metacarpal|scaphoid|lunate|triquetrum|triquetral|pisiform|trapezium|trapezoid|capitate|hamate|phalanx|phalang|deltoid|rotator cuff|supraspinatus|infraspinatus|subscapularis|teres|biceps|triceps|brachial|brachioradialis|anconeus|pronator|supinator|flexor|extensor|pollicis|opponens|palmaris|coracobrachialis|interossei|bicipitoradial|intertubercular|tendon sheath - abd|hand|digit/
    )
  )
    return "upperLimb";

  return "other";
}
