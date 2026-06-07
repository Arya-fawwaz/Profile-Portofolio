"use client";

import React, { useRef, useState } from "react";
import { ArrowUpRight, Radio, Layers3 } from "lucide-react";
import { useLang } from "./LangContext";

export interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  image: string; // Gradient class or image path
  tags: string[];
  githubUrl: string;
  demoUrl: string;
  challenge: string;
  solution: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: () => void;
}

export default function ProjectCard({ project, index, onClick }: ProjectCardProps) {
  const { t } = useLang();
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Cursor location relative to card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalize coordinates from -0.5 to 0.5
    const normalizedX = x / rect.width - 0.5;
    const normalizedY = y / rect.height - 0.5;

    // Set rotation (max 15 degrees)
    setRotateX(-normalizedY * 20); // Tilt up/down
    setRotateY(normalizedX * 20);  // Tilt left/right

    // Glare position percentage
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
          : `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
        transition: isHovered ? "none" : "transform 0.5s ease",
      }}
      className="project-card group relative min-h-[430px] w-full rounded-xl cursor-pointer overflow-hidden flex flex-col"
    >
      {/* Glare spotlight overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        style={{
          background: `radial-gradient(circle 180px at ${glarePosition.x}% ${glarePosition.y}%, rgba(6, 182, 212, 0.15), transparent 80%)`,
        }}
      />

      {/* Project Banner / Thumbnail */}
      <div className={`project-card-visual relative h-48 w-full ${project.image.startsWith('http') || project.image.startsWith('/') ? 'bg-black' : 'bg-gradient-to-br ' + project.image} flex items-center justify-center border-b border-surface overflow-hidden`}>
        {project.image.startsWith('http') || project.image.startsWith('/') ? (
          <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
        ) : null}
        
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full bg-black/25 px-3 py-1.5 text-[10px] font-medium uppercase text-white/85 backdrop-blur-md">
          <Radio className="h-3 w-3 text-accent-emerald" />
          {project.title}
        </div>
        <div className="absolute right-4 top-4 z-10 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-medium uppercase text-white backdrop-blur-md">
          Featured
        </div>
        <div className="absolute inset-4 rounded-xl border border-white/10 pointer-events-none" />
        
        {/* Project Title overlay on image (only show if not an image URL) */}
        {!(project.image.startsWith('http') || project.image.startsWith('/')) && (
          <>
            <div className="absolute top-1/2 left-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10 group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
            <h3 className="project-card-title font-semibold text-2xl text-center uppercase group-hover:scale-105 transition-transform duration-300 z-10 text-white">
              <span>{project.title}</span>
            </h3>
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col justify-between z-10 relative">
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-surface border border-surface px-3 py-1.5 text-[10px] uppercase text-secondary">
              <Layers3 className="h-3.5 w-3.5 text-accent-cyan" />
              Architecture
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-accent/35 to-transparent" />
          </div>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-accent/5 text-accent border border-accent/10"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-secondary text-sm line-clamp-3 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Action button triggers */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface">
          <span className="text-xs font-medium text-accent uppercase group-hover:text-primary transition-colors flex items-center gap-1.5">
            {t("projects.viewDetails")}
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </span>
          
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-1.5 rounded-lg text-[10px] uppercase font-bold flex items-center gap-1.5 transition-colors shadow-sm ${
                project.image.startsWith('http') || project.image.startsWith('/') // Just checking if it's an image, though ThemeContext is better, but we don't have it here. Let's use standard dark/light classes based on parent.
                  ? 'bg-slate-200 text-slate-800 border-slate-300 hover:bg-slate-300 dark:bg-accent/10 dark:text-primary dark:border-accent/20 dark:hover:bg-accent/20 dark:shadow-[0_0_15px_rgba(6,182,212,0.15)]' // Dark mode classes are active if html has 'dark' class
                  : 'bg-slate-200 text-slate-800 border-slate-300 hover:bg-slate-300 dark:bg-accent/10 dark:text-primary dark:border-accent/20 dark:hover:bg-accent/20 dark:shadow-[0_0_15px_rgba(6,182,212,0.15)]'
              }`}
              title="Live Demo"
            >
              Demo <ArrowUpRight className="h-3 w-3" />
            </a>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-accent/5 transition-colors"
              title="View Source on GitHub"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
