import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    // <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-4 min-w-60">
    <div className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm">
      <div className="bg-indigo-50 p-3 rounded-xl">
        <Clock className="w-4 h-4 text-indigo-600" />
      </div>
      <div className="text-right flex-1">
        <div className="text-lg font-black text-slate-900 tabular-nums tracking-tight">
          {time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>
        <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
          {time.toLocaleDateString([], {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};

export default LiveClock;
