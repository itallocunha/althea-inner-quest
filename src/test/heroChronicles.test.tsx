import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { GameProvider } from '@/context/GameContext';
import { DEFAULT_ATTRIBUTES, type GameState } from '@/types/game';
import { HeroChronicles } from '@/components/rpg/HeroChronicles';

const fixture = (): GameState => ({
  character: { name: 'Aerin', age: 16, race: 'elf', characterClass: 'mage', attributes: { ...DEFAULT_ATTRIBUTES }, xp: 180, level: 2, freePoints: 3, backstory: 'Meu prólogo preservado.' },
  challengeProgress: { b1: { challengeId: 'b1', completed: true, response: 'Resposta guardada' } },
  unlockedMedals: ['Medalha'], itemCards: [], skillCards: [], currentOrbIndex: 0,
  stories: [{ id: 'existing-a', title: 'Primeiro encontro', content: 'Uma memória guardada.', createdAt: '2026-10-01T12:00:00Z' }, { id: 'existing-b', title: 'A ponte', content: 'Atravessei com coragem.', createdAt: '2026-10-02T12:00:00Z' }],
});
const saved = (): GameState => JSON.parse(localStorage.getItem('althea-game-state')!);
const mount = () => render(<GameProvider><HeroChronicles /></GameProvider>);
beforeEach(() => { sessionStorage.clear(); localStorage.setItem('althea-game-state', JSON.stringify(fixture())); });
afterEach(() => { cleanup(); localStorage.clear(); sessionStorage.clear(); vi.restoreAllMocks(); });

describe('Páginas da história no livro do Herói', () => {
  it('folheia o prólogo e as crônicas existentes sem alterar o salvamento', () => {
    mount();
    expect(screen.getByText('Meu prólogo preservado.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Próxima página da história' }));
    expect(screen.getByRole('article', { name: 'Crônica: Primeiro encontro' })).toBeInTheDocument();
    expect(screen.getByText('Página 2 de 3')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Próxima página da história' }));
    expect(screen.getByText('Atravessei com coragem.')).toBeInTheDocument();
    expect(saved()).toEqual(fixture());
  });

  it('cria uma página com o formato atual e preserva os demais dados', () => {
    mount();
    fireEvent.click(screen.getByRole('button', { name: 'Nova página' }));
    expect(screen.getByRole('button', { name: 'Salvar página' })).toBeDisabled();
    fireEvent.change(screen.getByLabelText('Título da página'), { target: { value: '  Minha descoberta  ' } });
    fireEvent.change(screen.getByLabelText('Sua história'), { target: { value: '  Aprendi a me ouvir.  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar página' }));
    expect(screen.getByRole('article', { name: 'Crônica: Minha descoberta' })).toBeInTheDocument();
    expect(saved().stories).toHaveLength(3);
    expect(saved().stories[0]).toMatchObject({ title: 'Minha descoberta', content: 'Aprendi a me ouvir.' });
    expect(saved().stories.slice(1)).toEqual(fixture().stories);
    expect({ ...saved(), stories: fixture().stories }).toEqual(fixture());
  });

  it('edita sem trocar o identificador e reordena sem perder páginas', () => {
    mount();
    fireEvent.click(screen.getByRole('button', { name: /01 Primeiro encontro/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Editar página' }));
    fireEvent.change(screen.getByLabelText('Sua história'), { target: { value: 'Uma memória revisada.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar página' }));
    expect(saved().stories[0]).toEqual({ ...fixture().stories[0], content: 'Uma memória revisada.' });
    fireEvent.click(screen.getByRole('button', { name: 'Mover página para depois' }));
    expect(saved().stories.map(story => story.id)).toEqual(['existing-b', 'existing-a']);
    expect(screen.getByText('Uma memória revisada.')).toBeInTheDocument();
    expect(screen.getByText('Página 3 de 3')).toBeInTheDocument();
  });

  it('recupera um rascunho ao retornar sem abrir o editor sozinho nem alterar o jogo', () => {
    const first = mount();
    fireEvent.click(screen.getByRole('button', { name: /01 Primeiro encontro/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Editar página' }));
    fireEvent.change(screen.getByLabelText('Sua história'), { target: { value: 'Um texto ainda em construção.' } });
    expect(saved()).toEqual(fixture());
    first.unmount();
    mount();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    fireEvent.click(screen.getByRole('button', { name: 'Nova página' }));
    expect(confirm).toHaveBeenCalledWith(expect.stringContaining('Há um rascunho guardado'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Retomar rascunho' }));
    expect(screen.getByLabelText('Título da página')).toHaveValue('Primeiro encontro');
    expect(screen.getByLabelText('Sua história')).toHaveValue('Um texto ainda em construção.');
    expect(saved()).toEqual(fixture());
    fireEvent.click(screen.getByRole('button', { name: 'Salvar página' }));
    expect(saved().stories).toHaveLength(2);
    expect(saved().stories[0]).toEqual({ ...fixture().stories[0], content: 'Um texto ainda em construção.' });
    expect({ ...saved(), stories: fixture().stories }).toEqual(fixture());
    expect(sessionStorage.length).toBe(0);
  });

  it('protege o rascunho ao cancelar e exige confirmação para apagar', () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    mount();
    fireEvent.click(screen.getByRole('button', { name: 'Nova página' }));
    fireEvent.change(screen.getByLabelText('Título da página'), { target: { value: 'Rascunho' } });
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(confirm).toHaveBeenCalledWith(expect.stringContaining('Descartar'));
    confirm.mockReturnValue(true);
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /01 Primeiro encontro/ }));
    confirm.mockReturnValue(false);
    fireEvent.click(screen.getByRole('button', { name: 'Apagar' }));
    expect(saved()).toEqual(fixture());
    confirm.mockReturnValue(true);
    fireEvent.click(screen.getByRole('button', { name: 'Apagar' }));
    expect(saved().stories.map(story => story.id)).toEqual(['existing-b']);
  });
});

