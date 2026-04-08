import React from 'react';

export default function LoadingScreen({ text = "SYNCHRONISATION..." }) {
  return (
    <div className="fixed inset-0 flex flex-col gap-6 items-center justify-center bg-[#0A0A12] overflow-hidden z-[9999]">
       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #EF4444 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full animate-pulse" />
       
       <div className="relative z-10 flex flex-col items-center">
          <div className="h-32 w-32 relative group">
             <div className="absolute inset-0 bg-red-600 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
             <img src="/logo.png" alt="Logo" className="w-[120%] h-[120%] object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]" />
          </div>
          
          <div className="mt-12 flex flex-col items-center gap-3">
             <h2 className="text-white font-black uppercase italic tracking-[0.4em] text-sm animate-in fade-in slide-in-from-bottom duration-1000">Fire Académie</h2>
             <div className="flex gap-1.5 mt-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-1.5 w-1.5 rounded-full bg-red-600 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
             </div>
          </div>
       </div>
       
       <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/10 font-black uppercase tracking-[0.8em] text-[8px] whitespace-nowrap">
          {text}
       </div>
    </div>
  );
}
