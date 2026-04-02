export const categories = [
  { id: 'c1', name: 'SUAP', icon: 'Ambulance', color: 'bg-red-100 text-[#CC1A1A]', description: 'Premiers secours et interventions médicales.', theme_header: '#618fad', theme_bg: '#eaf7ff' },
  { id: 'c2', name: 'Incendie', icon: 'Flame', color: 'bg-orange-100 text-orange-600', description: 'Techniques d\'extinction et sauvetage.', theme_header: '#d45959', theme_bg: '#ffeeee' },
  { id: 'c3', name: 'Risques Particuliers', icon: 'Biohazard', color: 'bg-green-100 text-green-600', description: 'Nucléaire, Radiologique, Biologique, Chimique.', theme_header: '#c2b142', theme_bg: '#ffffe9' },
  { id: 'c4', name: 'Communication', icon: 'Radio', color: 'bg-blue-100 text-blue-600', description: 'Procédures radios et gestion d\'appels.', theme_header: '#fae78f', theme_bg: '#FBFAEF' },
  { id: 'c5', name: 'Commandement', icon: 'Shield', color: 'bg-purple-100 text-purple-600', description: 'Gestion de crise et commandement.', theme_header: '#fae78f', theme_bg: '#FBFAEF' },
  { id: 'c6', name: 'Sécurité Civile', icon: 'Siren', color: 'bg-yellow-100 text-yellow-600', description: 'Interventions diverses.', theme_header: '#fae78f', theme_bg: '#FBFAEF' },
];

export const fiches = [
  { id: 'f5', title: 'Conditions de l\'explosion', category_id: 'c3', difficulty: 'Débutant',
    type: 'interactive',
    interactive_id: 'explosion_pentagon',
    sections: [], 
    is_published: true, created_at: new Date().toISOString()
  }
];

export const procedures = [
  { id: 'p1', title: 'Pose d\'un garrot tactique', category_id: 'c1', difficulty: 'Intermédiaire', steps: [
    { title: 'Évaluation', description: 'Identifier que l\'hémorragie nécessite un garrot.' },
    { title: 'Mise en place', description: 'Positionner le garrot à 5cm au-dessus de la plaie.' },
    { title: 'Serrage', description: 'Serrer la sangle puis tourner le garrot jusqu à l arrêt du saignement.' },
    { title: 'Verrouillage', description: 'Bloquer la tige et sécuriser avec la sangle.' },
    { title: 'Heure', description: 'Noter l heure de pose visiblement.' },
    { title: 'Surveillance', description: 'Surveiller la victime jusqu au relais médical.' },
  ], is_published: true },
  { id: 'p2', title: 'Mise en place périmètre', category_id: 'c6', difficulty: 'Débutant', steps: [
    { title: 'Arrivée', description: 'Se garer en sécurité.' },
    { title: 'Distance', description: 'Évaluer la zone de danger.' },
    { title: 'Balisage', description: 'Disposer les cônes.' },
    { title: 'Contrôle', description: 'Éloigner les badauds.' },
    { title: 'Alerte', description: 'Confirmer la sécurité au CODIS.' }
  ], is_published: true }
];

export const documents = [
  { id: 'd1', title: 'Cours : Les brûlures', type: 'Cours PDF', category_id: 'c1', is_published: true, completion: 100 },
  { id: 'd2', title: 'Vidéo : ARI - Port de l appareil', type: 'Vidéo HD', category_id: 'c2', is_published: true, completion: 45 },
  { id: 'd3', title: 'Carte : Protocole arrêt cardiaque', type: 'Carte Mentale', category_id: 'c1', is_published: true, completion: 0 },
  { id: 'd4', title: 'Fiche : Tenue F1', type: 'Fiche Récap', category_id: 'c6', is_published: true, completion: 100 }
];

export const quizzes = [
  { id: 'q5', title: 'Quiz Explosion', fiche_id: 'f5', questions: [
    { q: 'Quelles sont les conditions de l\'explosion ?', answers: ['Combustible, Comburant, Energie', 'Confinement, Suspension, Mélange optimal', 'Les 6 éléments du Pentagone'], correct: 2, explanation: 'Une explosion nécessite le pentagone de l\'explosion.' }
  ], is_published: true }
];

export const mockUser = {
  id: 'u1',
  email: 'pompier@sdis.fr',
  display_name: 'Jean P.',
  grade: 'Sapeur',
  xp_total: 1250,
  lives: 5,
  streak_days: 7,
  daily_xp: 650,
  daily_goal: 1000,
  completed_fiches: [],
  avatar_url: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
};
