import { useRef, useState, type ChangeEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Camera, ChevronRight, RotateCcw, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { useGame } from '@/context/GameContext';
import { RACE_LABELS, CLASS_LABELS, xpForCurrentLevel, XP_PER_LEVEL } from '@/types/game';
import { CLASS_ART, ORB_ART, ORB_CONTINENT_ART, RACE_ART } from '@/lib/journeyAssets';
import { getJourneyResume } from '@/lib/journeyProgress';
import { BottomNav } from '@/components/BottomNav';
import { ORBS, getChallengesForOrb } from '@/data/gameData';
import { RpgIcon } from '@/components/rpg/RpgIcon';
import { XpMeter } from '@/components/rpg/Ornaments';
import { HeroAttributes } from '@/components/rpg/HeroAttributes';
import { Card3DViewer } from '@/components/rpg/Card3DViewer';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function savedImage(key: string) {
  try { return localStorage.getItem(key); } catch { return null; }
}

export default function Profile() {
  const { state, resetGame, getOrbProgress } = useGame();
  const reduced = useReducedMotion();
  const [profileImage, setProfileImage] = useState<string | null>(() => savedImage('althea-profile-image'));
  const [bannerImage, setBannerImage] = useState<string | null>(() => savedImage('althea-banner-image'));
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [cardOrigin, setCardOrigin] = useState<DOMRect | null>(null);
  const [selectedArt, setSelectedArt] = useState<{ src: string; label: string; type: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  if (!state.character) return <Navigate to="/" replace />;
  const c = state.character;
  const resume = getJourneyResume(state);
  const currentXP = xpForCurrentLevel(c.xp);
  const totalCompleted = Object.values(state.challengeProgress).filter(progress => progress.completed).length;

  function uploadImage(event: ChangeEvent<HTMLInputElement>, type: 'portrait' | 'banner') {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Escolha um arquivo de imagem.'); return; }
    if (file.size > 3 * 1024 * 1024) { toast.error('Escolha uma imagem de até 3 MB para salvar o retrato.'); return; }
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

  return <div className="archive-page hero-page">
    <header className="hero-page-heading"><div><p className="archive-eyebrow">Althea · Ficha do personagem</p><h1 className="mt-2 font-title text-3xl text-[#f3dfb8]">Herói</h1></div><button className="hero-customize" aria-label="Personalizar herói" onClick={() => setAppearanceOpen(true)}><Settings2 size={17} /><span>Personalizar</span></button></header>
    <main className="hero-layout">
      <div className="hero-identity">
        <motion.section className="hero-portrait-stage" initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <img src={bannerImage || ORB_CONTINENT_ART[resume.orb.id]} alt="" className="hero-portrait-background" />
          <img src={profileImage || RACE_ART[c.race].cover} alt={`Retrato de ${c.name}`} className={`hero-portrait-art ${profileImage ? 'is-custom' : 'is-race-art'}`} />
          <div className="hero-portrait-shade" />
          <div className="hero-stage-top"><span className="hero-rank"><RpgIcon name="star" size={12} />{totalCompleted === 0 ? 'Uma lenda em despertar' : `${totalCompleted} passos na sua lenda`}</span><span className="hero-level"><small>NÍVEL</small>{c.level}</span></div>
          <div className="hero-portrait-info"><p className="archive-eyebrow">{CLASS_LABELS[c.characterClass]}</p><h2 className="mt-2 break-words font-title text-3xl leading-snug text-[#f6e4be]">{c.name}</h2><p className="mt-2 font-body text-sm text-[#d0c6dc]">{RACE_LABELS[c.race]} · {c.age} anos</p><div className="mt-5"><XpMeter percent={currentXP / XP_PER_LEVEL * 100} label="Experiência" value={`${currentXP}/${XP_PER_LEVEL} XP`} /></div><p className="mt-2 text-right font-body text-xs text-[#bbb1ca]">{XP_PER_LEVEL - currentXP} XP para o próximo nível</p></div>
        </motion.section>
        <div className="hero-stat-strip"><div><RpgIcon name="sword" size={18} /><strong>{totalCompleted}</strong><span>Desafios</span></div><div><RpgIcon name="medal" size={18} /><strong>{state.unlockedMedals.length}</strong><span>Medalhas</span></div><div><RpgIcon name="flame" size={18} /><strong>{c.xp}</strong><span>XP total</span></div></div>
        <div className="archive-section-label mt-6"><span>Essência do personagem</span><span>Inspecionar</span></div>
        <div className="hero-trait-cards">{[{ src: RACE_ART[c.race].card, cover: RACE_ART[c.race].cover, label: RACE_LABELS[c.race], type: 'Raça' }, { src: CLASS_ART[c.characterClass].card, cover: CLASS_ART[c.characterClass].cover, label: CLASS_LABELS[c.characterClass], type: 'Classe' }].map(trait => <button key={trait.type} onClick={event => { setCardOrigin(event.currentTarget.getBoundingClientRect()); setSelectedArt({ src: trait.src, label: trait.label, type: trait.type }); }} aria-label={`Inspecionar carta de ${trait.type.toLowerCase()}: ${trait.label}`}><img src={trait.cover} alt="" loading="lazy" /><span><small>{trait.type}</small><strong>{trait.label}</strong></span><RpgIcon name="eye" size={17} className="trait-eye" /></button>)}</div>
        <Link to={resume.destination} className="archive-primary mt-5 w-full">Continuar jornada <ArrowRight size={16} /></Link>
        <div className="hero-collection-links"><Link to="/inventory"><RpgIcon name="chest" size={19} /><span>Inventário</span><strong>{state.itemCards.length}</strong></Link><Link to="/grimoire"><RpgIcon name="tome" size={19} /><span>Grimório</span><strong>{state.skillCards.length}</strong></Link><Link to="/collections"><RpgIcon name="gem" size={19} /><span>Todas as coleções</span><ChevronRight size={15} /></Link></div>
      </div>
      <div className="hero-dossier">
        <Tabs defaultValue="attributes">
          <TabsList className="hero-tabs"><TabsTrigger value="attributes">Atributos</TabsTrigger><TabsTrigger value="journey">Jornadas</TabsTrigger><TabsTrigger value="story">História</TabsTrigger></TabsList>
          <TabsContent value="attributes" className="mt-6"><HeroAttributes /></TabsContent>
          <TabsContent value="journey" className="mt-6"><div className="archive-section-label"><span>Os cinco territórios</span><RpgIcon name="map" size={18} /></div><p className="mb-5 font-body text-base text-muted-foreground">Cada orbe revela uma nova parte de você.</p><div className="space-y-3">{ORBS.map((orb, index) => {
            const progress = getOrbProgress(index);
            const challenges = getChallengesForOrb(orb.id);
            const completed = challenges.filter(challenge => state.challengeProgress[challenge.id]?.completed).length;
            const unlocked = index <= state.currentOrbIndex;
            return <div key={orb.id} className={`hero-journey ${unlocked ? '' : 'is-locked'}`}><img src={ORB_ART[orb.id]} alt="" /><div className="min-w-0 flex-1"><h3 className="font-display text-sm text-[#f3dfb8]">{orb.name}</h3><p className="mt-1 font-body text-sm text-muted-foreground">{orb.theme}</p><div className="mt-3 flex justify-between text-xs text-muted-foreground"><span>{completed}/{challenges.length} desafios</span><span>{progress}%</span></div><div className="attribute-track mt-2"><div style={{ width: `${progress}%`, backgroundColor: `hsl(var(--orb-${orb.id}))` }} /></div>{unlocked && <Link to={`/portfolio/${orb.id}`} className="mt-3 inline-flex items-center gap-2 font-body text-sm text-accent">Ver minhas conquistas <ArrowRight size={13} /></Link>}</div>{!unlocked && <RpgIcon name="lock" size={16} />}</div>;
          })}</div></TabsContent>
          <TabsContent value="story" className="mt-6"><section className="hero-story"><RpgIcon name="quill" size={32} /><p className="archive-eyebrow mt-5">Prólogo da sua lenda</p><h2 className="mt-3 font-display text-xl text-[#f3dfb8]">Toda aventura tem uma origem</h2><p className="mt-5 whitespace-pre-wrap break-words font-body text-base leading-relaxed text-[#cfc5db]">{c.backstory || 'A história do seu herói ainda está sendo escrita. Registre suas descobertas, encontros e momentos de coragem nas crônicas da jornada.'}</p><Link to="/stories" className="archive-primary mt-6">Escrever minhas crônicas <ArrowRight size={15} /></Link><p className="mt-5 font-body text-sm text-muted-foreground">{(state.stories || []).length} crônicas no seu acervo</p></section></TabsContent>
        </Tabs>
        <details className="hero-game-options"><summary>Opções da jornada</summary><button onClick={() => { if (confirm('Resetar todo o progresso? Esta ação apaga o personagem e suas conquistas.')) resetGame(); }}><RotateCcw size={14} /> Reiniciar jogo</button></details>
      </div>
    </main>
    <Dialog open={appearanceOpen} onOpenChange={setAppearanceOpen}><DialogContent className="artifact-dialog w-[calc(100%_-_2rem)] rounded-2xl"><DialogTitle className="font-display text-xl text-[#f3dfb8]">A aparência do seu herói</DialogTitle><DialogDescription className="font-body text-base">Escolha as imagens que contam a sua história.</DialogDescription><div className="grid gap-3"><button className="hero-upload-option" onClick={() => fileInputRef.current?.click()}><Camera size={22} /><span><strong>Alterar retrato</strong><small>A imagem principal do personagem</small></span><ChevronRight size={16} /></button><button className="hero-upload-option" onClick={() => bannerInputRef.current?.click()}><RpgIcon name="map" size={22} /><span><strong>Alterar cenário</strong><small>O fundo da sua ficha de herói</small></span><ChevronRight size={16} /></button></div><p className="text-sm text-muted-foreground">Imagens de até 3 MB, salvas neste navegador.</p></DialogContent></Dialog>
    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" aria-label="Enviar retrato do herói" onChange={event => uploadImage(event, 'portrait')} />
    <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" aria-label="Enviar cenário do herói" onChange={event => uploadImage(event, 'banner')} />
    <Card3DViewer origin={cardOrigin} onClose={() => setSelectedArt(null)} card={selectedArt ? {
      name: selectedArt.label, image: selectedArt.src, badge: `Carta de ${selectedArt.type.toLowerCase()}`,
      color: 'var(--orb-purple)', backTitle: selectedArt.label,
      backDescription: `A ${selectedArt.type.toLowerCase()} que faz parte da essência de ${c.name}. Uma carta da sua lenda em Althea.`,
    } : null} />
    <BottomNav />
  </div>;
}
