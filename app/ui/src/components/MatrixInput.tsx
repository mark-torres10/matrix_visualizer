"use client";

import React from "react";

export type MatrixInputProps = {
  label: string;
  value: number;
  step?: number;
  onChange: (value: number) => void;
};

export const MatrixInput = ({ label, value, step = 0.1, onChange }: MatrixInputProps) => {
  return (
    <label className="text-[10px] uppercase text-slate-400">
      <span className="block text-xs text-slate-300">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        step={step}
        value={Number.isNaN(value) ? "" : value}
        onChange={(event) => {
          const parsed = event.target.value === "" ? 0 : Number(event.target.value);
          onChange(Number.isFinite(parsed) ? parsed : 0);
        }}
        className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-sm font-semibold text-slate-100 placeholder:text-slate-600 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
      />
    </label>
  );
};
