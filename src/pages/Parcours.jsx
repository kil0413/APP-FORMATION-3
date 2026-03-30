import { useState, useRef, useEffect, useMemo } from 'react';
import { BookOpen, Zap, Crown, Star, X, Flame, RotateCcw, Play, FileQuestion, FileText } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useAuthStore } from '../store/useAuthStore';
import { useFicheStore } from '../store/useFicheStore';
import { useNavigate } from 'react-router-dom';

// ─── Constantes ───────────────────────────────────────────────────────────────
const DIFFICULTY_ORDER = { 'Débutant': 0, 'Intermédiaire': 1, 'Avancé': 2 };

const CHAPTER_COLORS = [
  { color: '#E24B4A', colorBg: 'rgba(226,75,74,0.12)', colorGlow: 'rgba(226,75,74,0.35)' },
  { color: '#378ADD', colorBg: 'rgba(55,138,221,0.12)', colorGlow: 'rgba(55,138,221,0.35)' },
  { color: '#EF9F27', colorBg: 'rgba(239,159,39,0.12)', colorGlow: 'rgba(239,159,39,0.35)' },
  { color: '#1D9E75', colorBg: 'rgba(29,158,117,0.12)', colorGlow: 'rgba(29,158,117,0.35)' },
  { color: '#9B59B6', colorBg: 'rgba(155,89,182,0.12)', colorGlow: 'rgba(155,89,182,0.35)' },
  { color: '#F39C12', colorBg: 'rgba(243,156,18,0.12)', colorGlow: 'rgba(243,156,18,0.35)' },
];

const ZIGZAG = [-1.2, 1.2, -0.8, 1.0, -1.4, 0.6];

// ─── Helpers statut ───────────────────────────────────────────────────────────
/**
 * Retourne { status, completedAt } pour un nœud fiche ou quiz
 * - done    : complété il y a moins de 14 jours
 * - refresh : complété mais il y a plus de 14 jours
 * - next    : premier nœud non terminé de la liste
 * - available : tout le reste
 */
function computeNodeStatuses(nodes, completedFiches) {
  // Construire un map id → date de dernière complétion
  const completedMap = {};
  (completedFiches || []).forEach(entry => {
    const [id, dateStr] = entry.includes('|') ? entry.split('|') : [entry, null];
    completedMap[id] = dateStr ? new Date(dateStr) : new Date(0);
  });

  const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  let foundNext = false;
  return nodes.map(node => {
    const completedAt = completedMap[node.id] || null;
    if (completedAt) {
      const age = now - completedAt.getTime();
      return { ...node, status: age > TWO_WEEKS_MS ? 'refresh' : 'done', completedAt };
    }
    // Pas terminé
    if (!foundNext) {
      foundNext = true;
      return { ...node, status: 'next', completedAt: null };
    }
    return { ...node, status: 'available', completedAt: null };
  });
}

// ─── Composants utilitaires ───────────────────────────────────────────────────
function Stars({ count = 0, max = 3 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star key={i} size={9}
          className={i < count ? 'text-yellow-400 fill-yellow-400' : 'text-white/15 fill-white/5'} />
      ))}
    </div>
  );
}

function typeIcon(type, size = 22) {
  if (type === 'quiz')  return <Zap size={size} strokeWidth={2.5} />;
  if (type === 'boss')  return <Crown size={size} strokeWidth={2.5} />;
  if (type === 'qcm')   return <FileQuestion size={size} strokeWidth={2.5} />;
  return <BookOpen size={size} strokeWidth={2.5} />;
}

function typeLabel(type) {
  if (type === 'quiz') return 'Quiz';
  if (type === 'boss') return 'Récap Boss';
  if (type === 'qcm')  return 'QCM';
  return 'Leçon';
}

const NODE_COLOR = { done: '#1D9E75', next: '#378ADD', refresh: '#EF9F27', available: '#1e1d2e' };
const NODE_BORDER = { done: '#23b885', next: '#4a9de8', refresh: '#f0a83a', available: '#2e2d44' };
const STATUS_LABEL = { done: 'Terminé', next: 'Suivant', refresh: 'À revoir', available: 'Disponible' };

