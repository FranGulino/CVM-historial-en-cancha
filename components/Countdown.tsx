"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: Date | string;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsExpired(true);
        clearInterval(intervalId);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate]);

  if (isExpired) {
    return (
      <div className="text-center bg-zinc-900/60 backdrop-blur-md px-6 py-3 rounded-lg border border-green-500/20 inline-block">
        <span className="text-xs font-bold text-green-400 tracking-wider uppercase">
          ¡El partido está en juego o ya finalizó!
        </span>
      </div>
    );
  }

  const timeBlocks = [
    { value: timeLeft.days, label: "Días" },
    { value: timeLeft.hours, label: "Hs" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Seg" },
  ];

  return (
    <div className="flex gap-2 justify-center items-center">
      {timeBlocks.map((block, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="min-w-[60px] sm:min-w-[70px] h-[55px] sm:h-[65px] bg-zinc-950/90 backdrop-blur-sm rounded-lg border border-zinc-800 flex items-center justify-center shadow-inner">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight tabular-nums">
              {String(block.value).padStart(2, "0")}
            </span>
          </div>
          <span className="mt-1 text-[9px] font-bold text-zinc-500 tracking-wider uppercase">
            {block.label}
          </span>
        </div>
      ))}
    </div>
  );
}
