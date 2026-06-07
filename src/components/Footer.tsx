"use client";

import React from "react";
import { Mail } from "lucide-react";
import { useLang } from "./LangContext";
import { useTheme } from "./ThemeContext";

export default function Footer() {
  const { t } = useLang();
  const { theme } = useTheme();

  const footerLinks = [
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.projects"), href: "#projects" },
    { label: t("nav.skills"), href: "#skills" },
    { label: t("nav.contact"), href: "#contact" },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
      )
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect x="2" y="9" width="4" height="12"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      )
    },
    {
      name: "Twitter",
      href: "https://twitter.com",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
        </svg>
      )
    },
    { name: "Email", href: "mailto:hello@example.com", icon: <Mail className="h-5 w-5" /> },
  ];

  return (
    <footer className="relative border-t border-surface py-16 overflow-hidden bg-inherit/40">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-accent-cyan/40 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-4 relative z-10">
        <div className="footer-panel">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 p-6 sm:p-8">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 flex items-center justify-center font-semibold text-white text-sm shadow-[0_0_22px_rgba(59,130,246,0.30)]">
                  AF
                </div>
                <div>
                  <p className="font-semibold text-base text-primary">Arya Fawwaz Septyan</p>
                  <p className="text-secondary text-xs uppercase">{t("footer.builtWith")}</p>
                </div>
              </div>

              <p className="max-w-xl text-secondary text-sm leading-relaxed">
                {t("footer.statement")}
              </p>
            </div>

            <div className="footer-link-panel">
              <span className="text-secondary text-xs uppercase">{t("footer.navigation")}</span>
              <div className="grid grid-cols-2 gap-2">
                {footerLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="footer-link"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="text-secondary text-xs text-center md:text-left font-normal">
              &copy; {new Date().getFullYear()} Arya Fawwaz Septyan. {t("footer.copyright")}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <span className="footer-status">{t("footer.available")}</span>
              <div className="flex items-center gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`h-10 w-10 rounded-xl bg-surface flex items-center justify-center border hover:scale-110 transition-all duration-300 ${
                      theme === "dark" 
                        ? "text-cyan-200 border-cyan-500/40 hover:border-cyan-400 hover:text-white hover:bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]" 
                        : "text-slate-600 border-slate-300 hover:border-cyan-500 hover:text-white hover:bg-cyan-500 bg-white shadow-sm hover:shadow-md hover:shadow-cyan-500/40"
                    }`}
                    aria-label={link.name}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
