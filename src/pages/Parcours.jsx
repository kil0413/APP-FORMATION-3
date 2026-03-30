import { useState, useRef, useEffect } from 'react';
import { BookOpen, Zap, Crown, Star, X, ChevronRight, Flame, RotateCcw, Play } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

// ─── Données statiques du parcours ────────────────────────────────────────────
const CHAPTERS = [
  {
    id: 'ch1',
    title: 'Incendie',
    color: '#E24B4A',
    colorBg: 'rgba(226,75,74,0.12)',
    colorGlow: 'rgba(226,75,74,0.35)',
    nodes: [
      { id: 'n1', title: 'Classes de feu', type: 'lesson', status: 'done', stars: 3 },
      { id: 'n2', title: 'Agents extincteurs', type: 'lesson', status: 'done', stars: 2 },
      { id: 'n3', title: 'Techniques d\'attaque', type: 'quiz', status: 'done', stars: 2 },
      { id: 'n4', title: 'Feux de véhicules', type: 'lesson', status: 'next' },
      { id: 'n5', title: 'Feux en milieu clos', type: 'lesson', status: 'available' },
      { id: 'n6', title: 'Récap Incendie', type: 'boss', status: 'available' },
    ],
  },
  {
    id: 'ch2',
    title: 'Secourisme',
    color: '#378ADD',
    colorBg: 'rgba(55,138,221,0.12)',
    colorGlow: 'rgba(55,138,221,0.35)',
    nodes: [
      { id: 'n7', title: 'Bilan primaire', type: 'lesson', status: 'done', stars: 3 },
      { id: 'n8', title: 'Bilan secondaire', type: 'lesson', status: 'refresh', stars: 1 },
      { id: 'n9', title: 'Arrêt cardiaque', type: 'lesson', status: 'available' },
      { id: 'n10', title: 'Hémorragies', type: 'quiz', status: 'available' },
      { id: 'n11', title: 'Traumatismes', type: 'lesson', status: 'available' },
      { id: 'n12', title: 'Récap Secourisme', type: 'boss', status: 'available' },
    ],
  },
  {
    id: 'ch3',
    title: 'Risques chimiques',
    color: '#EF9F27',
    colorBg: 'rgba(239,159,39,0.12)',
    colorGlow: 'rgba(239,159,39,0.35)',
    nodes: [
      { id: 'n13', title: 'Identification NRBC', type: 'lesson', status: 'available' },
      { id: 'n14', title: 'Équipements de protection', type: 'lesson', status: 'available' },
      { id: 'n15', title: 'Périmètre de sécurité', type: 'quiz', status: 'available' },
      { id: 'n16', title: 'Décontamination', type: 'lesson', status: 'available' },
      { id: 'n17', title: 'Récap Chimique', type: 'boss', status: 'available' },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const NODE_COLOR = {
  done: '#1D9E75',
  next: '#378ADD',
  refresh: '#EF9F27',
  available: '#2a2a3a',
};

const NODE_BORDER = {
  done: '#23b885',
  next: '#4a9de8',
  refresh: '#f0a83a',
  available: '#3a3a50',
};

const STATUS_LABEL = {
  done: 'Terminé',
  next: 'Suivant',
  refresh: 'À revoir',
  available: 'Disponible',
};

const typeIcon = (type, size = 22) => {
  if (type === 'lesson') return <BookOpen size={size} strokeWidth={2.5} />;
  if (type === 'quiz') return <Zap size={size} strokeWidth={2.5} />;
  if (type === 'boss') return <Crown size={size} strokeWidth={2.5} />;
};

const typeLabel = (type) => {
  if (type === 'lesson') return 'Leçon';
  if (type === 'quiz') return 'Quiz';
  if (type === 'boss') return 'Récap Boss';
};

function Stars({ count = 0, max = 3 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={9}
          className={i < count ? 'text-yellow-400 fill-yellow-400' : 'text-white/15 fill-white/5'}
        />
      ))}
    </div>
  );
}

