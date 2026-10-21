import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { ArrowDown, ArrowUp, BookOpen, ChevronLeft, ChevronRight, Feather, Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { CharacterStory } from '@/types/game';
import './HeroChronicles.css';

const PROLOGUE = '__prologue__';
const NEWEST = '__newest__';
interface StoryDraft { editingId: string | null; title: string; content: string }
function readDraft(key: string): StoryDraft | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const draft: unknown = JSON.parse(raw);
    if (!draft || typeof draft !== 'object') return null;
    const value = draft as Partial<StoryDraft>;
    return typeof value.title === 'string' && typeof value.content === 'string' && (value.editingId === null || typeof value.editingId === 'string')
      ? { title: value.title, content: value.content, editingId: value.editingId } : null;
  } catch { return null; }
}

export function HeroChronicles() {
  const { state, addStory, editStory, deleteStory, reorderStories } = useGame();
  const hero = state.character;
  const draftKey = `althea-hero-story-draft:${encodeURIComponent(JSON.stringify(hero ? [hero.name, hero.race, hero.characterClass, hero.age] : []))}`;
  const [savedDraft, setSavedDraft] = useState<StoryDraft | null>(() => readDraft(draftKey));
  const [selectedId, setSelectedId] = useState(PROLOGUE);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [original, setOriginal] = useState({ title: '', content: '' });
  const opener = useRef<HTMLButtonElement | null>(null);
  const newPageButton = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();
  const contentId = useId();
  const stories = state.stories || [];
  const selectedStory = selectedId === NEWEST ? stories[0] : stories.find(story => story.id === selectedId);
  const pageIndex = selectedStory ? stories.findIndex(story => story.id === selectedStory.id) + 1 : 0;
  const dirty = title !== original.title || content !== original.content;

  useEffect(() => {
    if (!editorOpen) return;
    if (!dirty) {
      try { sessionStorage.removeItem(draftKey); } catch { /* Storage may be unavailable. */ }
      setSavedDraft(null);
      return;
    }
    const draft = { editingId, title, content };
    try { sessionStorage.setItem(draftKey, JSON.stringify(draft)); } catch { /* Keep the draft available in this mounted editor when storage is unavailable. */ }
    setSavedDraft(draft);
  }, [editorOpen, dirty, editingId, title, content, draftKey]);

  useEffect(() => {
    if (!editorOpen || !dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [editorOpen, dirty]);

  if (!state.character) return null;

  function clearDraft() {
    try { sessionStorage.removeItem(draftKey); } catch { /* Storage may be unavailable. */ }
    setSavedDraft(null);
  }

  function resumeDraft(button: HTMLButtonElement) {
    if (!savedDraft) return;
    const existing = stories.find(story => story.id === savedDraft.editingId);
    opener.current = button;
    setEditingId(existing?.id || null);
    setTitle(savedDraft.title);
    setContent(savedDraft.content);
    setOriginal({ title: existing?.title || '', content: existing?.content || '' });
    setEditorOpen(true);
  }

  function openEditor(button: HTMLButtonElement, story?: CharacterStory) {
    if (savedDraft && !window.confirm('Há um rascunho guardado. Deseja descartá-lo para começar outra página? Para continuar o texto, escolha Retomar rascunho.')) return;
    if (savedDraft) clearDraft();
    opener.current = button;
    const draft = { title: story?.title || '', content: story?.content || '' };
    setEditingId(story?.id || null);
    setTitle(draft.title);
    setContent(draft.content);
    setOriginal(draft);
    setEditorOpen(true);
  }

  function closeEditor() {
    if (dirty && !window.confirm('Descartar as alterações que ainda não foram salvas nesta página?')) return;
    clearDraft();
    setEditorOpen(false);
  }

  function savePage(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;
    if (editingId) {
      editStory(editingId, title.trim(), content.trim());
      setSelectedId(editingId);
    } else {
      addStory(title.trim(), content.trim());
      setSelectedId(NEWEST);
    }
    clearDraft();
    setEditorOpen(false);
  }

  function removePage(story: CharacterStory) {
    if (!window.confirm(`Apagar a página “${story.title}”? Esta ação não pode ser desfeita.`)) return;
    deleteStory(story.id);
    setSelectedId(PROLOGUE);
  }

  function movePage(offset: number) {
    if (!selectedStory) return;
    const index = pageIndex - 1;
    const destination = index + offset;
    if (destination < 0 || destination >= stories.length) return;
    const reordered = [...stories];
    [reordered[index], reordered[destination]] = [reordered[destination], reordered[index]];
    reorderStories(reordered);
    setSelectedId(selectedStory.id);
  }

  function turnPage(index: number) {
    setSelectedId(index === 0 ? PROLOGUE : stories[index - 1].id);
  }

  return <section className="hero-chronicles" aria-label="Páginas da história do herói">
    <header className="hero-chronicles-heading">
      <div><span className="hero-chronicles-kicker"><Feather size={15} /> Memórias que ficam</span><h2>Sua história merece páginas</h2><p>Registre descobertas, encontros e pequenos atos de coragem.</p></div>
      <button ref={newPageButton} className="hero-chronicles-primary" onClick={event => openEditor(event.currentTarget)}><Plus size={17} /> Nova página</button>
    </header>
    {savedDraft && !editorOpen && <aside className="hero-chronicles-draft" aria-label="Rascunho recuperável"><div><Feather size={18} /><span><strong>Uma memória ficou por terminar</strong><small>Seu rascunho está guardado nesta sessão do navegador.</small></span></div><button onClick={event => resumeDraft(event.currentTarget)}>Retomar rascunho</button></aside>}
    <div className="hero-chronicles-layout">
      <nav className="hero-chronicles-index" aria-label="Índice das crônicas">
        <div className="hero-chronicles-index-label"><BookOpen size={16} /><span>Índice</span><small>{stories.length} {stories.length === 1 ? 'crônica' : 'crônicas'}</small></div>
        <button className={pageIndex === 0 ? 'is-current' : ''} aria-current={pageIndex === 0 ? 'page' : undefined} onClick={() => setSelectedId(PROLOGUE)}><span>00</span><strong>Prólogo</strong></button>
        {stories.map((story, index) => <button key={story.id} className={selectedStory?.id === story.id ? 'is-current' : ''} aria-current={selectedStory?.id === story.id ? 'page' : undefined} onClick={() => setSelectedId(story.id)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{story.title}</strong></button>)}
        {stories.length === 0 && <p className="hero-chronicles-index-empty">As próximas páginas esperam pela sua voz.</p>}
      </nav>
      <div className="hero-chronicles-reading">
        <article className="hero-chronicles-leaf" aria-label={selectedStory ? `Crônica: ${selectedStory.title}` : 'Prólogo do herói'}>
          <div className="hero-chronicles-leaf-top"><span>{selectedStory ? 'Crônica da jornada' : 'A origem da sua lenda'}</span><Feather size={20} aria-hidden="true" /></div>
          <h3>{selectedStory?.title || `O começo de ${state.character.name}`}</h3>
          {selectedStory && <time dateTime={selectedStory.createdAt}>{new Date(selectedStory.createdAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</time>}
          <div className="hero-chronicles-prose"><p>{selectedStory?.content || state.character.backstory || 'Toda lenda começa com alguém que decide dar o primeiro passo. O que trouxe seu herói até aqui? Crie uma página e conte com suas próprias palavras.'}</p></div>
          {selectedStory ? <div className="hero-chronicles-page-actions">
            <button onClick={event => openEditor(event.currentTarget, selectedStory)}><Pencil size={15} /> Editar página</button>
            <button onClick={() => removePage(selectedStory)} className="hero-chronicles-delete"><Trash2 size={15} /> Apagar</button>
            <div className="hero-chronicles-order" role="group" aria-label="Posição da página no livro"><button aria-label="Mover página para antes" title="Mover para antes" disabled={pageIndex <= 1} onClick={() => movePage(-1)}><ArrowUp size={16} /></button><button aria-label="Mover página para depois" title="Mover para depois" disabled={pageIndex >= stories.length} onClick={() => movePage(1)}><ArrowDown size={16} /></button></div>
          </div> : <div className="hero-chronicles-prologue-note"><Feather size={15} /><span>O prólogo guarda sua origem. Novas crônicas continuam a história.</span></div>}
          <span className="hero-chronicles-folio" aria-hidden="true">— {String(pageIndex + 1).padStart(2, '0')} —</span>
        </article>
        <nav className="hero-chronicles-pagination" aria-label="Folhear a história">
          <button aria-label="Página anterior da história" disabled={pageIndex === 0} onClick={() => turnPage(pageIndex - 1)}><ChevronLeft size={17} /><span>Anterior</span></button>
          <span aria-live="polite">Página {pageIndex + 1} de {stories.length + 1}</span>
          <button aria-label="Próxima página da história" disabled={pageIndex === stories.length} onClick={() => turnPage(pageIndex + 1)}><span>Próxima</span><ChevronRight size={17} /></button>
        </nav>
      </div>
    </div>
    <Dialog open={editorOpen} onOpenChange={open => { if (!open) closeEditor(); }}>
      <DialogContent className="hero-chronicles-editor" onCloseAutoFocus={event => { event.preventDefault(); (opener.current?.isConnected ? opener.current : newPageButton.current)?.focus(); }}>
        <DialogTitle><Feather size={21} />{editingId ? 'Reescrever uma memória' : 'Uma nova página da sua lenda'}</DialogTitle>
        <DialogDescription>Dê um título à sua memória e conte o que merece ficar neste livro.</DialogDescription>
        <form onSubmit={savePage}>
          <label htmlFor={titleId}>Título da página</label><input id={titleId} autoFocus required value={title} onChange={event => setTitle(event.target.value)} placeholder="Um encontro que me transformou" />
          <label htmlFor={contentId}>Sua história</label><textarea id={contentId} required value={content} onChange={event => setContent(event.target.value)} placeholder="Comece por um momento, uma descoberta ou um sentimento…" rows={9} />
          <p className="hero-chronicles-save-note">As páginas ficam salvas neste navegador, junto ao progresso do herói.</p>
          <div className="hero-chronicles-editor-actions"><button type="button" onClick={closeEditor}>Cancelar</button><button className="hero-chronicles-primary" type="submit" disabled={!title.trim() || !content.trim()}><Save size={16} /> Salvar página</button></div>
        </form>
      </DialogContent>
    </Dialog>
  </section>;
}



