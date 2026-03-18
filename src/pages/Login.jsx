import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Flame, Shield, ArrowRight, Mail } from 'lucide-react';

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
      <div className="flex h-screen w-full items-center justify-center bg-[#CC1A1A]">
        <Flame className="text-white animate-bounce" size={48} />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[#F2F2F7] overflow-y-auto relative pb-safe">
      <div className="absolute top-0 w-full h-[35vh] bg-[#CC1A1A] rounded-b-[4rem] flex px-4 items-center justify-center shadow-2xl shrink-0">
         <div className="absolute inset-0 bg-black/10 rounded-b-[4rem]"></div>
         <div className="relative text-center z-10 text-white flex flex-col items-center mt-[-40px]">
            <div className="h-16 w-16 bg-white rounded-[1.5rem] flex items-center justify-center shadow-xl mb-4 mt-8">
               <Shield size={32} className="text-[#CC1A1A]" />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic drop-shadow-md leading-none">
              SP Académie
            </h1>
            <p className="text-red-100 font-bold tracking-widest uppercase text-[9px] mt-2 border border-red-400/30 px-3 py-1 rounded-full">
              L'entrainement des champions
            </p>
         </div>
      </div>

      <div className="flex-1 px-6 pt-[28vh] z-10 flex flex-col pb-8">
         <div className="bg-white rounded-[2.5rem] p-6 shadow-xl space-y-6 flex-1 min-h-[300px]">
             
             {/* Toggle Auth Mode */}
             <div className="flex bg-gray-100 p-1 rounded-2xl relative">
                <button 
                  onClick={() => setIsLoginMode(true)}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all z-10 ${isLoginMode ? 'text-[#1A1A2E] shadow-sm bg-white' : 'text-gray-400'}`}
                >
                  Connexion
                </button>
                <button 
                  onClick={() => setIsLoginMode(false)}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all z-10 ${!isLoginMode ? 'text-[#1A1A2E] shadow-sm bg-white' : 'text-gray-400'}`}
                >
                  Nouveau
                </button>
             </div>

            <form onSubmit={handleSubmit} className="space-y-4">
               {!isLoginMode && (
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Prénom ou Surnom</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: Pompier75" 
                      value={name} onChange={e => setName(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold focus:ring-[#CC1A1A] text-sm"
                    />
                 </div>
               )}
               <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Email Courant</label>
                  <input 
                    type="email" 
                    required
                    placeholder="email@caserne.fr" 
                    value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold focus:ring-[#CC1A1A] text-sm"
                  />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Mot de passe secret</label>
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••" 
                    value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold focus:ring-[#CC1A1A] text-sm"
                  />
               </div>

               <button type="submit" className="w-full bg-[#1A1A2E] text-white py-4 mt-2 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest hover:bg-[#CC1A1A] active:scale-95 transition-all shadow-md">
                 <Mail size={18} />
                 {isLoginMode ? 'Entrer dans la caserne' : 'Créer mon dossier'}
               </button>
            </form>

            <div className="relative pt-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[10px] text-gray-400 uppercase font-bold tracking-widest">Connecteur Rapide</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={loginWithGoogle}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 py-4 rounded-2xl shadow-sm hover:bg-gray-50 active:scale-95 transition-transform"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              <span className="font-[900] uppercase tracking-tighter text-[#1A1A2E] text-xs">Utiliser Google</span>
            </button>
            <p className="text-center text-[9px] font-black uppercase text-gray-300 tracking-widest leading-relaxed pt-2">
              Authentification sécurisée
            </p>
         </div>
      </div>
    </div>
  );
}
