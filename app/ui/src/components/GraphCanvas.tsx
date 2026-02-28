"use client";

import { useEffect, useRef, useState } from "react";
import { GridSettings, PreviewLayer } from "@/src/lib/state";

export type GraphCanvasProps = {
  grid: GridSettings;
  layers: PreviewLayer[];
  layerColors: string[];
  layerNames?: string[];
};

type CameraState = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const GraphCanvas = ({
  grid,
  layers,
  layerColors,
  layerNames = [],
}: GraphCanvasProps) => {
  const defaultLayerColor = "rgba(148, 163, 184, 0.9)";
  const getLayerColor = (index: number) =>
    layerColors.length > 0 ? layerColors[index % layerColors.length] : defaultLayerColor;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [camera, setCamera] = useState<CameraState>({ scale: 60, offsetX: 0, offsetY: 0 });
  const cameraRef = useRef(camera);
  const dragState = useRef<{
    originX: number;
    originY: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
      canvas.width = width * ratio;
      canvas.height = height * ratio;
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);
    ctx.clearRect(0, 0, width, height);

    const worldToScreen = (x: number, y: number) => {
      return {
        x: width / 2 + (x + camera.offsetX) * camera.scale,
        y: height / 2 - (y + camera.offsetY) * camera.scale,
      };
    };

    ctx.lineWidth = 1;

    // draw grid
    ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
    ctx.beginPath();
    const isStepValid = Number.isFinite(grid.step) && grid.step > 0;
    const isExtentValid = Number.isFinite(grid.extent) && grid.extent >= 0;
    if (!isStepValid || !isExtentValid) {
      return;
    }
    const extent = Math.max(grid.extent, 0);
    const steps = Math.max(1, Math.ceil(extent / grid.step));
    for (let i = -steps; i <= steps; i++) {
      const coord = i * grid.step;
      const verticalStart = worldToScreen(coord, -extent);
      const verticalEnd = worldToScreen(coord, extent);
      ctx.moveTo(verticalStart.x, verticalStart.y);
      ctx.lineTo(verticalEnd.x, verticalEnd.y);

      const horizontalStart = worldToScreen(-extent, coord);
      const horizontalEnd = worldToScreen(extent, coord);
      ctx.moveTo(horizontalStart.x, horizontalStart.y);
      ctx.lineTo(horizontalEnd.x, horizontalEnd.y);
    }
    ctx.stroke();

    // axes
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(148, 163, 184, 0.9)";
    ctx.beginPath();
    const left = worldToScreen(-extent, 0);
    const right = worldToScreen(extent, 0);
    ctx.moveTo(left.x, left.y);
    ctx.lineTo(right.x, right.y);
    const top = worldToScreen(0, extent);
    const bottom = worldToScreen(0, -extent);
    ctx.moveTo(top.x, top.y);
    ctx.lineTo(bottom.x, bottom.y);
    ctx.stroke();

    // layers
    layers.forEach((layer, index) => {
      ctx.strokeStyle = getLayerColor(index);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      layer.lines.forEach(([x1, y1, x2, y2]) => {
        const start = worldToScreen(x1, y1);
        const end = worldToScreen(x2, y2);
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
      });
      ctx.stroke();
    });
  }, [layers, grid, camera.scale, camera.offsetX, camera.offsetY, layerColors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handlePointerDown = (event: PointerEvent) => {
      isDragging.current = true;
      dragState.current = {
        originX: event.clientX,
        originY: event.clientY,
        offsetX: cameraRef.current.offsetX,
        offsetY: cameraRef.current.offsetY,
      };
      canvas.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!isDragging.current || !dragState.current) return;
      const deltaX = (event.clientX - dragState.current.originX) / cameraRef.current.scale;
      const deltaY = (event.clientY - dragState.current.originY) / cameraRef.current.scale;
      const { offsetX, offsetY } = dragState.current;
      setCamera((prev) => ({
        ...prev,
        offsetX: offsetX - deltaX,
        offsetY: offsetY + deltaY,
      }));
    };

    const handlePointerUp = (event: PointerEvent) => {
      isDragging.current = false;
      dragState.current = null;
      if (canvas.hasPointerCapture?.(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const delta = event.deltaY > 0 ? 0.92 : 1.08;
      const rect = canvas.getBoundingClientRect();
      const localX = event.clientX - rect.left - rect.width / 2;
      const localY = rect.height / 2 - (event.clientY - rect.top);
      setCamera((prev) => {
        const nextScale = clamp(prev.scale * delta, 30, 220);
        const ratio = nextScale / prev.scale;
        return {
          scale: nextScale,
          offsetX: prev.offsetX + (localX / prev.scale) * (1 - ratio),
          offsetY: prev.offsetY + (localY / prev.scale) * (1 - ratio),
        };
      });
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointerleave", handlePointerUp);
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointerleave", handlePointerUp);
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="relative w-full">
      <canvas
        ref={canvasRef}
        className="h-[540px] w-full rounded-3xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/60"
      />
      <div className="absolute top-4 right-4 space-y-2 rounded-2xl border border-white/10 bg-black/50 p-3 text-xs text-slate-200 backdrop-blur">
        {layers.length === 0 ? (
          <p className="text-slate-400">No layers yet</p>
        ) : (
          layers.map((layer, index) => (
            <div key={layer.index} className="flex items-center gap-2">
              <span
                className="h-2 w-8 rounded-full"
                style={{ backgroundColor: getLayerColor(index) }}
              />
              <div>
                <p className="text-[11px] font-semibold text-slate-100">
                  Layer {layer.index}
                </p>
                {layerNames[index] && (
                  <p className="text-[10px] text-slate-400">{layerNames[index]}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
