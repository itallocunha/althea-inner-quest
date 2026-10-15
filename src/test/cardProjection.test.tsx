import { useState } from 'react';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Card3DViewer, type Card3DData } from '@/components/rpg/Card3DViewer';
import { GameProvider } from '@/context/GameContext';
import Profile from '@/pages/Profile';
import Medals from '@/pages/Medals';
import CharacterCreation from '@/pages/CharacterCreation';
import { CLASS_ART, RACE_ART, getMedalArt } from '@/lib/journeyAssets';
import { ALL_CHALLENGES } from '@/data/gameData';
import { DEFAULT_ATTRIBUTES } from '@/types/game';

const pointerMethods = ['setPointerCapture', 'releasePointerCapture', 'hasPointerCapture'] as const;
const originalMethods = pointerMethods.map(method => Object.getOwnPropertyDescriptor(HTMLElement.prototype, method));

beforeAll(() => {
  class TestPointerEvent extends MouseEvent {
    pointerId: number;
    isPrimary: boolean;
    constructor(type: string, options: PointerEventInit = {}) {
      super(type, options);
      this.pointerId = options.pointerId || 1;
      this.isPrimary = options.isPrimary ?? true;
    }
  }
  vi.stubGlobal('PointerEvent', TestPointerEvent);
  Object.defineProperties(HTMLElement.prototype, {
    setPointerCapture: { configurable: true, value: () => {} },
    releasePointerCapture: { configurable: true, value: () => {} },
    hasPointerCapture: { configurable: true, value: () => false },
  });
});

afterAll(() => {
  vi.unstubAllGlobals();
  pointerMethods.forEach((method, index) => {
    if (originalMethods[index]) Object.defineProperty(HTMLElement.prototype, method, originalMethods[index]!);
    else delete HTMLElement.prototype[method];
  });
});

afterEach(() => { cleanup(); localStorage.clear(); });

const card: Card3DData = { name: 'Carta de teste', badge: 'Relíquia', iconName: 'gem', description: 'Uma carta de Althea.', backDescription: 'A história deste tesouro.' };

function ProjectionFixture() {
  const [selected, setSelected] = useState<Card3DData | null>(card);
  return <Card3DViewer card={selected} onClose={() => setSelected(null)} />;
}

function characterFixture() {
  localStorage.setItem('althea-game-state', JSON.stringify({
    character: { name: 'Heroína', age: 16, race: 'elf', characterClass: 'mage', attributes: { ...DEFAULT_ATTRIBUTES }, level: 1, xp: 20, freePoints: 2 },
    itemCards: [], skillCards: [], stories: [], currentOrbIndex: 0,
    challengeProgress: { b1: { challengeId: 'b1', completed: true } }, unlockedMedals: [ALL_CHALLENGES[0].medalName],
  }));
}

describe('Projeção das cartas', () => {
  it('mostra verso e frente pelo teclado, sem limitar a uma única virada', () => {
    render(<ProjectionFixture />);
    const object = screen.getByTestId('card-3d-object');
    for (let index = 0; index < 7; index++) fireEvent.keyDown(object, { key: 'ArrowRight' });
    expect(object).toHaveAttribute('data-facing', 'back');
    for (let index = 0; index < 6; index++) fireEvent.keyDown(object, { key: 'ArrowRight' });
    expect(object).toHaveAttribute('data-facing', 'front');
  });

  it('gira por arrasto e não libera partículas ao terminar um arrasto', () => {
    render(<ProjectionFixture />);
    const object = screen.getByTestId('card-3d-object');
    fireEvent.pointerDown(object, { clientX: 100, clientY: 100, pointerId: 1, button: 0 });
    fireEvent.pointerMove(object, { clientX: 300, clientY: 140, pointerId: 1 });
    expect(object).toHaveAttribute('data-facing', 'back');
    fireEvent.pointerUp(object, { clientX: 300, clientY: 140, pointerId: 1 });
    fireEvent.click(object);
    expect(screen.queryAllByTestId('orb-burst')).toHaveLength(0);
    fireEvent.pointerDown(object, { clientX: 200, clientY: 200, pointerId: 2, button: 0 });
    fireEvent.pointerUp(object, { clientX: 200, clientY: 200, pointerId: 2 });
    fireEvent.click(object, { clientX: 200, clientY: 200, detail: 1 });
    expect(screen.getAllByTestId('orb-burst')).toHaveLength(1);
  });

  it('libera orbes em cada clique, limita o acúmulo e limpa o visor ao fechar', () => {
    render(<ProjectionFixture />);
    const object = screen.getByTestId('card-3d-object');
    for (let index = 0; index < 8; index++) fireEvent.click(object);
    expect(screen.getAllByTestId('orb-burst')).toHaveLength(5);
    expect(screen.getAllByTestId('orb-burst')[0].querySelectorAll('img')).toHaveLength(15);
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryAllByTestId('orb-burst')).toHaveLength(0);
  });

  it('permite reduzir efeitos sem perder rotação e clique na carta', () => {
    render(<ProjectionFixture />);
    fireEvent.click(screen.getByRole('button', { name: 'Reduzir efeitos mágicos' }));
    fireEvent.click(screen.getByRole('button', { name: 'Ver verso' }));
    expect(screen.getByTestId('card-3d-object')).toHaveAttribute('data-facing', 'back');
    fireEvent.keyDown(screen.getByTestId('card-3d-object'), { key: 'Enter' });
    expect(screen.getByTestId('orb-burst').querySelectorAll('img')).toHaveLength(5);
    fireEvent.click(screen.getByRole('button', { name: 'Ver frente' }));
    expect(screen.getByTestId('card-3d-object')).toHaveAttribute('data-facing', 'front');
  });

  it('projeta a ilustração original da carta de classe do Herói', () => {
    characterFixture();
    render(<MemoryRouter><GameProvider><Profile /></GameProvider></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: 'Inspecionar carta de classe: Mago Elemental' }));
    const dialog = screen.getByRole('dialog', { name: 'Mago Elemental' });
    expect(within(dialog).getByRole('img', { name: 'Mago Elemental' })).toHaveAttribute('src', CLASS_ART.mage.card);
    expect(within(dialog).getByTestId('card-3d-object')).toBeInTheDocument();
  });

  it('projeta medalhas com a arte ilustrada do desafio correto', () => {
    characterFixture();
    render(<MemoryRouter><GameProvider><Medals /></GameProvider></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: `Inspecionar medalha ${ALL_CHALLENGES[0].medalName}` }));
    const dialog = screen.getByRole('dialog', { name: ALL_CHALLENGES[0].medalName });
    expect(within(dialog).getByRole('img', { name: ALL_CHALLENGES[0].medalName })).toHaveAttribute('src', getMedalArt('blue', 'b1'));
  });

  it('abre a carta de raça durante a criação sem perder a seleção', async () => {
    render(<MemoryRouter><GameProvider><CharacterCreation /></GameProvider></MemoryRouter>);
    fireEvent.change(screen.getByPlaceholderText('Seu nome de herói'), { target: { value: 'Heroína' } });
    fireEvent.click(screen.getByRole('button', { name: 'Próximo' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Elfos da Floresta' }));
    const dialog = screen.getByRole('dialog', { name: 'Elfos da Floresta' });
    expect(within(dialog).getByRole('img', { name: 'Elfos da Floresta' })).toHaveAttribute('src', RACE_ART.elf.card);
    fireEvent.click(within(dialog).getByRole('button', { name: 'Fechar' }));
    expect(screen.getByRole('button', { name: 'Elfos da Floresta' })).toHaveAttribute('aria-pressed', 'true');
  });
});
