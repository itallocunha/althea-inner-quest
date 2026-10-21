import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { GameProvider } from '@/context/GameContext';
import { HeroJourney } from '@/components/rpg/HeroJourney';
import { ALL_CHALLENGES } from '@/data/gameData';
import { DEFAULT_ATTRIBUTES, type GameState } from '@/types/game';

const fixture = (): GameState => ({
  character: { name: 'Viajante', age: 16, race: 'elf', characterClass: 'mage', attributes: { ...DEFAULT_ATTRIBUTES }, level: 1, xp: 10, freePoints: 2, backstory: 'Origem preservada' },
  challengeProgress: { b1: { challengeId: 'b1', completed: true, response: 'Minha reflexão', completedAt: '2026-10-01T12:00:00Z' } },
  unlockedMedals: ['Medalha'], itemCards: [], skillCards: [], currentOrbIndex: 0,
  stories: [{ id: 'existing', title: 'Minha história', content: 'Uma memória', createdAt: '2026-10-01T12:00:00Z' }],
});
const mount = (state = fixture()) => {
  localStorage.setItem('althea-game-state', JSON.stringify(state));
  return render(<MemoryRouter><GameProvider><HeroJourney /></GameProvider></MemoryRouter>);
};
beforeEach(() => localStorage.clear());
afterEach(() => { cleanup(); localStorage.clear(); });

describe('Trajetória no livro do Herói', () => {
  it('retoma o próximo desafio salvo e permite inspecionar um território bloqueado sem oferecer entrada ou mudar o salvamento', () => {
    const original = fixture();
    mount(original);
    expect(screen.getByRole('link', { name: 'Continuar aventura' })).toHaveAttribute('href', '/challenge/b2');
    expect(screen.getByRole('link', { name: 'Mapa dos continentes' })).toHaveAttribute('href', '/world');
    expect(screen.getByRole('status')).toHaveTextContent('Você está em Clareza Azul');
    expect(screen.getByRole('link', { name: 'Rever minhas conquistas' })).toHaveAttribute('href', '/portfolio/blue');
    fireEvent.click(screen.getByRole('button', { name: /Explorar Memória Verde/ }));
    expect(screen.getByRole('heading', { name: 'Memória Verde' })).toBeInTheDocument();
    expect(screen.getByText(/Conclua os territórios anteriores/)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Rever minhas conquistas' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Continuar aventura' })).toHaveAttribute('href', '/challenge/b2');
    expect(JSON.parse(localStorage.getItem('althea-game-state')!)).toEqual(original);
  });

  it('reconhece todos os desafios concluídos com índice final além da última orbe', () => {
    const complete = fixture();
    complete.currentOrbIndex = 5;
    complete.challengeProgress = Object.fromEntries(ALL_CHALLENGES.map(challenge => [challenge.id, { challengeId: challenge.id, completed: true }]));
    mount(complete);
    expect(screen.getByRole('status')).toHaveTextContent('Os cinco territórios foram concluídos.');
    expect(screen.getByRole('link', { name: 'Revisitar aventura' })).toHaveAttribute('href', '/orb/yellow');
    expect(screen.getByRole('link', { name: 'Rever minhas conquistas' })).toHaveAttribute('href', '/portfolio/yellow');
    expect(screen.getAllByRole('button', { name: /Concluída/ })).toHaveLength(5);
  });
});
