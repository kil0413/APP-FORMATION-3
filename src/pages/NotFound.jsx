import { useNavigate } from 'react-router-dom';
import { Flame, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0A12] flex flex-col items-center justify-center p-6 relative overflow-hidden text-center w-full">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #EF4444 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center animate-in fade-in slide-in-from-bottom duration-1000">
        <div className="relative h-40 w-40 flex items-center justify-center mb-8">
          <AlertTriangle size={120} className="text-red-600/20 absolute" />
          <Flame size={60} className="text-red-500 animate-pulse" />
        </div>
        
        <h1 className="text-7xl font-black text-white tracking-tighter uppercase italic mb-4">404</h1>
        <p className="text-red-500 font-black uppercase tracking-[0.2em] text-sm mb-6 flex items-center gap-2">
          Perdu dans les fumées
        </p>
        <p className="text-gray-400 font-medium max-w-sm mb-12 text-sm leading-relaxed">
          La zone que vous essayez d'atteindre n'existe pas ou le plafond de fumée est trop bas pour explorer.
        </p>

        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-[0_10px_30px_rgba(239,68,68,0.2)]"
        >
          <ArrowLeft size={18} />
          Retour au QG
        </button>
      </div>
    </div>
  );
}
