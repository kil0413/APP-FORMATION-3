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
    <div className="flex h-screen flex-col bg-[#1A1A2E] overflow-hidden relative">
      
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 right-0 w-full h-[60vh] bg-gradient-to-b from-red-600/20 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -left-40 h-[600px] w-[600px] bg-red-600/10 blur-[160px] rounded-full" />
      <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] bg-blue-600/5 blur-[160px] rounded-full" />

      {/* Main Container */}
      <div className="flex-1 flex flex-col px-8 pt-16 md:pt-24 z-10 max-w-lg mx-auto w-full">
        
        {/* Branding */}
        <header className="flex flex-col items-center text-center gap-6 mb-16">
           <motion.div 
             initial={{ scale: 0, rotate: -20 }}
             animate={{ scale: 1, rotate: 0 }}
             className="h-24 w-24 bg-red-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_60px_rgba(204,26,26,0.3)] border-4 border-white/10"
           >
              <Shield size={48} className="text-white fill-current" />
           </motion.div>
           <div className="flex flex-col gap-3">
              <h1 className="text-4xl md:text-5xl font-black text-white hover:text-red-500 transition-colors uppercase tracking-tighter italic leading-none">
                FORM<span className="text-red-600">ATION</span> <span className="text-red-600">SP</span>
              </h1>
              <div className="flex items-center gap-3 justify-center">
                 <span className="h-0.5 w-8 bg-red-600/30 rounded-full" />
                 <p className="text-white/40 font-black tracking-[0.3em] uppercase text-[9px]">L'excellence opérationnelle</p>
                 <span className="h-0.5 w-8 bg-red-600/30 rounded-full" />
              </div>
           </div>
        </header>

        {/* Auth Glass Card */}
        <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[3rem] p-8 md:p-12 border border-white/5 shadow-2xl relative group overflow-hidden">
          
          <div className="relative z-10 flex flex-col gap-10">
            {/* Mode Switcher */}
            <div className="flex bg-white/5 p-1.5 rounded-[1.5rem] relative">
               <button 
                 onClick={() => setIsLoginMode(true)}
                 className={cn(
                   "flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-[1.2rem] transition-all z-10",
                   isLoginMode ? 'bg-[#CC1A1A] text-white shadow-xl' : 'text-white/40 hover:text-white/60'
                 )}
               >
                 Connexion
               </button>
               <button 
                 onClick={() => setIsLoginMode(false)}
                 className={cn(
                   "flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-[1.2rem] transition-all z-10",
                   !isLoginMode ? 'bg-[#CC1A1A] text-white shadow-xl' : 'text-white/40 hover:text-white/60'
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
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     exit={{ opacity: 0, height: 0 }}
                     className="flex flex-col gap-2"
                   >
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-3">Appelation</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                           <UserIcon size={20} className="text-white/20 group-focus-within:text-red-500 transition-colors" />
                        </div>
                        <input 
                          type="text" 
                          required
                          placeholder="Ex: Adj. Dupont" 
                          value={name} onChange={e => setName(e.target.value)}
                          className="w-full bg-white/5 border-none rounded-2xl py-5 pl-14 pr-6 font-bold text-white placeholder-white/10 focus:ring-4 focus:ring-red-600/20 transition-all text-sm outline-none"
                        />
                      </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-3">Accès Matricule</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                       <Mail size={20} className="text-white/20 group-focus-within:text-red-500 transition-colors" />
                    </div>
                    <input 
                      type="email" 
                      required
                      placeholder="votre@caserne.fr" 
                      value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full bg-white/5 border-none rounded-2xl py-5 pl-14 pr-6 font-bold text-white placeholder-white/10 focus:ring-4 focus:ring-red-600/20 transition-all text-sm outline-none"
                    />
                  </div>
               </div>

               <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-3">Code de sécurité</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                       <Lock size={20} className="text-white/20 group-focus-within:text-red-500 transition-colors" />
                    </div>
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••" 
                      value={password} onChange={e => setPassword(e.target.value)}
                      className="w-full bg-white/5 border-none rounded-2xl py-5 pl-14 pr-6 font-bold text-white placeholder-white/10 focus:ring-4 focus:ring-red-600/20 transition-all text-sm outline-none"
                    />
                  </div>
               </div>

               <button type="submit" className="w-full bg-red-600 text-white py-6 mt-4 rounded-3xl flex items-center justify-center gap-4 font-black uppercase tracking-[0.2em] text-xs hover:bg-red-700 active:scale-95 transition-all shadow-2xl shadow-red-600/30">
                 {isLoginMode ? 'Prendre la garde' : 'Ouvrir mon dossier'}
                 <ArrowRight size={18} strokeWidth={3} />
               </button>
            </form>

            <div className="flex items-center gap-6 py-2">
               <div className="flex-1 h-px bg-white/5" />
               <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Ou continuer avec</span>
               <div className="flex-1 h-px bg-white/5" />
            </div>

            <button 
              type="button"
              onClick={loginWithGoogle}
              className="w-full flex items-center justify-center gap-4 bg-white/5 border border-white/5 py-5 rounded-2xl hover:bg-white/10 active:scale-95 transition-all group"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-black uppercase tracking-widest text-white/60 group-hover:text-white text-[10px]">Google SSO</span>
            </button>
          </div>

          {/* Background Highlight */}
          <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-red-600/10 rounded-full blur-2xl" />
        </div>

        <footer className="mt-12 flex flex-col items-center gap-4 text-center pb-12">
           <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <Zap size={14} className="text-red-500 fill-red-500" />
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Serveur Opérationnel</span>
           </div>
           <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Propulsé par la Technologie SP-Academy</p>
        </footer>
      </div>
    </div>
  );
}
