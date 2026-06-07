"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, Globe, Sun, Moon } from "lucide-react";
import { useLang } from "./LangContext";
import { useTheme } from "./ThemeContext";

const NAV_KEYS = [
  { labelKey: "nav.home", id: "home" },
  { labelKey: "nav.business", id: "business" },
  { labelKey: "nav.about", id: "about" },
  { labelKey: "nav.projects", id: "projects" },
  { labelKey: "nav.skills", id: "skills" },
  { labelKey: "nav.contact", id: "contact" },
];

export default function Navbar() {
  const { lang, toggleLang, t } = useLang();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("home");
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      const sections = NAV_KEYS.map((item) => ({
        id: item.id,
        offset: document.getElementById(item.id)?.offsetTop || 0,
      }));
      
      const scrollPosition = window.scrollY + 120; // Improved trigger offset

      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollPosition >= sections[i].offset) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "py-3 px-4 md:px-8" : "py-6 px-4 md:px-8"
        }`}
      >
        <div
          className={`mx-auto max-w-7xl transition-all duration-300 rounded-xl md:rounded-full ${
            scrolled
              ? "glass-navbar px-4 md:px-8 py-3 shadow-lg"
              : "bg-transparent px-4 py-3"
          } flex items-center justify-between`}
        >
          {/* Logo */}
          <div
            onClick={() => handleScrollTo("home")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="h-10 w-10 rounded-full border-2 border-cyan-500/50 p-0.5 shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:scale-110 group-hover:border-cyan-400 transition-all duration-300 overflow-hidden">
              <img 
                src="/profile.jpg" 
                alt="AF" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="font-semibold text-lg text-inherit hidden sm:inline-block">
              ARYA FAWWAZ
            </span>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-1 bg-surface rounded-full p-1.5 border border-surface shadow-[0_12px_40px_rgba(0,0,0,0.18),0_0_30px_rgba(6,182,212,0.08)] backdrop-blur-xl">
            {NAV_KEYS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleScrollTo(item.id)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                  activeSection === item.id
                    ? "text-inherit"
                    : "text-secondary hover:text-inherit"
                }`}
              >
                {activeSection === item.id && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-accent/10 border border-accent/30 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {t(item.labelKey)}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-full bg-surface border border-surface transition-all cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:scale-110 ${
                theme === "dark" 
                  ? "text-cyan-100 hover:text-cyan-400 hover:border-cyan-400" 
                  : "text-slate-600 hover:text-cyan-600 hover:border-cyan-600 bg-white/50"
              }`}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className={`px-3 py-2 text-xs font-bold uppercase rounded-full bg-surface border border-surface transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:scale-105 ${
                theme === "dark"
                  ? "text-cyan-100 hover:text-cyan-400 hover:border-cyan-400"
                  : "text-slate-600 hover:text-cyan-600 hover:border-cyan-600 bg-white/50"
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              {lang === "en" ? "ID" : "EN"}
            </button>

            {/* Contact button */}
            <button
              onClick={() => handleScrollTo("contact")}
              className={`px-5 py-2.5 text-xs font-bold uppercase rounded-full hover:scale-105 flex items-center gap-1 cursor-pointer transition-all duration-300 ${
                theme === "dark"
                  ? "bg-cyan-500 text-white hover:bg-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.5)]"
                  : "bg-slate-800 text-white hover:bg-cyan-500 shadow-md hover:shadow-cyan-500/50"
              }`}
            >
              {t("nav.hireMe")} <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl bg-surface text-inherit hover:bg-surface-hover transition-colors border border-surface cursor-pointer"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[60] md:hidden bg-background/95 backdrop-blur-3xl flex flex-col p-8 pt-24"
          >
            {/* Close Button Inside Overlay */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 p-3 rounded-full bg-surface border border-surface shadow-xl"
            >
              <X className="h-6 w-6 text-primary" />
            </button>

            <div className="flex flex-col gap-6 overflow-y-auto pb-12">
              <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em] mb-2">Navigation.Menu</span>
              {NAV_KEYS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleScrollTo(item.id)}
                  className={`text-left py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-between group ${
                    activeSection === item.id
                      ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-500"
                      : "text-secondary hover:text-primary"
                  }`}
                >
                  <span className="text-2xl font-bold tracking-tight">{t(item.labelKey)}</span>
                  <ArrowUpRight className={`h-5 w-5 transition-transform duration-300 ${activeSection === item.id ? "opacity-100 scale-100" : "opacity-0 scale-50"}`} />
                </button>
              ))}
            </div>

            <div className="mt-auto space-y-6">
               <div className="flex gap-4">
                 <button
                   onClick={toggleTheme}
                   className="flex-1 py-4 bg-surface border border-surface rounded-2xl flex items-center justify-center gap-3 font-bold text-sm shadow-sm"
                 >
                   {theme === "dark" ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-600" />}
                   {theme === "dark" ? "Bright Mode" : "Dark Mode"}
                 </button>
                 <button
                   onClick={toggleLang}
                   className="flex-1 py-4 bg-surface border border-surface rounded-2xl flex items-center justify-center gap-3 font-bold text-sm shadow-sm"
                 >
                   <Globe size={20} className="text-cyan-500" />
                   {lang === "en" ? "Bahasa ID" : "English EN"}
                 </button>
               </div>
               
               <button
                 onClick={() => handleScrollTo("contact")}
                 className="w-full py-5 bg-cyan-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(6,182,212,0.3)]"
               >
                 {t("nav.hireMe")} <ArrowUpRight className="h-5 w-5" />
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
