"use client";

import { useEffect, useMemo, useState } from "react";
import { GraphCanvas } from "@/src/components/GraphCanvas";
import { TransformList } from "@/src/components/TransformList";
import { fetchPreview } from "@/src/lib/api";
import {
  createTransform,
  defaultGrid,
  defaultTransforms,
  GridSettings,
  PreviewLayer,
  TransformPreset,
  TransformState,
  layerColors,
} from "@/src/lib/state";

const clampPositive = (value: number) => (value <= 0 ? 0.5 : value);

type StatusState = "idle" | "loading" | "synced" | "error";

export default function Home() {
  const [transforms, setTransforms] = useState<TransformState[]>(() => defaultTransforms);
  const [grid, setGrid] = useState<GridSettings>(defaultGrid);
  const [preview, setPreview] = useState<{ layers: PreviewLayer[] }>({ layers: [] });
  const [status, setStatus] = useState<StatusState>("idle");

  const enabledTransforms = useMemo(() => transforms.filter((transform) => transform.enabled), [transforms]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      if (enabledTransforms.length === 0) {
        setPreview({ layers: [] });
        setStatus("idle");
        return;
      }

      setStatus("loading");
      try {
        const payload = await fetchPreview(transforms, grid, controller.signal);
        setPreview(payload);
        setStatus("synced");
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error(error);
        setStatus("error");
      }
    }, 260);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [transforms, grid.extent, grid.step, enabledTransforms]);

  const updateField = (id: string, field: "a" | "b" | "c" | "d", value: number) => {
    setTransforms((prev) =>
      prev.map((transform) =>
        transform.id === id
          ? {
              ...transform,
              [field]: value,
            }
          : transform
      )
    );
  };

  const toggleTransform = (id: string) => {
    setTransforms((prev) =>
      prev.map((transform) =>
        transform.id === id
          ? {
              ...transform,
              enabled: !transform.enabled,
            }
          : transform
      )
    );
  };

  const removeTransform = (id: string) => {
    setTransforms((prev) => prev.filter((transform) => transform.id !== id));
  };

  const moveTransform = (id: string, direction: "up" | "down") => {
    setTransforms((prev) => {
      const currentIndex = prev.findIndex((transform) => transform.id === id);
      if (currentIndex === -1) return prev;
      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const updated = [...prev];
      const [removed] = updated.splice(currentIndex, 1);
      updated.splice(targetIndex, 0, removed);
      return updated;
    });
  };

  const applyPreset = (id: string, preset: TransformPreset) => {
    setTransforms((prev) =>
      prev.map((transform) =>
        transform.id === id
          ? {
              ...transform,
              name: preset.name ?? transform.name,
              a: preset.a,
              b: preset.b,
              c: preset.c,
              d: preset.d,
            }
          : transform
      )
    );
  };

  const addTransform = () => {
    setTransforms((prev) => [
      ...prev,
      createTransform({
        name: `Matrix ${prev.length + 1}`,
      }),
    ]);
  };

  const updateGrid = (field: keyof GridSettings, value: number) => {
    setGrid((prev) => ({
      ...prev,
      [field]: clampPositive(value),
    }));
  };

  const statusLabel = {
    idle: "Waiting for transforms",
    loading: "Syncing with backend...",
    synced: `Preview ${preview.layers.length} layer(s)`,
    error: "Unable to load preview",
  }[status];

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:grid lg:grid-cols-[360px,1fr] lg:gap-8">
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur">
            <p className="font-semibold text-slate-200">Matrix Builder</p>
            <p className="text-xs text-slate-400">
              Stack enabled transforms to build the final composed layer.
            </p>
          </div>
          <TransformList
            transforms={transforms}
            onAddTransform={addTransform}
            onUpdateField={updateField}
            onToggle={toggleTransform}
            onRemove={removeTransform}
            onMove={moveTransform}
            onApplyPreset={applyPreset}
          />
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <p className="font-semibold text-slate-100">Grid settings</p>
              <p>Snaps to {grid.step}</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="text-xs text-slate-300">
                <span className="block text-[10px] uppercase tracking-[0.3em] text-slate-500">
                  Extent
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0.5}
                  step={0.5}
                  value={grid.extent}
                  onChange={(event) => updateGrid("extent", Number(event.target.value))}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-1 text-sm text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
              </label>
              <label className="text-xs text-slate-300">
                <span className="block text-[10px] uppercase tracking-[0.3em] text-slate-500">
                  Step
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0.2}
                  step={0.2}
                  value={grid.step}
                  onChange={(event) => updateGrid("step", Number(event.target.value))}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-1 text-sm text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
              </label>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5 backdrop-blur">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <p className="font-semibold text-slate-100">Live preview</p>
              <span className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
                {statusLabel}
              </span>
            </div>
          </div>
          <GraphCanvas
            grid={grid}
            layers={preview.layers as PreviewLayer[]}
            layerColors={layerColors}
            layerNames={enabledTransforms.map((transform) => transform.name)}
          />
        </div>
      </div>
    </div>
  );
}
