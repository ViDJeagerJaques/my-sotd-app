"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";

// --- KABEL DATABASE ---
import { perfumeDB } from "../data/perfumeDB"; 
import { perfumeDB1 } from "../data/mykonos"; 
import { perfumeDB2 } from "../data/lv";


export default function BrutalistSOTDpamungkas() {
  // ==========================================
  // --- STATES & REFS ---
  // ==========================================
  const [closet, setCloset] = useState<any[]>(Array(12).fill(null));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState("Indoor AC");
  
  // Weather & Location
  const [weather, setWeather] = useState<"Panas" | "Dingin" | null>(null);
  const [actualTemp, setActualTemp] = useState<number | null>(null);
  const [location, setLocation] = useState("Ketuk untuk akses lokasi & cuaca");
  const [isLocating, setIsLocating] = useState(false);

  // Engine
  const [isGenerated, setIsGenerated] = useState(false);
  const [mainRec, setMainRec] = useState<any>(null);
  const [altRecs, setAltRecs] = useState<any[]>([]);

  // --- DAILY TRACKER (JOURNAL) ---
  const [journal, setJournal] = useState<any[]>([]);

  // Misc
  const [searchQuery, setSearchQuery] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  
  // --- NEW: PASSWORD VISIBILITY STATE ---
  const [showPassword, setShowPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customImg, setCustomImg] = useState<string | null>(null);
  const [customBrand, setCustomBrand] = useState("");
  const [customName, setCustomName] = useState("");

  // ==========================================
  // --- EFFECTS ---
  // ==========================================
  useEffect(() => {
    const loggedInUser = localStorage.getItem("sotd_user");
    if (loggedInUser) setUser(loggedInUser);
    
    const savedJournal = localStorage.getItem("sotd_journal");
    if (savedJournal) setJournal(JSON.parse(savedJournal));
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // ==========================================
  // --- LOGIC FUNCTIONS ---
  // ==========================================
  
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (authEmail && authPassword) {
      const username = authEmail.split("@")[0]; 
      setUser(username);
      localStorage.setItem("sotd_user", username);
      setShowAuthModal(false);
      setAuthEmail(""); setAuthPassword("");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("sotd_user");
  };

  const handleGetLocation = () => {
    setIsLocating(true);
    setLocation("Mencari sinyal satelit...");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`);
            const geoData = await geoRes.json();
            const city = geoData.city || geoData.locality || "Kota Diketahui";
            const country = geoData.countryName || "";
            
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
            const weatherData = await weatherRes.json();
            const currentTemp = Math.round(weatherData.current_weather.temperature);
            
            setLocation(`${city}, ${country}`);
            setActualTemp(currentTemp);
            setWeather(currentTemp >= 26 ? "Panas" : "Dingin");
          } catch (error) {
            setLocation("Gagal memuat data");
          } finally {
            setIsLocating(false);
          }
        },
        () => {
          setLocation("Akses lokasi ditolak pengguna");
          setIsLocating(false);
        }
      );
    } else {
      setLocation("Geolokasi tidak didukung");
      setIsLocating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCustomImg(URL.createObjectURL(file));
  };

  const submitCustomPerfume = () => {
    if (customImg && customBrand && customName) {
      const newPerfume = { id: Date.now(), brand: customBrand, name: customName, img: customImg, spl: 4, weather: "Versatile", activity: "Indoor AC", notes: "Personal Archive" };
      addToCloset(newPerfume);
    }
  };

  const addToCloset = (perfume: any) => {
    const nextEmptyIndex = closet.findIndex((item) => item === null);
    if (nextEmptyIndex !== -1) {
      const newCloset = [...closet];
      newCloset[nextEmptyIndex] = perfume;
      setCloset(newCloset);
    }
    setIsModalOpen(false);
    setSearchQuery("");
    setCustomImg(null); setCustomBrand(""); setCustomName("");
  };

  const removeFromCloset = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation(); 
    const newCloset = [...closet];
    newCloset[idx] = null;
    setCloset(newCloset);
  };

  const generateSOTD = () => {
    const availablePerfumes = closet.filter(item => item !== null);
    if (availablePerfumes.length === 0) {
      alert("Vault lu kosong, Bos!");
      return;
    }

    const currentActiveWeather = weather || "Panas";
    let matches = availablePerfumes.filter(p => p.weather === currentActiveWeather || p.weather === "Versatile");
    if (matches.length === 0) matches = [...availablePerfumes];

    const shuffled = [...matches].sort(() => 0.5 - Math.random());

    setMainRec(shuffled[0]);
    setAltRecs(shuffled.slice(1, 4)); 
    setIsGenerated(true);
  };

  const logToJournal = () => {
    if (!mainRec) return;
    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    const newLog = {
      id: Date.now(),
      date: today,
      perfume: mainRec,
      weather: actualTemp !== null ? `${actualTemp}°C - ${weather}` : weather,
      activity: selectedActivity,
      sprays: mainRec.spl >= 4 ? "4-5x Sprays" : "6-8x Sprays"
    };

    const updatedJournal = [newLog, ...journal];
    setJournal(updatedJournal);
    localStorage.setItem("sotd_journal", JSON.stringify(updatedJournal));
    alert("SOTD berhasil disimpan ke Tracker harian lu!");
  };

  const filteredSearch = useMemo(() => {
    const gabunganDB = [...perfumeDB, ...perfumeDB1, ...perfumeDB2]; 
    if (!searchQuery) return gabunganDB;
    
    return gabunganDB.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // ==========================================
  // --- RENDER ---
  // ==========================================
  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 scroll-smooth ${isDark ? 'bg-[#0a0a0a] text-[#fafafa] selection:bg-[#fafafa] selection:text-[#0a0a0a]' : 'bg-[#fafafa] text-[#111111] selection:bg-[#111111] selection:text-white'}`}>
      
      {/* NAVIGATION */}
      <nav className={`fixed top-0 w-full z-40 backdrop-blur-md border-b transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a]/80 border-[#333333]' : 'bg-white/80 border-gray-200'}`}>
        <div className="max-w-screen-2xl mx-auto px-6 h-20 flex items-center justify-between">
          <span className="text-[10px] tracking-[0.4em] font-bold uppercase">SOTD.STUDIO</span>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex gap-8 mr-4">
              {["beranda", "vault", "stylist", "tracker"].map((item) => (
                <a key={item} href={`#${item}`} className="text-[10px] tracking-[0.3em] uppercase font-bold hover:line-through transition-all">{item}</a>
              ))}
            </div>
            <button onClick={() => setIsDark(!isDark)} className={`w-12 h-6 rounded-full border relative flex items-center px-1 transition-colors duration-300 ${isDark ? 'border-[#333333]' : 'border-gray-200'}`}>
              <div className={`w-4 h-4 rounded-full transition-all duration-300 ${isDark ? 'translate-x-6 bg-[#fafafa]' : 'bg-[#111111]'}`}></div>
            </button>
            {user ? (
              <div className={`flex items-center gap-4 border-l pl-4 ${isDark ? 'border-[#333333]' : 'border-gray-400'}`}>
                {/* --- BAGIAN INI DIBIKIN CAPSLOCK LAGI --- */}
                <span className={`text-[10px] tracking-widest uppercase font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>HI, {user}</span>
                <button onClick={handleLogout} className="text-[10px] uppercase font-bold text-red-500 hover:line-through">Logout</button>
              </div>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className={`text-[10px] uppercase font-bold tracking-[0.2em] px-4 py-2 border transition-all duration-300 ${isDark ? 'border-[#fafafa] hover:bg-[#fafafa] hover:text-[#0a0a0a]' : 'border-[#111111] hover:bg-[#111111] hover:text-white'}`}>Login</button>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="beranda" className={`min-h-screen flex flex-col pt-32 px-6 border-b justify-end pb-24 transition-colors duration-500 ${isDark ? 'border-[#333333]' : 'border-gray-200'}`}>
        <div className="max-w-screen-2xl mx-auto w-full">
          <p className={`text-[10px] tracking-[0.5em] uppercase font-bold mb-8 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>00 — INTRODUCTION</p>
          <h1 className="text-[12vw] font-medium tracking-tighter leading-[0.85] mb-20 uppercase transition-colors duration-500">Digital <br /> Fragrance <br /> Concierge.</h1>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <p className={`max-w-md text-xl font-light leading-relaxed transition-colors duration-500 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Curate your collection. Contextualize your day. Arrive at the perfect olfactory conclusion based on your local environment.</p>
            <a href="#vault" className={`px-12 py-5 border text-[10px] uppercase font-bold tracking-widest transition-all duration-500 hover:scale-105 ${isDark ? 'border-[#fafafa] hover:bg-[#fafafa] hover:text-[#0a0a0a]' : 'border-[#111111] hover:bg-[#111111] hover:text-white'}`}>Open The Vault</a>
          </div>
        </div>
      </section>

      <main className="max-w-screen-2xl mx-auto px-6">
        
        {/* THE VAULT */}
        <section id="vault" className={`py-32 grid grid-cols-1 md:grid-cols-12 gap-12 border-b transition-colors duration-500 ${isDark ? 'border-[#333333]' : 'border-gray-200'}`}>
          <div className="md:col-span-3">
            <span className={`text-[10px] tracking-[0.4em] uppercase font-bold sticky top-32 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>01 — PRIVATE VAULT</span>
          </div>
          <div className="md:col-span-9">
            <div className="mb-20">
              <h2 className="text-6xl md:text-8xl font-medium tracking-tighter leading-none mb-8 transition-colors duration-500">The Closet.</h2>
              <p className={`max-w-sm uppercase text-[10px] tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Select your archive to begin analysis.</p>
            </div>
            <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-0 border-t border-l transition-colors duration-500 ${isDark ? 'border-[#333333]' : 'border-gray-200'}`}>
              {closet.map((item, idx) => (
                <div key={`closet-${idx}`} onClick={() => !item && setIsModalOpen(true)} className={`aspect-[3/4] relative border-r border-b flex flex-col items-center justify-center cursor-pointer transition-colors duration-300 group overflow-hidden ${isDark ? 'border-[#333333] bg-[#121212] hover:bg-[#1a1a1a]' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                  {item ? (
                    <>
                      <img src={item.img} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" alt="" />
                      <button onClick={(e) => removeFromCloset(idx, e)} className={`absolute top-2 right-2 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 ${isDark ? 'bg-[#fafafa] text-[#0a0a0a]' : 'bg-[#111111] text-white'}`}><span className="text-xs font-bold">×</span></button>
                      <div className={`absolute bottom-0 left-0 right-0 p-4 backdrop-blur-sm border-t transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ${isDark ? 'bg-[#0a0a0a]/90 border-[#333333]' : 'bg-white/90 border-gray-100'}`}>
                        <p className={`text-[8px] uppercase font-bold tracking-widest ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{item.brand}</p>
                        <p className="text-[10px] font-bold uppercase truncate transition-colors duration-300">{item.name}</p>
                      </div>
                    </>
                  ) : (
                    <span className={`font-light text-4xl transition-colors duration-300 ${isDark ? 'text-[#333333] group-hover:text-[#fafafa]' : 'text-gray-200 group-hover:text-[#111111]'}`}>+</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STYLIST ENGINE */}
        <section id="stylist" className={`py-32 grid grid-cols-1 md:grid-cols-12 gap-12 border-b transition-colors duration-500 ${isDark ? 'border-[#333333]' : 'border-gray-200'}`}>
          <div className="md:col-span-3">
            <span className={`text-[10px] tracking-[0.4em] uppercase font-bold sticky top-32 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>02 — STYLIST ENGINE</span>
          </div>
          <div className="md:col-span-9 space-y-16">
            <div className="mb-20">
              <h2 className="text-6xl md:text-8xl font-medium tracking-tighter leading-none mb-8 transition-colors duration-500">Generate your SOTD</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              {/* KIRI: CONTROL PANEL */}
              <div className="space-y-16">
                <div className={`border p-8 transition-colors duration-500 shadow-sm ${isDark ? 'border-[#333333] bg-[#121212]' : 'border-gray-200 bg-white'}`}>
                  <span className={`text-[10px] tracking-widest uppercase font-bold block mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Environment Setup</span>
                  <div onClick={handleGetLocation} className={`flex items-center gap-2 mb-6 p-3 -ml-3 rounded cursor-pointer transition-colors border border-transparent ${isDark ? 'hover:border-[#333333] hover:bg-[#1a1a1a]' : 'hover:border-gray-200 hover:bg-gray-50'}`}>
                    <svg className={`w-5 h-5 ${isLocating ? 'animate-bounce' : ''} ${isDark ? 'fill-gray-400' : 'fill-gray-500'}`} viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    <p className={`text-[12px] uppercase font-bold tracking-widest ${actualTemp === null ? (isDark ? 'text-gray-400' : 'text-[#111111]') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}>{location}</p>
                  </div>
                  <div className={`flex items-center gap-8 border-t border-b py-8 mb-6 transition-colors duration-500 ${isDark ? 'border-[#333333]' : 'border-gray-100'}`}>
                    <div className={`w-16 h-16 rounded-full border flex items-center justify-center shrink-0 ${isDark ? 'border-[#333333]' : 'border-gray-100'}`}>
                      <svg className={`w-8 h-8 opacity-20 ${isDark ? 'fill-[#fafafa]' : 'fill-[#111111]'}`} viewBox="0 0 100 100">
                        {weather === "Panas" ? <path d="M50 20a30 30 0 110 60 30 30 0 010-60zM50 0v10M50 90v10M0 50h10M90 50h10M14 14l7 7M79 79l7 7M14 86l7-7M79 21l7-7" stroke="currentColor" strokeWidth="5"/> : <path d="M70 50a30 30 0 01-60 0 30 30 0 1160 0zm-5 25v10m-10-10v10m-10-10v10m25-25v-10m-10 10v-10M50 0v10" stroke="currentColor" strokeWidth="5"/>}
                      </svg>
                    </div>
                    <div>
                      <p className={`text-[10px] uppercase font-bold mb-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{actualTemp !== null ? 'Cuaca Saat Ini' : 'Simulasi Cuaca'}</p>
                      <button onClick={() => setWeather(weather === "Panas" ? "Dingin" : "Panas")} className="text-4xl md:text-5xl font-light transition-all duration-300 hover:line-through">{actualTemp !== null ? `${weather === "Panas" ? "Sunny" : "Sejuk"} / ${actualTemp}°C` : "Menunggu Data..."}</button>
                    </div>
                  </div>
                  <div className={`flex justify-between items-center transition-opacity duration-300 ${actualTemp !== null ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                    <span className={`text-[10px] uppercase font-bold ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>MANUAL OVERRIDE</span>
                    <button onClick={() => setWeather(weather === "Panas" ? "Dingin" : "Panas")} className={`w-12 h-6 rounded-full border relative flex items-center px-1 transition-colors duration-300 ${isDark ? 'border-[#333333]' : 'border-gray-200'}`}>
                      <div className={`w-4 h-4 rounded-full transition-all duration-300 ${weather === "Dingin" ? 'translate-x-6 bg-[#fafafa]' : 'bg-[#111111]'}`}></div>
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <span className={`text-[10px] tracking-widest uppercase font-bold ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Activity</span>
                  <div className="grid grid-cols-3 gap-6">
                    {["Indoor AC", "Indoor Non-AC", "Outdoor"].map((act) => (
                      <button key={`act-${act}`} onClick={() => setSelectedActivity(act)} className={`border p-6 group transition-all duration-300 text-left ${isDark ? 'bg-[#121212]' : 'bg-white'} ${selectedActivity === act ? (isDark ? 'border-[#fafafa] border-4' : 'border-[#111111] border-4') : (isDark ? 'border-[#333333] hover:bg-[#1a1a1a]' : 'border-gray-200 hover:bg-gray-50')}`}>
                        <div className={`w-12 h-12 rounded-full border flex items-center justify-center mb-4 transition-all duration-300 ${selectedActivity === act ? (isDark ? 'border-[#fafafa]' : 'border-[#111111]') : (isDark ? 'border-[#333333] group-hover:border-[#fafafa]' : 'border-gray-100 group-hover:border-[#111111]')}`}>
                          <svg className={`w-6 h-6 transition-colors duration-300 ${selectedActivity === act ? (isDark ? 'fill-[#fafafa]' : 'fill-[#111111]') : (isDark ? 'fill-gray-700 group-hover:fill-[#fafafa]' : 'fill-gray-300 group-hover:fill-[#111111]')}`} viewBox="0 0 100 100">
                            {act === "Indoor AC" ? <path d="M50 0 L100 100 L0 100 Z"/> : act === "Indoor Non-AC" ? <circle cx="50" cy="50" r="40"/> : <rect x="10" y="10" width="80" height="80"/>}
                          </svg>
                        </div>
                        <p className={`text-[10px] uppercase font-bold tracking-[0.1em] transition-colors duration-300 ${selectedActivity === act ? (isDark ? 'text-[#fafafa]' : 'text-[#111111]') : (isDark ? 'text-gray-600 group-hover:text-[#fafafa]' : 'text-gray-400 group-hover:text-[#111111]')}`}>{act}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={generateSOTD} className={`w-full py-8 text-[10px] uppercase font-bold tracking-[0.4em] transition-all duration-500 hover:scale-105 shadow-sm ${isDark ? 'bg-[#fafafa] text-[#0a0a0a] hover:bg-gray-300' : 'bg-[#111111] text-white hover:bg-gray-800'}`}>Make your SOTD</button>
              </div>

              {/* KANAN: RESULTS */}
              <div className={`transition-all duration-700 ${isGenerated && mainRec ? 'opacity-100' : 'opacity-0'}`}>
                {isGenerated && mainRec && (
                  <div className={`border p-12 transition-colors duration-500 shadow-sm flex flex-col gap-12 ${isDark ? 'border-[#333333] bg-[#121212]' : 'border-gray-200 bg-white'}`}>
                    
                    <div className="text-center">
                      <span className={`text-[10px] tracking-widest uppercase font-bold block mb-8 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Your Perfume Recommendation Today</span>
                      <img src={mainRec.img} className={`w-40 h-56 object-cover border transition-all duration-300 shadow-lg inline-block ${isDark ? 'border-[#333333] bg-[#0a0a0a]' : 'border-gray-200 bg-white'}`} alt="" />
                      <h3 className="text-5xl font-medium tracking-tighter leading-none mt-8 uppercase transition-colors duration-500">{mainRec.name}</h3>
                      <p className={`text-xs tracking-[0.4em] uppercase font-bold mt-2 transition-colors duration-500 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>House of {mainRec.brand}</p>
                      
                      {mainRec.topNotes && (
                        <div className="mt-6 pt-4 border-t border-dashed border-gray-200 dark:border-[#333333]">
                           <span className={`text-[8px] uppercase font-bold block mb-1 tracking-[0.2em] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Top Notes</span>
                           <p className={`text-[11px] italic font-serif leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{mainRec.topNotes}</p>
                        </div>
                      )}
                    </div>

                    {altRecs.length > 0 && (
                      <div className="space-y-6 pt-8 border-t transition-colors duration-500 border-gray-100 dark:border-[#333333]">
                        <span className={`text-[10px] tracking-widest uppercase font-bold block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Alternatives</span>
                        <div className="grid grid-cols-1 gap-4">
                          {altRecs.map((item, idx) => (
                            <div key={`alt-${idx}`} className={`border p-4 transition-colors duration-500 flex items-center gap-4 ${isDark ? 'border-[#333333] bg-[#0a0a0a]' : 'border-gray-100 bg-white'}`}>
                              <img src={item.img} alt={item.name} className={`w-12 h-16 object-cover border bg-white shadow-sm shrink-0 ${isDark ? 'border-[#333333]' : 'border-gray-200'}`} />
                              <div>
                                <p className={`text-[8px] uppercase font-bold tracking-widest ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{item.brand}</p>
                                <p className="text-[12px] font-bold uppercase truncate transition-colors duration-300">{item.name}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-6 border-t pt-8 transition-colors duration-500 border-gray-100 dark:border-[#333333]">
                      <span className={`text-[10px] tracking-widest uppercase font-bold block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Application Guide (Cruts)</span>
                      <div className="flex items-start gap-8">
                        <div className={`w-32 h-48 border relative flex items-center justify-center transition-colors duration-500 shrink-0 ${isDark ? 'border-[#333333] bg-[#0a0a0a]' : 'border-gray-200 bg-white'}`}>
                          <svg className={`w-20 h-auto opacity-10 ${isDark ? 'fill-[#fafafa]' : 'fill-[#111111]'}`} viewBox="0 0 200 300">
                            <path d="M100,20 C115,20 125,30 125,50 C125,70 115,85 100,85 C85,85 75,70 75,50 C75,30 85,20 100,20 M100,85 C120,85 150,95 160,120 L165,220 C165,220 150,225 145,220 L140,140 L130,280 L70,280 L60,140 L55,220 C50,225 35,220 35,220 L40,120 C50,95 80,85 100,85 Z" />
                          </svg>
                          <div className={`absolute top-[22%] left-[44%] w-1.5 h-1.5 rounded-full animate-ping ${isDark ? 'bg-[#fafafa]' : 'bg-[#111111]'}`}></div>
                          <div className={`absolute top-[22%] left-[53%] w-1.5 h-1.5 rounded-full animate-ping delay-150 ${isDark ? 'bg-[#fafafa]' : 'bg-[#111111]'}`}></div>
                          <div className={`absolute top-[38%] left-[48%] w-1.5 h-1.5 rounded-full animate-ping delay-300 ${isDark ? 'bg-[#fafafa]' : 'bg-[#111111]'}`}></div>
                        </div>
                        <p className={`text-sm font-light leading-relaxed transition-colors duration-500 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Berdasarkan profil parfum ini, gunakan <span className={`font-bold underline ${isDark ? 'text-[#fafafa]' : 'text-[#111111]'}`}>4-5x crut</span> aja biar wanginya maksimal. Fokus pada area anterior leher dan dada. Pilihan yang sangat ideal untuk cuaca <span className={`font-bold ${isDark ? 'text-[#fafafa]' : 'text-[#111111]'}`}>{mainRec.weather}</span> di lingkungan {selectedActivity.toLowerCase()}.
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 border-t pt-8 transition-colors duration-500 border-gray-100 dark:border-[#333333]">
                      <button onClick={logToJournal} className={`w-full py-4 text-[10px] uppercase font-bold tracking-widest border transition-all duration-500 hover:scale-105 flex items-center justify-center gap-2 ${isDark ? 'border-[#fafafa] hover:bg-[#fafafa] hover:text-[#0a0a0a]' : 'border-[#111111] hover:bg-[#111111] hover:text-white'}`}>
                        <span>+</span> LOG AS TODAY'S SOTD
                      </button>
                    </div>

                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* --- TRACKER --- */}
        <section id="tracker" className="py-32 grid grid-cols-1 md:grid-cols-12 gap-12 pb-64">
          <div className="md:col-span-3">
            <span className={`text-[10px] tracking-[0.4em] uppercase font-bold sticky top-32 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>03 — DAILY TRACKER</span>
          </div>
          
          <div className="md:col-span-9">
            <div className="mb-20">
              <h2 className="text-6xl md:text-8xl font-medium tracking-tighter leading-none mb-8 transition-colors duration-500">SOTD Journal.</h2>
              <p className={`max-w-sm uppercase text-[10px] tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Your personal olfactory footprint.</p>
            </div>

            {journal.length === 0 ? (
               <div className={`p-16 border text-center ${isDark ? 'border-[#333333] bg-[#121212]' : 'border-gray-200 bg-white'}`}>
                 <p className={`text-2xl font-light mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No scent recorded yet.</p>
                 <p className={`text-[10px] uppercase font-bold tracking-widest ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Generate and log your SOTD above.</p>
               </div>
            ) : (
              <div className="space-y-6">
                {journal.map((log) => (
                  <div key={`journal-${log.id}`} className={`border p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 transition-colors duration-500 ${isDark ? 'border-[#333333] bg-[#121212] hover:bg-[#1a1a1a]' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                    
                    <div className="flex items-center gap-6">
                      <img src={log.perfume.img} alt={log.perfume.name} className={`w-16 h-24 object-cover border bg-white shadow-sm shrink-0 ${isDark ? 'border-[#333333]' : 'border-gray-200'}`} />
                      <div>
                        <p className={`text-[10px] uppercase font-bold tracking-widest mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{log.date}</p>
                        <h4 className="text-2xl font-medium leading-none mb-1">{log.perfume.name}</h4>
                        <p className={`text-[10px] uppercase font-bold tracking-widest ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{log.perfume.brand}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap gap-4">
                      <div className={`px-4 py-2 border rounded-full flex items-center gap-2 ${isDark ? 'border-[#333333] bg-[#0a0a0a]' : 'border-gray-200 bg-white'}`}>
                        <span className="text-xs">🌡️</span>
                        <span className="text-[10px] uppercase font-bold tracking-widest">{log.weather || "Panas"}</span>
                      </div>
                      <div className={`px-4 py-2 border rounded-full flex items-center gap-2 ${isDark ? 'border-[#333333] bg-[#0a0a0a]' : 'border-gray-200 bg-white'}`}>
                        <span className="text-xs">🏢</span>
                        <span className="text-[10px] uppercase font-bold tracking-widest">{log.activity}</span>
                      </div>
                      <div className={`px-4 py-2 border rounded-full flex items-center gap-2 ${isDark ? 'border-[#fafafa] text-[#fafafa]' : 'border-[#111111] text-[#111111]'}`}>
                        <span className="text-xs">💨</span>
                        <span className="text-[10px] uppercase font-bold tracking-widest">{log.sprays}</span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* --- AUTHENTICATION MODAL --- */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center">
          <div className={`absolute inset-0 backdrop-blur-sm transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a]/90' : 'bg-white/90'}`} onClick={() => setShowAuthModal(false)}></div>
          <div className={`relative w-full max-w-md border p-12 shadow-2xl transition-all duration-500 ${isDark ? 'bg-[#121212] border-[#333333]' : 'bg-white border-gray-200'}`}>
            <header className="flex justify-between items-start mb-12 shrink-0">
              <h3 className="text-3xl font-medium tracking-tighter uppercase transition-colors duration-500">{authMode === 'login' ? 'Sign In' : 'Register'}</h3>
              <button onClick={() => setShowAuthModal(false)} className="text-[10px] uppercase font-bold tracking-widest hover:line-through transition-colors duration-300">tutup</button>
            </header>
            <form onSubmit={handleAuth} className="space-y-8 flex-1">
              <input type="email" placeholder="EMAIL ADDRESS" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)}
                className={`w-full bg-transparent border-b pb-2 text-sm tracking-widest font-bold focus:outline-none transition-colors duration-500 ${isDark ? 'border-[#333333] focus:border-[#fafafa]' : 'border-gray-200 focus:border-[#111111]'}`} />
              
              {/* --- BAGIAN PASSWORD YANNG BISA DIINTIP --- */}
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="PASSWORD" required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)}
                  className={`w-full bg-transparent border-b pb-2 text-sm tracking-widest font-bold focus:outline-none transition-colors duration-500 ${isDark ? 'border-[#333333] focus:border-[#fafafa]' : 'border-gray-200 focus:border-[#111111]'}`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 bottom-2 text-[10px] font-bold opacity-40 hover:opacity-100 transition-opacity">
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>

              <button type="submit" className={`w-full py-4 text-[10px] uppercase font-bold tracking-widest border transition-all duration-500 hover:scale-105 ${isDark ? 'bg-[#fafafa] text-[#0a0a0a] border-[#fafafa] hover:bg-gray-300' : 'bg-[#111111] text-white border-[#111111] hover:bg-gray-800'}`}>
                {authMode === 'login' ? 'ENTER VAULT' : 'CREATE ACCOUNT'}
              </button>
            </form>
            <p className={`text-center mt-8 text-[10px] uppercase tracking-widest font-bold cursor-pointer hover:line-through transition-colors duration-500 shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
              {authMode === 'login' ? 'NO ACCOUNT? REGISTER HERE.' : 'HAVE ACCOUNT? SIGN IN.'}
            </p>
          </div>
        </div>
      )}

      {/* --- DISCOVERY / VAULT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className={`absolute inset-0 backdrop-blur-sm transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a]/90' : 'bg-white/90'}`} onClick={() => setIsModalOpen(false)}></div>
          <div className={`relative w-full max-w-2xl border p-12 shadow-2xl flex flex-col max-h-[90vh] transition-all duration-500 ${isDark ? 'bg-[#121212] border-[#333333]' : 'bg-white border-gray-200'}`}>
            <header className="flex justify-between items-start mb-8 shrink-0">
              <h3 className="text-4xl font-medium tracking-tighter uppercase transition-colors duration-500">Discovery</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-xs uppercase font-bold tracking-widest hover:line-through transition-colors duration-300">tutup</button>
            </header>
            
            <div className={`mb-8 border p-6 transition-colors duration-500 shrink-0 ${isDark ? 'border-[#333333] bg-[#0f0f0f]' : 'border-gray-200 bg-gray-50'}`}>
              <span className={`text-[10px] tracking-widest uppercase font-bold block mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Add Custom Archive</span>
              
              {!customImg ? (
                <>
                  <input type="file" accept="image/*" capture="environment" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                  <button onClick={() => fileInputRef.current?.click()} className={`w-full py-4 border text-[10px] uppercase font-bold tracking-widest transition-all duration-500 hover:scale-105 ${isDark ? 'border-[#fafafa] hover:bg-[#fafafa] hover:text-[#0a0a0a]' : 'border-[#111111] hover:bg-[#111111] hover:text-white'}`}>
                    + Upload / Take Photo
                  </button>
                </>
              ) : (
                <div className="flex gap-6 items-start">
                  <img src={customImg} alt="Preview" className={`w-24 h-24 object-cover border bg-white shadow-sm shrink-0 ${isDark ? 'border-[#333333]' : 'border-gray-200'}`} />
                  <div className="flex-1 space-y-4">
                    <input type="text" placeholder="Brand (e.g. Mykonos)" value={customBrand} onChange={(e) => setCustomBrand(e.target.value)} className={`w-full bg-transparent border-b pb-2 text-sm focus:outline-none transition-colors duration-500 ${isDark ? 'border-[#333333] focus:border-[#fafafa]' : 'border-gray-200 focus:border-[#111111]'}`} />
                    <input type="text" placeholder="Perfume Name (e.g. Monaco Royale)" value={customName} onChange={(e) => setCustomName(e.target.value)} className={`w-full bg-transparent border-b pb-2 text-sm focus:outline-none transition-colors duration-500 ${isDark ? 'border-[#333333] focus:border-[#fafafa]' : 'border-gray-200 focus:border-[#111111]'}`} />
                    <button onClick={submitCustomPerfume} disabled={!customBrand || !customName} className={`w-full py-3 text-[10px] uppercase font-bold transition-all duration-300 hover:scale-105 ${customBrand && customName ? (isDark ? 'bg-[#fafafa] text-[#0a0a0a] hover:bg-gray-300' : 'bg-[#111111] text-white hover:bg-gray-800') : 'bg-gray-500 text-gray-300'}`}>
                      Save to Vault
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center mb-6 shrink-0">
              <span className={`text-[10px] tracking-widest uppercase font-bold transition-colors duration-500 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>— OR SEARCH DATABASE —</span>
            </div>

            <input type="text" placeholder="Cari parfum..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full bg-transparent border-b pb-4 text-2xl font-light focus:outline-none mb-6 transition-colors duration-500 shrink-0 ${isDark ? 'border-[#333333] focus:border-[#fafafa]' : 'border-gray-200 focus:border-[#111111]'}`} />
            
            <div className="space-y-2 overflow-y-auto pr-4 flex-1">
              {filteredSearch.map((p, index) => (
                <div key={`search-${index}`} onClick={() => addToCloset(p)} className={`group py-4 border-b flex justify-between items-center px-4 transition-colors duration-300 cursor-pointer ${isDark ? 'border-[#333333] hover:bg-[#1a1a1a]' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-4">
                    <img src={p.img} alt={p.name} className={`w-10 h-14 object-cover border bg-white shadow-sm shrink-0 ${isDark ? 'border-[#333333]' : 'border-gray-200'}`} />
                    <div>
                      <p className="text-lg font-medium leading-none transition-colors duration-300">{p.name}</p>
                      <p className={`text-[10px] uppercase tracking-widest font-bold mt-1 transition-colors duration-500 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{p.brand}</p>
                      {p.topNotes && <p className={`text-[8px] uppercase mt-1 italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{p.topNotes}</p>}
                    </div>
                  </div>
                  <span className={`text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 border px-3 py-1 transition-all duration-500 hover:scale-105 ${isDark ? 'border-[#fafafa] group-hover:bg-[#fafafa] group-hover:text-[#0a0a0a]' : 'border-[#111111] group-hover:bg-[#111111] group-hover:text-white'}`}>+ ARCHIVE</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className={`p-12 border-t text-center transition-colors duration-500 ${isDark ? 'border-[#333333]' : 'border-gray-200'}`}>
        <span className={`text-[8px] tracking-[0.5em] uppercase ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
          © 2026 SOTD Studio — All Rights Reserved.
        </span>
      </footer>

    </div>
  );
}