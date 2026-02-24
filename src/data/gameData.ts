import { OrbData, Challenge, OrbId } from '@/types/game';

export const ORBS: OrbData[] = [
  { id: 'blue', name: 'Clareza Azul', theme: 'Onde eu estou?', focus: 'Realidade atual', develops: 'Foco, Autoconhecimento, Comunicação', colorClass: 'orb-blue' },
  { id: 'green', name: 'Memória Verde', theme: 'De onde eu vim?', focus: 'Passado e identidade', develops: 'Empatia, Resiliência', colorClass: 'orb-green' },
  { id: 'purple', name: 'Presença Roxa', theme: 'Onde estou agora?', focus: 'Consciência do presente', develops: 'Autogestão, Força Emocional', colorClass: 'orb-purple' },
  { id: 'red', name: 'Ambição Vermelha', theme: 'Para onde quero ir?', focus: 'Sonhos e metas', develops: 'Liderança, Determinação', colorClass: 'orb-red' },
  { id: 'yellow', name: 'Sabedoria Amarela', theme: 'Como posso crescer?', focus: 'Evolução contínua', develops: 'Adaptabilidade, Resolução de Problemas', colorClass: 'orb-yellow' },
];

const blueChallenges: Challenge[] = [
  { id: 'b1', orbId: 'blue', index: 0, title: 'O Espelho Interior', narrative: 'Você encontra um espelho mágico numa clareira silenciosa. Ele não reflete sua aparência, mas sua essência.', objective: 'Descreva ou desenhe como você se vê por dentro. Quais cores, formas ou símbolos representam quem você é?', attributeBoosts: { selfKnowledge: 1, focus: 1 }, xpReward: 20, medalName: 'Espelho da Alma', cardReward: { type: 'item', id: 'mirror_soul', name: 'Espelho da Alma', description: 'Um espelho que reflete verdades internas', category: 'Artefato', icon: '🪞' } },
  { id: 'b2', orbId: 'blue', index: 1, title: 'Mapa do Agora', narrative: 'Um cartógrafo ancião pede que você desenhe o mapa da sua vida atual.', objective: 'Crie um mapa visual da sua vida hoje: escola, amigos, família, hobbies. O que está perto? O que está distante?', attributeBoosts: { communication: 1, selfKnowledge: 1 }, xpReward: 20, medalName: 'Cartógrafo Interior' },
  { id: 'b3', orbId: 'blue', index: 2, title: 'Vozes do Presente', narrative: 'Cristais vibrantes ecoam vozes. Cada um carrega uma mensagem sobre como os outros te veem.', objective: 'Escreva 3 qualidades que as pessoas veem em você e 1 que você gostaria que vissem.', attributeBoosts: { communication: 1, focus: 1 }, xpReward: 20, medalName: 'Eco Cristalino', cardReward: { type: 'skill', id: 'active_listening', name: 'Escuta Ativa', description: 'Capacidade de ouvir profundamente antes de responder', passive: true, icon: '👂' } },
  { id: 'b4', orbId: 'blue', index: 3, title: 'Âncora Emocional', narrative: 'Uma tempestade se aproxima. Você precisa encontrar sua âncora emocional para se manter firme.', objective: 'O que te dá estabilidade? Descreva ou represente seu ponto de equilíbrio.', attributeBoosts: { emotionalStrength: 1, resilience: 1 }, xpReward: 20, medalName: 'Âncora Firme' },
  { id: 'b5', orbId: 'blue', index: 4, title: 'Inventário Pessoal', narrative: 'Antes de seguir viagem, é preciso saber o que você carrega na mochila da vida.', objective: 'Liste 5 habilidades que você já tem e 3 que gostaria de desenvolver.', attributeBoosts: { selfKnowledge: 1, intelligence: 1 }, xpReward: 20, medalName: 'Mochileiro Consciente', cardReward: { type: 'item', id: 'backpack_awareness', name: 'Mochila da Consciência', description: 'Carrega apenas o que importa', category: 'Equipamento', icon: '🎒' } },
  { id: 'b6', orbId: 'blue', index: 5, title: 'O Rio das Emoções', narrative: 'Um rio brilhante flui à sua frente. Cada onda carrega uma emoção diferente.', objective: 'Identifique 5 emoções que você sentiu esta semana. Qual foi a mais forte?', attributeBoosts: { emotionalStrength: 1, selfKnowledge: 1 }, xpReward: 20, medalName: 'Navegador Emocional' },
  { id: 'b7', orbId: 'blue', index: 6, title: 'Constelação de Valores', narrative: 'No céu noturno, cada estrela representa um valor. Quais brilham mais forte para você?', objective: 'Escolha seus 5 valores mais importantes e explique por que cada um importa.', attributeBoosts: { focus: 1, determination: 1 }, xpReward: 20, medalName: 'Guardião Estelar', cardReward: { type: 'skill', id: 'moral_compass', name: 'Bússola Moral', description: 'Senso claro de direção baseado em valores', passive: true, icon: '🧭' } },
  { id: 'b8', orbId: 'blue', index: 7, title: 'Diálogo com Sombras', narrative: 'Sua sombra ganha voz e quer conversar sobre seus medos.', objective: 'Escreva um diálogo entre você e seus medos. O que eles dizem? Como você responde?', attributeBoosts: { resilience: 1, emotionalStrength: 1 }, xpReward: 25, medalName: 'Domador de Sombras' },
  { id: 'b9', orbId: 'blue', index: 8, title: 'Círculo de Conexões', narrative: 'Uma mesa redonda mágica reúne todas as pessoas importantes da sua vida.', objective: 'Desenhe ou descreva seu círculo de conexões. Quem está mais perto? Quem você gostaria de aproximar?', attributeBoosts: { communication: 1, teamwork: 1 }, xpReward: 25, medalName: 'Tecedor de Laços', cardReward: { type: 'item', id: 'connection_web', name: 'Teia de Conexões', description: 'Fios dourados que ligam corações', category: 'Relíquia', icon: '🕸️' } },
  { id: 'b10', orbId: 'blue', index: 9, title: 'Juramento da Clareza', narrative: 'No altar da Orbe Azul, você é convidado a fazer um juramento de autoconhecimento.', objective: 'Escreva uma carta para si mesmo com 3 compromissos de autoconhecimento que quer manter.', attributeBoosts: { selfKnowledge: 2, focus: 1 }, xpReward: 30, medalName: 'Mestre da Clareza', cardReward: { type: 'skill', id: 'inner_clarity', name: 'Clareza Interior', description: 'Visão límpida sobre si mesmo e o mundo', passive: false, icon: '💎' } },
];

