const REGION_COLORS: Record<string, string> = {
  Cervical: "#3b82f6",
  Thoracic: "#06b6d4",
  Lumbar: "#f59e0b",
  Sacrum: "#f43f5e",
} as const;

export interface VertebraInfo {
  nodePrefix: string;
  label: string;
  region: "Cervical" | "Thoracic" | "Lumbar" | "Sacrum";
  fullName: string;
  description: string;
  regionColor: string;
}

const CERVICAL: VertebraInfo[] = [
  {
    nodePrefix: "c1",
    label: "C1",
    region: "Cervical",
    fullName: "Atlas (C1)",
    description:
      "First cervical vertebra supporting the skull, enabling nodding motion.",
    regionColor: REGION_COLORS.Cervical,
  },
  {
    nodePrefix: "c2",
    label: "C2",
    region: "Cervical",
    fullName: "Axis (C2)",
    description:
      "Second cervical vertebra providing a pivot for head rotation.",
    regionColor: REGION_COLORS.Cervical,
  },
  {
    nodePrefix: "c3",
    label: "C3",
    region: "Cervical",
    fullName: "Cervical 3rd (C3)",
    description: "Supports neck muscles and protects the spinal cord.",
    regionColor: REGION_COLORS.Cervical,
  },
  {
    nodePrefix: "c4",
    label: "C4",
    region: "Cervical",
    fullName: "Cervical 4th (C4)",
    description: "Assists in neck movement and nerve signal transmission.",
    regionColor: REGION_COLORS.Cervical,
  },
  {
    nodePrefix: "c5",
    label: "C5",
    region: "Cervical",
    fullName: "Cervical 5th (C5)",
    description: "Innervates the deltoid and biceps muscles.",
    regionColor: REGION_COLORS.Cervical,
  },
  {
    nodePrefix: "c6",
    label: "C6",
    region: "Cervical",
    fullName: "Cervical 6th (C6)",
    description: "Key landmark for identifying cervical vertebrae.",
    regionColor: REGION_COLORS.Cervical,
  },
  {
    nodePrefix: "c7",
    label: "C7",
    region: "Cervical",
    fullName: "Vertebra Prominens (C7)",
    description:
      "Most prominent cervical vertebra, easily felt at the base of the neck.",
    regionColor: REGION_COLORS.Cervical,
  },
];

const THORACIC: VertebraInfo[] = Array.from({ length: 12 }, (_, i) => {
  const num = i + 1;
  return {
    nodePrefix: `t${num}`,
    label: `T${num}`,
    region: "Thoracic" as const,
    fullName: `Thoracic ${num}th (T${num})`,
    description: `Articulates with rib ${num} and protects thoracic organs.`,
    regionColor: REGION_COLORS.Thoracic,
  };
});

const LUMBAR: VertebraInfo[] = Array.from({ length: 5 }, (_, i) => {
  const num = i + 1;
  return {
    nodePrefix: `l${num}`,
    label: `L${num}`,
    region: "Lumbar" as const,
    fullName: `Lumbar ${num}th (L${num})`,
    description: `Large weight-bearing vertebra in the lower back.`,
    regionColor: REGION_COLORS.Lumbar,
  };
});

const SACRUM_INFO: VertebraInfo = {
  nodePrefix: "sacrum",
  label: "Sacrum",
  region: "Sacrum",
  fullName: "Sacrum",
  description:
    "Triangular bone formed by fused vertebrae, connecting the spine to the pelvis.",
  regionColor: REGION_COLORS.Sacrum,
};

export const VERTEBRAE: VertebraInfo[] = [
  ...CERVICAL,
  ...THORACIC,
  ...LUMBAR,
  SACRUM_INFO,
];

const _lookup = new Map<string, VertebraInfo>(
  VERTEBRAE.map((v) => [v.nodePrefix, v])
);

export function getVertebraInfo(nodeName: string): VertebraInfo | undefined {
  const clean = nodeName.replace(/_beige_0$/i, "").toLowerCase();
  return _lookup.get(clean);
}

export { REGION_COLORS };
