import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from '@/App';
import { ALL_CHALLENGES, ORBS, getChallengesForOrb } from '@/data/gameData';
import { DEFAULT_ATTRIBUTES, type GameState, type ItemCard, type SkillCard } from '@/types/game';
import { getJourneyResume } from '@/lib/journeyProgress';

const reducedMotionPreference = vi.hoisted(() => ({ value: null as boolean | null }));
vi.mock('framer-motion', async importOriginal => {
  const motion = await importOriginal<typeof import('framer-motion')>();
  return { ...motion, useReducedMotion: () => {
    const preference = motion.useReducedMotion();
    return reducedMotionPreference.value ?? preference;
  } };
});

const fixture = (): GameState => ({
  character: { name: 'Viajante', age: 16, race: 'elf', characterClass: 'mage', attributes: { ...DEFAULT_ATTRIBUTES, selfKnowledge: 7 }, level: 3, xp: 230, freePoints: 2, backstory: 'Uma história preservada' },
  challengeProgress: { b1: { challengeId: 'b1', completed: true, response: 'Minha reflexão', imageUrl: 'data:image/png;base64,imagem', completedAt: '2026-10-01T12:00:00Z' } },
  unlockedMedals: ['Medalha guardada'],
  itemCards: [ALL_CHALLENGES.find(c => c.id === 'b1')!.cardReward as ItemCard],
  skillCards: [ALL_CHALLENGES.find(c => c.id === 'b3')!.cardReward as SkillCard],
  currentOrbIndex: 0, favoriteCardIds: ['inner_portrait'],
  stories: [{ id: 'story-existing', title: 'Minha história', content: 'Memórias guardadas', createdAt: '2026-10-01T12:00:00Z' }],
});
const save = (state: GameState) => localStorage.setItem('althea-game-state', JSON.stringify(state));
const saved = () => JSON.parse(localStorage.getItem('althea-game-state')!);
function mount(path = '/atlas') { window.history.replaceState({}, '', path); return render(<App />); }
const choose = (name: RegExp) => fireEvent.click(screen.getByRole('button', { name }));

beforeEach(() => { save(fixture()); vi.spyOn(window, 'scrollTo').mockImplementation(() => {}); });
afterEach(() => { cleanup(); localStorage.clear(); vi.restoreAllMocks(); reducedMotionPreference.value = null; });

