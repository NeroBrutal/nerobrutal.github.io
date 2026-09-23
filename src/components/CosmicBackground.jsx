"use client";

import { useEffect, useRef } from "react";
import { detectLiteGraphics } from "../lib/liteGraphics";

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
    const lite = detectLiteGraphics();

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

      const count = lite
        ? Math.round((width * height) / 5500)
        : Math.round((width * height) / 2800);
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
        const alpha =
          reduceMotion || lite ? 0.85 : 0.72 + 0.18 * Math.abs(Math.sin(s.phase));
        ctx.beginPath();
        ctx.fillStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (!reduceMotion && !lite) {
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
      if (lite) return;
      if (document.hidden) {
        cancelAnimationFrame(frameId);
      } else {
        frameId = requestAnimationFrame(draw);
      }
    };

    resize();
    if (lite) {
      draw(0);
    } else {
      frameId = requestAnimationFrame(draw);
    }
    const onResize = () => {
      resize();
      if (lite) draw(0);
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-bg">
      {/* A single, restrained accent glow — not a rainbow of nebulae */}
      <div
        className="absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full opacity-80"
        style={{
          background:
            "radial-gradient(closest-side, rgb(var(--color-accent-rgb) / 0.07), transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full opacity-80"
        style={{
          background:
            "radial-gradient(closest-side, rgb(var(--color-accent-rgb) / 0.05), transparent 70%)",
        }}
      />

      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
