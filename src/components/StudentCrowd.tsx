'use client';

import React, { useEffect, useRef, useCallback } from 'react';

/**
 * Interactive Student Crowd Canvas / Panorama
 * Restored vector illustration of university students carrying backpacks and study gear.
 * - Slower, silky, gentle horizontal parallax movement
 * - Zero hover effects (no tooltips, no popups, no character displacement on hover)
 * - Solid baseline grounding with no cut-off floating torsos
 */
export default function StudentCrowd() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax animation state
  const targetOffset = useRef(0);
  const currentOffset = useRef(0);
  const isDragging = useRef(false);
  const startDragX = useRef(0);
  const dragStartOffset = useRef(0);
  const lastInteractionTime = useRef(Date.now());
  const rafId = useRef<number | null>(null);

  // Slower, gentle mouse move handler
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width; // 0 to 1
    const normalized = (relativeX - 0.5) * 2; // -1 to 1
    // Calibrated slower max pan (90px instead of 240px)
    targetOffset.current = normalized * 90;
    lastInteractionTime.current = Date.now();
  }, []);

  // Touch drag handlers for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    isDragging.current = true;
    startDragX.current = e.touches[0].clientX;
    dragStartOffset.current = targetOffset.current;
    lastInteractionTime.current = Date.now();
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const delta = e.touches[0].clientX - startDragX.current;
    // Calibrated gentle touch drag
    targetOffset.current = Math.max(-110, Math.min(110, dragStartOffset.current + delta * 0.5));
    lastInteractionTime.current = Date.now();
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  // Smooth physics animation loop with slow, gentle damping
  useEffect(() => {
    const layerBack = document.getElementById('crowd-layer-back');
    const layerMid = document.getElementById('crowd-layer-mid');
    const layerFront = document.getElementById('crowd-layer-front');

    const animate = () => {
      const now = Date.now();
      const timeSinceInteraction = now - lastInteractionTime.current;

      // Gentle ambient drift when idle
      let effectiveTarget = targetOffset.current;
      if (timeSinceInteraction > 2000) {
        const idleWave = Math.sin(now * 0.0004) * 25;
        effectiveTarget += idleWave;
      }

      // Slower lerp damping (0.035 for buttery, gentle gliding)
      currentOffset.current += (effectiveTarget - currentOffset.current) * 0.035;

      const offset = currentOffset.current;

      // Slower parallax depth multipliers
      if (layerBack) {
        layerBack.style.transform = `translate3d(${offset * 0.22}px, 0, 0)`;
      }
      if (layerMid) {
        layerMid.style.transform = `translate3d(${offset * 0.48}px, 0, 0)`;
      }
      if (layerFront) {
        layerFront.style.transform = `translate3d(${offset * 0.72}px, 0, 0)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full overflow-hidden select-none cursor-default bg-white pt-2 pb-0"
      style={{ touchAction: 'pan-y' }}
    >
      {/* Panorama Viewport */}
      <div className="relative h-[280px] sm:h-[340px] md:h-[380px] w-full flex items-end justify-center overflow-hidden">
        {/* ========================================================= */}
        {/* LAYER 1: BACKGROUND (Parallax 0.22x) - Distant Students */}
        {/* ========================================================= */}
        <div
          id="crowd-layer-back"
          className="absolute bottom-0 w-[2400px] h-full flex items-end justify-center will-change-transform pointer-events-none"
        >
          <svg
            viewBox="0 0 2400 360"
            className="w-full h-full text-black fill-white"
            preserveAspectRatio="xMidYMax slice"
          >
            <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              {[0, 600, 1200, 1800].map((shiftX, idx) => (
                <g key={`bg-mod-${idx}`} transform={`translate(${shiftX}, 40)`}>
                  {/* BG Student A: Beanie + Backpack visible */}
                  <g opacity="0.85">
                    <path d="M 45 150 C 45 120, 75 110, 85 110 C 95 110, 115 120, 115 150" fill="currentColor" />
                    <rect x="55" y="118" width="16" height="4" rx="2" fill="white" />
                    <circle cx="80" cy="155" r="28" fill="white" />
                    <path d="M 52 145 C 52 125, 62 118, 80 118 C 98 118, 108 125, 108 145 Z" fill="currentColor" />
                    <rect x="50" y="142" width="60" height="7" rx="3.5" fill="white" stroke="currentColor" strokeWidth="2" />
                    <circle cx="72" cy="156" r="6" fill="white" />
                    <circle cx="88" cy="156" r="6" fill="white" />
                    <path d="M 78 156 L 82 156" />
                    <circle cx="72" cy="156" r="2.5" fill="currentColor" />
                    <circle cx="88" cy="156" r="2.5" fill="currentColor" />
                    <path d="M 77 169 Q 80 172 83 169" />
                    <path d="M 40 230 Q 55 180 80 180 Q 105 180 120 230" fill="white" />
                  </g>

                  {/* BG Student B: High Bun + Backpack strap */}
                  <g opacity="0.9" transform="translate(110, 10)">
                    <path d="M 30 140 Q 25 105 50 100 Q 65 98 75 120" fill="currentColor" />
                    <circle cx="65" cy="108" r="15" fill="currentColor" />
                    <circle cx="65" cy="145" r="26" fill="white" />
                    <path d="M 42 135 C 45 120 85 120 88 135 C 80 125 50 125 42 135 Z" fill="currentColor" />
                    <circle cx="58" cy="144" r="2.5" fill="currentColor" />
                    <circle cx="72" cy="144" r="2.5" fill="currentColor" />
                    <path d="M 62 156 Q 65 159 68 156" />
                    <path d="M 35 230 Q 50 170 65 170 Q 80 170 95 230" fill="white" />
                    <path d="M 45 180 L 58 210" strokeWidth="3" />
                  </g>

                  {/* BG Student C: Graduation Cap Senior */}
                  <g opacity="0.9" transform="translate(220, -5)">
                    <polygon points="65,95 105,110 65,125 25,110" fill="currentColor" />
                    <circle cx="65" cy="110" r="3" fill="white" />
                    <path d="M 65 110 Q 85 118 88 132" fill="none" strokeWidth="2.5" />
                    <circle cx="88" cy="134" r="2" fill="currentColor" />
                    <circle cx="65" cy="142" r="24" fill="white" />
                    <circle cx="57" cy="142" r="2.5" fill="currentColor" />
                    <circle cx="73" cy="142" r="2.5" fill="currentColor" />
                    <path d="M 60 152 Q 65 157 70 152" fill="none" strokeWidth="2" />
                    <path d="M 35 220 Q 65 165 95 220" fill="white" />
                    <path d="M 52 165 Q 65 155 78 165" fill="none" strokeWidth="2" />
                  </g>

                  {/* BG Student D: Wavy Afro + Backpack */}
                  <g opacity="0.85" transform="translate(320, 15)">
                    <circle cx="75" cy="130" r="34" fill="currentColor" />
                    <circle cx="50" cy="138" r="20" fill="currentColor" />
                    <circle cx="100" cy="138" r="20" fill="currentColor" />
                    <circle cx="75" cy="148" r="24" fill="white" />
                    <rect x="60" y="142" width="12" height="10" rx="3" fill="white" strokeWidth="2" />
                    <rect x="78" y="142" width="12" height="10" rx="3" fill="white" strokeWidth="2" />
                    <line x1="72" y1="147" x2="78" y2="147" strokeWidth="2" />
                    <circle cx="66" cy="147" r="2" fill="currentColor" />
                    <circle cx="84" cy="147" r="2" fill="currentColor" />
                    <path d="M 70 160 Q 75 163 80 160" />
                    <path d="M 35 230 Q 75 170 115 230" fill="white" />
                  </g>

                  {/* BG Student E: Hijab with notes */}
                  <g opacity="0.9" transform="translate(430, 20)">
                    <path d="M 50 120 C 50 95, 100 95, 100 120 C 105 150, 105 185, 75 185 C 45 185, 45 150, 50 120 Z" fill="currentColor" />
                    <ellipse cx="75" cy="140" rx="17" ry="21" fill="white" stroke="none" />
                    <circle cx="68" cy="138" r="2.5" fill="currentColor" />
                    <circle cx="82" cy="138" r="2.5" fill="currentColor" />
                    <path d="M 71 150 Q 75 154 79 150" fill="none" strokeWidth="2" />
                    <path d="M 35 230 Q 75 180 115 230" fill="white" />
                  </g>

                  {/* BG Student F: Cap Backwards */}
                  <g opacity="0.85" transform="translate(520, 25)">
                    <path d="M 45 130 C 45 110, 85 110, 85 130" fill="currentColor" />
                    <rect x="75" y="132" width="22" height="5" rx="2.5" fill="currentColor" />
                    <circle cx="65" cy="145" r="22" fill="white" />
                    <circle cx="58" cy="144" r="2.5" fill="currentColor" />
                    <circle cx="72" cy="144" r="2.5" fill="currentColor" />
                    <path d="M 61 154 Q 65 157 69 154" fill="none" />
                    <path d="M 30 230 Q 65 170 100 230" fill="white" />
                    <path d="M 45 180 L 48 210" strokeWidth="3" />
                    <path d="M 85 180 L 82 210" strokeWidth="3" />
                  </g>
                </g>
              ))}
            </g>
          </svg>
        </div>

        {/* ========================================================= */}
        {/* LAYER 2: MIDGROUND (Parallax 0.48x) - Middle Students */}
        {/* ========================================================= */}
        <div
          id="crowd-layer-mid"
          className="absolute bottom-0 w-[2400px] h-full flex items-end justify-center will-change-transform pointer-events-none"
        >
          <svg
            viewBox="0 0 2400 360"
            className="w-full h-full text-black fill-white"
            preserveAspectRatio="xMidYMax slice"
          >
            <g stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round">
              {[0, 800, 1600].map((shiftX, idx) => (
                <g key={`mid-mod-${idx}`} transform={`translate(${shiftX}, 20)`}>
                  {/* MID 1: Female Student with Chic Hijab & Backpack */}
                  <g transform="translate(40, 20)">
                    <path d="M 40 160 C 35 110, 115 110, 110 160 Z" fill="currentColor" />
                    <rect x="60" y="118" width="30" height="7" rx="3.5" fill="white" stroke="currentColor" strokeWidth="2" />
                    <path d="M 48 125 C 48 85, 102 85, 102 125 C 110 170, 105 210, 75 210 C 45 210, 40 170, 48 125 Z" fill="currentColor" />
                    <ellipse cx="75" cy="140" rx="19" ry="24" fill="white" />
                    <circle cx="68" cy="138" r="7.5" fill="white" strokeWidth="2.2" />
                    <circle cx="82" cy="138" r="7.5" fill="white" strokeWidth="2.2" />
                    <line x1="75.5" y1="138" x2="74.5" y2="138" strokeWidth="2" />
                    <circle cx="68" cy="138" r="2.8" fill="currentColor" />
                    <circle cx="82" cy="138" r="2.8" fill="currentColor" />
                    <path d="M 70 153 Q 75 158 80 153" fill="none" strokeWidth="2.2" />
                    <path d="M 25 260 Q 40 190 75 190 Q 110 190 125 260" fill="white" strokeWidth="2.8" />
                    <path d="M 42 195 Q 48 215 50 260" strokeWidth="6" stroke="currentColor" />
                    <rect x="44" y="212" width="8" height="5" rx="1" fill="white" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M 108 195 Q 102 215 100 260" strokeWidth="6" stroke="currentColor" />
                    <rect x="98" y="212" width="8" height="5" rx="1" fill="white" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="52" y="225" width="46" height="32" rx="2" fill="white" stroke="currentColor" strokeWidth="2.5" />
                    <line x1="58" y1="233" x2="88" y2="233" strokeWidth="2" />
                    <line x1="58" y1="241" x2="80" y2="241" strokeWidth="2" />
                  </g>

                  {/* MID 2: Tech Student with Headphones */}
                  <g transform="translate(170, 10)">
                    <path d="M 28 150 C 25 110, 55 100, 65 125" fill="currentColor" />
                    <path d="M 50 172 Q 75 188 100 172" fill="none" strokeWidth="5" stroke="currentColor" />
                    <circle cx="48" cy="170" r="8" fill="currentColor" />
                    <circle cx="102" cy="170" r="8" fill="currentColor" />
                    <circle cx="75" cy="135" r="26" fill="white" />
                    <path d="M 50 125 C 50 95, 100 95, 100 125 C 90 112, 60 112, 50 125 Z" fill="currentColor" />
                    <circle cx="67" cy="135" r="3" fill="currentColor" />
                    <circle cx="83" cy="135" r="3" fill="currentColor" />
                    <path d="M 70 148 Q 75 153 80 148" fill="none" strokeWidth="2.5" />
                    <path d="M 25 260 Q 40 185 75 185 Q 110 185 125 260" fill="white" strokeWidth="2.8" />
                    <line x1="70" y1="188" x2="68" y2="215" strokeWidth="2.5" />
                    <circle cx="68" cy="216" r="2" fill="currentColor" />
                    <line x1="80" y1="188" x2="82" y2="215" strokeWidth="2.5" />
                    <circle cx="82" cy="216" r="2" fill="currentColor" />
                    <path d="M 40 190 L 45 260" strokeWidth="5.5" stroke="currentColor" />
                    <path d="M 110 190 L 105 260" strokeWidth="5.5" stroke="currentColor" />
                  </g>

                  {/* MID 3: Medical/Pharmacy Student with Books */}
                  <g transform="translate(300, 25)">
                    <circle cx="75" cy="132" r="25" fill="white" />
                    <path d="M 50 125 C 50 100, 100 100, 100 125 C 95 110, 55 110, 50 125 Z" fill="currentColor" />
                    <path d="M 98 128 C 115 132, 118 160, 105 168 C 100 162, 100 145, 95 135 Z" fill="currentColor" />
                    <circle cx="67" cy="132" r="2.8" fill="currentColor" />
                    <circle cx="83" cy="132" r="2.8" fill="currentColor" />
                    <path d="M 71 144 Q 75 148 79 144" fill="none" strokeWidth="2.2" />
                    <path d="M 30 255 Q 45 180 75 180 Q 105 180 120 255" fill="white" strokeWidth="2.8" />
                    <path d="M 45 185 L 48 255" strokeWidth="5" stroke="currentColor" />
                    <path d="M 105 185 L 102 255" strokeWidth="5" stroke="currentColor" />
                    <g transform="translate(50, 205)">
                      <rect x="0" y="0" width="50" height="20" rx="2" fill="white" stroke="currentColor" strokeWidth="2.5" />
                      <line x1="6" y1="0" x2="6" y2="20" strokeWidth="2" />
                      <line x1="12" y1="6" x2="44" y2="6" strokeWidth="1.8" />
                      <line x1="12" y1="12" x2="36" y2="12" strokeWidth="1.8" />
                      <rect x="-4" y="16" width="58" height="18" rx="2" fill="currentColor" />
                      <line x1="2" y1="20" x2="2" y2="30" stroke="white" strokeWidth="2" />
                    </g>
                  </g>

                  {/* MID 4: Senior Graduate with Cap */}
                  <g transform="translate(440, 5)">
                    <polygon points="75,80 125,98 75,116 25,98" fill="currentColor" />
                    <circle cx="75" cy="98" r="3.5" fill="white" />
                    <path d="M 75 98 Q 105 110 110 135" fill="none" strokeWidth="3" stroke="currentColor" />
                    <circle cx="110" cy="138" r="3" fill="currentColor" />
                    <circle cx="75" cy="136" r="26" fill="white" />
                    <path d="M 54 140 C 54 165, 96 165, 96 140 Z" fill="currentColor" />
                    <circle cx="75" cy="134" r="18" fill="white" />
                    <circle cx="68" cy="132" r="3" fill="currentColor" />
                    <circle cx="82" cy="132" r="3" fill="currentColor" />
                    <path d="M 70 144 Q 75 149 80 144" fill="none" strokeWidth="2.5" />
                    <path d="M 25 260 Q 40 182 75 182 Q 110 182 125 260" fill="white" strokeWidth="2.8" />
                    <path d="M 52 200 L 52 210 Q 52 216 57 216 Q 62 216 62 210 L 62 200" fill="none" strokeWidth="3" stroke="currentColor" />
                    <path d="M 108 184 L 105 260" strokeWidth="6" stroke="currentColor" />
                    <g transform="translate(75, 205)">
                      <rect x="0" y="0" width="35" height="10" rx="3" fill="white" stroke="currentColor" strokeWidth="2.4" />
                      <rect x="14" y="-1" width="6" height="12" fill="currentColor" />
                    </g>
                  </g>

                  {/* MID 5: Architecture Student with Drawing Tube */}
                  <g transform="translate(580, 18)">
                    <g transform="rotate(-25 60 120)">
                      <rect x="25" y="60" width="16" height="110" rx="5" fill="currentColor" />
                      <line x1="25" y1="75" x2="41" y2="75" stroke="white" strokeWidth="2" />
                      <line x1="25" y1="80" x2="41" y2="80" stroke="white" strokeWidth="2" />
                      <rect x="23" y="55" width="20" height="10" rx="3" fill="white" stroke="currentColor" strokeWidth="2" />
                    </g>
                    <circle cx="75" cy="136" r="25" fill="white" />
                    <path d="M 48 126 C 48 98, 102 98, 102 126 Z" fill="currentColor" />
                    <rect x="46" y="123" width="58" height="8" rx="4" fill="white" stroke="currentColor" strokeWidth="2" />
                    <rect x="62" y="132" width="11" height="9" rx="2" fill="white" strokeWidth="2" />
                    <rect x="77" y="132" width="11" height="9" rx="2" fill="white" strokeWidth="2" />
                    <line x1="73" y1="136" x2="77" y2="136" strokeWidth="2" />
                    <circle cx="67.5" cy="136.5" r="2.5" fill="currentColor" />
                    <circle cx="82.5" cy="136.5" r="2.5" fill="currentColor" />
                    <path d="M 71 148 Q 75 152 79 148" fill="none" strokeWidth="2.2" />
                    <path d="M 28 258 Q 45 185 75 185 Q 105 185 122 258" fill="white" strokeWidth="2.8" />
                    <path d="M 45 190 L 48 258" strokeWidth="5.5" stroke="currentColor" />
                    <path d="M 105 190 L 102 258" strokeWidth="5.5" stroke="currentColor" />
                  </g>

                  {/* MID 6: Freshman Student with Backpack */}
                  <g transform="translate(700, 12)">
                    <path d="M 30 160 C 25 90, 125 90, 120 160 Z" fill="currentColor" />
                    <rect x="55" y="98" width="40" height="9" rx="4.5" fill="white" stroke="currentColor" strokeWidth="2.2" />
                    <path d="M 45 130 Q 75 140 105 130" stroke="white" strokeWidth="2.5" />
                    <circle cx="75" cy="138" r="24" fill="white" />
                    <path d="M 52 125 C 52 105, 98 105, 98 125 C 88 115, 62 115, 52 125 Z" fill="currentColor" />
                    <circle cx="68" cy="136" r="3" fill="currentColor" />
                    <circle cx="82" cy="136" r="3" fill="currentColor" />
                    <path d="M 70 148 Q 75 153 80 148" fill="none" strokeWidth="2.4" />
                    <path d="M 68 185 L 75 210 L 82 185" fill="none" strokeWidth="2" stroke="currentColor" />
                    <rect x="68" y="210" width="14" height="18" rx="2" fill="white" stroke="currentColor" strokeWidth="1.8" />
                    <rect x="71" y="213" width="8" height="7" fill="currentColor" />
                    <line x1="71" y1="223" x2="79" y2="223" strokeWidth="1.5" />
                    <path d="M 30 260 Q 45 185 75 185 Q 105 185 120 260" fill="white" strokeWidth="2.8" />
                    <path d="M 45 188 L 50 260" strokeWidth="6" stroke="currentColor" />
                    <path d="M 105 188 L 100 260" strokeWidth="6" stroke="currentColor" />
                  </g>
                </g>
              ))}
            </g>
          </svg>
        </div>

        {/* ========================================================= */}
        {/* LAYER 3: FOREGROUND (Parallax 0.72x) - Frontline Students */}
        {/* Grounded flush against the bottom line */}
        {/* ========================================================= */}
        <div
          id="crowd-layer-front"
          className="absolute bottom-0 w-[2400px] h-full flex items-end justify-center will-change-transform pointer-events-none"
        >
          <svg
            viewBox="0 0 2400 360"
            className="w-full h-full text-black fill-white"
            preserveAspectRatio="xMidYMax slice"
          >
            <g stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
              {[0, 800, 1600].map((shiftX, idx) => (
                <g key={`front-mod-${idx}`} transform={`translate(${shiftX}, 0)`}>
                  {/* FRONT 1: Confident Student with Dual Padded Straps */}
                  <g transform="translate(70, 0)">
                    <path d="M 30 180 C 25 100, 135 100, 130 180 Z" fill="currentColor" />
                    <rect x="62" y="108" width="36" height="8" rx="4" fill="white" stroke="currentColor" strokeWidth="2.5" />
                    <circle cx="80" cy="148" r="28" fill="white" />
                    <path d="M 52 135 C 50 95, 110 95, 108 135 C 98 120, 62 120, 52 135 Z" fill="currentColor" />
                    <rect x="66" y="142" width="13" height="11" rx="3" fill="white" strokeWidth="2.5" />
                    <rect x="83" y="142" width="13" height="11" rx="3" fill="white" strokeWidth="2.5" />
                    <line x1="79" y1="147" x2="83" y2="147" strokeWidth="2.5" />
                    <circle cx="72.5" cy="147.5" r="3" fill="currentColor" />
                    <circle cx="89.5" cy="147.5" r="3" fill="currentColor" />
                    <path d="M 73 162 Q 80 168 87 162" fill="none" strokeWidth="2.8" />
                    <path d="M 25 290 Q 45 195 80 195 Q 115 195 135 290" fill="white" strokeWidth="3.2" />
                    <path d="M 44 200 Q 52 230 55 290" strokeWidth="8" stroke="currentColor" />
                    <rect x="47" y="228" width="10" height="6" rx="1.5" fill="white" stroke="currentColor" strokeWidth="2" />
                    <path d="M 116 200 Q 108 230 105 290" strokeWidth="8" stroke="currentColor" />
                    <rect x="103" y="228" width="10" height="6" rx="1.5" fill="white" stroke="currentColor" strokeWidth="2" />
                    <line x1="53" y1="231" x2="104" y2="231" strokeWidth="3" stroke="currentColor" />
                    <rect x="74" y="227" width="10" height="8" rx="2" fill="currentColor" />
                    <g transform="translate(56, 238)">
                      <rect x="0" y="0" width="48" height="32" rx="3" fill="white" stroke="currentColor" strokeWidth="2.8" />
                      <line x1="8" y1="8" x2="40" y2="8" strokeWidth="2.2" />
                      <line x1="8" y1="16" x2="32" y2="16" strokeWidth="2.2" />
                      <line x1="8" y1="24" x2="24" y2="24" strokeWidth="2.2" />
                    </g>
                  </g>

                  {/* FRONT 2: Medical Student with Lab Coat & Stethoscope */}
                  <g transform="translate(220, 10)">
                    <path d="M 32 170 C 25 125, 55 115, 68 140" fill="currentColor" />
                    <path d="M 48 135 C 48 90, 112 90, 112 135 C 120 185, 115 220, 80 220 C 45 220, 40 185, 48 135 Z" fill="currentColor" />
                    <ellipse cx="80" cy="150" rx="20" ry="26" fill="white" />
                    <circle cx="72" cy="148" r="3" fill="currentColor" />
                    <circle cx="88" cy="148" r="3" fill="currentColor" />
                    <path d="M 75 163 Q 80 168 85 163" fill="none" strokeWidth="2.8" />
                    <path d="M 28 290 Q 48 200 80 200 Q 112 200 132 290" fill="white" strokeWidth="3.2" />
                    <path d="M 64 200 L 74 240 L 80 290" strokeWidth="2.5" />
                    <path d="M 96 200 L 86 240 L 80 290" strokeWidth="2.5" />
                    <path d="M 66 215 Q 80 248 94 215" fill="none" strokeWidth="3.5" stroke="currentColor" />
                    <circle cx="80" cy="248" r="6" fill="currentColor" />
                    <path d="M 46 205 L 50 290" strokeWidth="7.5" stroke="currentColor" />
                    <path d="M 114 205 L 110 290" strokeWidth="7.5" stroke="currentColor" />
                    <g transform="translate(84, 215)">
                      <rect x="0" y="0" width="34" height="48" rx="3" fill="currentColor" stroke="currentColor" />
                      <line x1="6" y1="0" x2="6" y2="48" stroke="white" strokeWidth="2" />
                      <line x1="12" y1="12" x2="28" y2="12" stroke="white" strokeWidth="2" />
                      <line x1="12" y1="20" x2="24" y2="20" stroke="white" strokeWidth="2" />
                    </g>
                  </g>

                  {/* FRONT 3: Student with Campus Coffee & Crossbody Bag */}
                  <g transform="translate(370, 0)">
                    <circle cx="80" cy="145" r="27" fill="white" />
                    <path d="M 53 135 C 53 105, 107 105, 107 135 C 95 120, 65 120, 53 135 Z" fill="currentColor" />
                    <path d="M 58 150 C 58 175, 102 175, 102 150 Z" fill="currentColor" />
                    <circle cx="80" cy="144" r="19" fill="white" />
                    <circle cx="73" cy="142" r="3.2" fill="currentColor" />
                    <circle cx="87" cy="142" r="3.2" fill="currentColor" />
                    <path d="M 75 155 Q 80 160 85 155" fill="none" strokeWidth="2.8" />
                    <path d="M 25 290 Q 45 195 80 195 Q 115 195 135 290" fill="white" strokeWidth="3.2" />
                    <polygon points="80,195 70,210 80,218 90,210" fill="white" stroke="currentColor" strokeWidth="2.5" />
                    <path d="M 38 200 L 122 285" strokeWidth="11" stroke="currentColor" />
                    <rect x="74" y="228" width="12" height="8" rx="2" fill="white" stroke="currentColor" strokeWidth="2.5" />
                    <g transform="translate(42, 225)">
                      <polygon points="0,6 20,6 17,32 3,32" fill="white" stroke="currentColor" strokeWidth="2.5" />
                      <rect x="-2" y="2" width="24" height="4" rx="2" fill="currentColor" />
                      <rect x="1" y="14" width="18" height="10" fill="currentColor" />
                    </g>
                  </g>

                  {/* FRONT 4: Senior Graduate with Mortarboard Cap */}
                  <g transform="translate(520, -5)">
                    <polygon points="80,75 135,95 80,115 25,95" fill="currentColor" />
                    <circle cx="80" cy="95" r="4" fill="white" />
                    <path d="M 80 95 Q 115 105 120 135" fill="none" strokeWidth="3.5" stroke="currentColor" />
                    <circle cx="120" cy="138" r="3.5" fill="currentColor" />
                    <circle cx="80" cy="144" r="27" fill="white" />
                    <path d="M 53 135 C 55 115, 105 115, 107 135 Z" fill="currentColor" />
                    <circle cx="72" cy="142" r="7.5" fill="white" strokeWidth="2.5" />
                    <circle cx="88" cy="142" r="7.5" fill="white" strokeWidth="2.5" />
                    <line x1="79.5" y1="142" x2="80.5" y2="142" strokeWidth="2.5" />
                    <circle cx="72" cy="142" r="3" fill="currentColor" />
                    <circle cx="88" cy="142" r="3" fill="currentColor" />
                    <path d="M 74 158 Q 80 164 86 158" fill="none" strokeWidth="2.8" />
                    <path d="M 25 290 Q 45 195 80 195 Q 115 195 135 290" fill="white" strokeWidth="3.2" />
                    <path d="M 55 198 L 70 290" strokeWidth="7" stroke="currentColor" />
                    <path d="M 105 198 L 90 290" strokeWidth="7" stroke="currentColor" />
                    <g transform="translate(62, 230)">
                      <rect x="0" y="0" width="36" height="12" rx="4" fill="white" stroke="currentColor" strokeWidth="2.5" />
                      <rect x="15" y="-2" width="6" height="16" fill="currentColor" />
                    </g>
                  </g>

                  {/* FRONT 5: Computer Science Student with Heavy Backpack */}
                  <g transform="translate(670, 5)">
                    <path d="M 32 175 C 25 105, 135 105, 128 175 Z" fill="currentColor" />
                    <rect x="62" y="112" width="36" height="7" rx="3.5" fill="white" stroke="currentColor" strokeWidth="2.2" />
                    <line x1="45" y1="145" x2="115" y2="145" stroke="white" strokeWidth="3" />
                    <circle cx="80" cy="146" r="27" fill="white" />
                    <path d="M 53 132 C 53 100, 107 100, 107 132 C 95 118, 65 118, 53 132 Z" fill="currentColor" />
                    <rect x="66" y="140" width="12" height="10" rx="2" fill="white" strokeWidth="2.6" />
                    <rect x="82" y="140" width="12" height="10" rx="2" fill="white" strokeWidth="2.6" />
                    <line x1="78" y1="145" x2="82" y2="145" strokeWidth="2.5" />
                    <circle cx="72" cy="145" r="3" fill="currentColor" />
                    <circle cx="88" cy="145" r="3" fill="currentColor" />
                    <path d="M 74 160 Q 80 165 86 160" fill="none" strokeWidth="2.8" />
                    <path d="M 25 290 Q 45 195 80 195 Q 115 195 135 290" fill="white" strokeWidth="3.2" />
                    <path d="M 46 200 L 52 290" strokeWidth="8" stroke="currentColor" />
                    <rect x="49" y="230" width="10" height="6" rx="1.5" fill="white" stroke="currentColor" strokeWidth="2" />
                    <path d="M 114 200 L 108 290" strokeWidth="8" stroke="currentColor" />
                    <rect x="101" y="230" width="10" height="6" rx="1.5" fill="white" stroke="currentColor" strokeWidth="2" />
                    <g transform="translate(25, 230) rotate(15)">
                      <rect x="0" y="0" width="40" height="28" rx="3" fill="currentColor" />
                      <line x1="4" y1="4" x2="36" y2="4" stroke="white" strokeWidth="1.5" />
                    </g>
                  </g>
                </g>
              ))}
            </g>
          </svg>
        </div>
      </div>

      {/* Bottom Crisp Hairline Border */}
      <div className="w-full h-[1px] bg-zinc-200"></div>
    </div>
  );
}