// ─── Nœud individuel ──────────────────────────────────────────────────────────
function MapNode({ node, chapterColor, chapterGlow, onClick }) {
  const isBoss = node.type === 'boss';
  const isNext = node.status === 'next';
  const isDone = node.status === 'done';
  const isRefresh = node.status === 'refresh';
  const isActive = isDone || isNext || isRefresh;

  const size = isBoss ? 'w-20 h-20' : 'w-16 h-16';

  return (
    <div className="flex flex-col items-center gap-1.5 cursor-pointer select-none" onClick={() => onClick(node)}>
      {/* Badge au-dessus */}
      <div className="h-5 flex items-center">
        {isNext && (
          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full animate-bounce"
            style={{ background: chapterColor, color: '#fff' }}>Suivant</span>
        )}
        {isRefresh && (
          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-orange-500/90 text-white">À revoir</span>
        )}
        {isDone && <Stars count={3} />}
      </div>

      {/* Cercle */}
      <div className="relative">
        {isBoss && (
          <div className="absolute inset-[-6px] rounded-full border-2 border-dashed opacity-60"
            style={{ borderColor: chapterColor }} />
        )}
        {isNext && (
          <div className="absolute inset-[-4px] rounded-full animate-ping opacity-20"
            style={{ background: chapterColor }} />
        )}
        <div
          className={`${size} rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-105`}
          style={{
            background: NODE_COLOR[node.status],
            border: `3px solid ${NODE_BORDER[node.status]}`,
            boxShadow: isNext ? `0 0 20px ${chapterGlow}` : isDone ? '0 4px 15px rgba(29,158,117,0.3)' : 'none',
            color: isActive ? '#fff' : 'rgba(255,255,255,0.25)',
          }}
        >
          {typeIcon(node.type, isBoss ? 26 : 20)}
        </div>
      </div>

      {/* Titre */}
      <div className="text-center text-[10px] font-bold leading-tight max-w-[80px] uppercase tracking-wide"
        style={{ color: isActive ? '#e8e8f0' : 'rgba(255,255,255,0.28)' }}>
        {node.title}
      </div>
    </div>
  );
}

// ─── Chemin SVG ───────────────────────────────────────────────────────────────
function ChapterPath({ nodePositions, doneCount, color }) {
  if (nodePositions.length < 2) return null;
  return (
    <>
      {nodePositions.slice(0, -1).map((a, i) => {
        const b = nodePositions[i + 1];
        const cx = (a.x + b.x) / 2;
        const d = `M ${a.x} ${a.y} Q ${cx} ${a.y + 30} ${b.x} ${b.y}`;
        return (
          <path key={i} d={d} fill="none"
            stroke={i < doneCount ? color : 'rgba(255,255,255,0.07)'}
            strokeWidth="3" strokeLinecap="round"
            strokeDasharray={i < doneCount ? 'none' : '6 5'}
            opacity={i < doneCount ? 0.65 : 1} />
        );
      })}
    </>
  );
}

