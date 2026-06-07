"use client";

import React, { useEffect, useRef } from "react";

interface BlobParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  targetRadius: number;
  alpha: number;
  hue: number;
}

interface BlobParticlesProps {
  count: number;
  isLight: boolean;
  progress: number;
}

export default function BlobParticles({ count, isLight, progress }: BlobParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const particlesRef = useRef<BlobParticle[]>([]);
  
  // Optimize particle count for performance (max 25)
  const optimizedCount = Math.min(count, 25);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    let w = 0;
    let h = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      
      // Reinitialize particles on resize
      if (particlesRef.current.length === 0) {
        initParticles();
      }
    };

    const initParticles = () => {
      particlesRef.current = [];
      const baseHue = isLight ? 200 : 190;
      
      for (let i = 0; i < optimizedCount; i++) {
        particlesRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: 3 + Math.random() * 6,
          targetRadius: 3 + Math.random() * 6,
          alpha: 0.1 + Math.random() * (isLight ? 0.15 : 0.25),
          hue: baseHue + Math.random() * 60 - 30,
        });
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / w, y: e.clientY / h };
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        mouseRef.current = { x: touch.clientX / w, y: touch.clientY / h };
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    let running = true;
    let frame = 0;

    const loop = () => {
      if (!running) return;
      frame++;

      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x * w;
      const my = mouseRef.current.y * h;

      const particles = particlesRef.current;

      // Update and draw particles
      for (const p of particles) {
        // Magnetic effect towards mouse
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150 && dist > 0) {
          const force = (150 - dist) / 150;
          p.vx += (dx / dist) * force * 0.02;
          p.vy += (dy / dist) * force * 0.02;
        }

        // Apply velocity
        p.x += p.vx;
        p.y += p.vy;

        // Damping for smooth movement
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Wrap around edges
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        // Smooth radius variation (no choppy pulse)
        p.radius += (p.targetRadius - p.radius) * 0.05;

        // Random radius changes for organic feel
        if (Math.random() < 0.01) {
          p.targetRadius = 3 + Math.random() * 6;
        }

        // Smooth continuous scale variation
        const scaleVariation = 1 + Math.sin(frame * 0.01 + p.x * 0.005) * 0.15;
        const currentRadius = p.radius * scaleVariation;

        // Draw blob particle with gradient
        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          currentRadius
        );

        const blob1 = isLight
          ? "rgba(214, 92, 122, 0.12)"
          : "rgba(255, 183, 197, 0.10)";

        const blob2 = isLight
          ? "rgba(212, 175, 55, 0.10)"
          : "rgba(212, 175, 55, 0.08)";

        gradient.addColorStop(0, blob1);
        gradient.addColorStop(0.5, blob2);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // Inner bright core
        ctx.fillStyle = `hsla(${p.hue}, 80%, 80%, ${p.alpha * 0.4})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw connections between nearby particles (optimized - skip some checks)
      for (let i = 0; i < particles.length; i += 2) { // Step by 2 for performance
        for (let j = i + 1; j < Math.min(i + 4, particles.length); j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distSq = dx * dx + dy * dy; // Use squared distance to avoid sqrt
          const maxDistSq = 100 * 100; // 100px squared

          if (distSq < maxDistSq) {
            const alpha = (1 - distSq / maxDistSq) * 0.08;
            ctx.strokeStyle = `hsla(${(p1.hue + p2.hue) / 2}, 60%, 60%, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(loop);
    };

    loop();

    return () => {
      running = false;
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [optimizedCount, isLight, progress]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[2]"
      style={{
        transform: "translateZ(0)",
        willChange: "contents"
      }}
    />
  );
}
