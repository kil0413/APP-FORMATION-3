import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const conditions = [
  {
    label: "Combustible",
    icon: "🛢️",
    color: "#e07a3a",
    desc: "Matière capable de brûler : gaz, vapeur, poussière ou liquide inflammable. C'est le « carburant » de la réaction.",
    example: "💡 Exemples : méthane, farine en suspension, vapeurs d'essence, poussière de bois."
  },
  {
    label: "Comburant",
    icon: "💨",
    color: "#4db8e8",
    desc: "Substance qui alimente la combustion, généralement l'oxygène de l'air. Sans comburant, pas de réaction possible.",
    example: "💡 L'air contient ~21 % d'oxygène, suffisant pour la plupart des explosions."
  },
  {
    label: "Source d'énergie",
    icon: "⚡",
    color: "#ebd34e",
    desc: "Énergie d'activation qui déclenche la réaction : étincelle, flamme, chaleur, friction ou décharge électrostatique.",
    example: "💡 Une étincelle de seulement 0,2 mJ peut enflammer un nuage de poussière."
  },
  {
    label: "Mélange en proportions",
    icon: "⚖️",
    color: "#a78bfa",
    desc: "Le combustible et le comburant doivent être dans un rapport précis (entre les limites inférieure et supérieure d'explosivité).",
    example: "💡 Le méthane explose entre 5 % et 15 % de concentration dans l'air."
  },
  {
    label: "Confinement",
    icon: "📦",
    color: "#f472b6",
    desc: "Un espace clos ou semi-clos permet la montée brutale de pression qui caractérise l'explosion. Sans confinement, on obtient un simple incendie.",
    example: "💡 Un silo, une canalisation ou un local fermé constituent un confinement suffisant."
  }
];

// Pentagon geometry
const cx = 220, cy = 190, r = 130;
const pts = conditions.map((_, i) => {
  const angle = -Math.PI / 2 + (2 * Math.PI * i) / 5;
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
});