// ─── Nœud individuel ──────────────────────────────────────────────────────────
function MapNode({ node, chapterColor, chapterGlow, onClick }) {
  const isBoss = node.type === 'boss';
  const isNext = node.status === 'next';
  const isDone = node.status === 'done';
  const isRefresh = node.status === 'refresh';

  const size = isBoss ? 'w-20 h-20' : 'w-16 h-16';

  return (
    <div className="flex flex-col items-center gap-1.5 cursor-pointer select-none" onClick={() => onClick(node)}>
      {/* Badge au-dessus */}
      <div className="h-5 flex items-center">
        {isNext && (
          <span
            className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full animate-bounce"
            style={{ background: chapterColor, color: '#fff' }}
          >
            Suivant
          </span>
        )}
        {isRefresh && (
          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-orange-500/90 text-white">
            À revoir
          </span>
        )}
        {isDone && node.stars > 0 && <Stars count={node.stars} />}
      </div>

      {/* Cercle principal */}
      <div className="relative">
        {/* Anneau pointillé boss */}
        {isBoss && (
          <div
            className="absolute inset-[-6px] rounded-full border-2 border-dashed opacity-60"
            style={{ borderColor: chapterColor }}
          />
        )}

        {/* Halo pulsant sur "next" */}
        {isNext && (
          <div
            className="absolute inset-[-4px] rounded-full animate-ping opacity-25"
            style={{ background: chapterColor }}
          />
        )}

        <div
          className={`${size} rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-105 shadow-lg`}
          style={{
            background: isDone || isNext || isRefresh ? NODE_COLOR[node.status] : NODE_COLOR.available,
            border: `3px solid ${NODE_BORDER[node.status]}`,
            boxShadow: isNext ? `0 0 20px ${chapterGlow}` : isDone ? '0 4px 15px rgba(29,158,117,0.3)' : 'none',
            color: isDone || isNext || isRefresh ? '#fff' : 'rgba(255,255,255,0.3)',
          }}
        >
          {typeIcon(node.type, isBoss ? 26 : 20)}
        </div>
      </div>

      {/* Titre */}
      <div
        className="text-center text-[10px] font-bold leading-tight max-w-[72px] uppercase tracking-wide"
        style={{ color: isDone || isNext || isRefresh ? '#e8e8f0' : 'rgba(255,255,255,0.3)' }}
      >
        {node.title}
      </div>
    </div>
  );
}

// ─── Chemin SVG entre nœuds ───────────────────────────────────────────────────
function ChapterPath({ nodePositions, doneCount, color }) {
  if (nodePositions.length < 2) return null;
  const paths = [];

  for (let i = 0; i < nodePositions.length - 1; i++) {
    const a = nodePositions[i];
    const b = nodePositions[i + 1];
    const isDone = i < doneCount;
    // Courbe de Bézier
    const cx = (a.x + b.x) / 2;
    const cy = (a.y + b.y) / 2;
    const d = `M ${a.x} ${a.y} Q ${cx} ${a.y + 30} ${b.x} ${b.y}`;
    paths.push(
      <path
        key={i}
        d={d}
        fill="none"
        stroke={isDone ? color : 'rgba(255,255,255,0.08)'}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={isDone ? 'none' : '6 5'}
        opacity={isDone ? 0.7 : 1}
      />
    );
  }
  return <>{paths}</>;
}

