"use client";

import { transformPresets, TransformPreset, TransformState } from "@/src/lib/state";
import { MatrixInput } from "./MatrixInput";

export type TransformCardProps = {
  transform: TransformState;
  index: number;
  total: number;
  onUpdateField: (id: string, field: "a" | "b" | "c" | "d", value: number) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onApplyPreset: (id: string, preset: TransformPreset) => void;
};

export const TransformCard = ({
  transform,
  index,
  total,
  onUpdateField,
  onToggle,
  onRemove,
  onMove,
  onApplyPreset,
}: TransformCardProps) => {
  const fieldChange = (field: "a" | "b" | "c" | "d") => (value: number) => {
    onUpdateField(transform.id, field, value);
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-4 shadow-2xl shadow-black/30">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-100">{transform.name}</p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
            Layer {index}
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-300">
          <button
            type="button"
            className="rounded-md border border-white/10 px-2 py-1 text-[10px] transition hover:border-sky-400"
            onClick={() => onMove(transform.id, "up")}
            disabled={index === 1}
            aria-label="Move layer up"
            title="Move layer up"
          >
            ▲
          </button>
          <button
            type="button"
            className="rounded-md border border-white/10 px-2 py-1 text-[10px] transition hover:border-sky-400"
            onClick={() => onMove(transform.id, "down")}
            disabled={index === total}
            aria-label="Move layer down"
            title="Move layer down"
          >
            ▼
          </button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <MatrixInput label="a" value={transform.a} onChange={fieldChange("a")} />
        <MatrixInput label="b" value={transform.b} onChange={fieldChange("b")} />
        <MatrixInput label="c" value={transform.c} onChange={fieldChange("c")} />
        <MatrixInput label="d" value={transform.d} onChange={fieldChange("d")} />
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-300">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={transform.enabled}
            onChange={() => onToggle(transform.id)}
            className="h-4 w-4 rounded border border-white/30 bg-slate-900 text-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          Enabled
        </label>
        <button
          type="button"
          onClick={() => onRemove(transform.id)}
          className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-rose-400 transition hover:border-rose-400"
        >
          Remove
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {transformPresets.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => onApplyPreset(transform.id, preset)}
            className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-slate-200 transition hover:border-sky-400"
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  );
};
