'use client';

import { gsap } from 'gsap';
import React, { useEffect, useRef } from 'react';

interface CrowdCanvasProps {
  src: string;
  rows?: number;
  cols?: number;
}

/**
 * Authentic Animated Walking Crowd Simulation
 * Powered by HTML5 Canvas, GSAP walk-cycle timelines, and OpenPeeps character sprites.
 * Calibrated for a relaxed, natural walking pace and solid ground alignment with zero floating torsos.
 */
function CrowdCanvas({ src, rows = 15, cols = 7 }: CrowdCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraX = useRef(0);
  const targetCameraX = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const config = {
      src,
      rows,
      cols,
    };

    // UTILS
    const randomRange = (min: number, max: number) =>
      min + Math.random() * (max - min);
    const randomIndex = (array: any[]) => (randomRange(0, array.length) | 0);
    const removeFromArray = (array: any[], i: number) => array.splice(i, 1)[0];
    const removeItemFromArray = (array: any[], item: any) =>
      removeFromArray(array, array.indexOf(item));
    const removeRandomFromArray = (array: any[]) =>
      removeFromArray(array, randomIndex(array));
    const getRandomFromArray = (array: any[]) => array[randomIndex(array) | 0];

    // TWEEN FACTORIES
    const resetPeep = ({ stage, peep }: { stage: any; peep: any }) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      
      // Grounded alignment: Character base stays at or slightly below the bottom floor
      // This completely eliminates any floating cut-off waists
      const offsetY = randomRange(0, 20);
      const startY = stage.height - peep.height + offsetY;
      let startX: number;
      let endX: number;

      if (direction === 1) {
        startX = -peep.width - 50;
        endX = stage.width + 50;
        peep.scaleX = 1;
      } else {
        startX = stage.width + peep.width + 50;
        endX = -peep.width - 50;
        peep.scaleX = -1;
      }

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;

      return {
        startX,
        startY,
        endX,
      };
    };

    // Relaxed, calm, dignified walking pace
    const normalWalk = ({ peep, props }: { peep: any; props: any }) => {
      const { startX, startY, endX } = props;
      // Increased duration for relaxed, slow campus walking
      const xDuration = 26;
      const yDuration = 0.5;

      const tl = gsap.timeline();
      // Slow and peaceful speed multiplier (0.45 to 0.75)
      tl.timeScale(randomRange(0.45, 0.75));
      tl.to(
        peep,
        {
          duration: xDuration,
          x: endX,
          ease: 'none',
        },
        0,
      );
      tl.to(
        peep,
        {
          duration: yDuration,
          repeat: Math.floor(xDuration / yDuration),
          yoyo: true,
          y: startY - 7,
          ease: 'sine.inOut',
        },
        0,
      );

      return tl;
    };

    const walks = [normalWalk];

    // TYPES
    type Peep = {
      image: HTMLImageElement;
      rect: number[];
      width: number;
      height: number;
      drawArgs: any[];
      x: number;
      y: number;
      anchorY: number;
      scaleX: number;
      walk: any;
      setRect: (rect: number[]) => void;
      render: (ctx: CanvasRenderingContext2D) => void;
    };

    // FACTORY FUNCTIONS
    const createPeep = ({
      image,
      rect,
    }: {
      image: HTMLImageElement;
      rect: number[];
    }): Peep => {
      const peep: Peep = {
        image,
        rect: [],
        width: 0,
        height: 0,
        drawArgs: [],
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        setRect: (rect: number[]) => {
          peep.rect = rect;
          peep.width = rect[2];
          peep.height = rect[3];
          peep.drawArgs = [peep.image, ...rect, 0, 0, peep.width, peep.height];
        },
        render: (ctx: CanvasRenderingContext2D) => {
          ctx.save();
          ctx.translate(peep.x, peep.y);
          ctx.scale(peep.scaleX, 1);
          ctx.drawImage(
            peep.image,
            peep.rect[0],
            peep.rect[1],
            peep.rect[2],
            peep.rect[3],
            -peep.width / 2,
            0,
            peep.width,
            peep.height,
          );
          ctx.restore();
        },
      };

      peep.setRect(rect);
      return peep;
    };

    // MAIN STATE
    const img = document.createElement('img');
    const stage = {
      width: 0,
      height: 0,
    };

    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];

    const createPeeps = () => {
      const { rows, cols } = config;
      const { naturalWidth: width, naturalHeight: height } = img;
      const total = rows * cols;
      const rectWidth = width / rows;
      const rectHeight = height / cols;

      for (let i = 0; i < total; i++) {
        allPeeps.push(
          createPeep({
            image: img,
            rect: [
              (i % rows) * rectWidth,
              ((i / rows) | 0) * rectHeight,
              rectWidth,
              rectHeight,
            ],
          }),
        );
      }
    };

    const addPeepToCrowd = () => {
      if (!availablePeeps.length) return null;
      const peep = removeRandomFromArray(availablePeeps);
      if (!peep) return null;

      const walk = getRandomFromArray(walks)({
        peep,
        props: resetPeep({
          peep,
          stage,
        }),
      }).eventCallback('onComplete', () => {
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });

      peep.walk = walk;
      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);

      return peep;
    };

    const removePeepFromCrowd = (peep: Peep) => {
      removeItemFromArray(crowd, peep);
      availablePeeps.push(peep);
    };

    const initCrowd = () => {
      // Balanced crowd count to ensure natural spacing and zero clutter
      const targetCount = Math.min(availablePeeps.length, 28);
      for (let i = 0; i < targetCount; i++) {
        const peep = addPeepToCrowd();
        if (peep && peep.walk) {
          peep.walk.progress(Math.random());
        }
      }
    };

    const render = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;

      // Smooth camera interpolation for mouse parallax
      cameraX.current += (targetCameraX.current - cameraX.current) * 0.06;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      // Camera horizontal shift
      ctx.translate(cameraX.current, 0);

      crowd.forEach((peep) => {
        peep.render(ctx);
      });

      ctx.restore();
    };

    const resize = () => {
      if (!canvas || !containerRef.current) return;
      const dpr = window.devicePixelRatio || 1;
      stage.width = containerRef.current.clientWidth;
      stage.height = containerRef.current.clientHeight;
      canvas.width = stage.width * dpr;
      canvas.height = stage.height * dpr;

      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });

      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);

      initCrowd();
    };

    const init = () => {
      createPeeps();
      resize();
      gsap.ticker.add(render);
    };

    img.onload = init;
    img.src = config.src;

    // Mouse movement parallax handler
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
      targetCameraX.current = -relativeX * 100;
    };

    const handleMouseLeave = () => {
      targetCameraX.current = 0;
    };

    // Touch support for mobile
    let touchStartX = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) touchStartX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const delta = e.touches[0].clientX - touchStartX;
        targetCameraX.current = Math.max(-80, Math.min(80, delta * 0.35));
      }
    };

    const handleTouchEnd = () => {
      targetCameraX.current = 0;
    };

    const containerEl = containerRef.current;
    if (containerEl) {
      containerEl.addEventListener('mousemove', handleMouseMove);
      containerEl.addEventListener('mouseleave', handleMouseLeave);
      containerEl.addEventListener('touchstart', handleTouchStart, { passive: true });
      containerEl.addEventListener('touchmove', handleTouchMove, { passive: true });
      containerEl.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    const handleResize = () => resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerEl) {
        containerEl.removeEventListener('mousemove', handleMouseMove);
        containerEl.removeEventListener('mouseleave', handleMouseLeave);
        containerEl.removeEventListener('touchstart', handleTouchStart);
        containerEl.removeEventListener('touchmove', handleTouchMove);
        containerEl.removeEventListener('touchend', handleTouchEnd);
      }
      gsap.ticker.remove(render);
      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });
    };
  }, [src, rows, cols]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none [mask-image:linear-gradient(to_right,transparent,black_48px,black_calc(100%-48px),transparent)]"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

export default function StudentCrowd() {
  return (
    <div className="relative w-full bg-white text-black overflow-hidden select-none border-b border-zinc-200">
      {/* Live Walking Canvas Viewport (Pill removed per request, height calibrated) */}
      <div className="relative w-full h-[280px] sm:h-[320px] md:h-[350px]">
        <CrowdCanvas src="/all-peeps.png" rows={15} cols={7} />
      </div>

      {/* Ambient floor baseline */}
      <div className="w-full h-[1px] bg-zinc-200"></div>
    </div>
  );
}
