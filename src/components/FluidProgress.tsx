"use client";

import React from "react";
import { motion } from "framer-motion";

interface FluidProgressProps {
  progress: number;
  isLight: boolean;
  parallax: { x: number; y: number };
}

export default function FluidProgress({ progress, isLight, parallax }: FluidProgressProps) {
  const displayedPct = Math.floor(Math.min(progress, 100)); // Color morphing based on progress (Japanese palette: indigo → vermilion → sakura)

  const getGradient = () => {
    if (progress < 33) {
      return "linear-gradient(90deg, #4f46e5, #7c3aed, #C41E3A)";
    } else if (progress < 66) {
      return "linear-gradient(90deg, #C41E3A, #d65c7a, #FFB7C5)";
    } else {
      return "linear-gradient(90deg, #FFB7C5, #D4AF37, #f9f7f5)";
    }
  };

  const trackBg = isLight 
    ? "rgba(21,29,56,0.08)" 
    : "rgba(255,255,255,0.05)";

  const textColor = isLight
    ? "rgba(21,29,56,0.4)"
    : "rgba(255,255,255,0.3)";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1], delay: 1.8 }}
      className="relative w-[clamp(200px,45vw,500px)]"
      style={{ transform: `translate(${parallax.x * 3}px, ${parallax.y * 2}px)` }}
    >
      {/* Progress container */}
      <div className="relative h-3 rounded-full overflow-hidden backdrop-blur-xl"
        style={{ 
          backgroundColor: trackBg,
          border: `1px solid ${isLight ? 'rgba(21,29,56,0.06)' : 'rgba(255,255,255,0.03)'}`,
        }}
      >
        {/* Fluid fill with morphing effect */}
        <motion.div
          className="absolute inset-y-0 left-0"
          initial={{ width: 0 }}
          animate={{ width: `${displayedPct}%` }}
          transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }}
          style={{
            backgroundImage: getGradient(),
            backgroundSize: "200% 100%",
            filter: `blur(0.5px) drop-shadow(0 0 12px ${isLight ? 'rgba(59,130,246,0.2)' : 'rgba(139,92,246,0.4)'})`,
          }}
        >
          {/* Animated gradient shift */}
          <motion.div
            className="absolute inset-0"
            animate={{
              backgroundPosition: ["0% 0%", "200% 0%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundImage: getGradient(),
              backgroundSize: "200% 100%",
            }}
          />
          
          {/* Liquid shine effect */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
            }}
          />
        </motion.div>

        {/* Leading edge glow */}
        {displayedPct > 0 && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
            style={{
              left: `${displayedPct}%`,
              marginLeft: "-4px",
              background: isLight 
                ? "linear-gradient(135deg, #ffffff, #e0f2fe)" 
                : "linear-gradient(135deg, #ffffff, #ddd6fe)",
              boxShadow: `0 0 18px ${isLight ? 'rgba(59,130,246,0.6)' : 'rgba(168,85,247,0.7)'}`,
            }}
          />
        )}

        {/* Particle trail */}
        {displayedPct > 5 && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 w-1 h-1 rounded-full"
                style={{
                  left: `${displayedPct - 5 - i * 8}%`,
                  background: isLight ? "#3b82f6" : "#a855f7",
                  opacity: 0.3 - i * 0.1,
                }}
                animate={{
                  y: ["-50%", "-100%"],
                  opacity: [0.3 - i * 0.1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Percentage text */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0, duration: 0.4 }}
        className="absolute -top-7 right-0 text-sm font-mono tracking-wider tabular-nums"
        style={{ color: textColor }}
      >
        {String(displayedPct).padStart(3, "0")}
        <span className="text-xs ml-0.5">%</span>
      </motion.div>
    </motion.div>
  );
}
