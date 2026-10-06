'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Interactive Student Crowd Canvas / Panorama
 * Inspired by the hand-drawn ink line-art crowd concept, customized specifically
 * for Jordanian university students carrying backpacks, study books, graduation caps,
 * and campus gear with buttery-smooth multi-layer parallax and physics damping.
 */

interface CharacterTag {
  id: string;
  title: string;
  major: string;
}

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

  // Active hover student tag
  const [activeTag, setActiveTag] = useState<CharacterTag | null>(null);
  const [tagPos, setTagPos] = useState<{ x: number; y: number } | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Mouse move handler
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width; // 0 to 1
    // Range: -1 (far right) to 1 (far left)
    const normalized = (relativeX - 0.5) * 2;
    targetOffset.current = normalized * 240; // Max pan 240px
    lastInteractionTime.current = Date.now();
    if (!hasInteracted) setHasInteracted(true);
  }, [hasInteracted]);

  // Touch drag handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    isDragging.current = true;
    startDragX.current = e.touches[0].clientX;
    dragStartOffset.current = targetOffset.current;
    lastInteractionTime.current = Date.now();
    setHasInteracted(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const delta = e.touches[0].clientX - startDragX.current;
    targetOffset.current = Math.max(-280, Math.min(280, dragStartOffset.current + delta * 1.2));
    lastInteractionTime.current = Date.now();
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  // Physics animation loop (Smooth lerp + ambient idle float)
  useEffect(() => {
    const layerBack = document.getElementById('crowd-layer-back');
    const layerMid = document.getElementById('crowd-layer-mid');
    const layerFront = document.getElementById('crowd-layer-front');

    const animate = () => {
      const now = Date.now();
      const timeSinceInteraction = now - lastInteractionTime.current;

      // Ambient subtle drift if user is idle
      let effectiveTarget = targetOffset.current;
      if (timeSinceInteraction > 2500) {
        const idleWave = Math.sin(now * 0.0008) * 60;
        effectiveTarget += idleWave;
      }

      // Lerp damping (0.07 gives smooth inertia)
      currentOffset.current += (effectiveTarget - currentOffset.current) * 0.07;

      const offset = currentOffset.current;

      if (layerBack) {
        layerBack.style.transform = `translate3d(${offset * 0.4}px, 0, 0)`;
      }
      if (layerMid) {
        layerMid.style.transform = `translate3d(${offset * 0.75}px, 0, 0)`;
      }
      if (layerFront) {
        layerFront.style.transform = `translate3d(${offset * 1.15}px, 0, 0)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const handleCharacterHover = (
    e: React.MouseEvent,
    tag: CharacterTag
  ) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setActiveTag(tag);
    setTagPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 15,
    });
  };

  const handleCharacterLeave = () => {
    setActiveTag(null);
    setTagPos(null);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full overflow-hidden select-none cursor-ew-resize bg-white pt-2 pb-0"
      style={{ touchAction: 'pan-y' }}
    >
      {/* Visual Ambient Hint Badge */}
      <div
        className={`absolute top-2 left-1/2 -translate-x-1/2 z-30 transition-opacity duration-700 pointer-events-none ${
          hasInteracted ? 'opacity-0' : 'opacity-85'
        }`}
      >
        <div className="flex items-center gap-1.5 px-3 py-1 bg-black/90 text-white text-[11px] font-medium rounded-full shadow-md backdrop-blur-xs">
          <span className="animate-pulse">↔</span>
          <span>حرّك المؤشر لاستكشاف طلبة الجامعات</span>
        </div>
      </div>

      {/* Floating Hover Tooltip */}
      {activeTag && tagPos && (
        <div
          className="absolute z-40 pointer-events-none transition-transform duration-75 ease-out"
          style={{
            left: `${tagPos.x}px`,
            top: `${tagPos.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="bg-black text-white px-2.5 py-1 rounded-sm text-[11px] font-bold shadow-lg border border-zinc-700 whitespace-nowrap text-center">
            <div>{activeTag.title}</div>
            <div className="text-[10px] text-zinc-300 font-normal">{activeTag.major}</div>
          </div>
          <div className="w-2 h-2 bg-black rotate-45 mx-auto -mt-1 border-r border-b border-zinc-700"></div>
        </div>
      )}

      {/* Panorama Viewport */}
      <div className="relative h-[280px] sm:h-[340px] md:h-[380px] w-full flex items-end justify-center overflow-hidden">
        {/* ========================================================= */}
        {/* LAYER 1: BACKGROUND (Parallax 0.4x) - Distant Student Crowd */}
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
            {/* Background silhouettes, hats, backpacks rising behind */}
            <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              {/* Repeating module of background students with backpacks */}
              {[0, 600, 1200, 1800].map((shiftX, idx) => (
                <g key={`bg-mod-${idx}`} transform={`translate(${shiftX}, 40)`}>
                  {/* BG Student A: Beanie + Backpack visible */}
                  <g opacity="0.85">
                    {/* Backpack peeking out behind shoulder */}
                    <path d="M 45 150 C 45 120, 75 110, 85 110 C 95 110, 115 120, 115 150" fill="currentColor" />
                    <rect x="55" y="118" width="16" height="4" rx="2" fill="white" />
                    {/* Head & Beanie */}
                    <circle cx="80" cy="155" r="28" fill="white" />
                    <path d="M 52 145 C 52 125, 62 118, 80 118 C 98 118, 108 125, 108 145 Z" fill="currentColor" />
                    <rect x="50" y="142" width="60" height="7" rx="3.5" fill="white" stroke="currentColor" strokeWidth="2" />
                    {/* Glasses & Face */}
                    <circle cx="72" cy="156" r="6" fill="white" />
                    <circle cx="88" cy="156" r="6" fill="white" />
                    <path d="M 78 156 L 82 156" />
                    <circle cx="72" cy="156" r="2.5" fill="currentColor" />
                    <circle cx="88" cy="156" r="2.5" fill="currentColor" />
                    <path d="M 77 169 Q 80 172 83 169" />
                    {/* Shoulders */}
                    <path d="M 40 210 Q 55 180 80 180 Q 105 180 120 210" fill="white" />
                  </g>

                  {/* BG Student B: High Bun + Backpack strap */}
                  <g opacity="0.9" transform="translate(110, 10)">
                    {/* Backpack bulk behind */}
                    <path d="M 30 140 Q 25 105 50 100 Q 65 98 75 120" fill="currentColor" />
                    {/* High Hair Bun */}
                    <circle cx="65" cy="108" r="15" fill="currentColor" />
                    {/* Head */}
                    <circle cx="65" cy="145" r="26" fill="white" />
                    <path d="M 42 135 C 45 120 85 120 88 135 C 80 125 50 125 42 135 Z" fill="currentColor" />
                    {/* Face features */}
                    <circle cx="58" cy="144" r="2.5" fill="currentColor" />
                    <circle cx="72" cy="144" r="2.5" fill="currentColor" />
                    <path d="M 62 156 Q 65 159 68 156" />
                    {/* Backpack strap diagonal */}
                    <path d="M 35 200 Q 50 170 65 170 Q 80 170 95 200" fill="white" />
                    <path d="M 45 180 L 58 200" strokeWidth="3" />
                  </g>

                  {/* BG Student C: Graduation Cap Senior in background */}
                  <g opacity="0.9" transform="translate(220, -5)">
                    {/* Mortarboard hat */}
                    <polygon points="65,95 105,110 65,125 25,110" fill="currentColor" />
                    <circle cx="65" cy="110" r="3" fill="white" />
                    {/* Tassel */}
                    <path d="M 65 110 Q 85 118 88 132" fill="none" strokeWidth="2.5" />
                    <circle cx="88" cy="134" r="2" fill="currentColor" />
                    {/* Head */}
                    <circle cx="65" cy="142" r="24" fill="white" />
                    {/* Eyes & smile */}
                    <circle cx="57" cy="142" r="2.5" fill="currentColor" />
                    <circle cx="73" cy="142" r="2.5" fill="currentColor" />
                    <path d="M 60 152 Q 65 157 70 152" fill="none" strokeWidth="2" />
                    {/* Collar & backpack top handle */}
                    <path d="M 35 190 Q 65 165 95 190" fill="white" />
                    <path d="M 52 165 Q 65 155 78 165" fill="none" strokeWidth="2" />
                  </g>

                  {/* BG Student D: Wavy Afro + Backpack */}
                  <g opacity="0.85" transform="translate(320, 15)">
                    {/* Big curly afro hair */}
                    <circle cx="75" cy="130" r="34" fill="currentColor" />
                    <circle cx="50" cy="138" r="20" fill="currentColor" />
                    <circle cx="100" cy="138" r="20" fill="currentColor" />
                    {/* Face */}
                    <circle cx="75" cy="148" r="24" fill="white" />
                    {/* Glasses */}
                    <rect x="60" y="142" width="12" height="10" rx="3" fill="white" strokeWidth="2" />
                    <rect x="78" y="142" width="12" height="10" rx="3" fill="white" strokeWidth="2" />
                    <line x1="72" y1="147" x2="78" y2="147" strokeWidth="2" />
                    <circle cx="66" cy="147" r="2" fill="currentColor" />
                    <circle cx="84" cy="147" r="2" fill="currentColor" />
                    <path d="M 70 160 Q 75 163 80 160" />
                    {/* Backpack shape */}
                    <path d="M 35 195 Q 75 170 115 195" fill="white" />
                  </g>

                  {/* BG Student E: Hijab with study notes */}
                  <g opacity="0.9" transform="translate(430, 20)">
                    {/* Hijab wrap */}
                    <path d="M 50 120 C 50 95, 100 95, 100 120 C 105 150, 105 185, 75 185 C 45 185, 45 150, 50 120 Z" fill="currentColor" />
                    {/* Face opening */}
                    <ellipse cx="75" cy="140" rx="17" ry="21" fill="white" stroke="none" />
                    <circle cx="68" cy="138" r="2.5" fill="currentColor" />
                    <circle cx="82" cy="138" r="2.5" fill="currentColor" />
                    <path d="M 71 150 Q 75 154 79 150" fill="none" strokeWidth="2" />
                    {/* Shoulders */}
                    <path d="M 35 200 Q 75 180 115 200" fill="white" />
                  </g>

                  {/* BG Student F: Cap Backwards + Dual straps */}
                  <g opacity="0.85" transform="translate(520, 25)">
                    {/* Backward baseball cap */}
                    <path d="M 45 130 C 45 110, 85 110, 85 130" fill="currentColor" />
                    <rect x="75" y="132" width="22" height="5" rx="2.5" fill="currentColor" />
                    {/* Head */}
                    <circle cx="65" cy="145" r="22" fill="white" />
                    <circle cx="58" cy="144" r="2.5" fill="currentColor" />
                    <circle cx="72" cy="144" r="2.5" fill="currentColor" />
                    <path d="M 61 154 Q 65 157 69 154" fill="none" />
                    {/* Backpack strap lines */}
                    <path d="M 30 195 Q 65 170 100 195" fill="white" />
                    <path d="M 45 180 L 48 195" strokeWidth="3" />
                    <path d="M 85 180 L 82 195" strokeWidth="3" />
                  </g>
                </g>
              ))}
            </g>
          </svg>
        </div>

        {/* ========================================================= */}
        {/* LAYER 2: MIDGROUND (Parallax 0.75x) - Active College Students */}
        {/* ========================================================= */}
        <div
          id="crowd-layer-mid"
          className="absolute bottom-0 w-[2400px] h-full flex items-end justify-center will-change-transform"
        >
          <svg
            viewBox="0 0 2400 360"
            className="w-full h-full text-black fill-white"
            preserveAspectRatio="xMidYMax slice"
          >
            <g stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round">
              {[0, 800, 1600].map((shiftX, idx) => (
                <g key={`mid-mod-${idx}`} transform={`translate(${shiftX}, 20)`}>
                  {/* MID 1: Female Student with Chic Hijab & Heavy Backpack */}
                  <g
                    className="cursor-pointer transition-transform duration-200 hover:-translate-y-1"
                    onMouseEnter={(e) =>
                      handleCharacterHover(e, {
                        id: `m1-${idx}`,
                        title: 'طالبة هندسة حاسوب',
                        major: 'تحمل حقيبة ظهر ودفاتر المشاريع',
                      })
                    }
                    onMouseLeave={handleCharacterLeave}
                    transform="translate(40, 20)"
                  >
                    {/* Backpack Body behind shoulders */}
                    <path d="M 40 160 C 35 110, 115 110, 110 160 Z" fill="currentColor" />
                    <rect x="60" y="118" width="30" height="7" rx="3.5" fill="white" stroke="currentColor" strokeWidth="2" />
                    {/* Hijab wrap */}
                    <path d="M 48 125 C 48 85, 102 85, 102 125 C 110 170, 105 210, 75 210 C 45 210, 40 170, 48 125 Z" fill="currentColor" />
                    <ellipse cx="75" cy="140" rx="19" ry="24" fill="white" />
                    {/* Eyeglasses */}
                    <circle cx="68" cy="138" r="7.5" fill="white" strokeWidth="2.2" />
                    <circle cx="82" cy="138" r="7.5" fill="white" strokeWidth="2.2" />
                    <line x1="75.5" y1="138" x2="74.5" y2="138" strokeWidth="2" />
                    <circle cx="68" cy="138" r="2.8" fill="currentColor" />
                    <circle cx="82" cy="138" r="2.8" fill="currentColor" />
                    {/* Smile */}
                    <path d="M 70 153 Q 75 158 80 153" fill="none" strokeWidth="2.2" />
                    {/* Padded Backpack Straps on Chest */}
                    <path d="M 25 240 Q 40 190 75 190 Q 110 190 125 240" fill="white" strokeWidth="2.8" />
                    {/* Left Strap with buckle */}
                    <path d="M 42 195 Q 48 215 50 240" strokeWidth="6" stroke="currentColor" />
                    <rect x="44" y="212" width="8" height="5" rx="1" fill="white" stroke="currentColor" strokeWidth="1.5" />
                    {/* Right Strap with buckle */}
                    <path d="M 108 195 Q 102 215 100 240" strokeWidth="6" stroke="currentColor" />
                    <rect x="98" y="212" width="8" height="5" rx="1" fill="white" stroke="currentColor" strokeWidth="1.5" />
                    {/* College Folder held in front */}
                    <rect x="52" y="225" width="46" height="32" rx="2" fill="white" stroke="currentColor" strokeWidth="2.5" />
                    <line x1="58" y1="233" x2="88" y2="233" strokeWidth="2" />
                    <line x1="58" y1="241" x2="80" y2="241" strokeWidth="2" />
                  </g>

                  {/* MID 2: Tech Student with Headphones & Laptop Sleeve */}
                  <g
                    className="cursor-pointer transition-transform duration-200 hover:-translate-y-1"
                    onMouseEnter={(e) =>
                      handleCharacterHover(e, {
                        id: `m2-${idx}`,
                        title: 'طالب ذكاء اصطناعي',
                        major: 'سماعات رأس وحقيبة لابتوب دراسية',
                      })
                    }
                    onMouseLeave={handleCharacterLeave}
                    transform="translate(170, 10)"
                  >
                    {/* Backpack visible over left shoulder */}
                    <path d="M 28 150 C 25 110, 55 100, 65 125" fill="currentColor" />
                    {/* Headphones on neck */}
                    <path d="M 50 172 Q 75 188 100 172" fill="none" strokeWidth="5" stroke="currentColor" />
                    <circle cx="48" cy="170" r="8" fill="currentColor" />
                    <circle cx="102" cy="170" r="8" fill="currentColor" />
                    {/* Head & Short fade hair */}
                    <circle cx="75" cy="135" r="26" fill="white" />
                    <path d="M 50 125 C 50 95, 100 95, 100 125 C 90 112, 60 112, 50 125 Z" fill="currentColor" />
                    {/* Face & Confident Smile */}
                    <circle cx="67" cy="135" r="3" fill="currentColor" />
                    <circle cx="83" cy="135" r="3" fill="currentColor" />
                    <path d="M 70 148 Q 75 153 80 148" fill="none" strokeWidth="2.5" />
                    {/* Hoodie Torso */}
                    <path d="M 25 240 Q 40 185 75 185 Q 110 185 125 240" fill="white" strokeWidth="2.8" />
                    {/* Hoodie Strings */}
                    <line x1="70" y1="188" x2="68" y2="215" strokeWidth="2.5" />
                    <circle cx="68" cy="216" r="2" fill="currentColor" />
                    <line x1="80" y1="188" x2="82" y2="215" strokeWidth="2.5" />
                    <circle cx="82" cy="216" r="2" fill="currentColor" />
                    {/* Backpack Padded Straps */}
                    <path d="M 40 190 L 45 240" strokeWidth="5.5" stroke="currentColor" />
                    <path d="M 110 190 L 105 240" strokeWidth="5.5" stroke="currentColor" />
                  </g>

                  {/* MID 3: Medical/Pharmacy Student with Thick Textbooks */}
                  <g
                    className="cursor-pointer transition-transform duration-200 hover:-translate-y-1"
                    onMouseEnter={(e) =>
                      handleCharacterHover(e, {
                        id: `m3-${idx}`,
                        title: 'طالبة صيدلة وسريرية',
                        major: 'تحمل مراجع أكاديمية وحقيبة كتف',
                      })
                    }
                    onMouseLeave={handleCharacterLeave}
                    transform="translate(300, 25)"
                  >
                    {/* Hair with neat ponytail */}
                    <circle cx="75" cy="132" r="25" fill="white" />
                    <path d="M 50 125 C 50 100, 100 100, 100 125 C 95 110, 55 110, 50 125 Z" fill="currentColor" />
                    <path d="M 98 128 C 115 132, 118 160, 105 168 C 100 162, 100 145, 95 135 Z" fill="currentColor" />
                    {/* Face & Glasses */}
                    <circle cx="67" cy="132" r="2.8" fill="currentColor" />
                    <circle cx="83" cy="132" r="2.8" fill="currentColor" />
                    <path d="M 71 144 Q 75 148 79 144" fill="none" strokeWidth="2.2" />
                    {/* Torso & Backpack Straps */}
                    <path d="M 30 235 Q 45 180 75 180 Q 105 180 120 235" fill="white" strokeWidth="2.8" />
                    <path d="M 45 185 L 48 235" strokeWidth="5" stroke="currentColor" />
                    <path d="M 105 185 L 102 235" strokeWidth="5" stroke="currentColor" />
                    {/* Thick Medical Textbooks held in arms */}
                    <g transform="translate(50, 205)">
                      <rect x="0" y="0" width="50" height="20" rx="2" fill="white" stroke="currentColor" strokeWidth="2.5" />
                      <line x1="6" y1="0" x2="6" y2="20" strokeWidth="2" />
                      <line x1="12" y1="6" x2="44" y2="6" strokeWidth="1.8" />
                      <line x1="12" y1="12" x2="36" y2="12" strokeWidth="1.8" />
                      {/* Second Book underneath */}
                      <rect x="-4" y="16" width="58" height="18" rx="2" fill="currentColor" />
                      <line x1="2" y1="20" x2="2" y2="30" stroke="white" strokeWidth="2" />
                    </g>
                  </g>

                  {/* MID 4: Senior Graduate with Mortarboard Cap & Diploma */}
                  <g
                    className="cursor-pointer transition-transform duration-200 hover:-translate-y-1"
                    onMouseEnter={(e) =>
                      handleCharacterHover(e, {
                        id: `m4-${idx}`,
                        title: 'خريج جامعي متميز',
                        major: 'قبعة التخرج ووثيقة التميز الأكاديمي',
                      })
                    }
                    onMouseLeave={handleCharacterLeave}
                    transform="translate(440, 5)"
                  >
                    {/* Graduation Mortarboard */}
                    <polygon points="75,80 125,98 75,116 25,98" fill="currentColor" />
                    <circle cx="75" cy="98" r="3.5" fill="white" />
                    {/* Swinging Tassel */}
                    <path d="M 75 98 Q 105 110 110 135" fill="none" strokeWidth="3" stroke="currentColor" />
                    <circle cx="110" cy="138" r="3" fill="currentColor" />
                    {/* Head & Beard */}
                    <circle cx="75" cy="136" r="26" fill="white" />
                    {/* Beard trim */}
                    <path d="M 54 140 C 54 165, 96 165, 96 140 Z" fill="currentColor" />
                    <circle cx="75" cy="134" r="18" fill="white" />
                    <circle cx="68" cy="132" r="3" fill="currentColor" />
                    <circle cx="82" cy="132" r="3" fill="currentColor" />
                    <path d="M 70 144 Q 75 149 80 144" fill="none" strokeWidth="2.5" />
                    {/* University Varsity Jacket */}
                    <path d="M 25 240 Q 40 182 75 182 Q 110 182 125 240" fill="white" strokeWidth="2.8" />
                    {/* Varsity "U" Badge on Chest */}
                    <path d="M 52 200 L 52 210 Q 52 216 57 216 Q 62 216 62 210 L 62 200" fill="none" strokeWidth="3" stroke="currentColor" />
                    {/* Backpack on one shoulder */}
                    <path d="M 108 184 L 105 240" strokeWidth="6" stroke="currentColor" />
                    {/* Rolled Diploma Scroll in Hand */}
                    <g transform="translate(75, 205)">
                      <rect x="0" y="0" width="35" height="10" rx="3" fill="white" stroke="currentColor" strokeWidth="2.4" />
                      <rect x="14" y="-1" width="6" height="12" fill="currentColor" />
                    </g>
                  </g>

                  {/* MID 5: Architecture / Arts Student with Drawing Tube & Backpack */}
                  <g
                    className="cursor-pointer transition-transform duration-200 hover:-translate-y-1"
                    onMouseEnter={(e) =>
                      handleCharacterHover(e, {
                        id: `m5-${idx}`,
                        title: 'طالبة هندسة عمارة',
                        major: 'أنبوبة المخططات وحقيبة أدوات الرسم',
                      })
                    }
                    onMouseLeave={handleCharacterLeave}
                    transform="translate(580, 18)"
                  >
                    {/* Architectural Drawing Tube Slung over Back */}
                    <g transform="rotate(-25 60 120)">
                      <rect x="25" y="60" width="16" height="110" rx="5" fill="currentColor" />
                      <line x1="25" y1="75" x2="41" y2="75" stroke="white" strokeWidth="2" />
                      <line x1="25" y1="80" x2="41" y2="80" stroke="white" strokeWidth="2" />
                      <rect x="23" y="55" width="20" height="10" rx="3" fill="white" stroke="currentColor" strokeWidth="2" />
                    </g>
                    {/* Head with Beanie & Curly Hair */}
                    <circle cx="75" cy="136" r="25" fill="white" />
                    <path d="M 48 126 C 48 98, 102 98, 102 126 Z" fill="currentColor" />
                    <rect x="46" y="123" width="58" height="8" rx="4" fill="white" stroke="currentColor" strokeWidth="2" />
                    {/* Glasses */}
                    <rect x="62" y="132" width="11" height="9" rx="2" fill="white" strokeWidth="2" />
                    <rect x="77" y="132" width="11" height="9" rx="2" fill="white" strokeWidth="2" />
                    <line x1="73" y1="136" x2="77" y2="136" strokeWidth="2" />
                    <circle cx="67.5" cy="136.5" r="2.5" fill="currentColor" />
                    <circle cx="82.5" cy="136.5" r="2.5" fill="currentColor" />
                    <path d="M 71 148 Q 75 152 79 148" fill="none" strokeWidth="2.2" />
                    {/* Torso & Backpack Straps */}
                    <path d="M 28 238 Q 45 185 75 185 Q 105 185 122 238" fill="white" strokeWidth="2.8" />
                    <path d="M 45 190 L 48 238" strokeWidth="5.5" stroke="currentColor" />
                    <path d="M 105 190 L 102 238" strokeWidth="5.5" stroke="currentColor" />
                  </g>

                  {/* MID 6: Freshman Student with Huge Backpack */}
                  <g
                    className="cursor-pointer transition-transform duration-200 hover:-translate-y-1"
                    onMouseEnter={(e) =>
                      handleCharacterHover(e, {
                        id: `m6-${idx}`,
                        title: 'طالب سنة أولى مستجد',
                        major: 'حقيبة ظهر جامعية كاملة وبطاقة الطالب',
                      })
                    }
                    onMouseLeave={handleCharacterLeave}
                    transform="translate(700, 12)"
                  >
                    {/* Massive Backpack rising behind head */}
                    <path d="M 30 160 C 25 90, 125 90, 120 160 Z" fill="currentColor" />
                    <rect x="55" y="98" width="40" height="9" rx="4.5" fill="white" stroke="currentColor" strokeWidth="2.2" />
                    <path d="M 45 130 Q 75 140 105 130" stroke="white" strokeWidth="2.5" />
                    {/* Head */}
                    <circle cx="75" cy="138" r="24" fill="white" />
                    <path d="M 52 125 C 52 105, 98 105, 98 125 C 88 115, 62 115, 52 125 Z" fill="currentColor" />
                    <circle cx="68" cy="136" r="3" fill="currentColor" />
                    <circle cx="82" cy="136" r="3" fill="currentColor" />
                    <path d="M 70 148 Q 75 153 80 148" fill="none" strokeWidth="2.4" />
                    {/* Student ID Card Lanyard around neck */}
                    <path d="M 68 185 L 75 210 L 82 185" fill="none" strokeWidth="2" stroke="currentColor" />
                    <rect x="68" y="210" width="14" height="18" rx="2" fill="white" stroke="currentColor" strokeWidth="1.8" />
                    <rect x="71" y="213" width="8" height="7" fill="currentColor" />
                    <line x1="71" y1="223" x2="79" y2="223" strokeWidth="1.5" />
                    {/* Torso & Padded Dual Straps */}
                    <path d="M 30 240 Q 45 185 75 185 Q 105 185 120 240" fill="white" strokeWidth="2.8" />
                    <path d="M 45 188 L 50 240" strokeWidth="6" stroke="currentColor" />
                    <path d="M 105 188 L 100 240" strokeWidth="6" stroke="currentColor" />
                  </g>
                </g>
              ))}
            </g>
          </svg>
        </div>

        {/* ========================================================= */}
        {/* LAYER 3: FOREGROUND (Parallax 1.15x) - Hero Frontline Students */}
        {/* Rich detail, prominent backpack straps, books, campus coffee */}
        {/* ========================================================= */}
        <div
          id="crowd-layer-front"
          className="absolute bottom-0 w-[2400px] h-full flex items-end justify-center will-change-transform"
        >
          <svg
            viewBox="0 0 2400 360"
            className="w-full h-full text-black fill-white"
            preserveAspectRatio="xMidYMax slice"
          >
            <g stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
              {[0, 800, 1600].map((shiftX, idx) => (
                <g key={`front-mod-${idx}`} transform={`translate(${shiftX}, 0)`}>
                  {/* FRONT 1: Confident Engineering Student with Large Backpack */}
                  <g
                    className="cursor-pointer transition-transform duration-200 hover:-translate-y-1.5"
                    onMouseEnter={(e) =>
                      handleCharacterHover(e, {
                        id: `f1-${idx}`,
                        title: 'طالب هندسة ميكانيكية',
                        major: 'حقيبة ظهر مزدوجة الحمالات ومخطط أكاديمي',
                      })
                    }
                    onMouseLeave={handleCharacterLeave}
                    transform="translate(70, 0)"
                  >
                    {/* High-capacity Backpack rising on sides */}
                    <path d="M 30 180 C 25 100, 135 100, 130 180 Z" fill="currentColor" />
                    <rect x="62" y="108" width="36" height="8" rx="4" fill="white" stroke="currentColor" strokeWidth="2.5" />
                    {/* Head & Stylish Curly Hair */}
                    <circle cx="80" cy="148" r="28" fill="white" />
                    <path d="M 52 135 C 50 95, 110 95, 108 135 C 98 120, 62 120, 52 135 Z" fill="currentColor" />
                    {/* Eyeglasses */}
                    <rect x="66" y="142" width="13" height="11" rx="3" fill="white" strokeWidth="2.5" />
                    <rect x="83" y="142" width="13" height="11" rx="3" fill="white" strokeWidth="2.5" />
                    <line x1="79" y1="147" x2="83" y2="147" strokeWidth="2.5" />
                    <circle cx="72.5" cy="147.5" r="3" fill="currentColor" />
                    <circle cx="89.5" cy="147.5" r="3" fill="currentColor" />
                    {/* Genuine Smile */}
                    <path d="M 73 162 Q 80 168 87 162" fill="none" strokeWidth="2.8" />
                    {/* Torso / College Jacket */}
                    <path d="M 25 270 Q 45 195 80 195 Q 115 195 135 270" fill="white" strokeWidth="3.2" />
                    {/* Prominent Ergonomic Padded Backpack Straps */}
                    <path d="M 44 200 Q 52 230 55 270" strokeWidth="8" stroke="currentColor" />
                    <rect x="47" y="228" width="10" height="6" rx="1.5" fill="white" stroke="currentColor" strokeWidth="2" />
                    <path d="M 116 200 Q 108 230 105 270" strokeWidth="8" stroke="currentColor" />
                    <rect x="103" y="228" width="10" height="6" rx="1.5" fill="white" stroke="currentColor" strokeWidth="2" />
                    {/* Sternum Cross-Strap Clip between backpack straps */}
                    <line x1="53" y1="231" x2="104" y2="231" strokeWidth="3" stroke="currentColor" />
                    <rect x="74" y="227" width="10" height="8" rx="2" fill="currentColor" />
                    {/* Large Study Folder clamped to chest */}
                    <g transform="translate(56, 238)">
                      <rect x="0" y="0" width="48" height="32" rx="3" fill="white" stroke="currentColor" strokeWidth="2.8" />
                      <line x1="8" y1="8" x2="40" y2="8" strokeWidth="2.2" />
                      <line x1="8" y1="16" x2="32" y2="16" strokeWidth="2.2" />
                      <line x1="8" y1="24" x2="24" y2="24" strokeWidth="2.2" />
                    </g>
                  </g>

                  {/* FRONT 2: Medical Student with Lab Coat & Stethoscope & Backpack */}
                  <g
                    className="cursor-pointer transition-transform duration-200 hover:-translate-y-1.5"
                    onMouseEnter={(e) =>
                      handleCharacterHover(e, {
                        id: `f2-${idx}`,
                        title: 'طالبة طب وجراحة',
                        major: 'سماعة طبية وحقيبة كتب جامعية',
                      })
                    }
                    onMouseLeave={handleCharacterLeave}
                    transform="translate(220, 10)"
                  >
                    {/* Backpack visible on side */}
                    <path d="M 32 170 C 25 125, 55 115, 68 140" fill="currentColor" />
                    {/* Elegant Modern Hijab */}
                    <path d="M 48 135 C 48 90, 112 90, 112 135 C 120 185, 115 220, 80 220 C 45 220, 40 185, 48 135 Z" fill="currentColor" />
                    <ellipse cx="80" cy="150" rx="20" ry="26" fill="white" />
                    <circle cx="72" cy="148" r="3" fill="currentColor" />
                    <circle cx="88" cy="148" r="3" fill="currentColor" />
                    <path d="M 75 163 Q 80 168 85 163" fill="none" strokeWidth="2.8" />
                    {/* Lab Coat / Blazer Torso */}
                    <path d="M 28 270 Q 48 200 80 200 Q 112 200 132 270" fill="white" strokeWidth="3.2" />
                    {/* Coat Lapels */}
                    <path d="M 64 200 L 74 240 L 80 270" strokeWidth="2.5" />
                    <path d="M 96 200 L 86 240 L 80 270" strokeWidth="2.5" />
                    {/* Stethoscope around neck */}
                    <path d="M 66 215 Q 80 248 94 215" fill="none" strokeWidth="3.5" stroke="currentColor" />
                    <circle cx="80" cy="248" r="6" fill="currentColor" />
                    {/* Backpack Shoulder Straps */}
                    <path d="M 46 205 L 50 270" strokeWidth="7.5" stroke="currentColor" />
                    <path d="M 114 205 L 110 270" strokeWidth="7.5" stroke="currentColor" />
                    {/* Thick Anatomy Textbook held vertically */}
                    <g transform="translate(84, 215)">
                      <rect x="0" y="0" width="34" height="48" rx="3" fill="currentColor" stroke="currentColor" />
                      <line x1="6" y1="0" x2="6" y2="48" stroke="white" strokeWidth="2" />
                      <line x1="12" y1="12" x2="28" y2="12" stroke="white" strokeWidth="2" />
                      <line x1="12" y1="20" x2="24" y2="20" stroke="white" strokeWidth="2" />
                    </g>
                  </g>

                  {/* FRONT 3: Student with Campus Coffee & Crossbody Bag */}
                  <g
                    className="cursor-pointer transition-transform duration-200 hover:-translate-y-1.5"
                    onMouseEnter={(e) =>
                      handleCharacterHover(e, {
                        id: `f3-${idx}`,
                        title: 'طالب إدارة أعمال وتسويق',
                        major: 'قهوة الجامعة وحقيبة كتف للمحاضرات',
                      })
                    }
                    onMouseLeave={handleCharacterLeave}
                    transform="translate(370, 0)"
                  >
                    {/* Head & Short Trim Hair */}
                    <circle cx="80" cy="145" r="27" fill="white" />
                    <path d="M 53 135 C 53 105, 107 105, 107 135 C 95 120, 65 120, 53 135 Z" fill="currentColor" />
                    {/* Neatly trimmed beard */}
                    <path d="M 58 150 C 58 175, 102 175, 102 150 Z" fill="currentColor" />
                    <circle cx="80" cy="144" r="19" fill="white" />
                    <circle cx="73" cy="142" r="3.2" fill="currentColor" />
                    <circle cx="87" cy="142" r="3.2" fill="currentColor" />
                    <path d="M 75 155 Q 80 160 85 155" fill="none" strokeWidth="2.8" />
                    {/* Sweater with Shirt Collar */}
                    <path d="M 25 270 Q 45 195 80 195 Q 115 195 135 270" fill="white" strokeWidth="3.2" />
                    <polygon points="80,195 70,210 80,218 90,210" fill="white" stroke="currentColor" strokeWidth="2.5" />
                    {/* Wide Crossbody Bag Strap going diagonally across chest */}
                    <path d="M 38 200 L 122 265" strokeWidth="11" stroke="currentColor" />
                    <rect x="74" y="228" width="12" height="8" rx="2" fill="white" stroke="currentColor" strokeWidth="2.5" />
                    {/* Takeaway Campus Coffee Cup in hand */}
                    <g transform="translate(42, 225)">
                      <polygon points="0,6 20,6 17,32 3,32" fill="white" stroke="currentColor" strokeWidth="2.5" />
                      <rect x="-2" y="2" width="24" height="4" rx="2" fill="currentColor" />
                      <rect x="1" y="14" width="18" height="10" fill="currentColor" />
                    </g>
                  </g>

                  {/* FRONT 4: Senior Graduate in Full Robes & Cap */}
                  <g
                    className="cursor-pointer transition-transform duration-200 hover:-translate-y-1.5"
                    onMouseEnter={(e) =>
                      handleCharacterHover(e, {
                        id: `f4-${idx}`,
                        title: 'خريجة مرتبة الشرف',
                        major: 'فوج التخرج الجامعي 2026',
                      })
                    }
                    onMouseLeave={handleCharacterLeave}
                    transform="translate(520, -5)"
                  >
                    {/* Graduation Mortarboard with swinging golden tassel */}
                    <polygon points="80,75 135,95 80,115 25,95" fill="currentColor" />
                    <circle cx="80" cy="95" r="4" fill="white" />
                    <path d="M 80 95 Q 115 105 120 135" fill="none" strokeWidth="3.5" stroke="currentColor" />
                    <circle cx="120" cy="138" r="3.5" fill="currentColor" />
                    {/* Face & Confident Smile */}
                    <circle cx="80" cy="144" r="27" fill="white" />
                    <path d="M 53 135 C 55 115, 105 115, 107 135 Z" fill="currentColor" />
                    {/* Elegant Glasses */}
                    <circle cx="72" cy="142" r="7.5" fill="white" strokeWidth="2.5" />
                    <circle cx="88" cy="142" r="7.5" fill="white" strokeWidth="2.5" />
                    <line x1="79.5" y1="142" x2="80.5" y2="142" strokeWidth="2.5" />
                    <circle cx="72" cy="142" r="3" fill="currentColor" />
                    <circle cx="88" cy="142" r="3" fill="currentColor" />
                    <path d="M 74 158 Q 80 164 86 158" fill="none" strokeWidth="2.8" />
                    {/* Graduation Gown with Sash */}
                    <path d="M 25 270 Q 45 195 80 195 Q 115 195 135 270" fill="white" strokeWidth="3.2" />
                    {/* University Honor Sash draped over neck */}
                    <path d="M 55 198 L 70 270" strokeWidth="7" stroke="currentColor" />
                    <path d="M 105 198 L 90 270" strokeWidth="7" stroke="currentColor" />
                    {/* Diploma Cylinder / Scroll in hand with ribbon */}
                    <g transform="translate(62, 230)">
                      <rect x="0" y="0" width="36" height="12" rx="4" fill="white" stroke="currentColor" strokeWidth="2.5" />
                      <rect x="15" y="-2" width="6" height="16" fill="currentColor" />
                    </g>
                  </g>

                  {/* FRONT 5: Computer Science Student with Heavy Backpack & Glasses */}
                  <g
                    className="cursor-pointer transition-transform duration-200 hover:-translate-y-1.5"
                    onMouseEnter={(e) =>
                      handleCharacterHover(e, {
                        id: `f5-${idx}`,
                        title: 'طالب أمن سيبراني',
                        major: 'حقيبة ظهر تقنية وحافظة أجهزة تعليمية',
                      })
                    }
                    onMouseLeave={handleCharacterLeave}
                    transform="translate(670, 5)"
                  >
                    {/* Big Tactical College Backpack rising behind */}
                    <path d="M 32 175 C 25 105, 135 105, 128 175 Z" fill="currentColor" />
                    <rect x="62" y="112" width="36" height="7" rx="3.5" fill="white" stroke="currentColor" strokeWidth="2.2" />
                    <line x1="45" y1="145" x2="115" y2="145" stroke="white" strokeWidth="3" />
                    {/* Head & Modern Haircut */}
                    <circle cx="80" cy="146" r="27" fill="white" />
                    <path d="M 53 132 C 53 100, 107 100, 107 132 C 95 118, 65 118, 53 132 Z" fill="currentColor" />
                    {/* Bold Rectangular Glasses */}
                    <rect x="66" y="140" width="12" height="10" rx="2" fill="white" strokeWidth="2.6" />
                    <rect x="82" y="140" width="12" height="10" rx="2" fill="white" strokeWidth="2.6" />
                    <line x1="78" y1="145" x2="82" y2="145" strokeWidth="2.5" />
                    <circle cx="72" cy="145" r="3" fill="currentColor" />
                    <circle cx="88" cy="145" r="3" fill="currentColor" />
                    <path d="M 74 160 Q 80 165 86 160" fill="none" strokeWidth="2.8" />
                    {/* College Hoodie */}
                    <path d="M 25 270 Q 45 195 80 195 Q 115 195 135 270" fill="white" strokeWidth="3.2" />
                    {/* Backpack Padded Straps with Heavy Clips */}
                    <path d="M 46 200 L 52 270" strokeWidth="8" stroke="currentColor" />
                    <rect x="49" y="230" width="10" height="6" rx="1.5" fill="white" stroke="currentColor" strokeWidth="2" />
                    <path d="M 114 200 L 108 270" strokeWidth="8" stroke="currentColor" />
                    <rect x="101" y="230" width="10" height="6" rx="1.5" fill="white" stroke="currentColor" strokeWidth="2" />
                    {/* Laptop Sleeve held tightly under arm */}
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
