export type TransformState = {
  id: string;
  name: string;
  a: number;
  b: number;
  c: number;
  d: number;
  enabled: boolean;
};

export type GridSettings = {
  extent: number;
  step: number;
};

export type PreviewLayer = {
  index: number;
  matrix: number[][];
  lines: [number, number, number, number][];
};

const randomId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `transform-${Math.random().toString(36).slice(2)}`;
};

export const layerColors = [
  "#34d399",
  "#f97316",
  "#6366f1",
  "#ec4899",
  "#22d3ee",
];

const baseMatrix = (a: number, b: number, c: number, d: number) => ({ a, b, c, d });

export type TransformPreset = {
  name: string;
  matrix: { a: number; b: number; c: number; d: number };
};

export const transformPresets: TransformPreset[] = [
  {
    name: "Identity",
    matrix: baseMatrix(1, 0, 0, 1),
  },
  {
    name: "Scale 2×",
    matrix: baseMatrix(2, 0, 0, 2),
  },
  {
    name: "Shear Y",
    matrix: baseMatrix(1, 0, 0.5, 1),
  },
  {
    name: "Rotate 90°",
    matrix: baseMatrix(0, -1, 1, 0),
  },
];

export const createTransform = (
  overrides?: Partial<TransformState> & {
    name?: string;
    matrix?: { a: number; b: number; c: number; d: number };
  }
): TransformState => {
  const matrix = overrides?.matrix;
  return {
    id: overrides?.id ?? randomId(),
    name: overrides?.name ?? "Transform",
    a: overrides?.a ?? matrix?.a ?? 1,
    b: overrides?.b ?? matrix?.b ?? 0,
    c: overrides?.c ?? matrix?.c ?? 0,
    d: overrides?.d ?? matrix?.d ?? 1,
    enabled: overrides?.enabled ?? true,
  };
};

export const defaultTransforms: TransformState[] = [
  createTransform({
    name: "Scale X 1.5",
    matrix: baseMatrix(1.5, 0, 0, 1),
  }),
  createTransform({
    name: "Shear Y",
    matrix: baseMatrix(1, 0, 0.6, 1),
  }),
];

export const defaultGrid: GridSettings = {
  extent: 5,
  step: 1,
};