describe('Atlas de Althea', () => {
  it('reúne a navegação em uma única entrada e preserva as demais áreas', () => {
    mount();
    const nav = within(screen.getByRole('navigation', { name: 'Navegação principal' }));
    expect(nav.getAllByRole('link')).toHaveLength(5);
    expect(nav.getByRole('link', { name: 'Atlas' })).toHaveAttribute('aria-current', 'page');
    for (const name of ['Casa', 'Coleções', 'Guilda', 'Herói']) expect(nav.getByRole('link', { name })).toBeInTheDocument();
    expect(nav.queryByRole('link', { name: 'Mundo' })).not.toBeInTheDocument();
    expect(nav.queryByRole('link', { name: 'Jornadas' })).not.toBeInTheDocument();
  });

  it('apresenta os cinco mundos, seu estado e o progresso real', () => {
    mount();
    expect(within(screen.getByRole('group', { name: 'Planetas do Atlas' })).getAllByRole('button')).toHaveLength(5);
    expect(screen.getByRole('heading', { name: 'Mundo das Cinco Orbes' })).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2');
    expect(screen.getByText('1 de 50 desafios concluídos')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Entrar no mundo' })).toHaveAttribute('href', '/world');
    expect(screen.getByRole('link', { name: 'Continuar aventura' })).toHaveAttribute('href', '/challenge/b2');
  });

  it('permite conhecer os mundos futuros sem oferecer conteúdo jogável', () => {
    mount();
    choose(/Selecionar Mundo dos Gnomos/);
    expect(screen.getByText('Jornada da Educação Financeira')).toBeInTheDocument();
    expect(screen.getByText(/Bolsa Gnomágica/)).toBeInTheDocument();
    for (const name of [/Selecionar Mundo dos Gnomos/, /Selecionar Jornada da Liderança/, /Selecionar Jornada do Trabalho em Equipe/, /Selecionar Jornada da Oratória/]) {
      choose(name);
      expect(screen.getByRole('button', { name })).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByRole('heading', { name: 'Temas previstos' })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'Entrar no mundo' })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'Continuar aventura' })).not.toBeInTheDocument();
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    }
  });

  it('retoma o desafio salvo e permite voltar pela trilha ao mapa e ao Atlas', () => {
    mount();
    fireEvent.click(screen.getByRole('link', { name: 'Continuar aventura' }));
    expect(window.location.pathname).toBe('/challenge/b2');
    fireEvent.click(screen.getByRole('button', { name: /Voltar/ }));
    expect(window.location.pathname).toBe('/orb/blue');
    fireEvent.click(screen.getByRole('button', { name: /Voltar ao mapa/ }));
    expect(window.location.pathname).toBe('/world');
    expect(screen.getByRole('heading', { name: 'Mundo das Cinco Orbes' })).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('link', { name: 'Atlas' })[0]);
    expect(window.location.pathname).toBe('/atlas');
    expect(saved()).toEqual(fixture());
  });

  it('leva o foco aos detalhes sem alterar a rota ou o fragmento do endereço', () => {
    mount();
    const details = screen.getByRole('region', { name: 'Mundo das Cinco Orbes' });
    details.scrollIntoView = vi.fn();
    fireEvent.click(screen.getByRole('button', { name: 'Ver mundo selecionado' }));
    expect(details).toHaveFocus();
    expect(window.location.pathname).toBe('/atlas');
    expect(window.location.hash).toBe('');
  });

  it.each([false, true])('devolve o foco ao fechar o continente com Escape (movimento reduzido: %s)', async reduced => {
    reducedMotionPreference.value = reduced;
    mount('/world');
    const trigger = within(screen.getByRole('group', { name: 'Explorar continentes' })).getByRole('button', { name: 'Clareza Azul' });
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Clareza Azul' });
    fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), { timeout: 3000 });
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(saved()).toEqual(fixture());
  });

  it('abre o mapa artístico e mantém os desbloqueios existentes', async () => {
    mount();
    fireEvent.click(screen.getByRole('link', { name: 'Entrar no mundo' }));
    await waitFor(() => expect(window.location.pathname).toBe('/world'), { timeout: 2500 });
    expect(screen.getByRole('img', { name: 'Mapa-múndi de Althea' })).toBeInTheDocument();
    const continents = within(screen.getByRole('group', { name: 'Explorar continentes' }));
    expect(continents.getByRole('button', { name: 'Clareza Azul' })).toBeEnabled();
    expect(continents.getByRole('button', { name: 'Memória Verde · Selada' })).toBeDisabled();
    expect(saved()).toEqual(fixture());
  });

  it('sinaliza a aproximação antes de entrar pelo botão sem alterar o salvamento', async () => {
    mount();
    fireEvent.click(screen.getByRole('link', { name: 'Entrar no mundo' }));
    expect(screen.getByRole('status', { name: 'Entrando no Mundo das Cinco Orbes' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/atlas');
    await waitFor(() => expect(window.location.pathname).toBe('/world'), { timeout: 2500 });
    expect(saved()).toEqual(fixture());
  });

  it('entra no planeta pelo duplo clique e ignora ativações repetidas durante a aproximação', async () => {
    mount();
    const planet = screen.getByRole('button', { name: /Selecionar Mundo das Cinco Orbes/ });
    fireEvent.doubleClick(planet);
    fireEvent.doubleClick(planet);
    expect(screen.getAllByRole('status', { name: 'Entrando no Mundo das Cinco Orbes' })).toHaveLength(1);
    await waitFor(() => expect(window.location.pathname).toBe('/world'), { timeout: 2500 });
    expect(saved()).toEqual(fixture());
  });

  it('reconhece dois toques rápidos no mesmo planeta', async () => {
    mount();
    const planet = screen.getByRole('button', { name: /Selecionar Mundo das Cinco Orbes/ });
    const touch = () => {
      const event = new MouseEvent('pointerup', { bubbles: true, clientX: 110, clientY: 180 });
      Object.defineProperty(event, 'pointerType', { value: 'touch' });
      fireEvent(planet, event);
    };
    touch();
    expect(screen.queryByRole('status', { name: 'Entrando no Mundo das Cinco Orbes' })).not.toBeInTheDocument();
    touch();
    expect(screen.getByRole('status', { name: 'Entrando no Mundo das Cinco Orbes' })).toBeInTheDocument();
    await waitFor(() => expect(window.location.pathname).toBe('/world'), { timeout: 2500 });
  });

  it('mantém o duplo clique em mundos futuros apenas como seleção', () => {
    mount();
    fireEvent.doubleClick(screen.getByRole('button', { name: /Selecionar Mundo dos Gnomos/ }));
    expect(screen.getByRole('heading', { name: 'Mundo dos Gnomos' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/atlas');
    expect(screen.queryByRole('status', { name: /Entrando no/ })).not.toBeInTheDocument();
  });

  it.each(['button', 'planet'])('entra sem aproximação com movimento reduzido: %s', control => {
    reducedMotionPreference.value = true;
    mount();
    if (control === 'button') fireEvent.click(screen.getByRole('link', { name: 'Entrar no mundo' }));
    else fireEvent.doubleClick(screen.getByRole('button', { name: /Selecionar Mundo das Cinco Orbes/ }));
    expect(window.location.pathname).toBe('/world');
    expect(screen.queryByRole('status', { name: /Entrando no/ })).not.toBeInTheDocument();
    expect(saved()).toEqual(fixture());
  });

  it('permite ativar as animações mesmo com a preferência do sistema reduzida e guarda somente essa escolha visual', () => {
    reducedMotionPreference.value = true;
    const view = mount();
    const toggle = screen.getByRole('switch', { name: 'Animações do Atlas' });
    expect(toggle).not.toBeChecked();
    fireEvent.click(toggle);
    expect(toggle).toBeChecked();
    expect(localStorage.getItem('althea-atlas-motion')).toBe('full');
    expect(saved()).toEqual(fixture());
    view.unmount();
    mount();
    expect(screen.getByRole('switch', { name: 'Animações do Atlas' })).toBeChecked();
    fireEvent.click(screen.getByRole('link', { name: 'Entrar no mundo' }));
    expect(screen.getByRole('status', { name: 'Entrando no Mundo das Cinco Orbes' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/atlas');
  });

  it('permite reduzir novamente os movimentos sem alterar a aventura', () => {
    mount();
    const toggle = screen.getByRole('switch', { name: 'Animações do Atlas' });
    fireEvent.click(toggle);
    expect(toggle).not.toBeChecked();
    fireEvent.click(screen.getByRole('link', { name: 'Entrar no mundo' }));
    expect(window.location.pathname).toBe('/world');
    expect(localStorage.getItem('althea-atlas-motion')).toBe('reduced');
    expect(saved()).toEqual(fixture());
  });

  it.each([['/journeys', '/atlas'], ['/orbs', '/world'], ['/world', '/world']])('preserva a rota antiga %s', (oldPath, destination) => {
    mount(oldPath);
    expect(window.location.pathname).toBe(destination);
    expect(saved()).toEqual(fixture());
  });

  it('permite explorar o Atlas sem herói e conduz a entrada à criação', async () => {
    save({ ...fixture(), character: null });
    mount();
    expect(screen.getByRole('heading', { name: 'Atlas de Althea' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Continuar aventura' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('link', { name: 'Entrar no mundo' }));
    await waitFor(() => expect(window.location.pathname).toBe('/create'), { timeout: 2500 });
    expect(screen.getByPlaceholderText('Seu nome de herói')).toBeInTheDocument();
  });

  it.each(['/world', '/orbs', '/orb/blue', '/challenge/b1'])('protege o acesso sem personagem em %s', path => {
    save({ ...fixture(), character: null });
    mount(path);
    expect(window.location.pathname).toBe('/create');
    expect(screen.getByPlaceholderText('Seu nome de herói')).toBeInTheDocument();
  });

  it('apenas consultar e selecionar mundos não muda nenhum dado salvo', () => {
    mount();
    choose(/Selecionar Mundo dos Gnomos/);
    choose(/Selecionar Jornada da Oratória/);
    choose(/Selecionar Mundo das Cinco Orbes/);
    expect(saved()).toEqual(fixture());
  });
});

describe('Retomada da jornada preservada', () => {
  it('começa no primeiro desafio para um herói novo', () => {
    expect(getJourneyResume({ ...fixture(), challengeProgress: {} }).destination).toBe('/challenge/b1');
  });
  it('retoma a primeira lacuna no continente atual', () => {
    const state = fixture();
    state.currentOrbIndex = 1;
    for (const c of getChallengesForOrb('blue')) state.challengeProgress[c.id] = { challengeId: c.id, completed: true };
    for (const c of getChallengesForOrb('green').slice(0, 3)) state.challengeProgress[c.id] = { challengeId: c.id, completed: true };
    expect(getJourneyResume(state).destination).toBe('/challenge/g4');
  });
  it('mostra a última orbe quando todos os desafios foram concluídos', () => {
    const state = fixture();
    state.currentOrbIndex = ORBS.length;
    for (const c of ALL_CHALLENGES) state.challengeProgress[c.id] = { challengeId: c.id, completed: true };
    expect(getJourneyResume(state).destination).toBe('/orb/yellow');
  });
});
