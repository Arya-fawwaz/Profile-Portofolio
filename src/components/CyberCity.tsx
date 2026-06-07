"use client";

import React, { useEffect, useRef } from "react";

// ───  Cyber City Background ───
export default function CyberCity({ isLight, parallax }: { isLight: boolean; parallax: { x: number; y: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const offsetRef = useRef(0);
  const parallaxRef = useRef(parallax);
  parallaxRef.current = parallax;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;

    const resize = () => {
      w = canvas!.width = window.innerWidth;
      h = canvas!.height = window.innerHeight;
    };

    const neonHue = isLight ? 260 : 240;

    type Building = {
      x: number; w: number; h: number; color: string;
      windows: { y: number; lit: boolean; flicker: number; warm: boolean }[][];
      signs: { x: number; y: number; hue: number }[];
    };

    let buildings: Building[] = [];

    function buildCity(): Building[] {
      const b: Building[] = [];
      const count = Math.ceil(w / 80) + 14;
      for (let i = 0; i < count; i++) {
        const bw = 30 + Math.random() * 55;
        const bh = 50 + Math.random() * 150; // shorter: 50–200
        const hue = neonHue + Math.random() * 80 - 40;
        const sat = isLight ? 25 + Math.random() * 25 : 35 + Math.random() * 50;
        const lit = isLight ? 55 + Math.random() * 25 : 25 + Math.random() * 30;
        const color = `hsla(${hue}, ${sat}%, ${lit}%, ${isLight ? 0.35 : 0.55})`;

        const winCols = Math.floor(bw / 13);
        const winRows = Math.floor(bh / 15);
        const windows: { y: number; lit: boolean; flicker: number; warm: boolean }[][] = [];
        for (let cx = 0; cx < winCols; cx++) {
          const col: { y: number; lit: boolean; flicker: number; warm: boolean }[] = [];
          for (let cy = 0; cy < winRows; cy++) {
            col.push({
              y: 8 + cy * 15 + Math.random() * 3,
              lit: Math.random() > 0.3,
              flicker: Math.random() * 0.01 + 0.001,
              warm: Math.random() > 0.5,
            });
          }
          windows.push(col);
        }

        // Neon signs
        const signs: { x: number; y: number; hue: number }[] = [];
        const sCount = Math.floor(Math.random() * 3);
        for (let s = 0; s < sCount; s++) {
          signs.push({
            x: Math.random() * bw * 0.7 + bw * 0.1,
            y: 20 + Math.random() * (bh - 60),
            hue: Math.random() * 360,
          });
        }

        b.push({
          x: i * 80 - 60 - Math.random() * 30,
          w: bw, h: bh, color, windows, signs,
        });
      }
      return b;
    }

    buildings = buildCity();
    resize();
    window.addEventListener("resize", resize);

    // Emergence: grow from ground
    let emerge = 0;
    const emergeSpeed = 0.025; // much faster settle
    let speed = isLight ? 0.08 : 0.12;
    let running = true;
    let frameCount = 0;

    // Stars
    const stars = !isLight
      ? Array.from({ length: 80 }, () => ({
          x: Math.random() * (w || 1920),
          y: Math.random() * 350,
          size: Math.random() * 1.2 + 0.3,
          twinkle: Math.random() * 0.02 + 0.005,
        }))
      : [];

    const loop = () => {
      if (!running) return;
      frameCount++;

      const px = parallaxRef.current.x * 10;
      const py = parallaxRef.current.y * 4;
      emerge = Math.min(emerge + emergeSpeed, 1);
      // Ease-out quad — smooth settle
      const e = 1 - (1 - emerge) * (1 - emerge);

      ctx.clearRect(0, 0, w, h);
      offsetRef.current = (offsetRef.current + speed) % 80;

      // ── Sky ──
      const skyGrd = ctx.createLinearGradient(0, 0, 0, h);
      if (isLight) {
        skyGrd.addColorStop(0, "rgba(240, 244, 252, 0.2)");
        skyGrd.addColorStop(0.5, "rgba(220, 230, 245, 0.12)");
        skyGrd.addColorStop(1, "rgba(200, 215, 235, 0.06)");
      } else {
        skyGrd.addColorStop(0, "rgba(3, 3, 25, 0.4)");
        skyGrd.addColorStop(0.4, "rgba(8, 6, 30, 0.2)");
        skyGrd.addColorStop(1, "rgba(12, 8, 35, 0.08)");
      }
      ctx.fillStyle = skyGrd;
      ctx.fillRect(0, 0, w, h);

      // ── Stars ──
      if (!isLight) {
        for (const s of stars) {
          const tw = 0.5 + Math.sin(frameCount * s.twinkle) * 0.5;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * tw, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${0.15 * tw})`;
          ctx.fill();
        }
      }

      // ── Ground glow ──
      const gGrd = ctx.createRadialGradient(w / 2 + px, h + 20, 0, w / 2 + px, h + 20, h * 0.55);
      gGrd.addColorStop(0, `hsla(${neonHue}, 80%, 55%, ${isLight ? 0.025 : 0.05})`);
      gGrd.addColorStop(0.5, `hsla(${neonHue + 20}, 70%, 40%, ${isLight ? 0.01 : 0.025})`);
      gGrd.addColorStop(1, "transparent");
      ctx.fillStyle = gGrd;
      ctx.fillRect(0, 0, w, h);

      // ── Buildings ──
      const baseY = h - 30 + py;

      // Draw tall first (depth)
      const sorted = [...buildings].sort((a, b) => a.h - b.h);

      for (const b of sorted) {
        const bx = b.x + offsetRef.current;
        if (bx + b.w < -100 || bx > w + 100) continue;

        // Grow from bottom: height scales with e
        const currentH = b.h * e;
        if (currentH < 1) continue;

        ctx.globalAlpha = Math.min(e * 1.5, 1);

        // Shadow
        ctx.fillStyle = `rgba(0,0,0,${isLight ? 0.03 : 0.08})`;
        ctx.fillRect(bx + 4, baseY - currentH, b.w, currentH);

        // Body
        ctx.fillStyle = b.color;
        ctx.fillRect(bx, baseY - currentH, b.w, currentH);

        // Gradient overlay
        const bGrd = ctx.createLinearGradient(bx, baseY - currentH, bx, baseY);
        bGrd.addColorStop(0, `rgba(0,0,0,${isLight ? 0.02 : 0.06})`);
        bGrd.addColorStop(1, `rgba(0,0,0,${isLight ? 0.0 : 0.02})`);
        ctx.fillStyle = bGrd;
        ctx.fillRect(bx, baseY - currentH, b.w, currentH);

        // Neon edge
        ctx.shadowColor = `hsla(${neonHue}, 80%, 60%, ${isLight ? 0.015 : 0.04})`;
        ctx.shadowBlur = 10;
        ctx.fillStyle = `hsla(${neonHue}, 70%, 65%, ${isLight ? 0.035 : 0.06})`;
        ctx.fillRect(bx, baseY - currentH, 1.5, currentH);
        ctx.shadowBlur = 0;

        // Windows (only if enough height shown)
        if (currentH > 20) {
          const hRatio = currentH / b.h;
          for (let cx = 0; cx < b.windows.length; cx++) {
            const col = b.windows[cx];
            const winX = bx + 5 + cx * 13;
            for (const win of col) {
              const winY = baseY - currentH + win.y * hRatio;
              if (winY > baseY - 5) continue;
              if (win.lit && e > 0.1) {
                if (Math.random() < win.flicker * 0.3) {
                  ctx.fillStyle = `hsla(${neonHue}, 30%, 18%, ${isLight ? 0.03 : 0.05})`;
                } else {
                  const hw = win.warm ? 40 : 55;
                  const sw = win.warm ? 85 : 70;
                  const lw = win.warm ? 78 : 75;
                  ctx.fillStyle = `hsla(${hw}, ${sw}%, ${lw}%, ${isLight ? 0.1 : 0.18})`;
                  ctx.shadowColor = `hsla(${hw}, ${sw}%, 70%, ${isLight ? 0.01 : 0.025})`;
                  ctx.shadowBlur = 3;
                }
              } else {
                ctx.fillStyle = `hsla(${neonHue}, 30%, 15%, ${isLight ? 0.03 : 0.05})`;
              }
              ctx.fillRect(winX, winY, 5, 6);
              ctx.shadowBlur = 0;
            }
          }
        }

        // Neon signs
        for (const s of b.signs) {
          if (e < 0.3) continue;
          const sy = baseY - currentH + s.y * (currentH / b.h);
          const sx = bx + s.x;
          if (sy > baseY - 5) continue;
          const glow = Math.sin(frameCount * 0.03 + s.hue) * 0.3 + 0.7;
          ctx.shadowColor = `hsla(${s.hue}, 90%, 60%, ${isLight ? 0.02 : 0.05})`;
          ctx.shadowBlur = 6;
          ctx.fillStyle = `hsla(${s.hue}, 90%, 60%, ${isLight ? 0.04 * glow : 0.08 * glow})`;
          ctx.fillRect(sx, sy, 6 + (s.hue % 10), 2.5);
          ctx.shadowBlur = 0;
        }

        // Horizontal neon lines (only visible portion)
        if (currentH > 40) {
          for (let y = 1; y < 4; y++) {
            const ly = baseY - (currentH / 4) * y;
            ctx.fillStyle = `hsla(${neonHue}, 60%, 50%, ${isLight ? 0.015 : 0.03})`;
            ctx.fillRect(bx + 2, ly, b.w - 4, 0.7);
          }
        }

        ctx.globalAlpha = 1;
      }

      // ── Flying particles ──
      if (!isLight && e > 0.3) {
        for (let depth = 0; depth < 3; depth++) {
          const size = depth === 0 ? 0.6 : depth === 1 ? 1 : 1.5;
          const alpha = depth === 0 ? 0.04 : depth === 1 ? 0.06 : 0.08;
          const ys = [h * 0.35, h * 0.45, h * 0.55];
          for (let i = 0; i < 3; i++) {
            const fx = ((i * 317 + depth * 131 + offsetRef.current * (0.3 + depth * 0.2)) % (w + 200) + w + 200) % (w + 200) - 100;
            const fy = ys[depth] + Math.sin(i * 2.1 + offsetRef.current * 0.015 + depth) * 50 + i * 20;
            ctx.beginPath();
            ctx.arc(fx, fy, size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(0, 80%, ${70 - depth * 10}%, ${alpha})`;
            ctx.shadowColor = `hsla(0, 80%, 70%, ${alpha * 0.3})`;
            ctx.shadowBlur = 4;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // ── Horizon haze ──
      const hGrd = ctx.createLinearGradient(0, baseY - 40, 0, baseY + 20);
      hGrd.addColorStop(0, "transparent");
      hGrd.addColorStop(0.4, `hsla(${neonHue}, 70%, 50%, ${isLight ? 0.015 : 0.03})`);
      hGrd.addColorStop(0.7, `hsla(${neonHue + 30}, 60%, 40%, ${isLight ? 0.01 : 0.02})`);
      hGrd.addColorStop(1, "transparent");
      ctx.fillStyle = hGrd;
      ctx.fillRect(0, baseY - 40, w, 60);

      // ── Bottom fog ──
      const fogGrd = ctx.createLinearGradient(0, h - 60, 0, h);
      fogGrd.addColorStop(0, "transparent");
      fogGrd.addColorStop(1, `rgba(0,0,0,${isLight ? 0.02 : 0.06})`);
      ctx.fillStyle = fogGrd;
      ctx.fillRect(0, h - 60, w, 60);

      requestAnimationFrame(loop);
    };
    loop();

    return () => {
      running = false;
      window.removeEventListener("resize", resize);
    };
  }, [isLight]);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 pointer-events-none z-[0]"
    />
  );
}
