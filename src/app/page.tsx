"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Terminal,
  Database,
  Send,
  Download,
  CheckCircle2,
  Sparkles,
  Layers3,
  Activity,
  Gauge,
  Globe,
} from "lucide-react";
import InteractiveCanvas from "../components/InteractiveCanvas";
import CinematicLoader from "../components/CinematicLoader";
import ProjectCard, { Project } from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Lang, useLang } from "../components/LangContext";
import { useTheme } from "../components/ThemeContext";

type LocalizedText = Record<Lang, string>;
type LocalizedProject = Omit<Project, "description" | "longDescription" | "challenge" | "solution"> & {
  description: LocalizedText;
  longDescription: LocalizedText;
  challenge: LocalizedText;
  solution: LocalizedText;
};

const PROJECTS: LocalizedProject[] = [
  {
    id: 1,
    title: "UGForce",
    description: {
      en: "A robust and efficient classroom booking system designed for university environments.",
      id: "Sistem pemesanan ruang kelas yang andal dan efisien yang dirancang untuk lingkungan universitas.",
    },
    longDescription: {
      en: "UGForce is a comprehensive platform built to streamline the process of booking and managing classroom schedules. It allows students and faculty to easily view room availability, make reservations, and manage their schedules digitally. The system features an intuitive interface and robust backend to handle high traffic during peak booking periods.",
      id: "UGForce adalah platform komprehensif yang dibangun untuk merampingkan proses pemesanan dan pengelolaan jadwal ruang kelas. Ini memungkinkan mahasiswa dan staf pengajar untuk dengan mudah melihat ketersediaan ruangan, melakukan reservasi, dan mengelola jadwal mereka secara digital. Sistem ini memiliki antarmuka yang intuitif dan backend yang kuat untuk menangani lalu lintas tinggi selama periode puncak pemesanan.",
    },
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop", // Modern Lecture Hall
    tags: ["Laravel", "PHP", "PostgreSQL", "HTML", "CSS"],
    githubUrl: "https://github.com/aryafawwaz",
    demoUrl: "https://ugforce.vercel.app/",
    challenge: {
      en: "Handling concurrent booking requests to prevent double-booking of rooms while maintaining a responsive user interface.",
      id: "Menangani permintaan pemesanan secara bersamaan untuk mencegah pemesanan ganda ruangan sambil mempertahankan antarmuka pengguna yang responsif.",
    },
    solution: {
      en: "Implemented a robust transactional database system with optimistic locking and real-time availability updates.",
      id: "Menerapkan sistem basis data transaksional yang kuat dengan optimistic locking dan pembaruan ketersediaan secara real-time.",
    },
  },
  {
    id: 2,
    title: "ParkSmart",
    description: {
      en: "A digital parking management system for modern facilities.",
      id: "Sistem manajemen parkir digital untuk fasilitas modern.",
    },
    longDescription: {
      en: "ParkSmart modernizes parking facility management by digitizing the entire process. It provides real-time tracking of available spots, automated ticketing, and comprehensive reporting for administrators. Designed for scalability, it can handle multi-level parking structures and integrate with various access control hardware.",
      id: "ParkSmart memodernisasi manajemen fasilitas parkir dengan mendigitalkan seluruh proses. Ini menyediakan pelacakan tempat yang tersedia secara real-time, tiket otomatis, dan pelaporan komprehensif untuk administrator. Dirancang untuk skalabilitas, ia dapat menangani struktur parkir multi-level dan berintegrasi dengan berbagai perangkat keras kontrol akses.",
    },
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=800&auto=format&fit=crop", // Parking lot
    tags: ["Python", "Computer Vision", "Supabase", "PostgreSQL"],
    githubUrl: "https://github.com/aryafawwaz",
    demoUrl: "https://parksmart-gps.vercel.app/",
    challenge: {
      en: "Ensuring accurate real-time data sync between physical sensors and the web dashboard.",
      id: "Memastikan sinkronisasi data real-time yang akurat antara sensor fisik dan dashboard web.",
    },
    solution: {
      en: "Utilized WebSockets for low-latency communication and implemented a reliable message queue for sensor data.",
    },
  }
];

