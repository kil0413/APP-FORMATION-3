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
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: '#0b0f1a' }}>
      {/* Header logic */}
      <div className="px-8 py-4 md:py-8 border-b shrink-0" style={{ borderColor: '#1e2a3a' }}>
        <h2 className="text-xl md:text-4xl font-black tracking-tight uppercase italic mb-1" style={{ color: '#f0e6d3' }}>
          Les 5 conditions de l'explosion
        </h2>
        <p className="text-[10px] md:text-base font-light" style={{ color: '#7a8ba8' }}>
          Explorez les 5 éléments essentiels pour qu'une explosion se produise
        </p>
      </div>

      {/* Main Content: Responsive layout (stacked on mobile, row on desktop) */}
      <div className="flex-1 flex flex-col lg:flex-row p-4 md:p-8 gap-4 md:gap-12 min-h-0 overflow-hidden lg:items-center">
        
        {/* Left/Top: Pentagon */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center min-h-0 lg:w-[45%]">
          <div className="w-full max-w-[320px] md:max-w-xl lg:max-w-2xl flex-1 min-h-0 flex items-center justify-center">
            <svg viewBox="0 0 440 400" className="w-full h-full lg:h-auto lg:max-h-[70vh] drop-shadow-2xl overflow-visible">
              <defs>
                <radialGradient id="glowGrad">
                  <stop offset="0%" stopColor="#e07a3a" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#e07a3a" stopOpacity="0" />
                </radialGradient>
                <clipPath id="circleView">
                    <circle cx="45" cy="45" r="45" />
                </clipPath>
              </defs>

              <motion.circle
                cx={cx} cy={cy} r="60"
                fill="url(#glowGrad)"
                animate={{ opacity: [0.15, 0.35, 0.15] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              />

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

              <g transform={`translate(${cx - 45}, ${cy - 45})`}>
                 <image 
                   width="90" height="90" 
                   href="https://media.canva.com/v2/image-resize/format:PNG/height:550/quality:100/uri:ifs%3A%2F%2FM%2F9d8dd4ed-b36b-4b4f-814d-1793ec3d76f8/watermark:F/width:545?csig=AAAAAAAAAAAAAAAAAAAAAMJrkGXtHwL924bkSqKC9zwnnOdIiKP8q0nmj1PCZB1m&exp=1774528413&osig=AAAAAAAAAAAAAAAAAAAAAJn3yqL4RMtD6knlqWGal3H7BYva1R8kSsPWSX3HpxW9&signer=media-rpc&x-canva-quality=thumbnail_large"
                   clipPath="url(#circleView)"
                   preserveAspectRatio="xMidYMid slice"
                 />
              </g>

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

                    <motion.circle
                      cx={p.x} cy={p.y} r={36}
                      fill="#111827" stroke={c.color} strokeWidth={isActive ? 3.5 : 2.5}
                      initial={{ scale: 0.3, opacity: 0 }}
                      animate={{ scale: isActive ? 1.18 : 1, opacity: 1 }}
                      whileHover={{ scale: 1.12 }}
                      transition={{ delay, type: "spring", stiffness: 200, damping: 20 }}
                    />

                    <text 
                      x={p.x} y={p.y + 1} 
                      textAnchor="middle" dominantBaseline="central" 
                      fontSize="22"
                    >
                      {c.icon}
                    </text>

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

          {/* Progress dots */}
          <div className="flex justify-center gap-3 mt-4 md:mt-8 shrink-0">
            {conditions.map((c, i) => (
              <motion.div
                key={i}
                className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full"
                animate={{ 
                  backgroundColor: seen.has(i) ? c.color : '#3a3f52',
                  scale: seen.has(i) ? 1.3 : 1
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>

        {/* Right/Bottom: Detail Card */}
        <div className="flex-1 flex items-center justify-center min-w-0">
          <AnimatePresence mode='wait'>
            {activeCondition && (
              <motion.div 
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-md md:max-w-2xl rounded-2xl md:rounded-[2.5rem] p-5 md:p-10 border shadow-2xl" 
                style={{ 
                  background: '#111827', 
                  borderColor: '#1e2a3a' 
                }}
              >
                <div className="flex items-center gap-4 md:gap-6 mb-4 md:mb-8">
                  <div 
                    className="w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-[1.5rem] flex items-center justify-center text-2xl md:text-5xl shrink-0"
                    style={{ background: `${activeCondition.color}22` }}
                  >
                    {activeCondition.icon}
                  </div>
                  <div>
                     <h3 className="font-bold text-lg md:text-3xl" style={{ color: '#f0e6d3' }}>{activeCondition.label}</h3>
                     <span className="text-[10px] md:text-sm uppercase tracking-widest font-bold" style={{ color: '#7a8ba8' }}>Condition {activeIndex + 1} / 5</span>
                  </div>
                </div>
                
                <p className="text-[12px] md:text-lg leading-relaxed mb-4 md:mb-8" style={{ color: '#a0aec0' }}>
                  {activeCondition.desc}
                </p>
                
                <div className="mt-4 md:mt-8 text-[11px] md:text-base rounded-xl md:rounded-2xl p-4 md:p-6 font-medium bg-[#0b0f1a]" style={{ color: '#7a8ba8', borderLeft: `5px solid ${activeCondition.color}` }}>
                  {activeCondition.example}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
