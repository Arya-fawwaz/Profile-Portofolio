"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PremiumLoader from "./PremiumLoader";

interface CinematicLoaderProps {
  progress: number;
  onFinish: () => void;
}

export default function CinematicLoader({ progress, onFinish }: CinematicLoaderProps) {
  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-50"
    >
      <PremiumLoader progress={progress} onFinish={onFinish} />
    </motion.div>
  );
}