const SKILLS_LIST = [
  { name: "Laravel", icon: "laravel", color: "#FF2D20" },
  { name: "PHP", icon: "php", color: "#777BB4" },
  { name: "Python", icon: "python", color: "#3776ab" },
  { name: "Computer Vision", icon: "cv", color: "#00A67E" },
  { name: "HTML", icon: "html", color: "#E34F26" },
  { name: "CSS", icon: "css", color: "#1572B6" },
  { name: "PostgreSQL", icon: "postgres", color: "#336791" },
  { name: "Supabase", icon: "supabase", color: "#3ECF8E" },
  { name: "React", icon: "react", color: "#61dafb" },
  { name: "Next.js", icon: "next", color: "#111827" },
  { name: "TypeScript", icon: "ts", color: "#3178c6" },
] as const;

const SKILL_GROUPS = {
  frontend: ["HTML", "CSS", "React", "Next.js", "TypeScript"],
  backend: ["Laravel", "PHP", "Python", "Computer Vision"],
  cloud: ["PostgreSQL", "Supabase"],
};

const skillMeta: Map<string, (typeof SKILLS_LIST)[number]> = new Map(
  SKILLS_LIST.map((skill) => [skill.name, skill])
);

function SkillLogo({ name }: { name: string }) {
  const skill = skillMeta.get(name);
  const icon = skill?.icon ?? "code";
  const color = skill?.color ?? "#06b6d4";
  const mark =
    {
      react: "Rx",
      next: "N",
      ts: "TS",
      laravel: "Lv",
      php: "PHP",
      python: "Py",
      cv: "CV",
      html: "H5",
      css: "C3",
      supabase: "Sb",
      postgres: "PG",
      code: "</>",
    }[icon] ?? "</>";

  return (
    <span className="skill-logo" style={{ "--skill-color": color } as React.CSSProperties}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {icon === "react" && (
          <>
            <circle cx="12" cy="12" r="1.8" fill="currentColor" />
            <ellipse cx="12" cy="12" rx="8.5" ry="3.4" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <ellipse cx="12" cy="12" rx="8.5" ry="3.4" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="8.5" ry="3.4" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(120 12 12)" />
          </>
        )}
        {icon === "next" && (
          <>
            <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8 16V8l8 8V8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          </>
        )}
        {icon === "ts" && (
          <>
            <rect x="4" y="4" width="16" height="16" rx="3" fill="currentColor" opacity=".16" />
            <path d="M7 9h7M10.5 9v7M15 15.4c.6.5 1.3.8 2.1.8.9 0 1.6-.4 1.6-1.1 0-.8-.7-1-1.7-1.3-1.2-.4-2.1-.9-2.1-2.1 0-1.3 1-2.1 2.5-2.1.9 0 1.6.2 2.2.7" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
          </>
        )}
        {icon === "three" && <path d="M5 18 12 5l7 13H5Zm7-13 1.8 13M12 5 8.3 18M8.3 18l7-6.5M13.8 18 8.8 9.2" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />}
        {icon === "tailwind" && <path d="M5 11.8c1.4-3 3.1-4.4 5.3-4.4 1.3 0 2.2.5 3.2 1.5.7.7 1.3 1.1 2.1 1.1 1 0 1.9-.7 2.7-2.2-1.4 3-3.1 4.4-5.3 4.4-1.3 0-2.2-.5-3.2-1.5-.7-.7-1.3-1.1-2.1-1.1-1 0-1.9.7-2.7 2.2Zm0 4.4c1.4-3 3.1-4.4 5.3-4.4 1.3 0 2.2.5 3.2 1.5.7.7 1.3 1.1 2.1 1.1 1 0 1.9-.7 2.7-2.2-1.4 3-3.1 4.4-5.3 4.4-1.3 0-2.2-.5-3.2-1.5-.7-.7-1.3-1.1-2.1-1.1-1 0-1.9.7-2.7 2.2Z" fill="currentColor" />}
        {icon === "framer" && <path d="M7 4h10v5h-5l5 5H7V9h5L7 4Zm0 10h5v6l-5-6Z" fill="currentColor" />}
        {icon === "node" && <path d="M12 3.8 19 8v8l-7 4.2L5 16V8l7-4.2Zm-3.4 10.8c.9.9 1.9 1.3 3.2 1.3 1.5 0 2.6-.7 2.6-2 0-1.2-.8-1.7-2.5-2.1-1.1-.3-1.5-.5-1.5-1s.5-.8 1.2-.8c.8 0 1.5.2 2.1.8" fill="none" stroke="currentColor" strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5" />}
        {icon === "webgl" && <path d="M12 4 5 8v8l7 4 7-4V8l-7-4Zm0 0v8m0 8v-8m0 0 7-4m-7 4-7-4m7 4 7 4m-7-4-7 4" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />}
        {icon === "graphql" && (
          <>
            <path d="M12 4 19 8v8l-7 4-7-4V8l7-4Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
            {[["12","4"],["19","8"],["19","16"],["12","20"],["5","16"],["5","8"]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.3" fill="currentColor" />)}
          </>
        )}
        {icon === "postgres" && <path d="M12 4c-3.8 0-6.5 2.4-6.5 5.8 0 2.4 1.3 4.5 3.5 5.2l-1.1 4 3.5-2.5h.6c3.8 0 6.5-2.4 6.5-5.8S15.8 4 12 4Zm-1.2 5.2h2.2c1.5 0 2.5.8 2.5 2.1 0 1.4-1 2.2-2.6 2.2h-2.1V9.2Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />}
        {icon === "docker" && <path d="M4 13h15c-.6 3.5-3.2 5.5-7.4 5.5H9.2C6.5 18.5 4.5 16.5 4 13Zm2-4h3v3H6V9Zm4 0h3v3h-3V9Zm4 0h3v3h-3V9Zm-4-4h3v3h-3V5Zm9.1 5.3c.9-.1 1.6.2 2.2.8-.6.4-1.3.6-2.2.5" fill="none" stroke="currentColor" strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.4" />}
        {icon === "git" && <path d="M12 4 20 12l-8 8-8 8-8-8 8-8Zm-2.2 5.5 4.7 4.7M9.8 9.5v5m0-5a1.4 1.4 0 1 0 0-.1m4.7 4.8a1.4 1.4 0 1 0 0-.1" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />}
        {icon === "python" && <path d="M12.8 4H9.5C8.1 4 7 5.1 7 6.5V10h6.5c1.4 0 2.5 1.1 2.5 2.5V14h-4.8M11.2 20h3.3c1.4 0 2.5-1.1 2.5-2.5V14h-6.5C9.1 14 8 12.9 8 11.5V10h4.8M9.7 6.6h.1m4.4 10.8h.1" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />}
        {icon === "socket" && <path d="M5 12h4m6 0h4M9 12a3 3 0 0 1 6 0m-9.5-4.5a9 9 0 0 1 13 0m-13 9a9 9 0 0 0 13 0" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />}
      </svg>
      <span className="skill-logo-mark">{mark}</span>
    </span>
  );
}

export default function Home() {
  const { lang, t } = useLang();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState("all");

  // Contact Form State
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Statistics counters
  const [stats, setStats] = useState({ projects: 0, experience: 0, hours: 0 });

  // Loading Screen simulation — cinematic pace (~8s)
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 800);
          return 100;
        }
        // Slower at start & end, faster mid-way
        const increment =
          prev < 15
            ? Math.random() * 1.5 + 0.5
            : prev < 85
            ? Math.random() * 3 + 1.5
            : Math.random() * 1 + 0.3;
        return Math.min(prev + increment, 100);
      });
    }, 80);

    return () => clearInterval(timer);
  }, []);

  // Stats increment simulation once loaded
  useEffect(() => {
    if (loading) return;

    const duration = 2000;
    const steps = 50;
    const stepTime = duration / steps;
    let step = 0;

    const statsTimer = setInterval(() => {
      step++;
      setStats({
        projects: Math.min(Math.round((2 / steps) * step), 2),
        experience: 0,
        hours: Math.min(Math.round((100 / steps) * step), 100),
      });

      if (step >= steps) {
        clearInterval(statsTimer);
      }
    }, stepTime);

    return () => clearInterval(statsTimer);
  }, [loading]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess(false);

    if (!formState.name || !formState.email || !formState.message) {
      setFormError(t("contact.errorAll"));
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formState.email)) {
      setFormError(t("contact.errorEmail"));
      return;
    }

    setFormSubmitting(true);

    // Mock API request
    setTimeout(() => {
      setFormSubmitting(false);
      setFormSuccess(true);
      setFormState({ name: "", email: "", message: "" });
    }, 1500);
  };

  const projects: Project[] = PROJECTS.map((project) => ({
    ...project,
    description: project.description[lang],
    longDescription: project.longDescription[lang],
    challenge: project.challenge[lang],
    solution: project.solution[lang],
  }));

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((p) => p.tags.some((tt) => tt.toLowerCase() === filter.toLowerCase()));

  // Get unique tags from all projects for filters
  const filterTags = ["all", ...new Set(projects.flatMap((p) => p.tags))];

  return (
    <>
      {/* 1. Cinematic Movie-Style Loading Screen */}
      <AnimatePresence>
        {loading && (
          <CinematicLoader
            progress={progress}
            onFinish={() => setLoading(false)}
          />
        )}
      </AnimatePresence>

      {!loading && (
        <div className="min-h-screen premium-shell text-primary relative">
          {/* Animated grid pattern for sophistication */}
          <div className="fixed inset-0 grid-pattern z-0" />

          {/* Night mode meteor field */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <InteractiveCanvas />
          </div>

          {/* Navigation */}
          <Navbar />

          {/* Decorative canvas disabled for cleaner professional look */}

          {/* Main Content */}
          <main className="relative z-10">
                       <section id="home" className="min-h-screen flex items-center justify-center px-6 relative pt-20">
              <div className="max-w-6xl mx-auto w-full px-4 sm:px-10 md:px-16">
                <div className="flex flex-row items-center justify-between gap-10 lg:gap-24 text-left min-h-[350px] sm:min-h-[550px]">
                  <div className="flex-1 space-y-6 sm:space-y-8 py-4 sm:py-10">
                    {/* Micro-badge */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6 }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[8px] sm:text-[10px] font-mono uppercase text-cyan-500 shadow-[0_8px_30px_rgba(6,182,212,0.1)] backdrop-blur-xl tracking-[0.2em] sm:tracking-[0.3em] w-fit"
                    >
                      <Sparkles className="h-2.5 w-2.5" /> {t("hero.badge")}
                    </motion.div>

                    {/* Main Heading Group */}
                    <div className="space-y-3 sm:space-y-4">
                      <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="block text-cyan-400 font-mono text-xs sm:text-base uppercase tracking-[0.3em] sm:tracking-[0.4em]"
                      >
                        {t("hero.greeting")}
                      </motion.span>
                      
                      <motion.h1
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.15 }}
                        className="text-3xl sm:text-6xl md:text-7xl font-bold tracking-tighter leading-[0.9] text-primary"
                      >
                        Arya Fawwaz
                      </motion.h1>

                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "fit-content" }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="flex flex-col gap-1.5 pt-1 sm:pt-2"
                      >
                         <span className="hero-role font-mono text-[8px] sm:text-xs uppercase tracking-[0.4em] sm:tracking-[0.6em] text-cyan-500/70">
                           {t("hero.role")}
                         </span>
                         <div className="h-0.5 w-full bg-gradient-to-r from-cyan-500/60 via-cyan-500/10 to-transparent rounded-full" />
                      </motion.div>
                    </div>

                    {/* Subtitle */}
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="max-w-xl text-secondary text-xs sm:text-lg md:text-xl leading-relaxed font-light opacity-80"
                    >
                      {t("hero.subtitle")}
                    </motion.p>

                    {/* CTA buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="flex flex-row items-center gap-4 sm:gap-6 pt-2 sm:pt-4"
                    >
                      <a
                        href="#projects"
                        className="px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-full bg-cyan-500 text-white font-bold flex items-center justify-center gap-2 hover:bg-cyan-400 transition-all duration-300 shadow-[0_10px_35px_rgba(6,182,212,0.35)] hover:scale-105 active:scale-95 text-[9px] sm:text-xs uppercase tracking-widest"
                      >
                        {t("hero.explore")} <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </a>
                      <a
                        href="#contact"
                        className="px-6 py-2.5 sm:px-10 sm:py-4 rounded-full border border-white/10 text-primary font-bold hover:bg-white/5 transition-all duration-300 hover:border-white/20 active:scale-95 text-[9px] sm:text-base"
                      >
                        {t("hero.getInTouch")}
                      </a>
                    </motion.div>
                  </div>

                  {/* Profile Image - Re-centered Frame */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, x: 30 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative group lg:mt-0"
                  >
                    <div className="relative w-32 h-44 sm:w-80 sm:h-[450px] p-2 sm:p-4 flex items-center justify-center">
                      {/* Architectural Corners */}
                      <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-cyan-500/50" />
                      <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-cyan-500/50" />
                      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-cyan-500/50" />
                      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-cyan-500/50" />
                      
                      {/* Background Plate */}
                      <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-sm backdrop-blur-md -z-10 shadow-2xl" />
                      
                      {/* Image Wrapper */}
                      <div className="relative w-full h-full overflow-hidden rounded-sm border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
                         <img 
                           src="/profile.jpg" 
                           alt="Arya Fawwaz" 
                           className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                         />
                         <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* 3.5 Standalone Business Venture Dashboard */}
            <section id="business" className="py-40 relative border-y border-surface bg-surface/20">
              {/* Background Ambient Glows */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-cyan-500 blur-[120px] rounded-full animate-pulse" />
              </div>

              <div className="max-w-7xl mx-auto px-6 relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
                  
                  {/* Left: Venture Brand Card (4 Cols) */}
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="lg:col-span-5 relative group"
                  >
                    <div className="h-full relative border border-surface rounded-3xl overflow-hidden backdrop-blur-2xl bg-surface/10 p-1 shadow-2xl">
                      {/* Inner Architectural Frame */}
                      <div className="h-full border border-surface rounded-[1.4rem] overflow-hidden flex flex-col">
                        <div className="relative h-64 sm:h-80 bg-black flex items-center justify-center overflow-hidden">
                           {/* Website Preview / Logo Mask */}
                           <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-transparent z-10" />
                           <img 
                             src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop" 
                             alt="NextYoung Tech Venture" 
                             className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-1000"
                           />
                           <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                             <div className="h-16 w-16 rounded-2xl bg-cyan-500 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.5)] mb-4">
                               <Globe className="h-8 w-8 text-white animate-pulse" />
                             </div>
                             <span className="text-white font-mono font-bold tracking-[0.3em] uppercase">Venture.Active</span>
                           </div>
                        </div>
                        
                        <div className="flex-1 p-8 flex flex-col justify-between gap-6">
                            <div className="space-y-4">
                              <div className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-[0.4em]">{t("business.partnership")}</div>
                              <h3 className="text-2xl font-bold text-primary font-mono tracking-tight uppercase">NextYoung Tech</h3>
                              <p className="text-secondary text-sm leading-relaxed font-light">
                                {t("business.desc")}
                              </p>
                            </div>
                           
                           <a 
                             href="https://www.nextyoungtech.com/" 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="w-full py-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500 hover:text-white text-cyan-400 font-mono text-[10px] uppercase tracking-[0.3em] text-center transition-all duration-500 group-hover:border-cyan-400"
                           >
                             Execute_Link.NYT
                           </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Right: Leadership Dashboard (7 Cols) */}
                  <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="lg:col-span-7 flex flex-col gap-8"
                  >
                    {/* Header Info */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="h-px w-16 bg-cyan-500/30" />
                          <span className="text-cyan-400 font-mono text-[10px] uppercase tracking-[0.6em]">{t("business.label")}</span>
                        </div>
                        <h2 className="text-4xl sm:text-6xl font-bold tracking-tighter leading-none text-primary uppercase">
                          Technical <br />
                          <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent italic">{t("business.title").split(" ")[1]}</span>
                        </h2>
                      </div>

                    {/* Dashboard Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                       {[
                         { title: t("business.metrics.pos"), val: t("business.metrics.posVal"), detail: t("business.metrics.posDetail") },
                         { title: t("business.metrics.core"), val: t("business.metrics.coreVal"), detail: t("business.metrics.coreDetail") },
                         { title: t("business.metrics.status"), val: t("business.metrics.statusVal"), detail: t("business.metrics.statusDetail") },
                         { title: t("business.metrics.scope"), val: t("business.metrics.scopeVal"), detail: t("business.metrics.scopeDetail") }
                       ].map((m, i) => (
                         <div 
                           key={m.title}
                           className="p-6 rounded-2xl border border-surface bg-surface/30 hover:bg-surface/50 hover:border-cyan-500/30 transition-all duration-300 group/item flex flex-col justify-between shadow-sm"
                         >
                           <div className="space-y-1">
                              <div className="text-[8px] font-mono text-secondary uppercase tracking-widest">{m.title}</div>
                              <div className="text-lg font-bold text-primary font-mono group-hover/item:text-cyan-500 transition-colors">{m.val}</div>
                           </div>
                           <div className="mt-4 flex items-center justify-between">
                             <span className="text-[7px] font-mono text-secondary uppercase opacity-70">{m.detail}</span>
                             <div className={`h-1.5 w-1.5 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]`} />
                           </div>
                         </div>
                      ))}
                    </div>

                    {/* Bottom Status Bar */}
                     <div className="p-6 rounded-2xl border border-dashed border-surface flex items-center justify-between font-mono text-[9px] tracking-widest text-secondary/40 uppercase">
                       <span>{t("business.status")}</span>
                       <div className="flex gap-2">
                         <span>{t("business.nodes")}</span>
                         <span className="text-cyan-500/50">Sync.Success</span>
                       </div>
                     </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* 3. About Me Section */}
            <section id="about" className="section-panel py-32 relative">
              <div className="max-w-7xl mx-auto px-4 relative">
                
                {/* About Master Frame */}
                <div className="relative border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm group">
                  {/* Technical Corner Marks */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/50" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500/50" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500/50" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/50" />

                  <div className="flex flex-col lg:flex-row">
                    {/* Left Side: Biography */}
                    <div className="flex-1 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/10">
                      <div className="space-y-8">
                        <div className="space-y-2">
                          <span className="text-cyan-400 font-mono text-[10px] uppercase tracking-[0.5em] block">
                            {t("about.label")}
                          </span>
                          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-primary">
                            {t("about.title")}
                          </h2>
                        </div>
                        
                        <div className="space-y-6 text-secondary leading-relaxed text-base sm:text-lg font-light max-w-2xl">
                          <p className="bold-copy text-primary/90 font-normal">
                            {t("about.p1")}
                          </p>
                          <p>
                            {t("about.p2")}
                          </p>
                        </div>
                        
                        <div className="pt-4">
                          <a
                            href="#"
                            className="inline-flex items-center gap-3 px-8 py-3 rounded-full border border-cyan-500/30 text-[10px] font-mono uppercase tracking-widest text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300"
                          >
                            <Download className="h-3.5 w-3.5" /> {t("about.downloadCV")}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: University Stats Dashboard */}
                    <div className="lg:w-1/3 bg-white/[0.02] p-8 lg:p-12 flex flex-col justify-center gap-6">
                      <div className="space-y-6">
                         {/* University Block */}
                         <div className="border-l-2 border-cyan-500/30 pl-6 py-2">
                           <span className="text-[8px] font-mono text-secondary tracking-[0.3em] uppercase block mb-1">{t("about.affiliation")}</span>
                           <span className="text-xl font-bold font-mono text-primary block leading-tight">Gunadarma University</span>
                         </div>
 
                         {/* Major Block */}
                         <div className="border-l-2 border-purple-500/30 pl-6 py-2">
                           <span className="text-[8px] font-mono text-secondary tracking-[0.3em] uppercase block mb-1">{t("about.dept")}</span>
                           <span className="text-xl font-bold font-mono text-primary block leading-tight">{t("about.major")}</span>
                         </div>
 
                         {/* Status Block */}
                         <div className="border-l-2 border-emerald-500/30 pl-6 py-2">
                           <span className="text-[8px] font-mono text-secondary tracking-[0.3em] uppercase block mb-1">{t("about.status")}</span>
                           <span className="text-xl font-bold font-mono text-primary block leading-tight">{t("about.undergrad")}</span>
                         </div>
 
                         {/* Projects Block */}
                         <div className="border-l-2 border-amber-500/30 pl-6 py-2">
                           <span className="text-[8px] font-mono text-secondary tracking-[0.3em] uppercase block mb-1">{t("about.accomplishments")}</span>
                           <span className="text-xl font-bold font-mono text-primary block leading-tight">{stats.projects} {t("about.coreProj")}</span>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>


            {/* 4. Portfolio / Projects Section - Ultra Modern Overhaul */}
            <section id="projects" className="section-panel py-32 relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 relative">
                
                {/* Decorative Tech Grid (Top Left) */}
                <div className="absolute -top-12 left-0 hidden lg:grid grid-cols-4 gap-1.5 opacity-20 group">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0.2 }}
                      animate={{ opacity: [0.2, 0.8, 0.2] }}
                      transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                      className="h-1.5 w-1.5 bg-cyan-500 rounded-sm"
                    />
                  ))}
                </div>

                {/* Master Dashboard Frame */}
                <div className="relative border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm mb-24 group">
                  {/* Technical Corner Marks */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/50" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500/50" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500/50" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/50" />

                  <div className="flex flex-col lg:flex-row">
                    {/* Left Side: Brand & Title */}
                    <div className="flex-1 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/10">
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 mb-8"
                      >
                        <div className="h-px w-12 bg-cyan-500/50" />
                        <span className="text-cyan-400 font-mono text-[10px] uppercase tracking-[0.5em]">
                          {t("projects.label")}
                        </span>
                      </motion.div>
                      
                      <div className="space-y-6">
                         <motion.h2 
                           initial={{ opacity: 0, y: 20 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           className="text-4xl sm:text-6xl font-bold tracking-tighter leading-none"
                         >
                           <span className="bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
                             {t("projects.featured")}
                           </span>
                         </motion.h2>
                         
                         <motion.p 
                           initial={{ opacity: 0 }}
                           whileInView={{ opacity: 1 }}
                           transition={{ delay: 0.2 }}
                           className="text-secondary text-sm sm:text-base leading-relaxed font-light max-w-lg"
                         >
                           {t("projects.featuredDesc")}
                         </motion.p>
                      </div>
                    </div>

                    {/* Right Side: High-Tech Metrics Grid */}
                    <div className="lg:w-1/3 bg-white/[0.02] p-8 lg:p-12 flex flex-col justify-center gap-8">
                      <div className="grid grid-cols-2 gap-8">
                         {[
                           { label: t("projects.metrics.selected"), val: `0${filteredProjects.length}` },
                           { label: t("projects.metrics.stack"), val: `0${filterTags.length - 1}` },
                           { label: t("projects.metrics.engine"), val: "v2.0" },
                           { label: t("projects.metrics.status"), val: t("projects.metrics.active") }
                         ].map((m, i) => (
                          <motion.div 
                            key={m.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex flex-col gap-1 border-b border-white/5 pb-2"
                          >
                            <span className="text-[8px] font-mono text-secondary tracking-[0.3em] uppercase">{m.label}</span>
                            <span className="text-xl font-bold font-mono text-primary group-hover:text-cyan-400 transition-all">{m.val}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter Navigation - Centered & Clean */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-16 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md max-w-fit mx-auto shadow-2xl">
                  {filterTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setFilter(tag)}
                      className={`text-[9px] font-mono uppercase tracking-widest px-6 py-2 rounded-full transition-all duration-300 relative ${
                        filter === tag 
                          ? "text-white bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]" 
                          : "text-slate-600 dark:text-secondary hover:text-cyan-600 dark:hover:text-white"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Projects Grid */}
                <div className="projects-grid">
                  <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ProjectCard
                          project={project}
                          index={index}
                          onClick={() => setSelectedProject(project)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* 5. Skills / Tech Stack Section */}
            <section id="skills" className="section-panel py-24 border-t border-surface overflow-hidden">
              <div className="max-w-6xl mx-auto px-4 mb-12">
                <div className="text-center space-y-2">
                  <span className="text-accent-cyan font-medium uppercase text-xs">
                    {t("skills.label")}
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-semibold text-primary premium-title">
                    {t("skills.title")}
                  </h2>
                </div>
              </div>

              {/* Infinite scrolling marquee */}
              <div className="flex overflow-hidden select-none w-full relative py-4 bg-white/2">
                <div className="flex items-center gap-12 animate-marquee whitespace-nowrap min-w-full">
                  {[...SKILLS_LIST, ...SKILLS_LIST].map((skill, index) => (
                    <div
                      key={`${skill.name}-${index}`}
                      className="tech-chip flex items-center gap-2 px-6 py-2.5 rounded-xl font-mono text-sm text-primary"
                    >
                      <SkillLogo name={skill.name} />
                      {skill.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Categorized Skills Grid */}
              <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                {/* Front-End */}
                <div className="glass-card p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2.5 text-accent-cyan font-medium uppercase text-sm border-b border-surface pb-3">
                    <Code2 className="h-4 w-4" /> {t("skills.frontend")}
                  </div>
                  <ul className="space-y-2 text-secondary text-sm">
                    {SKILL_GROUPS.frontend.map((skill) => (
                      <li key={skill} className="flex items-center gap-2 text-primary">
                        <SkillLogo name={skill} />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Back-End */}
                <div className="glass-card p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2.5 text-accent-purple font-medium uppercase text-sm border-b border-surface pb-3">
                    <Terminal className="h-4 w-4" /> {t("skills.backend")}
                  </div>
                  <ul className="space-y-2 text-secondary text-sm">
                    {SKILL_GROUPS.backend.map((skill) => (
                      <li key={skill} className="flex items-center gap-2 text-primary">
                        <SkillLogo name={skill} />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Databases & Devops */}
                <div className="glass-card p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2.5 text-accent-emerald font-medium uppercase text-sm border-b border-surface pb-3">
                    <Database className="h-4 w-4" /> {t("skills.cloud")}
                  </div>
                  <ul className="space-y-2 text-secondary text-sm">
                    {SKILL_GROUPS.cloud.map((skill) => (
                      <li key={skill} className="flex items-center gap-2 text-primary">
                        <SkillLogo name={skill} />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* 6. Contact Section */}
            <section id="contact" className="section-panel py-24 px-4 border-t border-surface">
              <div className="max-w-4xl mx-auto">
                <div className="text-center space-y-2 mb-12">
                  <span className="text-accent-cyan font-medium uppercase text-xs">
                    {t("contact.label")}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-semibold text-primary">
                    {t("contact.title")}
                  </h2>
                  <p className="text-secondary text-sm sm:text-base max-w-md mx-auto">
                    {t("contact.subtitle")}
                  </p>
                </div>

                {/* Form layout */}
                <div className="glass-card p-8 rounded-2xl border border-surface shadow-2xl relative">
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    {/* Form Notifications */}
                    {formError && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                        {formError}
                      </div>
                    )}
                    
                    {formSuccess && (
                      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-accent-emerald text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="h-4.5 w-4.5" /> {t("contact.success")}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-xs font-medium uppercase text-secondary">
                          {t("contact.yourName")}
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          placeholder={t("contact.placeholder.name")}
                          className="w-full bg-surface border-2 border-surface focus:border-accent-cyan/70 rounded-xl px-4 py-3 text-sm text-primary font-normal focus:outline-none transition-all shadow-[0_0_24px_rgba(6,182,212,0.05)]"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="text-xs font-medium uppercase text-secondary">
                          {t("contact.email")}
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          placeholder={t("contact.placeholder.email")}
                          className="w-full bg-surface border-2 border-surface focus:border-accent-cyan/70 rounded-xl px-4 py-3 text-sm text-primary font-normal focus:outline-none transition-all shadow-[0_0_24px_rgba(6,182,212,0.05)]"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-xs font-medium uppercase text-secondary">
                        {t("contact.message")}
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        placeholder={t("contact.placeholder.message")}
                        className="w-full bg-surface border-2 border-surface focus:border-accent-cyan/70 rounded-xl p-4 text-sm text-primary font-normal focus:outline-none transition-all resize-none shadow-[0_0_24px_rgba(6,182,212,0.05)]"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className={`w-full py-4 font-bold uppercase rounded-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:hover:scale-100 ${
                        theme === "dark"
                          ? "bg-cyan-500 hover:bg-cyan-400 text-white shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                          : "bg-slate-800 hover:bg-cyan-500 text-white shadow-md hover:shadow-cyan-500/50"
                      }`}
                    >
                      {formSubmitting ? (
                        <>{t("contact.sending")}</>
                      ) : (
                        <>
                          {t("contact.send")} <Send className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </section>
          </main>
          <Footer />
          <AnimatePresence>
            {selectedProject && (
              <ProjectModal
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
