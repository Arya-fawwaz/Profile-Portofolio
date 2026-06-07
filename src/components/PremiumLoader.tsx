"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeContext";

import { useLang } from "./LangContext";

interface PremiumLoaderProps {
  progress: number;
  onFinish: () => void;
}

const smoothEase = [0.16, 1, 0.3, 1] as const;

export default function PremiumLoader({ progress, onFinish }: PremiumLoaderProps) {
  const { theme } = useTheme();
  const { t } = useLang();
  const [mounted, setMounted] = useState(false);
  const isLight = mounted ? theme === "light" : false;

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayedPct = Math.floor(Math.min(progress, 100));

  if (!mounted) return null;

  const bg = isLight ? "#fdfdfd" : "#020205";
  const cinematicBar = isLight ? "#ffffff" : "#000000";
  const textPrimary = isLight ? "#0f172a" : "#ffffff";
  const textSecondary = isLight ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.4)";

  return (
    <motion.div
      exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 1.2, ease: "easeInOut" } }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: bg }}
    >
      {/* Cinematic Letterbox Bars */}
      <motion.div 
        initial={{ height: "50vh" }}
        animate={{ height: "12vh" }}
        transition={{ duration: 1.8, ease: smoothEase }}
        className="absolute top-0 left-0 right-0 z-40 border-b border-white/[0.03] shadow-2xl"
        style={{ backgroundColor: cinematicBar }}
      />
      <motion.div 
        initial={{ height: "50vh" }}
        animate={{ height: "12vh" }}
        transition={{ duration: 1.8, ease: smoothEase }}
        className="absolute bottom-0 left-0 right-0 z-40 border-t border-white/[0.03] shadow-2xl"
        style={{ backgroundColor: cinematicBar }}
      />

      {/* Atmospheric Soft Light */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] opacity-20"
          style={{
            background: isLight 
              ? "radial-gradient(circle at 50% 50%, rgba(14,165,233,0.12) 0%, transparent 70%)"
              : "radial-gradient(circle at 50% 50%, rgba(56,189,248,0.08) 0%, transparent 75%)",
          }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Luxury Grain Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-30 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')`,
          filter: isLight ? 'invert(1)' : 'none'
        }}
      />

      <div className="relative z-20 w-full max-w-2xl px-12 flex flex-col items-center">
        {/* Cinematic Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.5, delay: 0.6, ease: smoothEase }}
          className="mb-6"
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.6em] text-cyan-500 font-bold text-center block">
            {t("loading.welcome")}
          </span>
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mt-4 opacity-50" />
        </motion.div>

        {/* Title Focus Reveal */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(25px)", scale: 1.05 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          transition={{ duration: 2.2, ease: smoothEase }}
          className="mb-16 text-center"
        >
          <h1 className="text-5xl sm:text-8xl font-black tracking-[0.15em] uppercase leading-none text-primary italic" style={{ color: textPrimary }}>
            Arya Fawwaz
          </h1>
        </motion.div>

        {/* Minimalist Professional Loader */}
        <div className="w-full max-w-sm space-y-4">
          <div className="flex justify-between items-center px-1 font-mono text-[9px] tracking-[0.3em] uppercase">
            <span style={{ color: textSecondary }} className="font-medium italic">{t("loading.running")}</span>
            <span style={{ color: textPrimary }} className="font-bold text-cyan-500">{displayedPct}%</span>
          </div>
          
          <div className="w-full h-[2px] relative bg-white/[0.05] dark:bg-white/[0.05] overflow-hidden rounded-full" style={{ backgroundColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.04)" }}>
            <motion.div
              className="absolute top-0 left-0 bottom-0 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
              style={{ width: `${displayedPct}%` }}
              transition={{ type: "spring", stiffness: 40, damping: 25 }}
            />
          </div>
        </div>
      </div>

      {/* Cinematic Corner HUD */}
      <div className="absolute inset-0 pointer-events-none z-30">
        <div className="absolute top-16 left-12 font-mono text-[8px] tracking-[0.4em] uppercase opacity-40" style={{ color: textPrimary }}>
          Ver.2026.01_Secure_Link
        </div>
        <div className="absolute bottom-16 right-12 font-mono text-[8px] tracking-[0.4em] uppercase opacity-40" style={{ color: textPrimary }}>
          User.Authorized: AF_Dev
        </div>
      </div>

      <AnimatePresence>
        {progress > 40 && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.6, y: 0 }}
            whileHover={{ opacity: 1, letterSpacing: "0.4em", scale: 1.1 }}
            exit={{ opacity: 0 }}
            onClick={onFinish}
            className="absolute bottom-24 z-50 text-[10px] font-mono uppercase tracking-[0.3em] transition-all duration-500 cursor-pointer border border-cyan-500/30 px-6 py-2 rounded-full hover:bg-cyan-500/10 hover:border-cyan-500"
            style={{ color: textPrimary }}
          >
            {t("projects.viewDetails").split(" ")[0]} Intro
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