// ─── Bottom sheet ─────────────────────────────────────────────────────────────
function NodeSheet({ node, chapter, onClose, onStart }) {
  if (!node) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg rounded-t-[2rem] p-6 pb-10 shadow-2xl"
        style={{ background: '#13121c', border: '1px solid rgba(255,255,255,0.07)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-6" />

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-col gap-1">
            <span
              className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full w-fit"
              style={{ background: chapter.colorBg, color: chapter.color }}
            >
              {chapter.title} · {typeLabel(node.type)}
            </span>
            <h2 className="text-xl font-black text-white leading-tight mt-1">{node.title}</h2>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors mt-1">
            <X size={20} />
          </button>
        </div>

        {/* Statut */}
        <div className="flex items-center gap-3 mb-6 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: chapter.colorBg }}
          >
            {typeIcon(node.type, 18)}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white/80">{STATUS_LABEL[node.status]}</span>
            {node.stars > 0 && (
              <div className="mt-0.5">
                <Stars count={node.stars} />
              </div>
            )}
            {node.status === 'refresh' && (
              <span className="text-[10px] text-orange-400 font-bold mt-0.5">Dernière révision : il y a longtemps</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {node.status === 'done' && (
            <button
              onClick={() => onStart(node, true)}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border border-white/10 text-white/60 hover:border-white/20 hover:text-white transition-all font-bold text-sm"
            >
              <RotateCcw size={15} />
              Refaire
            </button>
          )}
          <button
            onClick={() => onStart(node, false)}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm text-white transition-all active:scale-95 shadow-lg hover:opacity-90"
            style={{ background: chapter.color }}
          >
            <Play size={15} fill="currentColor" />
            {node.status === 'done' ? 'Réviser' : 'Commencer'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Composant de chapitre entier ─────────────────────────────────────────────
function ChapterSection({ chapter, onNodeClick }) {
  const containerRef = useRef(null);
  const nodeRefs = useRef([]);
  const [svgData, setSvgData] = useState({ w: 0, h: 0, positions: [] });

  const doneCount = chapter.nodes.filter(n => n.status === 'done').length;
  const total = chapter.nodes.length;
  const progress = Math.round((doneCount / total) * 100);

  // Zigzag positions
  const ZIGZAG = [-1.2, 1.2, -0.6, 1.2, -1.2, 0.8];

  // Met à jour les positions SVG après rendu
  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const boxRect = containerRef.current.getBoundingClientRect();
      const positions = nodeRefs.current.map(ref => {
        if (!ref) return { x: 0, y: 0 };
        const r = ref.getBoundingClientRect();
        return {
          x: r.left + r.width / 2 - boxRect.left,
          y: r.top + r.height / 2 - boxRect.top,
        };
      });
      setSvgData({ w: boxRect.width, h: boxRect.height, positions });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <div className="flex flex-col gap-0 w-full">
      {/* En-tête chapitre */}
      <div className="flex items-center gap-3 px-5 py-4 mx-3 rounded-2xl mb-2" style={{ background: chapter.colorBg }}>
        <div className="flex flex-col flex-1 gap-1">
          <div className="flex items-center justify-between">
            <span className="font-black text-sm uppercase tracking-widest" style={{ color: chapter.color }}>
              {chapter.title}
            </span>
            <span className="text-[10px] font-bold text-white/40">{doneCount}/{total}</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: chapter.color }}
            />
          </div>
        </div>
      </div>

      {/* Carte des nœuds */}
      <div ref={containerRef} className="relative w-full" style={{ minHeight: chapter.nodes.length * 110 }}>
        {/* SVG chemin */}
        <svg
          width={svgData.w}
          height={svgData.h}
          className="absolute inset-0 pointer-events-none"
          style={{ overflow: 'visible' }}
        >
          <ChapterPath
            nodePositions={svgData.positions}
            doneCount={doneCount}
            color={chapter.color}
          />
        </svg>

        {/* Nœuds */}
        {chapter.nodes.map((node, idx) => {
          const shift = (ZIGZAG[idx % ZIGZAG.length] || 0) * 38;
          return (
            <div
              key={node.id}
              ref={el => nodeRefs.current[idx] = el}
              className="absolute"
              style={{
                top: idx * 105 + 12,
                left: '50%',
                transform: `translateX(calc(-50% + ${shift}px))`,
              }}
            >
              <MapNode
                node={node}
                chapterColor={chapter.color}
                chapterGlow={chapter.colorGlow}
                onClick={onNodeClick}
              />
            </div>
          );
        })}

        {/* Espace réservé pour que le div ait assez de hauteur */}
        <div style={{ height: chapter.nodes.length * 105 + 60 }} />
      </div>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function Parcours() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const handleNodeClick = (node, chapter) => {
    setSelectedNode(node);
    setSelectedChapter(chapter);
  };

  const handleStart = (node) => {
    setSelectedNode(null);
    // Navigation contextuelle
    if (node.type === 'quiz' || node.type === 'boss') {
      navigate('/quiz/q1');
    } else {
      navigate('/repertoire');
    }
  };

  // Stats globales
  const totalNodes = CHAPTERS.reduce((acc, ch) => acc + ch.nodes.length, 0);
  const doneNodes = CHAPTERS.reduce((acc, ch) => acc + ch.nodes.filter(n => n.status === 'done').length, 0);
  const globalPct = Math.round((doneNodes / totalNodes) * 100);

  return (
    <PageWrapper>
      <Header title="Mon Parcours" className="md:hidden" />

      <main className="flex flex-col gap-0 pb-32 max-w-lg mx-auto w-full relative">

        {/* ── En-tête sticky ── */}
        <div
          className="sticky top-0 z-30 px-4 pt-4 pb-3 flex flex-col gap-3"
          style={{ background: 'rgba(11,10,13,0.92)', backdropFilter: 'blur(16px)' }}
        >
          {/* Titre + badges */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black text-white uppercase tracking-tight">Mon Parcours</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-orange-500/15 px-3 py-1.5 rounded-full border border-orange-500/25">
                <Flame size={13} className="text-orange-400 fill-orange-400" />
                <span className="text-[11px] font-black text-orange-300">{user?.streak_days ?? 0} j.</span>
              </div>
              <div className="flex items-center gap-1.5 bg-yellow-400/10 px-3 py-1.5 rounded-full border border-yellow-400/20">
                <Zap size={13} className="text-yellow-400 fill-yellow-400" />
                <span className="text-[11px] font-black text-yellow-300">{(user?.xp_total ?? 0).toLocaleString()} XP</span>
              </div>
            </div>
          </div>

          {/* Progression globale */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#E24B4A] via-[#EF9F27] to-[#378ADD] transition-all duration-700"
                style={{ width: `${globalPct}%` }}
              />
            </div>
            <span className="text-[10px] font-black text-white/30 shrink-0">{globalPct}%</span>
          </div>

          {/* Chips progression par chapitre */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
            {CHAPTERS.map(ch => {
              const done = ch.nodes.filter(n => n.status === 'done').length;
              const pct = Math.round((done / ch.nodes.length) * 100);
              return (
                <div
                  key={ch.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0"
                  style={{ background: ch.colorBg, border: `1px solid ${ch.color}30` }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: ch.color }} />
                  <span className="text-[10px] font-black whitespace-nowrap" style={{ color: ch.color }}>
                    {ch.title} {pct}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Suggestion du jour */}
          <div
            className="flex items-start gap-3 px-3 py-2.5 rounded-xl"
            style={{ background: 'rgba(55,138,221,0.08)', border: '1px solid rgba(55,138,221,0.18)' }}
          >
            <Zap size={14} className="text-blue-400 mt-0.5 shrink-0" />
            <div className="text-[10px] font-bold text-blue-300 leading-relaxed">
              <span className="text-blue-500 font-black">Suggestion du jour — </span>
              Feux de véhicules (nouveau) · Bilan secondaire (à rafraîchir)
            </div>
          </div>
        </div>

        {/* ── Carte des chapitres ── */}
        <div className="flex flex-col gap-6 px-2 pt-4">
          {CHAPTERS.map((chapter) => (
            <ChapterSection
              key={chapter.id}
              chapter={chapter}
              onNodeClick={(node) => handleNodeClick(node, chapter)}
            />
          ))}

          {/* Fin de parcours */}
          <div className="flex flex-col items-center gap-4 py-12 px-6 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-dashed border-white/15"
            >
              <Crown size={32} className="text-white/20" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
              Examen final — finissez tous les chapitres
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Sheet */}
      {selectedNode && selectedChapter && (
        <NodeSheet
          node={selectedNode}
          chapter={selectedChapter}
          onClose={() => setSelectedNode(null)}
          onStart={handleStart}
        />
      )}
    </PageWrapper>
  );
}
