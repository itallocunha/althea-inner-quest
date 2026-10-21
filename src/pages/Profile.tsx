import { useRef, useState, type ChangeEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { BookOpen, Camera, ChevronLeft, ChevronRight, Compass, Feather, Settings2, Sparkles, UserRound, RotateCcw, ArrowRight, Backpack, LibraryBig, ScrollText } from 'lucide-react';
import { toast } from 'sonner';
import { useGame } from '@/context/GameContext';
import { RACE_LABELS, CLASS_LABELS, xpForCurrentLevel, XP_PER_LEVEL } from '@/types/game';
import { CLASS_ART, ORB_CONTINENT_ART, RACE_ART } from '@/lib/journeyAssets';
import { getJourneyResume } from '@/lib/journeyProgress';
import { BottomNav } from '@/components/BottomNav';
import { HeroAttributes } from '@/components/rpg/HeroAttributes';
import { HeroJourney } from '@/components/rpg/HeroJourney';
import { HeroChronicles } from '@/components/rpg/HeroChronicles';
import { Card3DViewer } from '@/components/rpg/Card3DViewer';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import './Profile.css';

const CHAPTERS = [
  { id: 'character', name: 'Personagem', icon: UserRound, caption: 'Quem carrega esta lenda', number: 'I' },
  { id: 'attributes', name: 'Atributos', icon: Sparkles, caption: 'O céu que existe em você', number: 'II' },
  { id: 'journey', name: 'Jornada', icon: Compass, caption: 'Os caminhos que te transformam', number: 'III' },
  { id: 'story', name: 'História', icon: Feather, caption: 'Uma vida, muitas páginas', number: 'IV' },
];
function savedImage(key: string) {
  try { return localStorage.getItem(key); } catch { return null; }
}
export default function Profile() {
  const { state, resetGame } = useGame();
  const [page, setPage] = useState('character');
  const [profileImage, setProfileImage] = useState<string | null>(() => savedImage('althea-profile-image'));
  const [bannerImage, setBannerImage] = useState<string | null>(() => savedImage('althea-banner-image'));
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [cardOrigin, setCardOrigin] = useState<DOMRect | null>(null);
  const [selectedArt, setSelectedArt] = useState<{ src: string; label: string; type: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  if (!state.character) return <Navigate to="/" replace />;
  const c = state.character;
  const resume = getJourneyResume(state);
  const currentXP = xpForCurrentLevel(c.xp);
  const totalCompleted = Object.values(state.challengeProgress).filter(progress => progress.completed).length;
  const chapterIndex = CHAPTERS.findIndex(chapter => chapter.id === page);
  const chapter = CHAPTERS[chapterIndex];
  function turnPage(next: string) {
    setPage(next);
    bookRef.current?.querySelector<HTMLButtonElement>(`[data-chapter="${next}"]`)?.focus({ preventScroll: true });
    bookRef.current?.scrollIntoView({ behavior: 'instant', block: 'start' });
  }
  function uploadImage(event: ChangeEvent<HTMLInputElement>, type: 'portrait' | 'banner') {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Escolha um arquivo de imagem.'); return; }
    if (file.size > 3 * 1024 * 1024) { toast.error('Escolha uma imagem de até 3 MB.'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const image = String(reader.result);
      try {
        localStorage.setItem(type === 'portrait' ? 'althea-profile-image' : 'althea-banner-image', image);
        if (type === 'portrait') setProfileImage(image); else setBannerImage(image);
        toast.success('A aparência do seu herói foi atualizada.');
      } catch { toast.error('Não foi possível salvar. Experimente uma imagem menor.'); }
    };
    reader.onerror = () => toast.error('Não foi possível ler esta imagem.');
    reader.readAsDataURL(file);
  }
  return <div className="hero-book-page">
    <header className="hero-book-heading"><div><p>Althea · Acervo de uma vida</p><h1>Herói</h1></div><span className="hero-book-heading-note"><BookOpen size={17} /> Sua lenda, página por página</span></header>
    <main>
      <Tabs value={page} onValueChange={setPage} className="hero-book" ref={bookRef}>
        <div className="hero-book-binding" aria-hidden="true"><span>ALTHEA</span></div>
        <div className="hero-book-topline"><span><BookOpen size={17} /> O livro da sua lenda</span><span>Capítulo {chapter.number}</span></div>
        <TabsList className="hero-book-bookmarks" aria-label="Capítulos do livro do Herói">
          {CHAPTERS.map(item => <TabsTrigger key={item.id} value={item.id} data-chapter={item.id}><item.icon size={20} /><span>{item.name}</span><small>{item.number}</small></TabsTrigger>)}
        </TabsList>
        <div className="hero-book-paper">
          <div className="hero-book-chapter-label"><span>{chapter.number} / {chapter.name}</span><span>{chapter.caption}</span></div>
          <TabsContent value="character" forceMount hidden={page !== 'character'} className="hero-book-leaf">
            <div className="hero-book-opening">
              <section className="hero-book-portrait-leaf" aria-label="Retrato do personagem">
                <div className="hero-book-portrait-frame">
                  <img src={bannerImage || ORB_CONTINENT_ART[resume.orb.id]} alt="" className="hero-book-scenery" />
                  <img src={profileImage || RACE_ART[c.race].cover} alt={`Retrato de ${c.name}`} className={`hero-book-portrait ${profileImage ? 'is-custom' : ''}`} />
                  <div className="hero-book-portrait-vignette" />
                  <span className="hero-book-level-seal"><small>Nível</small><strong>{c.level}</strong></span>
                  <button className="hero-book-portrait-edit" onClick={() => setAppearanceOpen(true)} aria-label="Personalizar herói"><Camera size={17} /><span>Personalizar</span></button>
                  <div className="hero-book-portrait-caption"><span>Retrato de uma lenda</span><strong>{c.name}</strong></div>
                </div>
                <p className="hero-book-portrait-note"><Sparkles size={14} /> {totalCompleted ? `${totalCompleted} passos já escritos na sua lenda` : 'Toda grande aventura começa dentro de você.'}</p>
              </section>
              <section className="hero-book-identity-leaf" aria-labelledby="hero-book-name">
                <span className="hero-book-kicker">O protagonista desta história</span>
                <h2 id="hero-book-name">{c.name}</h2><p className="hero-book-class">{CLASS_LABELS[c.characterClass]}</p>
                <dl className="hero-book-identity-facts"><div><dt>Raça</dt><dd>{RACE_LABELS[c.race]}</dd></div><div><dt>Idade</dt><dd>{c.age} anos</dd></div></dl>
                <div className="hero-book-xp"><div><span>Experiência · Nível {c.level}</span><strong>{currentXP}/{XP_PER_LEVEL} XP</strong></div><div role="progressbar" aria-label="Experiência no nível atual" aria-valuenow={currentXP} aria-valuemin={0} aria-valuemax={XP_PER_LEVEL}><span style={{ width: `${currentXP / XP_PER_LEVEL * 100}%` }} /></div><small>Faltam {XP_PER_LEVEL - currentXP} XP para o próximo nível</small></div>
                <div className="hero-book-summary"><span><strong>{totalCompleted}</strong> desafios</span><span><strong>{state.unlockedMedals.length}</strong> medalhas</span><span><strong>{c.xp}</strong> XP total</span></div>
                <Link to={resume.destination} className="hero-book-primary">Continuar aventura <ArrowRight size={17} /></Link>
                {c.freePoints > 0 && <button className="hero-book-points-invitation" onClick={() => turnPage('attributes')}><Sparkles size={17} /><span><strong>{c.freePoints} pontos para evoluir</strong>Abra sua constelação</span><ChevronRight size={17} /></button>}
                <div className="hero-book-essence"><span className="hero-book-kicker">Selos da sua essência · toque para inspecionar</span><div>{[{ src: RACE_ART[c.race].card, cover: RACE_ART[c.race].cover, label: RACE_LABELS[c.race], type: 'Raça' }, { src: CLASS_ART[c.characterClass].card, cover: CLASS_ART[c.characterClass].cover, label: CLASS_LABELS[c.characterClass], type: 'Classe' }].map(trait => <button key={trait.type} onClick={event => { setCardOrigin(event.currentTarget.getBoundingClientRect()); setSelectedArt({ src: trait.src, label: trait.label, type: trait.type }); }} aria-label={`Inspecionar carta de ${trait.type.toLowerCase()}: ${trait.label}`}><img src={trait.cover} alt="" loading="lazy" /><span><small>{trait.type}</small><strong>{trait.label}</strong><em>Inspecionar carta 3D</em></span></button>)}</div></div>
              </section>
            </div>
          </TabsContent>
          <TabsContent value="attributes" forceMount hidden={page !== 'attributes'} className="hero-book-leaf"><HeroAttributes /></TabsContent>
          <TabsContent value="journey" forceMount hidden={page !== 'journey'} className="hero-book-leaf"><HeroJourney /></TabsContent>
          <TabsContent value="story" forceMount hidden={page !== 'story'} className="hero-book-leaf"><HeroChronicles /></TabsContent>
          <footer className="hero-book-pagination"><button disabled={chapterIndex === 0} onClick={() => turnPage(CHAPTERS[chapterIndex - 1].id)} aria-label="Capítulo anterior"><ChevronLeft size={17} /><span>Anterior</span></button><span><Feather size={14} /> {chapterIndex + 1} / {CHAPTERS.length}</span><button disabled={chapterIndex === CHAPTERS.length - 1} onClick={() => turnPage(CHAPTERS[chapterIndex + 1].id)} aria-label="Próximo capítulo"><span>Próxima</span><ChevronRight size={17} /></button></footer>
        </div>
      </Tabs>
      <nav className="hero-book-collection-dock" aria-label="Coleções do herói"><span className="hero-book-dock-label">Além destas páginas</span><Link to="/inventory"><Backpack size={21} /><span>Inventário<small>{state.itemCards.length} cartas</small></span><ChevronRight size={15} /></Link><Link to="/grimoire"><BookOpen size={21} /><span>Grimório<small>{state.skillCards.length} habilidades</small></span><ChevronRight size={15} /></Link><Link to="/collections"><LibraryBig size={21} /><span>Todas as coleções<small>Seu acervo de conquistas</small></span><ChevronRight size={15} /></Link></nav>
      <details className="hero-book-options"><summary><Settings2 size={14} /> Opções da jornada</summary><button onClick={() => { if (confirm('Resetar todo o progresso? Esta ação apaga o personagem e suas conquistas.')) resetGame(); }}><RotateCcw size={14} /> Reiniciar jogo</button></details>
    </main>
    <Dialog open={appearanceOpen} onOpenChange={setAppearanceOpen}><DialogContent className="artifact-dialog w-[calc(100%_-_2rem)] rounded-2xl"><DialogTitle className="font-display text-xl text-[#f3dfb8]">A aparência do seu herói</DialogTitle><DialogDescription className="font-body text-base">Escolha as imagens que contam a sua história.</DialogDescription><div className="grid gap-3"><button className="hero-upload-option" onClick={() => fileInputRef.current?.click()}><Camera size={22} /><span><strong>Alterar retrato</strong><small>A imagem principal do personagem</small></span><ChevronRight size={16} /></button><button className="hero-upload-option" onClick={() => bannerInputRef.current?.click()}><ScrollText size={22} /><span><strong>Alterar cenário</strong><small>O fundo da sua ficha de herói</small></span><ChevronRight size={16} /></button></div><p className="text-sm text-muted-foreground">Imagens de até 3 MB, salvas neste navegador.</p></DialogContent></Dialog>
    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" aria-label="Enviar retrato do herói" onChange={event => uploadImage(event, 'portrait')} />
    <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" aria-label="Enviar cenário do herói" onChange={event => uploadImage(event, 'banner')} />
    <Card3DViewer origin={cardOrigin} onClose={() => setSelectedArt(null)} card={selectedArt ? { name: selectedArt.label, image: selectedArt.src, badge: `Carta de ${selectedArt.type.toLowerCase()}`, color: 'var(--orb-purple)', backTitle: selectedArt.label, backDescription: `A ${selectedArt.type.toLowerCase()} que faz parte da essência de ${c.name}. Uma carta da sua lenda em Althea.` } : null} />
    <BottomNav />
  </div>;
}
