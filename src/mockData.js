export const categories = [
  { id: 'c1', name: 'SUAP', icon: 'Ambulance', color: 'bg-red-100 text-[#CC1A1A]', description: 'Premiers secours et interventions médicales.', theme_header: '#618fad', theme_bg: '#eaf7ff' },
  { id: 'c2', name: 'Incendie', icon: 'Flame', color: 'bg-orange-100 text-orange-600', description: 'Techniques d\'extinction et sauvetage.', theme_header: '#d45959', theme_bg: '#ffeeee' },
  { id: 'c3', name: 'Risques Particuliers', icon: 'Biohazard', color: 'bg-green-100 text-green-600', description: 'Nucléaire, Radiologique, Biologique, Chimique.', theme_header: '#c2b142', theme_bg: '#ffffe9' },
  { id: 'c4', name: 'Communication', icon: 'Radio', color: 'bg-blue-100 text-blue-600', description: 'Procédures radios et gestion d\'appels.', theme_header: '#fae78f', theme_bg: '#FBFAEF' },
  { id: 'c5', name: 'Commandement', icon: 'Shield', color: 'bg-purple-100 text-purple-600', description: 'Gestion de crise et commandement.', theme_header: '#fae78f', theme_bg: '#FBFAEF' },
  { id: 'c6', name: 'Sécurité Civile', icon: 'Siren', color: 'bg-yellow-100 text-yellow-600', description: 'Interventions diverses.', theme_header: '#fae78f', theme_bg: '#FBFAEF' },
];

