"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  /** optional: override bg image used in Hero */
  backgroundUrl?: string; // default: "/images/main.jpg"
  /** minimum visible time (ms) to avoid flash */
  minDuration?: number; // default: 700
};

export default function SplashScreen({
  backgroundUrl = "/images/main.jpg",
  minDuration = 700,
}: Props) {
  const [visible, setVisible] = useState(true); // opacity
  const [gone, setGone] = useState(false); // unmount after fade
  const [progress, setProgress] = useState(0); // 0..100
  const loadedRef = useRef(false);
  const start = useMemo(() => Date.now(), []);

  useEffect(() => {
    // Prevent background scroll
    const original = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    // 1) Preload the hero background to avoid a flash when revealing
    const img = new Image();
    img.src = backgroundUrl;

    // 2) Smooth fake progress (up to 90%) while real load happens
    const tick = () => {
      setProgress((p) => {
        if (loadedRef.current) return p; // stop ticking once we finish
        const next = p + Math.max(0.4, (100 - p) * 0.015); // ease
        return Math.min(90, next);
      });
    };
    const interval = setInterval(tick, 30);

    const finish = () => {
      if (loadedRef.current) return;
      loadedRef.current = true;

      // Ensure min visible time
      const elapsed = Date.now() - start;
      const wait = Math.max(0, minDuration - elapsed);

      setTimeout(() => {
        // Snap progress to 100% with a tiny ease
        const finishAnim = setInterval(() => {
          setProgress((p) => {
            const next = p + Math.max(1.5, (100 - p) * 0.12);
            if (next >= 99.8) {
              clearInterval(finishAnim);
              setProgress(100);
              // fade out
              setVisible(false);
              // remove after fade completes
              setTimeout(() => {
                setGone(true);
                document.documentElement.style.overflow = original;
              }, 600);
            }
            return Math.min(100, next);
          });
          // eslint-disable-next-line
        }, 16);
      }, wait);
    };

    const onWindowLoad = () => finish();

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", onWindowLoad, { once: true });
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener("load", onWindowLoad);
      document.documentElement.style.overflow = original;
    };
  }, [backgroundUrl, minDuration, start]);

  if (gone) return null;

  return (
    <div
      aria-busy={visible}
      className={`fixed inset-0 z-[9999] transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Background (matches HeroSection) */}
      <div className="absolute inset-0 -z-10">
        {/* Photo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${backgroundUrl}')` }}
          aria-hidden
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background:
              "linear-gradient(120deg, rgba(51, 0, 102, 0.65) 0%, rgba(10, 37, 99, 0.55) 100%)",
          }}
        />
        {/* Radial glow */}
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(60% 50% at 50% 40%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 40%, rgba(0,0,0,0) 70%)",
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          aria-hidden
          style={{ boxShadow: "inset 0 0 120px rgba(0,0,0,0.35)" }}
        />
      </div>

      {/* Center content */}
      <div className="relative flex h-full items-center justify-center px-6">
        <div className="flex w-full max-w-md flex-col items-center text-center text-white">
          {/* Logo/Mark */}
          <div className="mb-6 grid place-items-center">
            <div className="relative h-16 w-16">
              {/* rotating ring */}
              <div className="absolute inset-0 rounded-full border-4 border-white/20" />
              <div className="absolute inset-0 rounded-full border-4 border-white/70 border-t-transparent animate-spin" />
            </div>
          </div>

          {/* Brand + tag */}
          <div className="mb-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide">
            Study in Korea · Tailored for Uzbekistan
          </div>
          <h1 className="text-balance text-3xl font-extrabold leading-tight md:text-4xl">
            Your Path to
            <span className="block bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
              Top Korean Universities
            </span>
          </h1>

          {/* Progress */}
          <div className="mt-6 w-full rounded-xl border border-white/30 bg-white/20 p-3 backdrop-blur-sm">
            <div className="mb-1 flex items-center justify-between text-xs text-white/90">
              <span>Preparing experience…</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/25">
              <div
                className="h-full w-0 rounded-full bg-white transition-[width] duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Microcopy */}
          <p className="mt-4 text-xs text-white/80">
            Loading universities, programs, scholarships & UI assets…
          </p>
        </div>
      </div>
    </div>
  );
}
