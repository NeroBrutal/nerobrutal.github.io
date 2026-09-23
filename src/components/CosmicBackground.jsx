"use client";

import { useEffect, useRef } from "react";

// Fixed, full-viewport canvas starfield with drifting nebula glows and the
// occasional shooting star. Pauses when the tab is hidden and respects
// prefers-reduced-motion.
export default function CosmicBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars = [];
    let meteors = [];
    let frameId;
    let lastMeteorAt = 0;

    const STAR_COLORS = ["#ffffff", "#e6e8ec", "#a5f3fc"];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round((width * height) / 2800);
      stars = Array.from({ length: count }, (_, i) => {
        const big = i % 14 === 0;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: big ? Math.random() * 1.3 + 2.2 : Math.random() * 1.1 + 1,
          glow: big,
          phase: Math.random() * Math.PI * 2,
          speed: 0.01 + Math.random() * 0.02,
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
          drift: Math.random() * 0.05,
        };
      });
    };

    const spawnMeteor = () => {
      const startX = Math.random() * width * 0.6 + width * 0.2;
      meteors.push({
        x: startX,
        y: -20,
        vx: -3.2 - Math.random() * 2,
        vy: 3.6 + Math.random() * 2,
        life: 60,
      });
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height);

      for (const s of stars) {
        s.phase += s.speed;
        s.y += s.drift;
        if (s.y > height) s.y = 0;
        const alpha = reduceMotion
          ? 0.9
          : 0.6 + 0.4 * Math.abs(Math.sin(s.phase));
        ctx.beginPath();
        ctx.fillStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = s.glow ? 10 : 0;
        ctx.shadowColor = s.color;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      if (!reduceMotion) {
        if (time - lastMeteorAt > 4200 + Math.random() * 3500) {
          spawnMeteor();
          lastMeteorAt = time;
        }

        meteors = meteors.filter((m) => m.life > 0);
        for (const m of meteors) {
          m.x += m.vx;
          m.y += m.vy;
          m.life -= 1;

          const tailX = m.x - m.vx * 7;
          const tailY = m.y - m.vy * 7;
          const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
          grad.addColorStop(0, "rgba(255,255,255,0.95)");
          grad.addColorStop(1, "rgba(255,255,255,0)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
        }
      }

      frameId = requestAnimationFrame(draw);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frameId);
      } else {
        frameId = requestAnimationFrame(draw);
      }
    };

    resize();
    frameId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-bg">
      {/* A single, restrained accent glow — not a rainbow of nebulae */}
      <div className="absolute -top-40 -left-40 w-[36rem] h-[36rem] bg-accent/[0.06] rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-accent/[0.04] rounded-full blur-[120px]" />

      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
