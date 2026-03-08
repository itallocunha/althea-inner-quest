import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { GameState, CharacterData, CharacterStory, ChallengeProgress, ItemCard, SkillCard, Attributes, DEFAULT_ATTRIBUTES, calculateLevel, XP_PER_LEVEL } from '@/types/game';
import { getChallengesForOrb, ORBS } from '@/data/gameData';

interface GameContextType {
  state: GameState;
  createCharacter: (data: CharacterData) => void;
  completeChallenge: (challengeId: string, response?: string, imageUrl?: string) => void;
  distributePoints: (attr: keyof Attributes, points: number) => void;
  resetGame: () => void;
  addStory: (title: string, content: string) => void;
  editStory: (id: string, title: string, content: string) => void;
  deleteStory: (id: string) => void;
  reorderStories: (stories: CharacterStory[]) => void;
  getOrbProgress: (orbIndex: number) => number;
  isOrbUnlocked: (orbIndex: number) => boolean;
  isChallengeUnlocked: (challengeId: string) => boolean;
  isChallengeCompleted: (challengeId: string) => boolean;
}

const STORAGE_KEY = 'althea-game-state';

const defaultState: GameState = {
  character: null,
  challengeProgress: {},
  unlockedMedals: [],
  itemCards: [],
  skillCards: [],
  currentOrbIndex: 0,
  stories: [],
};

function loadState(): GameState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultState;
  } catch { return defaultState; }
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const createCharacter = useCallback((data: CharacterData) => {
    setState(prev => ({ ...prev, character: { ...data, level: 1, xp: 0 } }));
  }, []);

  const completeChallenge = useCallback((challengeId: string, response?: string, imageUrl?: string) => {
    setState(prev => {
      if (!prev.character) return prev;
      const allChallenges = ORBS.flatMap((orb) => getChallengesForOrb(orb.id));
      const challenge = allChallenges.find(c => c.id === challengeId);
      if (!challenge) return prev;

      const newProgress: ChallengeProgress = {
        challengeId, completed: true, response, completedAt: new Date().toISOString(),
      };

      const newXP = prev.character.xp + challenge.xpReward;
      const oldLevel = calculateLevel(prev.character.xp);
      const newLevel = calculateLevel(newXP);
      const leveledUp = newLevel > oldLevel;

      const newAttrs = { ...prev.character.attributes };
      for (const [key, val] of Object.entries(challenge.attributeBoosts)) {
        const k = key as keyof Attributes;
        newAttrs[k] = Math.min(10, newAttrs[k] + (val as number));
      }

      const newMedals = [...prev.unlockedMedals, challenge.medalName];
      const newItems = [...prev.itemCards];
      const newSkills = [...prev.skillCards];
      if (challenge.cardReward?.type === 'item') newItems.push(challenge.cardReward);
      if (challenge.cardReward?.type === 'skill') newSkills.push(challenge.cardReward);

      // Check if orb is complete
      const orbChallenges = getChallengesForOrb(challenge.orbId);
      const completedInOrb = Object.values({ ...prev.challengeProgress, [challengeId]: newProgress })
        .filter(p => p.completed && orbChallenges.some(c => c.id === p.challengeId)).length;
      const orbComplete = completedInOrb >= orbChallenges.length;
      const orbIndex = ORBS.findIndex(o => o.id === challenge.orbId);

      return {
        ...prev,
        character: {
          ...prev.character,
          xp: newXP,
          level: newLevel,
          attributes: newAttrs,
          freePoints: prev.character.freePoints + (leveledUp ? 2 : 0),
        },
        challengeProgress: { ...prev.challengeProgress, [challengeId]: newProgress },
        unlockedMedals: newMedals,
        itemCards: newItems,
        skillCards: newSkills,
        currentOrbIndex: orbComplete ? Math.max(prev.currentOrbIndex, orbIndex + 1) : prev.currentOrbIndex,
      };
    });
  }, []);

  const distributePoints = useCallback((attr: keyof Attributes, points: number) => {
    setState(prev => {
      if (!prev.character || prev.character.freePoints < points) return prev;
      const newAttrs = { ...prev.character.attributes };
      newAttrs[attr] = Math.min(10, newAttrs[attr] + points);
      return { ...prev, character: { ...prev.character, attributes: newAttrs, freePoints: prev.character.freePoints - points } };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const addStory = useCallback((title: string, content: string) => {
    setState(prev => ({
      ...prev,
      stories: [
        { id: `story-${Date.now()}`, title, content, createdAt: new Date().toISOString() },
        ...(prev.stories || []),
      ],
    }));
  }, []);

  const editStory = useCallback((id: string, title: string, content: string) => {
    setState(prev => ({
      ...prev,
      stories: (prev.stories || []).map(s => s.id === id ? { ...s, title, content } : s),
    }));
  }, []);

  const deleteStory = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      stories: (prev.stories || []).filter(s => s.id !== id),
    }));
  }, []);

  const reorderStories = useCallback((stories: CharacterStory[]) => {
    setState(prev => ({ ...prev, stories }));
  }, []);

  const getOrbProgress = useCallback((orbIndex: number) => {
    const orb = ORBS[orbIndex];
    if (!orb) return 0;
    const challenges = getChallengesForOrb(orb.id);
    const completed = challenges.filter(c => state.challengeProgress[c.id]?.completed).length;
    return Math.round((completed / challenges.length) * 100);
  }, [state.challengeProgress]);

  const isOrbUnlocked = useCallback((orbIndex: number) => orbIndex <= state.currentOrbIndex, [state.currentOrbIndex]);

  const isChallengeUnlocked = useCallback((challengeId: string) => {
    const allChallenges = ORBS.flatMap((orb) => getChallengesForOrb(orb.id));
    const challenge = allChallenges.find(c => c.id === challengeId);
    if (!challenge) return false;
    const orbIndex = ORBS.findIndex(o => o.id === challenge.orbId);
    if (!isOrbUnlocked(orbIndex)) return false;
    if (challenge.index === 0) return true;
    const orbChallenges = getChallengesForOrb(challenge.orbId);
    const prev = orbChallenges[challenge.index - 1];
    return !!state.challengeProgress[prev.id]?.completed;
  }, [state.challengeProgress, isOrbUnlocked]);

  const isChallengeCompleted = useCallback((challengeId: string) => {
    return !!state.challengeProgress[challengeId]?.completed;
  }, [state.challengeProgress]);

  return (
    <GameContext.Provider value={{ state, createCharacter, completeChallenge, distributePoints, resetGame, addStory, editStory, deleteStory, reorderStories, getOrbProgress, isOrbUnlocked, isChallengeUnlocked, isChallengeCompleted }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be inside GameProvider');
  return ctx;
}
