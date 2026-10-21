import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { GameProvider } from '@/context/GameContext';
import { DEFAULT_ATTRIBUTES, type GameState } from '@/types/game';
import { HeroAttributes } from './HeroAttributes';

const fixture = (): GameState => ({
  character: { name: 'Heroína de teste', age: 16, race: 'elf', characterClass: 'mage', attributes: { ...DEFAULT_ATTRIBUTES }, level: 2, xp: 120, freePoints: 2 },
  challengeProgress: { b1: { challengeId: 'b1', completed: true } },
  unlockedMedals: ['Primeiro passo'], itemCards: [], skillCards: [], currentOrbIndex: 0, stories: [],
});
const saved = (): GameState => JSON.parse(localStorage.getItem('althea-game-state')!);
const mount = () => render(<GameProvider><HeroAttributes /></GameProvider>);
beforeEach(() => localStorage.setItem('althea-game-state', JSON.stringify(fixture())));
afterEach(() => { cleanup(); localStorage.clear(); });

describe('Constelações do livro do herói', () => {
  it('permite explorar os quinze atributos sem gastar pontos ou mudar o progresso', () => {
    mount();
    const stars = screen.getAllByRole('button', { name: /^Explorar / });
    expect(stars).toHaveLength(15);
    for (const star of stars) fireEvent.click(star);
    expect(saved()).toEqual(fixture());
    expect(screen.getByRole('button', { name: 'Aumentar Adaptabilidade em 1 ponto' })).toBeEnabled();
  });

  it('navega entre ramos com o teclado e evolui somente a estrela selecionada', async () => {
    mount();
    const initial = screen.getByRole('button', { name: 'Explorar Autoconhecimento: 0 de 100' });
    initial.focus();
    fireEvent.keyDown(initial, { key: 'ArrowRight' });
    const physical = screen.getByRole('button', { name: 'Explorar Força Física: 0 de 100' });
    await waitFor(() => expect(physical).toHaveFocus());
    expect(physical).toHaveAttribute('aria-pressed', 'true');
    fireEvent.keyDown(physical, { key: 'End' });
    const management = screen.getByRole('button', { name: 'Explorar Autogestão: 0 de 100' });
    await waitFor(() => expect(management).toHaveFocus());
    expect(saved().character!.freePoints).toBe(2);
    fireEvent.click(screen.getByRole('button', { name: 'Aumentar Autogestão em 1 ponto' }));
    expect(saved().character!.attributes.selfManagement).toBe(1);
    expect(saved().character!.attributes.physicalStrength).toBe(0);
    expect(saved().character!.freePoints).toBe(1);
    expect(saved().challengeProgress).toEqual(fixture().challengeProgress);
    expect(screen.getByRole('status')).toHaveTextContent('Autogestão recebeu 1 ponto');
  });

  it('separa os doze atributos futuros em consulta, sem botões de evolução', () => {
    mount();
    const summary = screen.getByText('Estrelas de jornadas futuras');
    fireEvent.click(summary);
    const section = summary.closest('details')!;
    expect(within(section).getAllByRole('article')).toHaveLength(12);
    expect(within(section).queryByRole('button')).not.toBeInTheDocument();
    expect(within(section).getByText(/apenas para consulta/)).toBeInTheDocument();
  });
});

