"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type Lang = "en" | "id";

interface Translations {
  [key: string]: { en: string; id: string };
}

const translations: Translations = {
  // Navbar
  "nav.home": { en: "Home", id: "Beranda" },
  "nav.business": { en: "Partnership", id: "Mitra/Bisnis" },
  "nav.about": { en: "About", id: "Tentang Saya" },
  "nav.projects": { en: "Portfolio", id: "Proyek" },
  "nav.skills": { en: "Expertise", id: "Keahlian" },
  "nav.contact": { en: "Contact", id: "Kontak" },
  "nav.hireMe": { en: "Hire Me", id: "Hubungi Saya" },

  // Hero
  "hero.badge": { en: "Welcome to my digital space", id: "Selamat datang di ruang digital saya" },
  "hero.greeting": { en: "Hi, I am", id: "Halo, Saya" },
  "hero.role": { en: "Creative Developer", id: "Developer Kreatif" },
  "hero.subtitle": {
    en: "I build immersive, visually stunning 3D interfaces and high-performance full-stack web applications. Bridging design elegance with complex engineering.",
    id: "Saya membangun antarmuka 3D yang imersif dan menakjubkan secara visual serta aplikasi web full-stack berperforma tinggi. Menjembatani keindahan desain dengan rekayasa yang kompleks.",
  },
  "hero.explore": { en: "Explore Works", id: "Lihat Karya" },
  "hero.getInTouch": { en: "Get In Touch", id: "Hubungi Saya" },

  // About
  "about.label": { en: "Biography", id: "Biografi" },
  "about.title": { en: "Academic & Digital Journey", id: "Perjalanan Akademik & Digital" },
  "about.p1": {
    en: "I am Arya Fawwaz Septyan, a student at Gunadarma University majoring in Information Systems. I am passionate about exploring the world of technology and digital systems, focusing on building useful and efficient web applications.",
    id: "Saya adalah Arya Fawwaz Septyan, seorang mahasiswa di Universitas Gunadarma jurusan Sistem Informasi. Saya memiliki semangat tinggi untuk mengeksplorasi dunia teknologi dan sistem digital, dengan fokus pada pembangunan aplikasi web yang bermanfaat dan efisien.",
  },
  "about.p2": {
    en: "Currently, I am actively learning and developing my skills through various academic projects and independent explorations, aiming to bridge information management with modern web technology.",
    id: "Saat ini, saya aktif belajar dan mengembangkan kemampuan saya melalui berbagai proyek akademik dan eksplorasi mandiri, dengan tujuan menjembatani manajemen informasi dengan teknologi web modern.",
  },
  "about.downloadCV": { en: "Download Resume", id: "Unduh Resume" },
  "about.yearsExp": { en: "Undergraduate Student", id: "Mahasiswa Aktif" },
  "about.projectsBuilt": { en: "Projects Developed", id: "Proyek Dikembangkan" },
  "about.hoursCoding": { en: "Gunadarma University", id: "Universitas Gunadarma" },

  // Projects
  "projects.label": { en: "My Work", id: "Karya Saya" },
  "projects.title": { en: "Featured Engineered Projects", id: "Proyek Unggulan" },
  "projects.viewDetails": { en: "View Project Details", id: "Lihat Detail Proyek" },

  // Skills
  "skills.label": { en: "My Toolkit", id: "Perangkat Saya" },
  "skills.title": { en: "Languages, Frameworks & Tech", id: "Bahasa, Framework & Teknologi" },
  "skills.frontend": { en: "Front-End Web", id: "Front-End Web" },
  "skills.backend": { en: "Back-End Systems", id: "Sistem Back-End" },
  "skills.cloud": { en: "Cloud & Data", id: "Cloud & Data" },

  // Contact
  "contact.label": { en: "Start a Project", id: "Mulai Proyek" },
  "contact.title": { en: "Send a Message", id: "Kirim Pesan" },
  "contact.subtitle": {
    en: "Let's build something exceptional together. Drop me a note and I will get back to you within 24 hours.",
    id: "Mari bangun sesuatu yang luar biasa bersama. Kirim pesan dan saya akan merespons dalam 24 jam.",
  },
  "contact.yourName": { en: "Your Name", id: "Nama Anda" },
  "contact.email": { en: "Email Address", id: "Alamat Email" },
  "contact.message": { en: "Message Content", id: "Isi Pesan" },
  "contact.placeholder.name": { en: "Jane Doe", id: "Nama Lengkap" },
  "contact.placeholder.email": { en: "jane@example.com", id: "email@contoh.com" },
  "contact.placeholder.message": {
    en: "Tell me details about your upcoming project...",
    id: "Ceritakan detail tentang proyek Anda yang akan datang...",
  },
  "contact.send": { en: "Send Message", id: "Kirim Pesan" },
  "contact.sending": { en: "Sending...", id: "Mengirim..." },
  "contact.success": {
    en: "Message sent successfully! I will respond shortly.",
    id: "Pesan berhasil terkirim! Saya akan segera merespons.",
  },
  "contact.errorAll": { en: "Please fill out all fields.", id: "Harap isi semua kolom." },
  "contact.errorEmail": { en: "Please enter a valid email address.", id: "Harap masukkan alamat email yang valid." },

  // Footer
  "footer.builtWith": {
    en: "Creative Developer",
    id: "Developer Kreatif",
  },
  "footer.statement": {
    en: "A focused portfolio of selected digital products, interactive interfaces, and engineering work crafted for clarity, performance, and polished user experience.",
    id: "Portofolio pilihan berisi produk digital, antarmuka interaktif, dan karya engineering yang dirancang untuk kejelasan, performa, dan pengalaman pengguna yang matang.",
  },
  "footer.navigation": {
    en: "Navigation",
    id: "Navigasi",
  },
  "footer.available": {
    en: "Available for selected collaborations",
    id: "Terbuka untuk kolaborasi terpilih",
  },
  "footer.copyright": {
    en: "All rights reserved.",
    id: "Hak cipta dilindungi.",
  },

  // Business Section
  "business.label": { en: "Professional Venture", id: "Kemitraan Profesional" },
  "business.title": { en: "Technical Leadership", id: "Kepemimpinan Teknis" },
  "business.partnership": { en: "Official Partnership", id: "Kemitraan Resmi" },
  "business.desc": { 
    en: "Premium web development services at a global scale with a focus on digital innovation.", 
    id: "Layanan pengembangan web premium berskala global dengan fokus pada inovasi digital." 
  },
  "business.metrics.pos": { en: "Current Position", id: "Posisi Saat Ini" },
  "business.metrics.posVal": { en: "Head of IT Team", id: "Kepala Tim IT" },
  "business.metrics.posDetail": { en: "Strategic Direction", id: "Arahan Strategis" },
  "business.metrics.core": { en: "Service Core", id: "Inti Layanan" },
  "business.metrics.coreVal": { en: "Web Solutions", id: "Solusi Web" },
  "business.metrics.coreDetail": { en: "Enterprise Grade", id: "Kelas Perusahaan" },
  "business.metrics.status": { en: "Team Status", id: "Status Tim" },
  "business.metrics.statusVal": { en: "Operational", id: "Operasional" },
  "business.metrics.statusDetail": { en: "Full Capacity", id: "Kapasitas Penuh" },
  "business.metrics.scope": { en: "Market Scope", id: "Cakupan Pasar" },
  "business.metrics.scopeVal": { en: "Global Scale", id: "Skala Global" },
  "business.metrics.scopeDetail": { en: "Direct Sales", id: "Penjualan Langsung" },
  "business.status": { en: "Status: System Optimized", id: "Status: Sistem Teroptimasi" },
  "business.nodes": { en: "Active Nodes: 12", id: "Node Aktif: 12" },

  // About Extra
  "about.affiliation": { en: "Affiliation", id: "Afiliasi" },
  "about.dept": { en: "Department", id: "Jurusan" },
  "about.status": { en: "Status", id: "Status" },
  "about.accomplishments": { en: "Accomplishments", id: "Pencapaian" },
  "about.major": { en: "Information Systems", id: "Sistem Informasi" },
  "about.undergrad": { en: "Undergraduate", id: "Mahasiswa" },
  "about.coreProj": { en: "Core Projects", id: "Proyek Utama" },

  // Projects Extra
  "projects.featured": { en: "Featured Works", id: "Karya Unggulan" },
  "projects.featuredDesc": { 
    en: "A collection of selected digital systems built with high engineering standards and mature visual aesthetics.", 
    id: "Koleksi sistem digital pilihan yang dibangun dengan standar engineering tinggi dan estetika visual yang matang." 
  },
  "projects.metrics.selected": { en: "Selected", id: "Pilihan" },
  "projects.metrics.stack": { en: "Stack", id: "Teknologi" },
  "projects.metrics.engine": { en: "Engine", id: "Mesin" },
  "projects.metrics.status": { en: "Status", id: "Status" },
  "projects.metrics.active": { en: "Active", id: "Aktif" },

  // Loading
  "loading.text": { en: "LOADING", id: "MEMUAT" },
  "loading.welcome": { en: "Welcome to Portfolio", id: "Selamat Datang di Portofolio" },
  "loading.running": { en: "System Running...", id: "Loading Berjalan" },
};

interface LangContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextType>({
  lang: "en",
  toggleLang: () => {},
  t: (key: string) => key,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("id");

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "en" ? "id" : "en"));
  }, []);

  const t = useCallback(
    (key: string) => {
      const entry = translations[key];
      if (!entry) return key;
      return entry[lang];
    },
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
