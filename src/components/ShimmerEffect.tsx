"use client";

import React, { useEffect, useRef } from "react";

interface ShimmerEffectProps {
  isLight: boolean;
  progress: number;
}

export default function ShimmerEffect({ isLight, progress }: ShimmerEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    let w = 0;
    let h = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Color based on progress (Japanese palette: indigo → vermilion → gold)
    const getColorFromProgress = (prog: number): [number, number, number] => {
      if (prog < 33) {
        // Indigo
        return [79, 70, 229]; // #4f46e5
      } else if (prog < 66) {
        // Vermilion
        return [196, 30, 58]; // #C41E3A
      } else {
        // Gold
        return [212, 175, 55]; // #D4AF37
      }
    };

    let running = true;
    let frame = 0;

    const loop = () => {
      if (!running) return;
      frame++;

      ctx.clearRect(0, 0, w, h);

      const [r, g, b] = getColorFromProgress(progress);

      // Draw 3 layers of smooth waves
      const layers = [
        { amplitude: 80, frequency: 0.003, speed: 0.001, opacity: 0.15, offset: 0 },
        { amplitude: 60, frequency: 0.005, speed: 0.0015, opacity: 0.10, offset: Math.PI / 3 },
        { amplitude: 40, frequency: 0.007, speed: 0.002, opacity: 0.08, offset: Math.PI / 1.5 },
      ];

      for (const layer of layers) {
        ctx.beginPath();
        ctx.moveTo(0, h);

        // Create smooth wave path
        for (let x = 0; x <= w; x += 2) {
          const y =
            h / 2 +
            Math.sin(x * layer.frequency + frame * layer.speed + layer.offset) * layer.amplitude +
            Math.sin(x * layer.frequency * 1.5 + frame * layer.speed * 0.7 + layer.offset) * (layer.amplitude * 0.5);

          ctx.lineTo(x, y);
        }

        ctx.lineTo(w, h);
        ctx.closePath();

        // Gradient fill
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        
        if (isLight) {
          gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${layer.opacity * 0.6})`);
          gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${layer.opacity * 0.4})`);
          gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${layer.opacity * 0.2})`);
        } else {
          gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${layer.opacity * 1.2})`);
          gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${layer.opacity})`);
          gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${layer.opacity * 0.6})`);
        }

        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Add subtle shimmer highlights
      if (!isLight) {
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = 0.15;

        for (let i = 0; i < 3; i++) {
          const shimmerX = (frame * 2 + i * w / 3) % (w + 200) - 100;
          const shimmerGrad = ctx.createRadialGradient(
            shimmerX,
            h / 2,
            0,
            shimmerX,
            h / 2,
            120
          );

          shimmerGrad.addColorStop(0, `rgba(${r + 40}, ${g + 40}, ${b + 40}, 0.3)`);
          shimmerGrad.addColorStop(0.5, `rgba(${r + 20}, ${g + 20}, ${b + 20}, 0.15)`);
          shimmerGrad.addColorStop(1, "transparent");

          ctx.fillStyle = shimmerGrad;
          ctx.fillRect(shimmerX - 120, 0, 240, h);
        }

        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
      }

      requestAnimationFrame(loop);
    };

    loop();

    return () => {
      running = false;
      window.removeEventListener("resize", resize);
    };
  }, [isLight, progress]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[1]"
      style={{
        transform: "translateZ(0)",
        willChange: "contents",
      }}
    />
  );
}