export default function ExplosionPentagon() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [seen, setSeen] = useState(new Set());

  useEffect(() => {
    // Initial selection after animations
    const timer = setTimeout(() => {
      handleSelect(0);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = (i) => {
    if (activeIndex === i) return;
    setActiveIndex(i);
    setSeen(prev => new Set([...prev, i]));
  };

  const activeCondition = activeIndex !== -1 ? conditions[activeIndex] : null;

  return (
    <div className="w-full h-full flex flex-col items-center py-2 md:py-6 overflow-hidden" style={{ background: '#0b0f1a' }}>
      {/* Header logic moved into Fiche.jsx header when this is active, or we keep locally if it replaces the whole content */}
      <div className="text-center pb-2 md:pb-6 px-4 shrink-0">
        <h2 className="text-xl md:text-5xl font-black tracking-tight uppercase italic" style={{ color: '#f0e6d3' }}>Les 5 conditions de l'explosion</h2>
        <p className="mt-0.5 text-[10px] md:text-sm font-light tracking-wide" style={{ color: '#7a8ba8' }}>Cliquez sur chaque élément pour en savoir plus</p>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 pb-6">
        {conditions.map((c, i) => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 rounded-full"
            initial={{ scale: 1 }}
            animate={{ 
              backgroundColor: seen.has(i) ? c.color : '#3a3f52',
              scale: seen.has(i) ? 1.3 : 1
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      {/* Pentagon SVG Container */}
      <div className="flex justify-center px-4 w-full max-w-[320px] md:max-w-xl lg:max-w-2xl flex-1 min-h-0">
        <svg viewBox="0 0 440 400" className="w-full h-full drop-shadow-2xl overflow-visible">
          <defs>
            <radialGradient id="glowGrad">
              <stop offset="0%" stopColor="#e07a3a" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#e07a3a" stopOpacity="0" />
            </radialGradient>
            <clipPath id="circleView">
                <circle cx="45" cy="45" r="45" />
            </clipPath>
          </defs>

          {/* Center Glow */}
          <motion.circle
            cx={cx} cy={cy} r="60"
            fill="url(#glowGrad)"
            animate={{ opacity: [0.15, 0.35, 0.15] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />

          {/* Lines */}
          {pts.map((p, i) => {
            const nextIdx = (i + 1) % 5;
            const nextP = pts[nextIdx];
            return (
              <motion.line
                key={`line-${i}`}
                x1={p.x} y1={p.y}
                x2={nextP.x} y2={nextP.y}
                stroke="#1e2a3a"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: i * 0.15, duration: 1.5 }}
              />
            );
          })}

          {/* Center Image (using standard image since we can't be sure of the custom URL) */}
          <g transform={`translate(${cx - 45}, ${cy - 45})`}>
             <image 
               width="90" height="90" 
               href="https://media.canva.com/v2/image-resize/format:PNG/height:550/quality:100/uri:ifs%3A%2F%2FM%2F9d8dd4ed-b36b-4b4f-814d-1793ec3d76f8/watermark:F/width:545?csig=AAAAAAAAAAAAAAAAAAAAAMJrkGXtHwL924bkSqKC9zwnnOdIiKP8q0nmj1PCZB1m&exp=1774528413&osig=AAAAAAAAAAAAAAAAAAAAAJn3yqL4RMtD6knlqWGal3H7BYva1R8kSsPWSX3HpxW9&signer=media-rpc&x-canva-quality=thumbnail_large"
               clipPath="url(#circleView)"
               preserveAspectRatio="xMidYMid slice"
             />
          </g>

          {/* Nodes */}
          {conditions.map((c, i) => {
            const p = pts[i];
            const isActive = activeIndex === i;
            const delay = 0.3 + i * 0.12;

            return (
              <g 
                key={`node-${i}`} 
                className="cursor-pointer" 
                onClick={() => handleSelect(i)}
                style={{ transformOrigin: `${p.x}px ${p.y}px` }}
              >
                {/* Pulse Ring */}
                <AnimatePresence>
                  {isActive && (
                    <motion.circle
                      cx={p.x} cy={p.y} r={38}
                      fill="none" stroke={c.color} strokeWidth="1"
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: "easeOut" }}
                    />
                  )}
                </AnimatePresence>

                {/* Main Circle */}
                <motion.circle
                  cx={p.x} cy={p.y} r={36}
                  fill="#111827" stroke={c.color} strokeWidth={isActive ? 3.5 : 2.5}
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: isActive ? 1.18 : 1, opacity: 1 }}
                  whileHover={{ scale: 1.12 }}
                  transition={{ delay, type: "spring", stiffness: 200, damping: 20 }}
                />

                {/* Icon */}
                <text 
                  x={p.x} y={p.y + 1} 
                  textAnchor="middle" dominantBaseline="central" 
                  fontSize="22"
                >
                  {c.icon}
                </text>

                {/* Label */}
                <text 
                  x={p.x} 
                  y={i === 0 ? p.y - 48 : p.y + 52} 
                  textAnchor="middle" 
                  fill={c.color} 
                  fontSize="11" 
                  fontWeight="600"
                  className="font-['Outfit']"
                >
                  {c.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Detail Card Overlay */}
      <div className="flex justify-center px-4 w-full mt-2 md:mt-4 pb-4 md:pb-8 shrink-0">
        <AnimatePresence mode='wait'>
          {activeCondition && (
            <motion.div 
              key={activeIndex}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="w-full max-w-md md:max-w-2xl rounded-2xl md:rounded-3xl p-4 md:p-10 border shadow-2xl" 
              style={{ 
                background: '#111827', 
                borderColor: `${activeCondition.color}33` 
              }}
            >
              <div className="flex items-center gap-3 md:gap-6 mb-2 md:mb-6">
                <div 
                  className="w-10 h-10 md:w-16 md:h-16 rounded-lg md:rounded-2xl flex items-center justify-center text-lg md:text-3xl"
                  style={{ background: `${activeCondition.color}22` }}
                >
                  {activeCondition.icon}
                </div>
                <div>
                   <h3 className="font-bold text-sm md:text-2xl" style={{ color: activeCondition.color }}>{activeCondition.label}</h3>
                   <span className="text-[9px] md:text-xs uppercase tracking-widest font-bold" style={{ color: '#7a8ba8' }}>Condition {activeIndex + 1} / 5</span>
                </div>
              </div>
              
              <p className="text-[11px] md:text-base leading-relaxed" style={{ color: '#a0aec0' }}>
                {activeCondition.desc}
              </p>
              
              <div className="mt-2 md:mt-6 text-[10px] md:text-sm rounded-lg md:rounded-xl p-2 md:p-5 font-medium bg-[#0b0f1a]" style={{ color: '#7a8ba8', borderLeft: `3px md:border-left-4 md:border-left-[activeCondition.color]44` }}>
                {activeCondition.example}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