// ─── Bottom sheet au clic ─────────────────────────────────────────────────────
function NodeSheet({ node, chapter, onClose, onStart }) {
  if (!node) return null;
  const isDone = node.status === 'done' || node.status === 'refresh';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg rounded-t-[2rem] p-6 pb-10 shadow-2xl"
        style={{ background: '#13121c', border: '1px solid rgba(255,255,255,0.07)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-6" />

        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full w-fit"
              style={{ background: chapter.colorBg, color: chapter.color }}>
              {chapter.title} · {typeLabel(node.type)}
            </span>
            <h2 className="text-xl font-black text-white leading-tight mt-1">{node.title}</h2>
            {node.difficulty && (
              <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{node.difficulty}</span>
            )}
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors mt-1">
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: chapter.colorBg }}>
            {typeIcon(node.type, 18)}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-white/80">{STATUS_LABEL[node.status]}</span>
            {node.completedAt && (
              <span className="text-[10px] text-white/30 font-medium">
                Dernière révision : {node.completedAt.toLocaleDateString('fr-FR')}
              </span>
            )}
            {node.status === 'refresh' && (
              <span className="text-[10px] text-orange-400 font-bold">⚠ Il est temps de réviser !</span>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          {isDone && (
            <button onClick={() => onStart(node, true)}
              className="flex-shrink-0 flex items-center justify-center py-4 px-5 rounded-xl border border-white/10 text-white/60 hover:border-white/20 hover:text-white transition-all font-bold text-sm">
              <RotateCcw size={15} />
            </button>
          )}
          {node.type === 'lesson' ? (
            <>
              <button onClick={() => node.navigateToFiche()}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all font-bold text-sm">
                <FileText size={15} />
                Lire la Fiche
              </button>
              <button onClick={() => node.navigateToQuiz()}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm text-white transition-all active:scale-95 shadow-lg"
                style={{ background: chapter.color }}>
                <Zap size={15} fill="currentColor" />
                Passer le QCM
              </button>
            </>
          ) : (
            <button onClick={() => onStart(node, false)}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm text-white transition-all active:scale-95 shadow-lg"
              style={{ background: chapter.color }}>
              <Play size={15} fill="currentColor" />
              {isDone ? 'Mise en situation' : 'Commencer'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Section d'un chapitre ────────────────────────────────────────────────────
function ChapterSection({ chapter, onNodeClick }) {
  const containerRef = useRef(null);
  const nodeRefs = useRef([]);
  const [svgData, setSvgData] = useState({ w: 0, h: 0, positions: [] });

  const doneCount = chapter.nodes.filter(n => n.status === 'done').length;
  const total = chapter.nodes.length;
  const progress = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const box = containerRef.current.getBoundingClientRect();
      const positions = nodeRefs.current.map(ref => {
        if (!ref) return { x: box.width / 2, y: 0 };
        const r = ref.getBoundingClientRect();
        return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
      });
      setSvgData({ w: box.width, h: box.height, positions });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [chapter.nodes.length]);

  return (
    <div className="flex flex-col gap-0 w-full">
      {/* En-tête chapitre */}
      <div className="flex items-center gap-3 px-4 py-3 mx-3 rounded-2xl mb-3"
        style={{ background: chapter.colorBg }}>
        <div className="flex flex-col flex-1 gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-black text-sm uppercase tracking-widest" style={{ color: chapter.color }}>
              {chapter.title}
            </span>
            <span className="text-[10px] font-bold text-white/40">{doneCount}/{total}</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: chapter.color }} />
          </div>
        </div>
      </div>

      {/* Nœuds + chemin SVG */}
      <div ref={containerRef} className="relative w-full">
        <svg width={svgData.w} height={svgData.h}
          className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
          <ChapterPath nodePositions={svgData.positions} doneCount={doneCount} color={chapter.color} />
        </svg>

        {chapter.nodes.map((node, idx) => {
          const shift = (ZIGZAG[idx % ZIGZAG.length] || 0) * 38;
          return (
            <div key={node.id} ref={el => nodeRefs.current[idx] = el}
              className="absolute"
              style={{ top: idx * 108 + 12, left: '50%', transform: `translateX(calc(-50% + ${shift}px))` }}>
              <MapNode node={node}
                chapterColor={chapter.color}
                chapterGlow={chapter.colorGlow}
                onClick={onNodeClick} />
            </div>
          );
        })}

        <div style={{ height: chapter.nodes.length * 108 + 60 }} />
      </div>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function Parcours() {
  const { user } = useAuthStore();
  const { fiches, categories, quizzes } = useFicheStore();
  const navigate = useNavigate();
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  // ── Construction dynamique des chapitres ──────────────────────────────────
  const chapters = useMemo(() => {
    const completedFiches = user?.completed_fiches || [];

    return categories.map((cat, catIdx) => {
      const colorTheme = CHAPTER_COLORS[catIdx % CHAPTER_COLORS.length];

      // Fiches de cette catégorie, triées par difficulté
      const catFiches = fiches
        .filter(f => f.category_id === cat.id && f.is_published !== false)
        .sort((a, b) => (DIFFICULTY_ORDER[a.difficulty] ?? 99) - (DIFFICULTY_ORDER[b.difficulty] ?? 99));

      // Quiz rattachés aux fiches de cette catégorie
      const catQuizIds = new Set(catFiches.map(f => f.id));
      const catQuizzes = quizzes.filter(q => catQuizIds.has(q.fiche_id));

      // Construire les nœuds (fiches + boss récap)
      const rawNodes = [
        ...catFiches.map(f => {
          const quiz = catQuizzes.find(q => q.fiche_id === f.id);
          return {
            id: f.id,
            title: f.title,
            type: 'lesson',
            difficulty: f.difficulty,
            navigateToFiche: () => navigate(`/fiche/${f.id}`),
            navigateToQuiz: quiz ? () => navigate(`/quiz/${quiz.id}`) : () => alert("Ce module n'a pas encore de QCM"),
          };
        }),
        // Boss récap à la fin de chaque chapitre s'il y a au moins 2 fiches
        ...(catFiches.length >= 2 ? [{
          id: `boss-${cat.id}`,
          title: `Récap ${cat.name}`,
          type: 'boss',
          navigateTo: () => navigate(`/quiz/${catQuizzes[0]?.id || 'q1'}`),
        }] : []),
      ];

      if (rawNodes.length === 0) return null;

      const nodes = computeNodeStatuses(rawNodes, completedFiches);

      return {
        id: cat.id,
        title: cat.name,
        ...colorTheme,
        nodes,
      };
    }).filter(Boolean);
  }, [categories, fiches, quizzes, user?.completed_fiches, navigate]);

  // ── Statistiques globales ───────────────────────────────────────────────────
  const totalNodes = chapters.reduce((acc, ch) => acc + ch.nodes.length, 0);
  const doneNodes = chapters.reduce((acc, ch) => acc + ch.nodes.filter(n => n.status === 'done').length, 0);
  const globalPct = totalNodes > 0 ? Math.round((doneNodes / totalNodes) * 100) : 0;

  // Suggestion du jour : premier nœud "next" ou "refresh"
  const suggestions = chapters.flatMap(ch => ch.nodes.filter(n => n.status === 'next' || n.status === 'refresh'))
    .slice(0, 2);

  const handleNodeClick = (node, chapter) => {
    setSelectedNode(node);
    setSelectedChapter(chapter);
  };

  const handleStart = (node) => {
    setSelectedNode(null);
    if (node.navigateTo) node.navigateTo();
  };

  return (
    <PageWrapper>
      <Header title="Mon Parcours" className="md:hidden" />

      <main className="flex flex-col gap-0 pb-32 max-w-lg mx-auto w-full relative">

        {/* ── En-tête sticky ── */}
        <div className="sticky top-0 z-30 px-4 pt-4 pb-3 flex flex-col gap-3"
          style={{ background: 'rgba(11,10,13,0.93)', backdropFilter: 'blur(16px)' }}>

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

          {/* Barre globale */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#E24B4A] via-[#EF9F27] to-[#378ADD] transition-all duration-700"
                style={{ width: `${globalPct}%` }} />
            </div>
            <span className="text-[10px] font-black text-white/30 shrink-0">{globalPct}%</span>
          </div>

          {/* Chips par chapitre */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
            {chapters.map(ch => {
              const done = ch.nodes.filter(n => n.status === 'done').length;
              const pct = ch.nodes.length > 0 ? Math.round((done / ch.nodes.length) * 100) : 0;
              return (
                <div key={ch.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0"
                  style={{ background: ch.colorBg, border: `1px solid ${ch.color}30` }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: ch.color }} />
                  <span className="text-[10px] font-black whitespace-nowrap" style={{ color: ch.color }}>
                    {ch.title} {pct}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Suggestion du jour */}
          {suggestions.length > 0 && (
            <div className="flex items-start gap-3 px-3 py-2.5 rounded-xl"
              style={{ background: 'rgba(55,138,221,0.08)', border: '1px solid rgba(55,138,221,0.18)' }}>
              <Zap size={14} className="text-blue-400 mt-0.5 shrink-0" />
              <div className="text-[10px] font-bold text-blue-300 leading-relaxed">
                <span className="text-blue-400 font-black">Suggestion du jour — </span>
                {suggestions.map((n, i) => (
                  <span key={n.id}>{i > 0 ? ' · ' : ''}{n.title}{n.status === 'refresh' ? ' (à rafraîchir)' : ' (nouveau)'}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Chapitres ── */}
        <div className="flex flex-col gap-6 px-2 pt-4">
          {chapters.length === 0 && (
            <div className="flex flex-col items-center gap-4 py-20 text-center px-8">
              <BookOpen size={40} className="text-white/15" />
              <p className="text-white/30 font-bold text-sm uppercase tracking-widest">
                Aucune fiche disponible.<br />Ajoutez des fiches depuis la console admin pour les voir apparaître ici.
              </p>
            </div>
          )}

          {chapters.map(chapter => (
            <ChapterSection
              key={chapter.id}
              chapter={chapter}
              onNodeClick={(node) => handleNodeClick(node, chapter)}
            />
          ))}

          {chapters.length > 0 && (
            <div className="flex flex-col items-center gap-4 py-12 px-6 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-dashed border-white/10">
                <Crown size={32} className="text-white/15" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
                Examen final — finissez tous les chapitres
              </p>
            </div>
          )}
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
