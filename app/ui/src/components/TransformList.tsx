"use client";

import { TransformState, TransformPreset } from "@/src/lib/state";
import { TransformCard } from "./TransformCard";

export type TransformListProps = {
  transforms: TransformState[];
  onAddTransform: () => void;
  onUpdateField: (id: string, field: "a" | "b" | "c" | "d", value: number) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onApplyPreset: (id: string, preset: TransformPreset) => void;
};

export const TransformList = ({
  transforms,
  onAddTransform,
  onUpdateField,
  onToggle,
  onRemove,
  onMove,
  onApplyPreset,
}: TransformListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-100">Transform Stack</p>
          <p className="text-xs text-slate-400">Edit 2×2 matrices in sequence</p>
        </div>
        <button
          type="button"
          onClick={onAddTransform}
          className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white transition hover:border-sky-400"
        >
          Add Transform
        </button>
      </div>
      <div className="space-y-3">
        {transforms.map((transform, index) => (
          <TransformCard
            key={transform.id}
            transform={transform}
            index={index + 1}
            total={transforms.length}
            onUpdateField={onUpdateField}
            onToggle={onToggle}
            onRemove={onRemove}
            onMove={onMove}
            onApplyPreset={onApplyPreset}
          />
        ))}
      </div>
    </div>
  );
};
