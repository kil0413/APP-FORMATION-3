import { useFicheStore } from '../../../store/useFicheStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { Users, FileText, CheckCircle2, TrendingUp, Clock, AlertTriangle, ArrowUpRight, ArrowDownRight, Brain } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';

export default function DashboardTab() {
  const { fiches, quizzes } = useFicheStore();
  const { profiles } = useAuthStore();

  const stats = [
    { label: 'Utilisateurs', value: profiles.length.toLocaleString(), change: '+12%', trend: 'up', icon: Users, color: 'blue' },
    { label: 'Fiches Publiées', value: fiches.length, change: '+5', trend: 'up', icon: FileText, color: 'red' },
    { label: 'Fiches Validées (moy)', value: '74%', change: '+2%', trend: 'up', icon: CheckCircle2, color: 'green' },
    { label: 'Quiz Disponibles', value: quizzes.length, change: '+1', trend: 'up', icon: Brain, color: 'purple' },
  ];

  const recentActivity = [
    { id: 1, user: 'Lucas Dupont', action: 'A validé le module INC-1', time: 'Il y a 2 min', type: 'success' },
    { id: 2, user: 'Sarah Martin', action: 'A échoué au quiz "Risque Gaz"', time: 'Il y a 15 min', type: 'error' },
    { id: 3, user: 'Admin', action: `Nouvelle fiche "${fiches[0]?.title || '...'}" publiée`, time: 'Il y a 1h', type: 'info' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:shadow-xl transition-all duration-300 border-none bg-white group cursor-default shadow-sm">
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
                  {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
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
        <Card className="lg:col-span-2 border-none bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black uppercase tracking-tighter italic">Engagement Hebdomadaire</h3>
              <p className="text-xs text-gray-400 font-medium">Répartition des succès aux quiz par jour</p>
            </div>
            <select className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-500 outline-none">
              <option>7 Derniers Jours</option>
              <option>30 Derniers Jours</option>
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
                    {h}% engagement
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase text-gray-400">{'Lu,Ma,Me,Je,Ve,Sa,Di'.split(',')[i]}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-none bg-white p-8 relative overflow-hidden shadow-sm">
          <h3 className="text-xl font-black uppercase tracking-tighter italic mb-8 relative z-10">Activité Récente</h3>
          <div className="space-y-6 relative z-10">
            {recentActivity.map((act) => (
              <div key={act.id} className="flex gap-4 group cursor-pointer hover:translate-x-1 transition-transform">
                <div className={`mt-1 h-3 w-3 rounded-full shrink-0 ${
                  act.type === 'success' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' :
                  act.type === 'error' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
                  act.type === 'warning' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' :
                  'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                }`} />
                <div>
                   <p className="text-xs font-black uppercase tracking-tighter text-[#1A1A2E] leading-none mb-1 group-hover:text-red-600 transition-colors">{act.user}</p>
                   <p className="text-[11px] text-gray-500 font-medium leading-tight mb-1">{act.action}</p>
                   <p className="text-[9px] font-black uppercase tracking-widest text-gray-300 flex items-center gap-1">
                     <Clock size={10} />
                     {act.time}
                   </p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 border-2 border-dashed border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 hover:border-gray-300 transition-all">
            Voir tout l'historique
          </button>
          
          <TrendingUp className="absolute -right-8 -bottom-8 opacity-[0.03] scale-[4]" size={64} />
        </Card>
      </div>
    </div>
  );
}
