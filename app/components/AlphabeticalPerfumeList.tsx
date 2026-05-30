"use client";

import React, { useRef, useMemo, useCallback } from "react";

// ============================================================
// AlphabeticalPerfumeList
// ============================================================
// Props:
//   perfumes   – flat array of perfume objects (already filtered by search)
//   isDark     – dark/light mode flag to match global theme
//   onSelect   – callback fired when the user clicks a perfume row
//   archiveLabel – button label text (e.g. "+ ARCHIVE")
// ============================================================

// Intentionally loose — accepts both typed PerfumeEntry objects and ad-hoc custom perfumes.
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

export default function AlphabeticalPerfumeList({
  perfumes,
  isDark,
  onSelect,
  archiveLabel = "+ ARCHIVE",
}: Props) {
  const listRef = useRef<HTMLDivElement>(null);

  // ── 1. Group perfumes by first letter ──────────────────────
  const grouped = useMemo(() => {
    const map: Record<string, Perfume[]> = {};
    const sorted = [...perfumes].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );
    for (const p of sorted) {
      const letter = p.name[0]?.toUpperCase() ?? "#";
      if (!map[letter]) map[letter] = [];
      map[letter].push(p);
    }
    return map;
  }, [perfumes]);

  // ── 2. Sorted list of letters present ──────────────────────
  const letters = useMemo(() => Object.keys(grouped).sort(), [grouped]);

  // ── 3. Jump-to-section handler ─────────────────────────────
  const scrollToLetter = useCallback(
    (letter: string) => {
      const target = listRef.current?.querySelector<HTMLElement>(
        `[data-alpha-section="${letter}"]`
      );
      if (target && listRef.current) {
        // Offset by the sticky header height (≈ 32px)
        const containerTop = listRef.current.getBoundingClientRect().top;
        const targetTop = target.getBoundingClientRect().top;
        listRef.current.scrollTop +=
          targetTop - containerTop - 32;
      }
    },
    []
  );

  // ── 4. All 26 letters for the sidebar (greyed if absent) ───
  const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  if (perfumes.length === 0) {
    return (
      <div
        className={`flex-1 flex items-center justify-center p-12 border ${
          isDark ? "border-[#333333]" : "border-gray-200"
        }`}
      >
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
    <div className="flex flex-1 min-h-0 gap-0 relative">
      {/* ── Main scrollable list ── */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto pr-1"
        style={{ scrollBehavior: "smooth" }}
      >
        {letters.map((letter) => (
          <div key={letter} data-alpha-section={letter}>
            {/* Sticky group header */}
            <div
              className={`sticky top-0 z-10 flex items-center gap-3 py-1.5 px-4 border-b ${
                isDark
                  ? "bg-[#121212] border-[#333333]"
                  : "bg-white border-gray-200"
              }`}
            >
              <span
                className={`text-[28px] font-black leading-none tracking-tight select-none ${
                  isDark ? "text-[#fafafa]" : "text-[#111111]"
                }`}
              >
                {letter}
              </span>
              <span
                className={`text-[8px] font-bold uppercase tracking-[0.4em] self-end mb-1 ${
                  isDark ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {grouped[letter].length}{" "}
                {grouped[letter].length === 1 ? "ENTRY" : "ENTRIES"}
              </span>
            </div>

            {/* Perfume rows for this letter */}
            {grouped[letter].map((p, i) => (
              <div
                key={`${letter}-${p.id ?? p.name}-${i}`}
                onClick={() => onSelect(p)}
                className={`group py-4 border-b flex justify-between items-center px-4 transition-colors duration-200 cursor-pointer ${
                  isDark
                    ? "border-[#333333] hover:bg-[#1a1a1a]"
                    : "border-gray-100 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <img
                    src={p.img}
                    alt={p.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/images/monaco.png";
                    }}
                    className={`w-10 h-14 object-cover border bg-white shadow-sm shrink-0 ${
                      isDark ? "border-[#333333]" : "border-gray-200"
                    }`}
                  />
                  {/* Meta */}
                  <div>
                    <p className="text-base font-medium leading-none transition-colors duration-200">
                      {p.name}
                    </p>
                    <p
                      className={`text-[10px] uppercase tracking-widest font-bold mt-1 ${
                        isDark ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {p.brand}
                    </p>
                    {p.topNotes && (
                      <p
                        className={`text-[8px] uppercase mt-1 italic ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {p.topNotes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Archive badge */}
                <span
                  className={`text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 border px-3 py-1 transition-all duration-300 hover:scale-105 ${
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
        ))}
      </div>

      {/* ── A–Z Index Sidebar ── */}
      <div
        className={`flex flex-col items-center justify-center py-2 px-1 gap-[1px] border-l shrink-0 ${
          isDark ? "border-[#333333]" : "border-gray-200"
        }`}
        style={{ width: "28px" }}
      >
        {allLetters.map((l) => {
          const isActive = !!grouped[l];
          return (
            <button
              key={l}
              onClick={() => isActive && scrollToLetter(l)}
              disabled={!isActive}
              aria-label={`Jump to ${l}`}
              className={`text-[8px] font-black leading-none py-[1px] w-full text-center transition-all duration-150 rounded-sm ${
                isActive
                  ? isDark
                    ? "text-[#fafafa] hover:bg-[#fafafa] hover:text-[#0a0a0a] cursor-pointer"
                    : "text-[#111111] hover:bg-[#111111] hover:text-white cursor-pointer"
                  : isDark
                  ? "text-[#333333] cursor-default"
                  : "text-gray-300 cursor-default"
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
