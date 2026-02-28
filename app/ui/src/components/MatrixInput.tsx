"use client";

import { useEffect, useState } from "react";

export type MatrixInputProps = {
  label: string;
  value: number;
  step?: number;
  onChange: (value: number) => void;
};

const formatValue = (value: number) => (Number.isFinite(value) ? String(value) : "");

export const MatrixInput = ({ label, value, step = 0.1, onChange }: MatrixInputProps) => {
  const [draft, setDraft] = useState(() => formatValue(value));

  useEffect(() => {
    setDraft(formatValue(value));
  }, [value]);

  const commitValue = (input: string) => {
    const trimmed = input.trim();
    if (trimmed === "") {
      setDraft(formatValue(value));
      return;
    }
    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed)) {
      setDraft(formatValue(value));
      return;
    }
    onChange(parsed);
    setDraft(formatValue(parsed));
  };

  return (
    <label className="text-[10px] uppercase text-slate-400">
      <span className="block text-xs text-slate-300">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        step={step}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={(event) => commitValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            commitValue(event.currentTarget.value);
            event.currentTarget.blur();
          }
        }}
        className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-sm font-semibold text-slate-100 placeholder:text-slate-600 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
      />
    </label>
  );
};
