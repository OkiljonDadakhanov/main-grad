// components/home/tashkent-seoul-clock.tsx
"use client";

import { useEffect, useState } from "react";

export function TashkentSeoulClock() {
  const [times, setTimes] = useState({
    tashkent: "",
    seoul: "",
  });

  useEffect(() => {
    const updateClocks = () => {
      const tashkentTime = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Tashkent",
      });

      const seoulTime = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Seoul",
      });

      setTimes({ tashkent: tashkentTime, seoul: seoulTime });
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center gap-8 mb-6 text-white text-lg font-semibold">
      <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
        <p className="text-sm opacity-80">Tashkent</p>
        <p className="text-2xl tracking-widest">{times.tashkent}</p>
      </div>
      <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
        <p className="text-sm opacity-80">Seoul</p>
        <p className="text-2xl tracking-widest">{times.seoul}</p>
      </div>
    </div>
  );
}
