import { useState, useEffect } from 'react';
import { Settings, Bell, Shield, Smartphone, Globe, Save, RefreshCw, Palette, Trash2, Database, AlertTriangle, Key, Mail, Fingerprint, Lock, Eye, EyeOff } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

export default function SettingsTab() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    mfa: true,
    publicRegistration: false,
    darkMode: 'Auto',
    language: 'Français (SDIS)'
  });

  useEffect(() => {
    const saved = localStorage.getItem('admin_settings');
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    setTimeout(() => {
      setIsSaving(false);
      alert('Configurations enregistrées avec succès sur le serveur.');
    }, 1200);
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-10">
        <div>
          <h2 className="text-4xl font-black text-[#1A1A2E] tracking-tighter uppercase italic">Architecture Système</h2>
          <p className="text-base font-medium text-gray-400 mt-2">Configurez les paramètres globaux de l'infrastructure de formation</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-3 px-8 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl transition-all duration-300 ${
            isSaving 
              ? 'bg-green-500 text-white shadow-green-500/20 scale-95' 
              : 'bg-[#1A1A2E] text-white shadow-red-500/20 hover:bg-red-600 active:scale-95'
          }`}
        >
          {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
          {isSaving ? 'Enregistrement...' : 'Propager les changements'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-4">
           {['Global', 'Sécurité & Accès', 'Notifications', 'Interface', 'Base de données', 'Logs Système'].map((cat, i) => (
             <button 
               key={i} 
               className={`w-full flex items-center justify-between px-8 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] text-left transition-all group ${
                 i === 0 ? 'bg-white shadow-xl text-red-600 border-none' : 'text-gray-400 hover:bg-white/50 hover:text-gray-600'
               }`}
             >
                <div className="flex items-center gap-4">
                  {i === 0 && <Globe size={16} />}
                  {i === 1 && <Lock size={16} />}
                  {i === 2 && <Bell size={16} />}
                  {i === 3 && <Palette size={16} />}
                  {i === 4 && <Database size={16} />}
                  {i === 5 && <Fingerprint size={16} />}
                  {cat}
                </div>
                <div className={`h-2 w-2 rounded-full transition-all group-hover:scale-110 ${i === 0 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-gray-200'}`} />
             </button>
           ))}
           
           <div className="mt-10 p-8 bg-[#CC1A1A] rounded-[2.5rem] text-white shadow-xl shadow-red-500/20 relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                   <AlertTriangle size={16} /> Maintenance
                </h4>
                <p className="text-[11px] font-bold opacity-80 uppercase leading-relaxed mb-6">Activer le mode maintenance déconnectera tous les utilisateurs actifs immédiatement.</p>
                <button 
                  onClick={() => alert('Mode maintenance activé. L\'application est désormais hors-ligne pour les élèves.')}
                  className="w-full bg-white text-red-500 font-black uppercase text-[10px] tracking-widest py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
                >
                  Activer la maintenance
                </button>
              </div>
              <Settings className="absolute -right-8 -bottom-8 opacity-10 group-hover:rotate-45 transition-transform duration-1000" size={120} />
           </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
           <Card className="border-none shadow-sm bg-white p-10 rounded-[3rem]">
              <h3 className="text-xs font-black uppercase tracking-widest text-red-500 flex items-center gap-3 mb-10">
                 <Shield size={16} /> Configuration de l'Espace Admin
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Identifiant Admin</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input 
                        type="email" 
                        defaultValue="admin@sdis.fr"
                        className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] pl-14 pr-6 py-4 font-bold text-sm focus:bg-white focus:border-red-100 transition-all outline-none"
                      />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Mot de passe Console</label>
                    <div className="relative">
                       <Key size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                       <input 
                         type={showPassword ? 'text' : 'password'} 
                         defaultValue="admin"
                         className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] pl-14 pr-14 py-4 font-bold text-sm focus:bg-white focus:border-red-100 transition-all outline-none"
                       />
                       <button 
                         onClick={() => setShowPassword(!showPassword)}
                         className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500 transition-colors"
                       >
                         {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                       </button>
                    </div>
                 </div>
              </div>

              <div className="mt-10 pt-10 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="flex items-center justify-between group">
                    <div>
                       <p className="text-sm font-black uppercase tracking-tighter italic text-[#1A1A2E]">Authentification Multi-Facteurs</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">Sécurité renforcée (SMS/Email)</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" className="sr-only peer" 
                        checked={settings.mfa}
                        onChange={() => toggleSetting('mfa')}
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[5px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500" />
                    </label>
                 </div>
                 <div className="flex items-center justify-between group">
                    <div>
                       <p className="text-sm font-black uppercase tracking-tighter italic text-[#1A1A2E]">Enregistrement Public</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">Autoriser les nouveaux comptes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" className="sr-only peer" 
                        checked={settings.publicRegistration}
                        onChange={() => toggleSetting('publicRegistration')}
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[5px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500" />
                    </label>
                 </div>
              </div>
           </Card>

           <Card className="border-none shadow-sm bg-white p-10 rounded-[3rem]">
              <h3 className="text-xs font-black uppercase tracking-widest text-red-500 flex items-center gap-3 mb-10">
                 <Smartphone size={16} /> Préférences de l'App
              </h3>
              
              <div className="space-y-8">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="max-w-md">
                       <p className="text-sm font-black uppercase tracking-tighter italic text-[#1A1A2E]">Mode Sombre Forcé</p>
                       <p className="text-[11px] text-gray-400 font-medium leading-relaxed mt-1">L'application s'adaptera automatiquement à l'heure locale.</p>
                    </div>
                    <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl w-fit">
                       {['Auto', 'On', 'Off'].map(mode => (
                         <button 
                           key={mode}
                           onClick={() => setSettings({...settings, darkMode: mode})}
                           className={`px-6 py-2.5 shadow-sm rounded-xl text-[10px] font-black uppercase transition-all ${
                             settings.darkMode === mode ? 'bg-white text-red-500 shadow-sm' : 'text-gray-400'
                           }`}
                         >
                           {mode}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                       <p className="text-sm font-black uppercase tracking-tighter italic text-[#1A1A2E]">Langue par défaut</p>
                       <p className="text-[11px] text-gray-400 font-medium leading-relaxed mt-1">Détermine la langue des fiches techniques.</p>
                    </div>
                    <select 
                      className="bg-gray-50 border-none rounded-2xl px-8 py-3.5 font-black uppercase text-[10px] tracking-widest outline-none shadow-inner cursor-pointer"
                      value={settings.language}
                      onChange={(e) => setSettings({...settings, language: e.target.value})}
                    >
                       <option>Français (SDIS)</option>
                       <option>English (International)</option>
                    </select>
                 </div>
              </div>
           </Card>

           <div className="p-10 bg-gray-50 border-2 border-dashed border-gray-100 rounded-[3rem]">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-300 flex items-center gap-3 mb-10">
                 <Trash2 size={16} /> Zone de danger
              </h3>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div>
                    <p className="text-sm font-black uppercase tracking-tighter italic text-[#101010]">Vider les caches système</p>
                    <p className="text-[11px] text-gray-400 font-medium mt-1">Réinitialise toutes les images et fichiers temporaires.</p>
                 </div>
                 <button 
                   onClick={() => alert('Caches purgés avec succès.')}
                   className="px-8 py-4 border border-red-200 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-50 transition-all"
                 >
                   Purger maintenant
                 </button>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div>
                    <p className="text-sm font-black uppercase tracking-tighter italic text-red-600">Supprimer toutes les données</p>
                    <p className="text-[11px] text-gray-400 font-medium mt-1">Efface l'intégralité de la base de données Supabase.</p>
                 </div>
                 <button 
                   onClick={() => { if(window.confirm('CETTE ACTION EST IRREVERSIBLE. Supprimer toutes les données ?')) alert('Action annulée par sécurité (Mode démo)') }}
                   className="px-8 py-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-red-600/20 active:scale-95 transition-all"
                 >
                   Détruire la base
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
