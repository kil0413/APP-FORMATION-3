import { useState } from 'react';
import { useFicheStore } from '../../../store/useFicheStore';
import { Plus, Search, Filter, Edit2, Trash2, Brain } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import QuizEditor from '../components/QuizEditor';

export default function QuizzesTab() {
  const { quizzes, fiches, deleteQuiz } = useFicheStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const filteredQuizzes = quizzes.filter(q => {
    const matchesSearch = q.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleEdit = (quiz) => {
    setEditingQuiz(quiz);
    setIsEditorOpen(true);
  };

  const handleAddNew = () => {
    setEditingQuiz(null);
    setIsEditorOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce QCM ? Cette action est irréversible.')) {
      deleteQuiz(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#1A1A2E] tracking-tighter uppercase italic">Évaluations & QCM</h2>
          <div className="flex items-center gap-4 mt-1">
             <p className="text-sm font-medium text-gray-400">Gérez les quiz liés aux fiches</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleAddNew}
            className="bg-[#378ADD] text-white flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 hover:bg-black transition-all"
          >
            <Plus size={18} />
            Nouveau QCM
          </button>
        </div>
      </div>

      <Card className="p-6 border-none shadow-sm flex flex-col md:flex-row md:items-center gap-4 bg-white/50 backdrop-blur-sm">
        <div className="flex-1 relative group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Rechercher par titre..."
            className="w-full bg-white border border-gray-100 rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/20 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredQuizzes.length > 0 ? filteredQuizzes.map((quiz) => {
            const fiche = fiches.find(f => f.id === quiz.fiche_id);
            return (
              <Card key={quiz.id} className="group hover:border-blue-500/20 transition-all duration-300 bg-white shadow-sm hover:shadow-xl hover:shadow-blue-500/5">
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                      <Brain size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#1A1A2E] truncate pr-2">{quiz.title || 'QCM Sans titre'}</h3>
                      <p className="text-xs text-gray-400 font-medium truncate mt-0.5">
                        Lié à : <span className="text-gray-600">{fiche?.title || 'Fiche inconnue'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-widest">
                      {quiz.questions?.length || 0} Questions
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-widest ${quiz.is_published ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {quiz.is_published ? 'Publié' : 'Brouillon'}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(quiz)}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(quiz.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          }) : (
            <div className="col-span-full py-20 text-center flex flex-col items-center">
               <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Brain size={40} className="text-gray-300" />
               </div>
               <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Aucun QCM trouvé</p>
            </div>
          )}
      </div>

      {isEditorOpen && (
        <QuizEditor
          quiz={editingQuiz}
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </div>
  );
}
