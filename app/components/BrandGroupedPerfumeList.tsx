"use client";

import React, { useRef, useMemo, useCallback } from "react";

// ============================================================
// BrandGroupedPerfumeList
// ============================================================
// Groups perfumes by the FIRST LETTER of their 'brand' property,
// then sub-groups by the brand name itself.
//
// Props:
//   perfumes     – flat array (already filtered by any search)
//   isDark       – mirrors the global isDark theme flag
//   onSelect     – called when user clicks a perfume row
//   archiveLabel – CTA label (defaults to "+ ARCHIVE")
// ============================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Perfume = {
  id?: number | string;
  name: string;
  brand?: string;
  img?: string;
  topNotes?: string;
} & Record<string, any>;

interface Props {
  perfumes: Perfume[];
  isDark: boolean;
  onSelect: (perfume: Perfume) => void;
  archiveLabel?: string;
}

export default function BrandGroupedPerfumeList({
  perfumes,
  isDark,
  onSelect,
  archiveLabel = "+ ARCHIVE",
}: Props) {
  const listRef = useRef<HTMLDivElement>(null);

  // ── 1. Group by brand using reduce (as requested) ──────────
  //    Structure: { "A": { "Afnan": [p, p], "Armani": [p] }, … }
  const grouped = useMemo(() => {
    // Sort perfumes by brand then by name so both levels are alphabetical
    const sorted = [...perfumes].sort((a, b) => {
      const brandA = (a.brand ?? "").toUpperCase();
      const brandB = (b.brand ?? "").toUpperCase();
      if (brandA !== brandB) return brandA.localeCompare(brandB);
      return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    });

    // Outer reduce: letter → { brand → perfumes[] }
    return sorted.reduce<Record<string, Record<string, Perfume[]>>>(
      (acc, perfume) => {
        const firstLetter = (perfume.brand?.[0] ?? "#").toUpperCase();
        const brandKey = perfume.brand ?? "—";

        if (!acc[firstLetter]) acc[firstLetter] = {};
        if (!acc[firstLetter][brandKey]) acc[firstLetter][brandKey] = [];
        acc[firstLetter][brandKey].push(perfume);
        return acc;
      },
      {}
    );
  }, [perfumes]);

  // ── 2. Sorted letter keys ───────────────────────────────────
  const letters = useMemo(() => Object.keys(grouped).sort(), [grouped]);

  // ── 3. Jump-to-section (scrolls inside the modal, not window) ─
  const scrollToLetter = useCallback((letter: string) => {
    const target = listRef.current?.querySelector<HTMLElement>(
      `[data-brand-section="${letter}"]`
    );
    if (target && listRef.current) {
      const containerTop = listRef.current.getBoundingClientRect().top;
      const targetTop = target.getBoundingClientRect().top;
      // Offset by the letter-sticky header height (~40px)
      listRef.current.scrollTop += targetTop - containerTop - 40;
    }
  }, []);

  // ── 4. Full A–Z alphabet for sidebar ──────────────────────
  const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // ── Empty state ─────────────────────────────────────────────
  if (perfumes.length === 0) {
    return (
      <div
        className={`flex-1 flex flex-col items-center justify-center gap-3 p-12 border ${
          isDark ? "border-[#333333]" : "border-gray-200"
        }`}
      >
        <span
          className={`text-4xl font-black select-none ${
            isDark ? "text-[#222]" : "text-gray-200"
          }`}
        >
          ∅
        </span>
        <p
          className={`text-[10px] font-black uppercase tracking-[0.3em] ${
            isDark ? "text-gray-600" : "text-gray-400"
          }`}
        >
          NO RESULTS FOUND
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0 relative">
      {/* ── Main scrollable list ─────────────────────────────── */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollBehavior: "smooth" }}
      >
        {letters.map((letter) => {
          const brandsInLetter = grouped[letter];
          const brandNames = Object.keys(brandsInLetter).sort();
          const totalInLetter = brandNames.reduce(
            (sum, b) => sum + brandsInLetter[b].length,
            0
          );

          return (
            <div key={letter} data-brand-section={letter}>
              {/* ── Level 1: Letter sticky header ─────────────── */}
              <div
                className={`sticky top-0 z-20 flex items-baseline gap-3 px-4 py-2 border-b-2 ${
                  isDark
                    ? "bg-[#0a0a0a] border-[#fafafa]"
                    : "bg-[#fafafa] border-[#111111]"
                }`}
              >
                <span
                  className={`text-[36px] font-black leading-none tracking-tight select-none ${
                    isDark ? "text-[#fafafa]" : "text-[#111111]"
                  }`}
                >
                  {letter}
                </span>
                <span
                  className={`text-[8px] font-bold uppercase tracking-[0.45em] ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {brandNames.length}{" "}
                  {brandNames.length === 1 ? "BRAND" : "BRANDS"} ·{" "}
                  {totalInLetter}{" "}
                  {totalInLetter === 1 ? "ENTRY" : "ENTRIES"}
                </span>
              </div>

              {/* ── Level 2: Brand sub-groups ─────────────────── */}
              {brandNames.map((brand) => {
                const brandPerfumes = brandsInLetter[brand];

                return (
                  <div key={brand}>
                    {/* Brand name row */}
                    <div
                      className={`sticky top-[52px] z-10 flex items-center justify-between px-4 py-2 border-b ${
                        isDark
                          ? "bg-[#121212] border-[#333333]"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <span
                        className={`text-[11px] font-black uppercase tracking-[0.3em] ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {brand}
                      </span>
                      <span
                        className={`text-[8px] font-bold uppercase tracking-widest border px-2 py-0.5 ${
                          isDark
                            ? "border-[#333333] text-gray-600"
                            : "border-gray-200 text-gray-400"
                        }`}
                      >
                        {brandPerfumes.length}
                      </span>
                    </div>

                    {/* Perfume rows */}
                    {brandPerfumes.map((p, i) => (
                      <div
                        key={`${brand}-${p.id ?? p.name}-${i}`}
                        onClick={() => onSelect(p)}
                        className={`group flex items-center justify-between px-4 py-3 border-b cursor-pointer transition-colors duration-150 ${
                          isDark
                            ? "border-[#222222] hover:bg-[#1a1a1a]"
                            : "border-gray-100 hover:bg-gray-50"
                        }`}
                      >
                        {/* Left: thumbnail + meta */}
                        <div className="flex items-center gap-4">
                          <img
                            src={p.img}
                            alt={p.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/images/monaco.png";
                            }}
                            className={`w-9 h-12 object-cover border bg-white shadow-sm shrink-0 ${
                              isDark ? "border-[#333333]" : "border-gray-200"
                            }`}
                          />
                          <div>
                            <p
                              className={`text-sm font-medium leading-none transition-colors duration-150 ${
                                isDark
                                  ? "text-[#fafafa] group-hover:text-white"
                                  : "text-[#111111]"
                              }`}
                            >
                              {p.name}
                            </p>
                            {p.topNotes && (
                              <p
                                className={`text-[8px] uppercase mt-1 italic tracking-wide ${
                                  isDark ? "text-gray-500" : "text-gray-400"
                                }`}
                              >
                                {p.topNotes}
                              </p>
                            )}
                            {/* Category pill */}
                            {p.category && (
                              <span
                                className={`inline-block mt-1.5 text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 border ${
                                  isDark
                                    ? "border-[#444] text-gray-500"
                                    : "border-gray-200 text-gray-400"
                                }`}
                              >
                                {p.category}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right: archive CTA (visible on hover) */}
                        <span
                          className={`shrink-0 text-[10px] uppercase font-black tracking-widest opacity-0 group-hover:opacity-100 border px-3 py-1 transition-all duration-200 hover:scale-105 ${
                            isDark
                              ? "border-[#fafafa] group-hover:bg-[#fafafa] group-hover:text-[#0a0a0a]"
                              : "border-[#111111] group-hover:bg-[#111111] group-hover:text-white"
                          }`}
                        >
                          {archiveLabel}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* ── A–Z Index Sidebar ────────────────────────────────── */}
      <div
        className={`flex flex-col items-center justify-center py-2 px-[3px] gap-[1px] border-l shrink-0 ${
          isDark ? "border-[#333333]" : "border-gray-200"
        }`}
        style={{ width: "26px" }}
      >
        {allLetters.map((l) => {
          const isActive = !!grouped[l];
          return (
            <button
              key={l}
              onClick={() => isActive && scrollToLetter(l)}
              disabled={!isActive}
              aria-label={`Jump to brands starting with ${l}`}
              className={`text-[7.5px] font-black leading-none py-[1.5px] w-full text-center transition-all duration-100 rounded-[1px] ${
                isActive
                  ? isDark
                    ? "text-[#fafafa] hover:bg-[#fafafa] hover:text-[#0a0a0a] cursor-pointer"
                    : "text-[#111111] hover:bg-[#111111] hover:text-white cursor-pointer"
                  : isDark
                  ? "text-[#2a2a2a] cursor-default"
                  : "text-gray-200 cursor-default"
              }`}
            >
              {l}
            </button>
          );
        })}
      </div>
    </div>
  );
}
