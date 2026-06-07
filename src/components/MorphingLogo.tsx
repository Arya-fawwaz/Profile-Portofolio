"use client";

import React from "react";
import { motion } from "framer-motion";

interface MorphingLogoProps {
  isLight: boolean;
  parallax: { x: number; y: number };
}

export default function MorphingLogo({ isLight, parallax }: MorphingLogoProps) {
  const glowColor = isLight
    ? "rgba(6,182,212,0.15)"
    : "rgba(139,92,246,0.4)";

  const textColor = isLight ? "#151d38" : "#ffffff";
  const gradientBg = isLight
    ? "linear-gradient(135deg, rgba(6,182,212,0.12), rgba(168,85,247,0.12))"
    : "linear-gradient(135deg, rgba(6,182,212,0.2), rgba(168,85,247,0.2))";

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 15,
        delay: 0.3,
      }}
      className="relative mb-10"
      style={{ transform: `translate(${parallax.x * 15}px, ${parallax.y * 12}px)` }}
    >
      {/* Outer glow rings */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: 0.4,
        }}
      >
        <div
          className="w-48 h-48 rounded-full"
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            filter: "blur(30px)",
          }}
        />
      </motion.div>

      {/* Main logo container with glassmorphism */}
      <motion.div
        className="relative w-40 h-40 rounded-3xl backdrop-blur-2xl overflow-hidden"
        style={{
          background: gradientBg,
          border: `1px solid ${isLight ? 'rgba(21,29,56,0.1)' : 'rgba(255,255,255,0.1)'}`,
          boxShadow: `0 8px 32px ${isLight ? 'rgba(6,182,212,0.1)' : 'rgba(139,92,246,0.2)'}, 
                      0 0 0 1px ${isLight ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.05)'}`,
        }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)",
              "linear-gradient(225deg, transparent, rgba(255,255,255,0.1), transparent)",
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Liquid blob background */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M80,20 C100,20 120,30 130,50 C140,70 140,90 130,110 C120,130 100,140 80,140 C60,140 40,130 30,110 C20,90 20,70 30,50 C40,30 60,20 80,20 Z"
            fill={isLight ? "rgba(6,182,212,0.06)" : "rgba(139,92,246,0.08)"}
            animate={{
              d: [
                "M80,20 C100,20 120,30 130,50 C140,70 140,90 130,110 C120,130 100,140 80,140 C60,140 40,130 30,110 C20,90 20,70 30,50 C40,30 60,20 80,20 Z",
                "M80,15 C105,18 125,35 132,55 C138,75 135,95 125,112 C115,128 95,142 80,142 C65,142 45,128 35,112 C25,95 22,75 28,55 C35,35 55,12 80,15 Z",
                "M80,20 C100,20 120,30 130,50 C140,70 140,90 130,110 C120,130 100,140 80,140 C60,140 40,130 30,110 C20,90 20,70 30,50 C40,30 60,20 80,20 Z",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>

        {/* AF Text with gradient */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.6,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="relative"
          >
            <motion.span
              className="text-6xl font-bold tracking-tighter"
              style={{
                fontFamily: "var(--font-mono)",
                color: textColor,
                backgroundImage: isLight
                  ? "linear-gradient(135deg, #0891b2, #6d28d9)"
                  : "linear-gradient(135deg, #06b6d4, #a855f7, #ffffff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: `drop-shadow(0 0 24px ${glowColor})`,
              } as React.CSSProperties}
            >
              AF
            </motion.span>
          </motion.div>
        </div>

        {/* Floating particles inside logo */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              background: isLight
                ? "rgba(6,182,212,0.4)"
                : "rgba(168,85,247,0.5)",
              left: `${25 + i * 20}%`,
              top: "50%",
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Rotating ring decoration */}
      <motion.div
        className="absolute inset-0 w-40 h-40"
        animate={{ rotate: 360 }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg viewBox="0 0 160 160" className="w-full h-full">
          <circle
            cx="80"
            cy="80"
            r="76"
            fill="none"
            stroke={isLight ? "rgba(6,182,212,0.2)" : "rgba(139,92,246,0.2)"}
            strokeWidth="1"
            strokeDasharray="8 12"
          />
        </svg>
      </motion.div>

      {/* Counter-rotating ring */}
      <motion.div
        className="absolute inset-2 w-36 h-36"
        animate={{ rotate: -360 }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg viewBox="0 0 144 144" className="w-full h-full">
          <circle
            cx="72"
            cy="72"
            r="70"
            fill="none"
            stroke={isLight ? "rgba(168,85,247,0.15)" : "rgba(6,182,212,0.15)"}
            strokeWidth="0.5"
            strokeDasharray="4 8"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
