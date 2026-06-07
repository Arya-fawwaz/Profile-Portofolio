"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { X, ExternalLink, ShieldCheck, AlertCircle } from "lucide-react";
import { Project } from "./ProjectCard";
import { useLang } from "./LangContext";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { lang } = useLang();
  const labels = {
    codebase: lang === "id" ? "Kode Sumber" : "Codebase",
    demo: lang === "id" ? "Demo Langsung" : "Live Demo",
    overview: lang === "id" ? "Ringkasan Proyek" : "Project Overview",
    challenge: lang === "id" ? "Tantangan" : "The Challenge",
    solution: lang === "id" ? "Solusi Engineering" : "Engineering Solution",
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="glass-card w-full max-w-4xl max-h-[85vh] rounded-2xl overflow-y-auto relative z-10 border border-surface shadow-2xl flex flex-col bg-[var(--background)]"
      >
        {/* Banner */}
        <div className={`relative h-48 sm:h-60 w-full ${project.image.startsWith('http') || project.image.startsWith('/') ? 'bg-black' : 'bg-gradient-to-br ' + project.image} flex items-center justify-center border-b border-surface`}>
          {project.image.startsWith('http') || project.image.startsWith('/') ? (
            <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
          ) : null}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-gray-200 hover:text-white hover:bg-black/60 transition-all border border-white/10 cursor-pointer z-20"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent opacity-80 pointer-events-none" />
          
          {/* Project Title overlay on image (only show if not an image URL) */}
          {!(project.image.startsWith('http') || project.image.startsWith('/')) && (
            <h2 className="font-semibold text-3xl sm:text-4xl text-white text-center uppercase drop-shadow-[0_2px_15px_rgba(0,0,0,0.6)] z-10">
              {project.title}
            </h2>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Tech Badges & Links */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface pb-6">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-surface text-sm font-medium text-secondary hover:text-primary hover:bg-surface-hover hover:border-surface transition-all"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg> {labels.codebase}
              </a>
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                 className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-accent dark:text-white dark:hover:bg-accent-cyan dark:shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-lg"
              >
                <ExternalLink className="h-4 w-4" /> {labels.demo}
              </a>
            </div>
          </div>

          {/* Overview */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-primary uppercase border-l-2 border-accent pl-3">
              {labels.overview}
            </h3>
            <p className="text-secondary leading-relaxed text-base">
              {project.longDescription}
            </p>
          </div>

          {/* Challenge and Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Challenge */}
            <div className="p-5 rounded-xl bg-red-500/5 border border-red-500/10 space-y-3">
              <div className="flex items-center gap-2 text-red-400 font-medium uppercase text-sm">
                <AlertCircle className="h-4 w-4" /> {labels.challenge}
              </div>
              <p className="text-secondary text-sm leading-relaxed">
                {project.challenge}
              </p>
            </div>

            {/* Solution */}
            <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-3">
              <div className="flex items-center gap-2 text-accent-emerald font-medium uppercase text-sm">
                <ShieldCheck className="h-4 w-4" /> {labels.solution}
              </div>
              <p className="text-secondary text-sm leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
