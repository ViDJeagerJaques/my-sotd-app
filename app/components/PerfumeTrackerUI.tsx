'use client';

import React, { useState } from 'react';
import { MapPin, Sun, Check, X } from 'lucide-react';

export default function PerfumeTrackerUI() {
  const [selectedLocation, setSelectedLocation] = useState('INDOOR NON-AC');
  const [selectedActivity, setSelectedActivity] = useState('DATE');
  const [sprays, setSprays] = useState(6);
  const [skinCondition, setSkinCondition] = useState('MOISTURIZED');
  const [isLayered, setIsLayered] = useState(false);

  return (
    <div className="font-sans text-black max-w-7xl mx-auto p-4 md:p-8 bg-white min-h-screen flex flex-col">
      {/* 3 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        
        {/* LEFT COLUMN: ENVIRONMENT SETUP */}
        <div className="flex flex-col">
          <h2 className="text-xs font-bold tracking-widest text-gray-400 mb-6 uppercase">Environment Setup</h2>
          
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={18} strokeWidth={2} />
            <h3 className="font-semibold text-sm tracking-widest uppercase">Pekanbaru, Indonesia</h3>
            <div className="flex gap-2 ml-auto">
              <span className="text-[10px] font-bold border border-gray-300 px-2 py-1 text-gray-500">[ DRY PANAS ]</span>
              <span className="text-[10px] font-bold border border-gray-300 px-2 py-1 text-gray-500">[ DRY DINGIN ]</span>
            </div>
          </div>
          
          <div className="flex flex-col mb-8">
            <div className="flex items-center gap-3">
              <Sun size={32} strokeWidth={1.5} />
              <span className="text-3xl font-light tracking-tight">Sunny / 32°C</span>
            </div>
            <p className="text-xs font-bold text-red-600 mt-2 tracking-widest uppercase">[ WARNING: AVOID HEAVY OUD ]</p>
          </div>

          <div className="mb-6">
            <p className="text-[10px] font-bold tracking-widest text-gray-400 mb-3 uppercase">Layer 1: Location</p>
            <div className="flex flex-col gap-2">
              {['INDOOR AC', 'INDOOR NON-AC', 'OUTDOOR'].map((loc) => {
                const isActive = selectedLocation === loc;
                return (
                  <button
                    key={loc}
                    onClick={() => setSelectedLocation(loc)}
                    className={`text-left text-xs font-bold tracking-widest py-3 px-4 border ${isActive ? 'border-black text-black' : 'border-gray-200 text-gray-400'}`}
                  >
                    {isActive ? (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-black"></div>
                        {loc}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full border border-gray-300"></div>
                        {loc}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-8 flex-1">
            <p className="text-[10px] font-bold tracking-widest text-gray-400 mb-3 uppercase">Layer 2: Activity</p>
            <div className="grid grid-cols-2 gap-2">
              {['SPORT', 'GYM', 'DATE', 'FORMAL'].map((act) => {
                const isActive = selectedActivity === act;
                return (
                  <button
                    key={act}
                    onClick={() => setSelectedActivity(act)}
                    className={`flex items-center justify-between text-xs font-bold tracking-widest py-3 px-3 border ${isActive ? 'border-black text-black' : 'border-gray-200 text-gray-400'}`}
                  >
                    <span>{act}</span>
                    {isActive && <Check size={14} strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>

          <button className="w-full bg-black text-white text-xs font-bold tracking-[0.2em] uppercase py-4 mt-auto">
            MAKE YOUR SOTD
          </button>
        </div>

        {/* CENTER COLUMN: PERFUME RECOMMENDATION */}
        <div className="flex flex-col border-t lg:border-t-0 lg:border-l lg:border-r border-gray-200 pt-8 lg:pt-0 lg:px-8">
          <h2 className="text-xs font-bold tracking-widest text-gray-400 mb-6 uppercase">Your Perfume Recommendation Today</h2>
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-48 h-64 bg-gray-100 flex items-center justify-center mb-4">
              {/* Placeholder for Perfume Bottle */}
              <div className="text-gray-400 text-xs font-bold tracking-widest">[ BOTTLE ]</div>
            </div>
            <h3 className="text-3xl font-bold tracking-tight uppercase">REVERIE</h3>
            <p className="text-xs font-bold tracking-[0.3em] text-gray-500 uppercase mt-1">HOUSE OF KAHF</p>
            <div className="w-full border-t border-dotted border-gray-300 my-4"></div>
            <p className="text-xs tracking-widest text-gray-600 font-medium uppercase">TOP NOTES: Lemon, Bergamot</p>
          </div>

          <div className="mb-8">
            <p className="text-[10px] font-bold tracking-widest text-gray-400 mb-3 uppercase text-center">Alternatives</p>
            <div className="flex justify-center gap-4">
              <div className="flex flex-col items-center">
                <div className="w-16 h-20 bg-gray-100 flex items-center justify-center mb-2"></div>
                <span className="text-[9px] font-bold tracking-widest uppercase">ALPHA</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-20 bg-gray-100 flex items-center justify-center mb-2"></div>
                <span className="text-[9px] font-bold tracking-widest uppercase">TURATHI BLUE</span>
              </div>
            </div>
          </div>

          <div className="border-2 border-red-600 mb-8">
            <div className="bg-red-600 text-white text-[10px] font-bold tracking-widest uppercase p-2 text-center">
              CRITICAL WARNING: NOT RECOMMENDED FOR TODAY [TOO HEAVY]
            </div>
            <div className="p-4 flex flex-col items-center bg-red-50">
              <p className="text-[10px] font-medium tracking-widest text-red-800 text-center uppercase mb-4 max-w-xs">
                HOT WEATHER WILL RUIN THIS PERFORMANCE AND PROJECT TOO AGGRESSIVELY.
              </p>
              <div className="flex gap-4">
                <div className="relative w-12 h-16 bg-gray-300 opacity-50 flex items-center justify-center">
                  <X size={32} className="text-red-600 absolute" strokeWidth={3} />
                </div>
                <div className="relative w-12 h-16 bg-gray-300 opacity-50 flex items-center justify-center">
                  <X size={32} className="text-red-600 absolute" strokeWidth={3} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-6">
            <div>
              <p className="text-[10px] font-bold tracking-widest text-gray-400 mb-2 uppercase">Actual Sprays Used</p>
              <div className="flex items-center border border-gray-300 w-full">
                <button onClick={() => setSprays(s => Math.max(1, s - 1))} className="flex-1 py-2 font-black border-r border-gray-300 text-gray-500 hover:bg-gray-50">-</button>
                <div className="w-20 text-center font-bold text-sm tracking-widest">[ {sprays}x ]</div>
                <button onClick={() => setSprays(s => s + 1)} className="flex-1 py-2 font-black border-l border-gray-300 text-gray-500 hover:bg-gray-50">+</button>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold tracking-widest text-gray-400 mb-2 uppercase">Skin Condition</p>
              <div className="flex gap-2">
                {['DRY SKIN', 'MOISTURIZED'].map((cond) => {
                  const isActive = skinCondition === cond;
                  return (
                    <button
                      key={cond}
                      onClick={() => setSkinCondition(cond)}
                      className={`flex-1 py-2 text-[10px] font-bold tracking-widest border uppercase transition-colors ${isActive ? 'bg-black text-white border-black' : 'border-gray-300 text-gray-500 hover:border-black hover:text-black'}`}
                    >
                      [ {cond} ]
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setIsLayered(!isLayered)}
              className="w-full flex items-center gap-3 border border-gray-300 py-3 px-4 text-xs font-bold tracking-widest uppercase text-gray-500 hover:border-black hover:text-black"
            >
              <div className={`w-4 h-4 border flex items-center justify-center ${isLayered ? 'bg-black border-black text-white' : 'border-gray-400'}`}>
                {isLayered && <Check size={12} strokeWidth={4} />}
              </div>
              [ LAYER WITH ANOTHER SCENT? ]
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: GUIDE & VISUALIZATION */}
        <div className="flex flex-col border-t lg:border-t-0 border-gray-200 pt-8 lg:pt-0 pb-8">
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Silhouette Container */}
            <div className="relative w-48 h-[350px] flex items-center justify-center mb-8">
              {/* SVG Silhouette Fallback */}
              <svg viewBox="0 0 200 480" className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                <g fill="#000000">
                  <ellipse cx="100" cy="44" rx="26" ry="32"/>
                  <rect x="89" y="74" width="22" height="22" rx="0"/>
                  <path d="M56,97 Q70,93 89,95 L89,128 L111,128 L111,95 Q130,93 144,97 Q153,116 151,136 L111,136 L89,136 L49,136 Q47,116 56,97 Z"/>
                  <rect x="68" y="134" width="64" height="106" rx="0"/>
                  <path d="M64,238 L136,238 L141,266 L59,266 Z"/>
                  <rect x="65" y="264" width="29" height="92" rx="0"/>
                  <rect x="67" y="354" width="25" height="90" rx="0"/>
                  <rect x="106" y="264" width="29" height="92" rx="0"/>
                  <rect x="108" y="354" width="25" height="90" rx="0"/>
                  <path d="M56,98 Q44,110 38,146 L36,216 Q35,236 38,254 L48,254 Q50,234 50,214 L52,146 Q54,122 60,108 Z"/>
                  <path d="M38,254 L48,254 L49,304 L37,304 Z"/>
                  <path d="M144,98 Q156,110 162,146 L164,216 Q165,236 162,254 L152,254 Q150,234 150,214 L148,146 Q146,122 140,108 Z"/>
                  <path d="M152,254 L162,254 L163,304 L151,304 Z"/>
                </g>
              </svg>
              
              {/* Glowing Green Dots */}
              {/* Neck */}
              <div className="absolute top-[18%] left-[43%] w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-pulse"></div>
              <div className="absolute top-[18%] right-[43%] w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-pulse"></div>
              {/* Chest */}
              <div className="absolute top-[35%] left-[50%] -translate-x-1/2 w-3.5 h-3.5 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-pulse"></div>
              {/* Wrists */}
              <div className="absolute top-[60%] left-[20%] w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-pulse"></div>
              <div className="absolute top-[60%] right-[20%] w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-pulse"></div>
            </div>

            <div className="w-full text-center px-4">
              <p className="text-sm font-light leading-relaxed text-gray-800">
                Based on this perfume&apos;s profile, use <strong>6-8x sprays (fresh scent, lower longevity)</strong> for maximum scent impact. Focus on major pulse points: <strong>neck, chest, and wrists</strong> (per the green indicators). An ideal choice for <strong>Panas</strong> weather in a <strong>date</strong> environment inside a <strong>INDOOR NON-AC</strong> area.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM FIXED/SPANNING BUTTON */}
      <div className="mt-12 pt-8">
        <button className="w-full py-5 text-lg font-bold uppercase tracking-widest border-[3px] border-black bg-white text-black hover:bg-black hover:text-white transition-colors duration-300">
          + LOG AS TODAY&apos;S SOTD
        </button>
      </div>

    </div>
  );
}
