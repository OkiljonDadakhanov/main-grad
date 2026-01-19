"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** minimum visible time (ms) to avoid flash */
  minDuration?: number; // default: 400
};

export default function SplashScreen({ minDuration = 400 }: Props) {
  const [visible, setVisible] = useState(true);
  const [gone, setGone] = useState(false);
  const loadedRef = useRef(false);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const original = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const finish = () => {
      if (loadedRef.current) return;
      loadedRef.current = true;

      const elapsed = Date.now() - startRef.current;
      const wait = Math.max(0, minDuration - elapsed);

      setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          setGone(true);
          document.documentElement.style.overflow = original;
        }, 300);
      }, wait);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }

    return () => {
      window.removeEventListener("load", finish);
      document.documentElement.style.overflow = original;
    };
  }, [minDuration]);

  if (gone) return null;

  return (
    <div
      aria-busy={visible}
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-purple-900 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Simple spinner */}
        <div className="h-10 w-10 rounded-full border-3 border-white/30 border-t-white animate-spin" />
        <p className="text-white/80 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}
