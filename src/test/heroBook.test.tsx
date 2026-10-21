import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { GameProvider } from '@/context/GameContext';
import { DEFAULT_ATTRIBUTES, type GameState } from '@/types/game';
import Profile from '@/pages/Profile';

const fixture = (): GameState => ({
  character: { name: 'Aerin', age: 16, race: 'elf', characterClass: 'mage', attributes: { ...DEFAULT_ATTRIBUTES }, level: 2, xp: 120, freePoints: 2, backstory: 'Uma origem preservada.' },
  challengeProgress: { b1: { challengeId: 'b1', completed: true, response: 'Minha resposta' } },
  unlockedMedals: ['Uma medalha'], itemCards: [], skillCards: [], currentOrbIndex: 0,
  stories: [{ id: 'old-story', title: 'Um encontro', content: 'Uma memória que fica.', createdAt: '2026-10-01T10:00:00Z' }],
});
function mount() {
  return render(<MemoryRouter initialEntries={['/profile']}><GameProvider><Routes><Route path="/profile" element={<Profile />} /><Route path="/" element={<p>Entrada de Althea</p>} /></Routes></GameProvider></MemoryRouter>);
}
beforeEach(() => {
  localStorage.setItem('althea-game-state', JSON.stringify(fixture()));
  localStorage.setItem('althea-profile-image', 'data:image/png;base64,portrait');
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => { cleanup(); localStorage.clear(); vi.restoreAllMocks(); });

describe('Livro do Herói', () => {
  it('abre no personagem e folheia sem alterar personagem, respostas, imagens ou crônicas', () => {
    mount();
    expect(screen.getByRole('tab', { name: 'Personagem I' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    expect(screen.getByRole('img', { name: 'Retrato de Aerin' })).toHaveAttribute('src', 'data:image/png;base64,portrait');
    expect(screen.getByRole('link', { name: 'Continuar aventura' })).toHaveAttribute('href', '/challenge/b2');
    fireEvent.click(screen.getByRole('button', { name: 'Próximo capítulo' }));
    expect(screen.getByRole('heading', { name: 'Constelação de atributos' })).toBeVisible();
    expect(screen.queryByRole('img', { name: 'Retrato de Aerin' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Próximo capítulo' }));
    expect(screen.getByRole('heading', { name: 'Sua jornada, entre as orbes' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Próximo capítulo' }));
    expect(screen.getByRole('heading', { name: 'Sua história merece páginas' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Próximo capítulo' })).toBeDisabled();
    expect(screen.getByRole('link', { name: /Inventário/ })).toHaveAttribute('href', '/inventory');
    expect(screen.getByRole('link', { name: /Grimório/ })).toHaveAttribute('href', '/grimoire');
    expect(screen.getByRole('link', { name: /Todas as coleções/ })).toHaveAttribute('href', '/collections');
    expect(JSON.parse(localStorage.getItem('althea-game-state')!)).toEqual(fixture());
    expect(localStorage.getItem('althea-profile-image')).toBe('data:image/png;base64,portrait');
  });
  it('conduz quem ainda não criou personagem à entrada', () => {
    localStorage.setItem('althea-game-state', JSON.stringify({ ...fixture(), character: null }));
    mount();
    expect(screen.getByText('Entrada de Althea')).toBeVisible();
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });
});
