export interface FeedPost {
  id: string;
  userName: string;
  userAvatar: string;
  userLevel: number;
  type: 'achievement' | 'levelup' | 'medal' | 'challenge';
  content: string;
  detail?: string;
  likes: number;
  comments: number;
  timeAgo: string;
}

export const MOCK_FEED: FeedPost[] = [
  {
    id: '1',
    userName: 'Lyra Aelindra',
    userAvatar: '🧝',
    userLevel: 7,
    type: 'medal',
    content: 'Conquistou a medalha "Espelho Interior"!',
    detail: 'Orbe da Clareza Azul concluída com sucesso.',
    likes: 12,
    comments: 3,
    timeAgo: '2h',
  },
  {
    id: '2',
    userName: 'Kaelen Forge',
    userAvatar: '⛏️',
    userLevel: 4,
    type: 'levelup',
    content: 'Alcançou o Nível 4!',
    detail: '+2 pontos livres para distribuir.',
    likes: 8,
    comments: 1,
    timeAgo: '5h',
  },
  {
    id: '3',
    userName: 'Zara Flamewing',
    userAvatar: '🐉',
    userLevel: 9,
    type: 'challenge',
    content: 'Completou o desafio "Raízes da Alma"',
    detail: 'Uma reflexão sobre identidade e pertencimento.',
    likes: 21,
    comments: 5,
    timeAgo: '8h',
  },
  {
    id: '4',
    userName: 'Milo Starwhisper',
    userAvatar: '🧚',
    userLevel: 3,
    type: 'achievement',
    content: 'Desbloqueou a carta "Cristal da Serenidade"!',
    detail: 'Item raro obtido na Jornada do Autoconhecimento.',
    likes: 15,
    comments: 2,
    timeAgo: '12h',
  },
  {
    id: '5',
    userName: 'Thorin Ironshield',
    userAvatar: '👹',
    userLevel: 6,
    type: 'medal',
    content: 'Conquistou a medalha "Guardião da Memória"!',
    detail: 'Todos os desafios da Orbe Verde concluídos.',
    likes: 30,
    comments: 7,
    timeAgo: '1d',
  },
];

export interface JourneyGame {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'active' | 'coming_soon';
  color: string;
  progress?: number;
}

export const JOURNEY_GAMES: JourneyGame[] = [
  {
    id: 'self-knowledge',
    name: 'Jornada do Autoconhecimento',
    description: 'Descubra quem você é através de 5 Orbes e 50 desafios criativos.',
    icon: '🔮',
    status: 'active',
    color: 'var(--orb-purple)',
  },
  {
    id: 'leadership',
    name: 'Jornada da Liderança',
    description: 'Desenvolva habilidades de liderança através de missões estratégicas.',
    icon: '👑',
    status: 'coming_soon',
    color: 'var(--orb-red)',
  },
  {
    id: 'teamwork',
    name: 'Jornada do Trabalho em Equipe',
    description: 'Aprenda a colaborar e construir junto com outros aventureiros.',
    icon: '🤝',
    status: 'coming_soon',
    color: 'var(--orb-green)',
  },
  {
    id: 'financial',
    name: 'Jornada da Educação Financeira',
    description: 'Domine o ouro e aprenda a administrar seus recursos com sabedoria.',
    icon: '💰',
    status: 'coming_soon',
    color: 'var(--orb-yellow)',
  },
  {
    id: 'oratory',
    name: 'Jornada da Oratória',
    description: 'Encontre sua voz e aprenda a inspirar através das palavras.',
    icon: '🎙️',
    status: 'coming_soon',
    color: 'var(--orb-blue)',
  },
];
