"use client";

import React, { useEffect, useRef } from "react";

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  targetRadius: number;
  hue: number;
  targetHue: number;
}

interface LiquidBackgroundProps {
  isLight: boolean;
  progress: number;
  parallax: { x: number; y: number };
}

export default function LiquidBackground({ isLight, progress, parallax }: LiquidBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parallaxRef = useRef(parallax);
  parallaxRef.current = parallax;

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

    // Color palette based on progress
    const getColorFromProgress = (prog: number): number => {
      if (prog < 33) return 200; // Cyan/Blue
      if (prog < 66) return 270; // Purple
      return 320; // Pink/Magenta
    };

    // Create blobs (reduced from 6 to 4 for better performance)
    const blobCount = 4;
    const blobs: Blob[] = [];

    for (let i = 0; i < blobCount; i++) {
      blobs.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 80 + Math.random() * 120,
        targetRadius: 80 + Math.random() * 120,
        hue: Math.random() * 60 + 180,
        targetHue: Math.random() * 60 + 180,
      });
    }

    let running = true;
    let frame = 0;

    const loop = () => {
      if (!running) return;
      frame++;

      ctx.clearRect(0, 0, w, h);

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      if (isLight) {
        bgGrad.addColorStop(0, "#f8fafc");
        bgGrad.addColorStop(0.5, "#f1f5f9");
        bgGrad.addColorStop(1, "#e2e8f0");
      } else {
        bgGrad.addColorStop(0, "#0f0f1e");
        bgGrad.addColorStop(0.5, "#0a0a18");
        bgGrad.addColorStop(1, "#050510");
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Update target hue based on progress
      const targetHue = getColorFromProgress(progress);

      // Update and draw blobs
      for (let i = 0; i < blobs.length; i++) {
        const blob = blobs[i];

        // Update position with parallax
        const px = parallaxRef.current.x * 15 * (i % 2 === 0 ? 1 : -1);
        const py = parallaxRef.current.y * 10 * (i % 2 === 0 ? 1 : -1);

        blob.x += blob.vx + px * 0.02;
        blob.y += blob.vy + py * 0.02;

        // Bounce off edges with padding
        const padding = blob.radius;
        if (blob.x < padding || blob.x > w - padding) blob.vx *= -1;
        if (blob.y < padding || blob.y > h - padding) blob.vy *= -1;
        blob.x = Math.max(padding, Math.min(w - padding, blob.x));
        blob.y = Math.max(padding, Math.min(h - padding, blob.y));

        // Smoothly interpolate radius
        blob.radius += (blob.targetRadius - blob.radius) * 0.02;

        // Random radius changes
        if (Math.random() < 0.005) {
          blob.targetRadius = 80 + Math.random() * 120;
        }

        // Smoothly interpolate hue towards target
        const hueTarget = targetHue + (i * 20 - 30);
        blob.hue += (hueTarget - blob.hue) * 0.02;
      }

      // Create metaball effect using radial gradients
      for (const blob of blobs) {
        const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
        
        const alpha = isLight ? 0.12 : 0.25;
        const sat = isLight ? 50 : 70;
        const light = isLight ? 65 : 55;

        gradient.addColorStop(0, `hsla(${blob.hue}, ${sat}%, ${light}%, ${alpha})`);
        gradient.addColorStop(0.4, `hsla(${blob.hue + 10}, ${sat - 10}%, ${light - 5}%, ${alpha * 0.7})`);
        gradient.addColorStop(0.7, `hsla(${blob.hue + 20}, ${sat - 20}%, ${light - 10}%, ${alpha * 0.3})`);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }

      // Add glow overlay for premium look
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = isLight ? 0.15 : 0.25;
      
      for (const blob of blobs) {
        const glowGrad = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          blob.radius * 1.5
        );
        glowGrad.addColorStop(0, `hsl(${blob.hue}, 80%, 70%)`);
        glowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, w, h);
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;

      // Add subtle noise texture for depth
      if (frame % 3 === 0) {
        ctx.globalAlpha = isLight ? 0.015 : 0.03;
        for (let i = 0; i < 500; i++) {
          ctx.fillStyle = Math.random() > 0.5 ? "#ffffff" : "#000000";
          ctx.fillRect(
            Math.random() * w,
            Math.random() * h,
            1,
            1
          );
        }
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
      className="absolute inset-0 pointer-events-none z-0"
      style={{ 
        filter: "blur(20px)",
        transform: "translateZ(0)",
        willChange: "contents"
      }}
    />
  );
}
