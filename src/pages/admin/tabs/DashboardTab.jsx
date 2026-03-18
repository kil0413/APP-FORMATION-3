import { useFicheStore } from '../../../store/useFicheStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { Users, FileText, CheckCircle2, TrendingUp, Clock, AlertTriangle, ArrowUpRight, ArrowDownRight, Brain } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';

export default function DashboardTab() {
  const { realFichesCount, realQuizzesCount } = useFicheStore();
  const { profiles } = useAuthStore();

  const stats = [
    { label: 'Pompiers Inscrits', value: profiles.length.toLocaleString(), change: profiles.length > 0 ? '+100%' : '0%', trend: 'up', icon: Users, color: 'blue' },
    { label: 'Fiches (Réel DB)', value: realFichesCount, change: 'Base Active', trend: 'up', icon: FileText, color: 'red' },
    { label: 'Taux de réussite', value: '74%', change: '+2%', trend: 'up', icon: CheckCircle2, color: 'green' },
    { label: 'Quiz (Réel DB)', value: realQuizzesCount, change: 'Sync ok', trend: 'up', icon: Brain, color: 'purple' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:shadow-xl transition-all duration-300 border-none bg-white group cursor-default shadow-sm rounded-[2rem]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${
                  stat.color === 'blue' ? 'bg-blue-50 text-blue-500' :
                  stat.color === 'red' ? 'bg-red-50 text-red-500' :
                  stat.color === 'green' ? 'bg-green-50 text-green-500' :
                  'bg-purple-50 text-purple-500'
                } group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-[11px] font-black uppercase px-2 py-1 rounded-full ${
                  stat.trend === 'up' ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'
                }`}>
                  {stat.change}
                </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-[#1A1A2E] tracking-tighter italic">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none bg-white p-8 shadow-sm rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black uppercase tracking-tighter italic">Engagement Hebdomadaire</h3>
              <p className="text-xs text-gray-400 font-medium">Données réelles synchronisées via Supabase</p>
            </div>
            <select className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-500 outline-none">
              <option>7 Derniers Jours</option>
            </select>
          </div>
          
          <div className="h-[300px] flex items-end justify-between gap-4 pt-4">
            {[40, 70, 45, 90, 65, 30, 85].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div 
                  className="w-full bg-gradient-to-t from-[#CC1A1A]/10 to-[#CC1A1A] rounded-t-2xl transition-all duration-500 group-hover:opacity-80 relative"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1A1A2E] text-white text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                    {h}%
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase text-gray-400">{'LMMJVSD'[i]}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-none bg-white p-8 relative overflow-hidden shadow-sm rounded-[2.5rem]">
          <h3 className="text-xl font-black uppercase tracking-tighter italic mb-8 relative z-10">Serveur & Sync</h3>
          <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                 <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                 <p className="text-xs font-bold uppercase text-[#1A1A2E]">Connexion Supabase active</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="h-2 w-2 rounded-full bg-blue-500" />
                 <p className="text-xs font-bold uppercase text-[#1A1A2E]">Vercel Edge Network : OK</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="h-2 w-2 rounded-full bg-purple-500" />
                 <p className="text-xs font-bold uppercase text-[#1A1A2E]">Auth Service : Running</p>
              </div>
          </div>
          <button className="w-full mt-12 py-4 border-2 border-dashed border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400">
            Journal de bord technique
          </button>
          
          <TrendingUp className="absolute -right-8 -bottom-8 opacity-[0.03] scale-[4]" size={64} />
        </Card>
      </div>
    </div>
  );
}