function generateOrbChallenges(orbId: OrbId, prefix: string, titles: string[], boostKeys: [string, string][]): Challenge[] {
  return titles.map((title, i) => ({
    id: `${prefix}${i + 1}`,
    orbId,
    index: i,
    title,
    narrative: `Uma nova etapa da ${ORBS.find(o => o.id === orbId)!.name} se revela diante de você...`,
    objective: 'Reflita sobre o tema e expresse-se através de escrita, desenho ou outra forma criativa.',
    attributeBoosts: { [boostKeys[i % boostKeys.length][0]]: 1, [boostKeys[i % boostKeys.length][1]]: 1 } as any,
    xpReward: i === 9 ? 30 : i >= 7 ? 25 : 20,
    medalName: `${title}`,
  }));
}

const greenChallenges = generateOrbChallenges('green', 'g', [
  'Raízes Ancestrais', 'Álbum de Memórias', 'Cicatrizes que Contam', 'O Lar Interior',
  'Heróis do Passado', 'Tradições Sagradas', 'Perdão Antigo', 'Linha do Tempo',
  'Carta ao Passado', 'Guardião da Memória'
], [['empathy', 'resilience'], ['selfKnowledge', 'empathy'], ['resilience', 'emotionalStrength'], ['empathy', 'communication']]);

const purpleChallenges = generateOrbChallenges('purple', 'p', [
  'Respiração Consciente', 'Momento Presente', 'Corpo e Mente', 'Ritual Diário',
  'Gratidão Profunda', 'Silêncio Interior', 'Emoção do Agora', 'Presença Plena',
  'Autocompaixão', 'Mestre do Presente'
], [['selfManagement', 'emotionalStrength'], ['focus', 'selfManagement'], ['emotionalStrength', 'resilience'], ['selfManagement', 'selfKnowledge']]);

const redChallenges = generateOrbChallenges('red', 'r', [
  'Visão do Futuro', 'Metas Corajosas', 'Plano de Ação', 'Aliados do Caminho',
  'Superando Obstáculos', 'Fogo Interior', 'Legado Pessoal', 'Inspiração Viva',
  'Pacto de Coragem', 'Guardião da Ambição'
], [['leadership', 'determination'], ['determination', 'focus'], ['leadership', 'communication'], ['determination', 'creativity']]);

const yellowChallenges = generateOrbChallenges('yellow', 'y', [
  'Aprendiz Eterno', 'Zona de Conforto', 'Feedback como Presente', 'Reinvenção',
  'Mentalidade de Crescimento', 'Adaptação Criativa', 'Problemas como Portais', 'Colaboração Sábia',
  'Síntese da Jornada', 'Mestre da Sabedoria'
], [['adaptability', 'problemSolving'], ['problemSolving', 'creativity'], ['adaptability', 'intelligence'], ['problemSolving', 'teamwork']]);

export const ALL_CHALLENGES: Challenge[] = [
  ...blueChallenges,
  ...greenChallenges,
  ...purpleChallenges,
  ...redChallenges,
  ...yellowChallenges,
];

export function getChallengesForOrb(orbId: OrbId): Challenge[] {
  return ALL_CHALLENGES.filter(c => c.orbId === orbId);
}
