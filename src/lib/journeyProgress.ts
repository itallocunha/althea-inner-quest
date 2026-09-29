import { ORBS, getChallengesForOrb } from '@/data/gameData';
import { GameState } from '@/types/game';

export function getJourneyResume(state: GameState) {
  const orbIndex = Math.min(state.currentOrbIndex, ORBS.length - 1);
  const orb = ORBS[orbIndex];
  const challenges = getChallengesForOrb(orb.id);
  const nextChallenge = challenges.find(challenge => !state.challengeProgress[challenge.id]?.completed);
  const completedCount = challenges.filter(challenge => state.challengeProgress[challenge.id]?.completed).length;

  return {
    orb,
    challenge: nextChallenge,
    completedCount,
    destination: nextChallenge ? `/challenge/${nextChallenge.id}` : `/orb/${orb.id}`,
    label: nextChallenge ? `Desafio ${nextChallenge.index + 1} de ${challenges.length}` : 'Orbe concluída',
  };
}