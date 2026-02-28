import { GridSettings, PreviewLayer, TransformState } from "./state";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

export type PreviewResponse = {
  layers: PreviewLayer[];
};

export async function fetchPreview(
  transforms: TransformState[],
  grid: GridSettings,
  signal?: AbortSignal
): Promise<PreviewResponse> {
  const enabledTransforms = transforms.filter((t) => t.enabled);
  if (enabledTransforms.length === 0) {
    return { layers: [] };
  }

  const response = await fetch(`${BACKEND_URL}/preview`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grid,
      transforms: transforms.map(({ a, b, c, d, enabled }) => ({
        a,
        b,
        c,
        d,
        enabled,
      })),
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch preview layers");
  }

  return response.json();
}
