import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { GameProvider } from '@/context/GameContext';
import Inventory from '@/pages/Inventory';
import Grimoire from '@/pages/Grimoire';
import { HeroAttributes } from '@/components/rpg/HeroAttributes';
import { ALL_CHALLENGES } from '@/data/gameData';
import { DEFAULT_ATTRIBUTES, type GameState, type ItemCard, type SkillCard } from '@/types/game';
import { getRewardPresentation } from '@/lib/collectionPresentation';

const reward = (challengeId: string) => ALL_CHALLENGES.find(ch => ch.id === challengeId)!.cardReward!;
const fixture = (): GameState => ({
  character: { name: 'Heroína de teste', age: 16, race: 'elf', characterClass: 'mage', attributes: { ...DEFAULT_ATTRIBUTES }, level: 2, xp: 120, freePoints: 2 },
  challengeProgress: { b1: { challengeId: 'b1', completed: true } },
  unlockedMedals: [], itemCards: [reward('b1') as ItemCard, reward('b5') as ItemCard],
  skillCards: [reward('b3') as SkillCard, reward('b10') as SkillCard], currentOrbIndex: 0, stories: [],
});
const readSaved = (): GameState => JSON.parse(localStorage.getItem('althea-game-state')!);
function mount(element: React.ReactNode) { return render(<MemoryRouter><GameProvider>{element}</GameProvider></MemoryRouter>); }

beforeEach(() => localStorage.setItem('althea-game-state', JSON.stringify(fixture())));
afterEach(() => { cleanup(); localStorage.clear(); });

describe('Acervo e ficha do herói', () => {
  it('busca sem acentos e combina busca com categorias', () => {
    mount(<Inventory />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'heroi' } });
    expect(screen.getByRole('button', { name: 'Inspecionar Escudo do Herói Interior' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Inspecionar Retrato Interior' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Artefato' }));
    expect(screen.getByText('Nenhum tesouro por aqui')).toBeInTheDocument();
  });

  it('salva favoritos e os recupera ao reabrir sem alterar o progresso', () => {
    const view = mount(<Inventory />);
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar Retrato Interior aos favoritos' }));
    expect(readSaved().favoriteCardIds).toEqual(['inner_portrait']);
    expect(readSaved().challengeProgress).toEqual(fixture().challengeProgress);
    view.unmount();
    mount(<Inventory />);
    fireEvent.click(screen.getByRole('button', { name: 'Favoritos' }));
    expect(screen.getByRole('button', { name: 'Inspecionar Retrato Interior' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Inspecionar Escudo do Herói Interior' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Remover Retrato Interior dos favoritos' }));
    expect(readSaved().favoriteCardIds).toEqual([]);
  });

  it('mostra a origem real da carta e permite fechar o visor', () => {
    mount(<Inventory />);
    fireEvent.click(screen.getByRole('button', { name: 'Inspecionar Retrato Interior' }));
    const dialog = screen.getByRole('dialog', { name: 'Retrato Interior' });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Ver verso' }));
    expect(within(dialog).getByText(/Recebido no desafio 1 da Clareza Azul/)).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Fechar' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('separa habilidades ativas e passivas', () => {
    mount(<Grimoire />);
    fireEvent.click(screen.getByRole('button', { name: 'Ativas' }));
    expect(screen.getByRole('button', { name: 'Inspecionar Clareza Interior' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Inspecionar Percepção de Habilidades' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Passivas' }));
    expect(screen.getByRole('button', { name: 'Inspecionar Percepção de Habilidades' })).toBeInTheDocument();
  });

  it('direciona o inventário vazio ao próximo desafio salvo', () => {
    localStorage.setItem('althea-game-state', JSON.stringify({ ...fixture(), itemCards: [] }));
    mount(<Inventory />);
    expect(screen.getByRole('link', { name: 'Continuar jornada' })).toHaveAttribute('href', '/challenge/b2');
  });

  it('distribui os dois pontos disponíveis individualmente e impede gasto adicional', () => {
    mount(<HeroAttributes />);
    const add = screen.getByRole('button', { name: 'Aumentar Autoconhecimento em 1 ponto' });
    fireEvent.click(add);
    expect(readSaved().character!.freePoints).toBe(1);
    expect(readSaved().character!.attributes.selfKnowledge).toBe(1);
    fireEvent.click(add);
    expect(readSaved().character!.freePoints).toBe(0);
    expect(readSaved().character!.attributes.selfKnowledge).toBe(2);
    expect(add).toBeDisabled();
  });

  it('limita o último ponto ao máximo do atributo', () => {
    const saved = fixture();
    saved.character!.attributes.selfKnowledge = 99;
    localStorage.setItem('althea-game-state', JSON.stringify(saved));
    mount(<HeroAttributes />);
    const add = screen.getByRole('button', { name: 'Aumentar Autoconhecimento em 1 ponto' });
    fireEvent.click(add);
    expect(readSaved().character!.attributes.selfKnowledge).toBe(100);
    expect(readSaved().character!.freePoints).toBe(1);
    expect(add).toBeDisabled();
  });

  it('aceita cartas antigas sem origem cadastrada', () => {
    expect(getRewardPresentation({ type: 'item', id: 'old-card', icon: '?', name: 'Legado', description: '', category: 'Artefato' })).toMatchObject({ icon: 'gem', challenge: undefined, orb: undefined });
  });
});