export const fiches = [
  { id: 'f1', title: 'Hémorragies externes', category_id: 'c1', difficulty: 'Intermédiaire', 
    sections: [
      { type: 'definition', title: 'Définition', content: 'Une hémorragie externe est une perte de sang abondante et prolongée...' },
      { type: 'procedure', title: 'Procédure pas à pas', steps: ['Comprimer directement', 'Allonger', 'Alerter', 'Couvrir'] },
      { type: 'keypoints', title: 'Points clés', items: ['Agir vite', 'Se protéger (gants)', 'Ne pas relâcher'] },
      { type: 'remember', title: 'À retenir', content: 'Le temps est le facteur de survie principal.' }
    ], is_published: true, created_at: new Date().toISOString()
  },
  { id: 'f2', title: 'Extinction urbain', category_id: 'c2', difficulty: 'Avancé',
    sections: [
      { type: 'definition', title: 'Contexte', content: 'Incendie en appartement ou milieu clos.' },
      { type: 'procedure', title: 'Action', steps: ['Reconnaissance', 'Sauvetage', 'Établissement', 'Attaque'] },
      { type: 'remember', title: 'À retenir', content: 'Toujours tester les portes avant ouverture (T.O.).' }
    ], is_published: true, created_at: new Date().toISOString()
  },
  { id: 'f3', title: 'Protection et Alerte', category_id: 'c6', difficulty: 'Débutant',
    sections: [
      { type: 'definition', title: 'Définition', content: 'Première phase indispensable avant toute action de secours.' },
      { type: 'procedure', title: 'Process', steps: ['Baliser', 'Évaluer les risques', 'Message d alerte'] },
      { type: 'keypoints', title: 'Le message', items: ['Où', 'Quoi', 'Combien', 'Actions entreprises'] }
    ], is_published: true, created_at: new Date().toISOString()
  },
  { id: 'f4', title: 'Risque Gaz', category_id: 'c3', difficulty: 'Intermédiaire',
    sections: [
      { type: 'definition', title: 'Caractéristiques à rechercher', items: [
        'La toxicité pour les personnes',
        'La densité du gaz',
        'La plage d’explosivité'
      ], note: 'Parmi les plus courants, seulement les GPL et l’H2S sont plus lourds que l’air.' },
      { type: 'comparison', title: 'L’Explosion', items: [
        { label: 'Déflagration', value: 'v < 340m/s' },
        { label: 'Détonation', value: '2000 < v < 9000m/s' }
      ] },
      { type: 'procedure', title: 'Les 5 Conditions de l’explosion', steps: [
        'Gaz combustible / vapeur inflammable / poussière inflammable',
        'Comburant O2',
        'Énergie d’activation',
        'Plage d’explosivité',
        'Confinement suffisant'
      ] },
      { type: 'keypoints', title: 'Déclenchée par :', items: [
        'Source d’inflammation ⚡',
        'Échauffement trop important (surpression)',
        'Refroidissement trop rapide (choc thermique)',
        'Choc mécanique',
        'Apport brusque de comburant'
      ] },
      { type: 'keypoints', title: 'Conséquences de l’explosion (BLAST) :', items: [
        'Souffle',
        'Onde de choc / surpression ⚡',
        'Chaleur / front de flamme',
        'Effet missile 🚀'
      ] },
      { type: 'definition', title: 'UVCE (Unconfined Vapor Cloud Explosion)', content: 'L’explosion en milieu non confiné d’un nuage de vapeurs de produits inflammables sous l’effet de causes diverses (flamme, friction, compression...).', steps: [
        '1 - Formation du nuage inflammable',
        '2 - Inflammation',
        '3 - Propagation de la flamme à travers le nuage',
        '4 - Propagation des ondes de pression'
      ] },
      { type: 'definition', title: 'BLEVE (Boiling Liquid Expanding Vapor Explosion)', content: 'Vaporisation violente d’un gaz stocké dans un réservoir sous forme liquide. Le gaz se vaporise dès la rupture.', warning: 'Peut survenir même si le conteneur dispose d’un dispositif de sécurité, dans le cas où celui-ci ne se déclenche pas suffisamment tôt.' },
      { type: 'keypoints', title: 'L’Incendie', content: 'Le gaz est soit la cause de l’incendie soit un facteur aggravant.', items: [
        'Température de flamme élevée',
        'Fort risque de propagation',
        'Danger potentiel d’explosion suite à création de poche gazeuses',
        'Dégagement de vapeurs toxiques et produit chimiques'
      ] },
      { type: 'remember', title: 'Flux Thermique', content: 'Flux thermique = puissance qui traverse une surface au cours d’un transfert thermique (Watt). Densité de flux thermique (W/m2) permet de mesurer les effets d’un incendie sur les personnes et structures.' },
      { type: 'definition', title: 'Risques liés aux bouteilles', content: 'Peu importe le contenu, elle est dangereuse lorsqu’elle est soumise à un incendie (BLEVE).', items: [
        'Gaz liquéfié',
        'Gaz comprimé',
        'Gaz dissous (Acétylène)'
      ] }
    ], is_published: true, created_at: new Date().toISOString()
  },
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
  { id: 'q1', title: 'Bilans secouristes', fiche_id: 'f1', questions: [
    { q: 'Quel bilan est prioritaire ?', answers: ['Circonstanciel', 'Vital', 'Lésionnel', 'Complémentaire'], correct: 1, explanation: 'Le bilan vital permet d\'identifier les détresses menaçant la vie.' },
    { q: 'Que signifie PLS ?', answers: ['Position Latérale de Sécurité', 'Protection Légale de Secours', 'Poste Local Sanitaire', 'Premiers Lieux Sauvés'], correct: 0, explanation: 'La PLS maintient les voies aériennes libres.' }
  ], is_published: true },
  { id: 'q2', title: 'Quiz Risque Gaz', fiche_id: 'f4', questions: [
    { q: 'Que signifie BLEVE ?', answers: ['Boiling Liquid Expanding Vapor Explosion', 'Blast Level Emergency Valve Exit', 'Basic Line Essential Venture Engine'], correct: 0, explanation: 'Il s\'agit de la vaporisation violente d\'un gaz liquéfié sous pression.' },
    { q: 'Lequel de ces gaz est plus lourd que l\'air ?', answers: ['Gaz Naturel', 'Hydrogène', 'GPL (Butane/Propane)'], correct: 2, explanation: 'Les GPL ont une densité supérieure à 1 et s\'accumulent au sol.' },
    { q: 'Quelle est la vitesse d\'une détonation ?', answers: ['< 340 m/s', 'Entre 2000 et 9000 m/s', '> 15 000 m/s'], correct: 1, explanation: 'Une détonation est une explosion supersonique (2000-9000m/s).' },
    { q: 'Que signifie UVCE ?', answers: ['Unconfined Vapor Cloud Explosion', 'Universal Valve Control Engine', 'Underground Vault Center Exit'], correct: 0, explanation: 'C\'est l\'explosion d\'un nuage de vapeur en milieu non confiné.' }
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
