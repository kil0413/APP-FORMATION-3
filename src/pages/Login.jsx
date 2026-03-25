import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Flame, Shield, ArrowRight, Mail, Lock, User as UserIcon, Zap, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export default function Login() {
  const { loginWithGoogle, loginWithEmail, signUpWithEmail, isLoading } = useAuthStore();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    if (isLoginMode) {
       loginWithEmail(email, password);
    } else {
       if (!name) return alert("Votre prénom est requis");
       signUpWithEmail(email, password, name);
    }
  };

  if (isLoading) {
    return (
      <div className="flex bg-[#1A1A2E] h-screen items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-red-600/10 blur-[150px] animate-pulse rounded-full scale-150" />
        <div className="flex flex-col items-center gap-8 relative z-10">
           <div className="h-24 w-24 bg-red-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl animate-bounce">
              <Shield size={48} className="text-white fill-current" />
           </div>
           <div className="flex flex-col items-center gap-2">
             <span className="text-white/40 font-black uppercase text-[10px] tracking-[0.4em] animate-pulse">Ouverture de la caserne...</span>
             <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden mt-4">
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="h-full w-full bg-red-600"
                />
             </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#0A0A12] overflow-hidden relative">
      
      {/* --- LEFT SIDE: CINEMATIC BRANDING (Desktop Only) --- */}
      <div className="hidden lg:flex lg:w-3/5 relative flex-col items-center justify-center p-20 overflow-hidden border-r border-white/5">
        {/* Dynamic Blobs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-600/10 blur-[180px] -translate-y-1/2 translate-x-1/2 rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] translate-y-1/2 -translate-x-1/2 rounded-full" />
        
        {/* Animated Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
           
           <motion.div
             initial={{ y: 30, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.4, duration: 0.8 }}
             className="flex flex-col gap-4"
           >
              <h1 className="text-7xl xl:text-8xl font-black text-white uppercase tracking-tighter italic leading-none">
                FIRE <span className="text-red-600">ACADEMIE</span>
              </h1>
              <div className="flex items-center gap-4 justify-center">
                 <span className="h-0.5 w-16 bg-red-600/40 rounded-full" />
                 <p className="text-white/40 font-black tracking-[0.5em] uppercase text-xs">Centre d'Apprentissage d'Élite</p>
                 <span className="h-0.5 w-16 bg-red-600/40 rounded-full" />
              </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1, duration: 1 }}
             className="mt-20 flex gap-12"
           >
              <div className="flex flex-col items-center">
                 <p className="text-3xl font-black text-white italic">+150</p>
                 <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">Modules</p>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="flex flex-col items-center">
                 <p className="text-3xl font-black text-white italic">24/7</p>
                 <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">Opérationnel</p>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="flex flex-col items-center">
                 <p className="text-3xl font-black text-white italic">HD</p>
                 <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">Immersion</p>
              </div>
           </motion.div>
        </div>
      </div>

      {/* --- RIGHT SIDE: LOGIN FORM (Full Screen on Mobile, Side on Desktop) --- */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-20 lg:px-24 xl:px-32 z-10 relative">
        
        {/* Mobile-only background effects */}
        <div className="lg:hidden absolute top-0 right-0 w-full h-[60vh] bg-gradient-to-b from-red-600/20 to-transparent pointer-events-none" />
        <div className="lg:hidden absolute -top-40 -left-40 h-[600px] w-[600px] bg-red-600/10 blur-[160px] rounded-full" />

        <div className="max-w-md mx-auto w-full">
          {/* Mobile Branding (Hidden on Laptop) */}
          <header className="lg:hidden flex flex-col items-center text-center gap-4 mb-10 animate-in fade-in slide-in-from-top duration-700">
             <div className="h-16 w-16 bg-red-600 rounded-[1.5rem] flex items-center justify-center shadow-xl border-2 border-white/10">
                <Shield size={32} className="text-white fill-current" />
             </div>
             <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">
                FIRE <span className="text-red-600">ACADEMIE</span>
             </h1>
          </header>

          <div className="text-center mb-10 hidden lg:block animate-in fade-in duration-1000">
             <h2 className="text-sm font-black text-red-600 uppercase tracking-[0.4em] mb-2 italic">Accès Sécurisé</h2>
             <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Utilisez vos identifiants caserne</p>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] p-8 md:p-12 border border-white/5 shadow-[0_25px_80px_rgba(0,0,0,0.5)] relative group animate-in zoom-in-95 duration-500">
            <div className="relative z-10 flex flex-col gap-10">
              {/* Mode Switcher */}
              <div className="flex bg-white/5 p-1.5 rounded-[2rem] relative border border-white/5">
                 <button 
                   onClick={() => setIsLoginMode(true)}
                   className={cn(
                     "flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-[1.5rem] transition-all z-10",
                     isLoginMode ? 'bg-[#CC1A1A] text-white shadow-xl scale-105' : 'text-white/40 hover:text-white/60'
                   )}
                 >
                   Connexion
                 </button>
                 <button 
                   onClick={() => setIsLoginMode(false)}
                   className={cn(
                     "flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-[1.5rem] transition-all z-10",
                     !isLoginMode ? 'bg-[#CC1A1A] text-white shadow-xl scale-105' : 'text-white/40 hover:text-white/60'
                   )}
                 >
                   Inscription
                 </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                 <AnimatePresence mode="wait">
                   {!isLoginMode && (
                     <motion.div 
                       initial={{ opacity: 0, height: 0, y: -20 }}
                       animate={{ opacity: 1, height: 'auto', y: 0 }}
                       exit={{ opacity: 0, height: 0, y: -20 }}
                       className="flex flex-col gap-2"
                     >
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Grade & Nom</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                             <UserIcon size={20} className="text-white/20 group-focus-within:text-red-500 transition-colors" />
                          </div>
                          <input 
                            type="text" 
                            required
                            placeholder="Ex: Adj. Dupont" 
                            value={name} onChange={e => setName(e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-14 pr-6 font-bold text-white placeholder-white/20 focus:ring-4 focus:ring-red-600/10 focus:bg-white/10 transition-all text-sm outline-none"
                          />
                        </div>
                     </motion.div>
                   )}
                 </AnimatePresence>

                 <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Matricule (Email)</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                         <Mail size={20} className="text-white/20 group-focus-within:text-red-500 transition-colors" />
                      </div>
                      <input 
                        type="email" 
                        required
                        placeholder="matricule@caserne.fr" 
                        value={email} onChange={e => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-14 pr-6 font-bold text-white placeholder-white/20 focus:ring-4 focus:ring-red-600/10 focus:bg-white/10 transition-all text-sm outline-none"
                      />
                    </div>
                 </div>

                 <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Clé d'Accès</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                         <Lock size={20} className="text-white/20 group-focus-within:text-red-500 transition-colors" />
                      </div>
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••" 
                        value={password} onChange={e => setPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-14 pr-6 font-bold text-white placeholder-white/20 focus:ring-4 focus:ring-red-600/10 focus:bg-white/10 transition-all text-sm outline-none"
                      />
                    </div>
                 </div>

                 <button type="submit" className="w-full bg-red-600 text-white py-6 mt-4 rounded-2xl flex items-center justify-center gap-4 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-red-700 active:scale-95 transition-all shadow-2xl shadow-red-600/20">
                   {isLoginMode ? 'Prendre la garde' : 'Ouvrir mon dossier'}
                   <ArrowRight size={16} strokeWidth={3} />
                 </button>
              </form>

              <div className="flex items-center gap-6 py-2">
                 <div className="flex-1 h-px bg-white/5" />
                 <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.4em]">SSO Operationnel</span>
                 <div className="flex-1 h-px bg-white/5" />
              </div>

              <button 
                type="button"
                onClick={loginWithGoogle}
                className="w-full flex items-center justify-center gap-4 bg-white/5 border border-white/5 py-4 rounded-xl hover:bg-white/10 active:scale-95 transition-all group"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                <span className="font-black uppercase tracking-widest text-white/40 group-hover:text-white text-[9px]">Google Auth</span>
              </button>
            </div>
            {/* Background Highlight */}
            <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-red-600/10 rounded-full blur-3xl group-hover:bg-red-600/20 transition-all duration-700" />
          </div>

          <footer className="mt-12 flex items-center justify-between text-center pb-8 opacity-40 group-hover:opacity-100 transition-opacity">
             <p className="text-[8px] font-black text-white uppercase tracking-[0.3em] italic">V.3.1.2.0 - FIRE ACADEMIE</p>
             <div className="flex items-center gap-2">
                <Zap size={10} className="text-red-500" />
                <span className="text-[8px] font-black text-white uppercase tracking-widest">SERVEUR STATUS : OK</span>
             </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
