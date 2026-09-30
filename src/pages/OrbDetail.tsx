import { Fragment, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Check, ChevronLeft, FileText, ImageIcon, Lock, MapPin, Sparkles } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { getChallengesForOrb, getOrbStory, ORBS } from '@/data/gameData';
import { OrbId } from '@/types/game';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import {
  CHARACTER_ART, JOURNEY_FINALE_ART, ORB_ART, ORB_CONTINENT_ART, ORB_LEVEL_ART, ORB_REWARD_ART,
  ORB_STORY_ART, ORB_TITLE_ART, getChallengeArt,
} from '@/lib/journeyAssets';

function MilestoneBanner({ src, alt }: { src: string; alt: string }) {
  return (
    <motion.img
      src={src}
      alt={alt}
      loading="lazy"
      className="relative z-10 w-full rounded-2xl border border-accent/40 shadow-lg shadow-black/40"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
    />
  );
}

const ORB_THEME = {
  blue: { accent: 'text-orb-blue', border: 'border-orb-blue/45', bg: 'bg-orb-blue/10', line: 'bg-orb-blue/35', node: 'bg-orb-blue text-background', wash: 'from-orb-blue/30' },
  green: { accent: 'text-orb-green', border: 'border-orb-green/45', bg: 'bg-orb-green/10', line: 'bg-orb-green/35', node: 'bg-orb-green text-background', wash: 'from-orb-green/30' },
  purple: { accent: 'text-orb-purple', border: 'border-orb-purple/45', bg: 'bg-orb-purple/10', line: 'bg-orb-purple/35', node: 'bg-orb-purple text-background', wash: 'from-orb-purple/30' },
  red: { accent: 'text-orb-red', border: 'border-orb-red/45', bg: 'bg-orb-red/10', line: 'bg-orb-red/35', node: 'bg-orb-red text-background', wash: 'from-orb-red/30' },
  yellow: { accent: 'text-orb-yellow', border: 'border-orb-yellow/45', bg: 'bg-orb-yellow/10', line: 'bg-orb-yellow/35', node: 'bg-orb-yellow text-background', wash: 'from-orb-yellow/30' },
} as const;

export default function OrbDetail() {
  const { orbId } = useParams<{ orbId: string }>();
  const navigate = useNavigate();
  const { isChallengeUnlocked, isChallengeCompleted, getOrbProgress, state } = useGame();
  const [showStory, setShowStory] = useState(false);
  const orb = ORBS.find(item => item.id === orbId);

  if (!orb) return null;

  const challenges = getChallengesForOrb(orb.id);
  const progress = getOrbProgress(ORBS.indexOf(orb));
  const story = getOrbStory(orb.id);
  const theme = ORB_THEME[orb.id];
  const currentIndex = challenges.findIndex(challenge => !isChallengeCompleted(challenge.id) && isChallengeUnlocked(challenge.id));
  const completedCount = challenges.filter(challenge => isChallengeCompleted(challenge.id)).length;
  const halfwayIndex = Math.ceil(challenges.length / 2) - 1;

  return (
    <div className="min-h-screen overflow-hidden pb-24">
      <header className={`relative overflow-hidden border-b ${theme.border} bg-gradient-to-br ${theme.wash} via-card to-background`}>
        <img src={ORB_CONTINENT_ART[orb.id]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-background/10" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
        <div className="relative mx-auto max-w-3xl px-4 pb-6 pt-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/orbs')} className="mb-2 px-0 text-muted-foreground hover:bg-transparent hover:text-foreground">
            <ChevronLeft /> Voltar ao mapa
          </Button>
          <div className="relative flex min-h-48 items-center">
            <div className="relative z-10 max-w-[62%]">
              <div className={`mb-2 flex items-center gap-1.5 ${theme.accent}`}><Sparkles size={14} /><span className="font-body text-[9px] font-semibold uppercase tracking-wider">Território da jornada</span></div>
              <h1 className={`font-display text-xl leading-tight sm:text-2xl ${theme.accent}`}>{orb.name}</h1>
              <p className="mt-1 font-body text-xs text-foreground">{orb.theme}</p>
              <p className="mt-2 line-clamp-2 font-body text-[10px] text-muted-foreground">{orb.focus}</p>
            </div>
            <motion.img src={ORB_ART[orb.id]} alt={`Arte da ${orb.name}`} className="absolute -right-6 h-56 w-56 object-contain drop-shadow-2xl sm:right-4 sm:h-64 sm:w-64" animate={{ y: [0, -7, 0] }} transition={{ duration: 3.5, repeat: Infinity }} />
          </div>
          <div className="relative z-10 mt-2"><div className="mb-1.5 flex justify-between font-body text-[10px]"><span className="text-muted-foreground">{challenges.filter(challenge => isChallengeCompleted(challenge.id)).length}/{challenges.length} desafios</span><span className={theme.accent}>{progress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-secondary"><motion.div className={`h-full ${theme.node}`} initial={{ width: 0 }} animate={{ width: `${progress}%` }} /></div></div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <img src={ORB_TITLE_ART[orb.id]} alt={orb.theme} className={`mb-5 w-full rounded-2xl border ${theme.border} shadow-lg shadow-black/40`} />

        {story &&<Button variant="outline" onClick={() => setShowStory(value => !value)} className={`mb-4 h-auto w-full justify-start whitespace-normal border ${theme.border} ${theme.bg} p-4 text-left`}><BookOpen className={theme.accent} /><span><span className={`block font-display text-xs ${theme.accent}`}>{story.fragmentTitle}</span><span className="block font-body text-[10px] text-muted-foreground">{showStory ? 'Fechar história do fragmento' : 'Conheça este território'}</span></span></Button>}

        {showStory && story && <motion.section className="mb-7 space-y-4 border-y border-border py-5" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}><img src={ORB_STORY_ART[orb.id]} alt={story.fragmentTitle} loading="lazy" className={`w-full rounded-2xl border ${theme.border}`} /><p className="whitespace-pre-line font-body text-sm leading-relaxed text-foreground/90">{story.story}</p><div><h2 className={`mb-2 font-display text-[10px] uppercase tracking-wider ${theme.accent}`}>O que você vai aprender</h2><ul className="space-y-1">{story.learningObjectives.map(objective => <li key={objective} className="flex gap-2 font-body text-xs text-muted-foreground"><span className={theme.accent}>◆</span>{objective}</li>)}</ul></div>{progress === 100 && <div className={`border-l-2 pl-4 ${theme.border}`}><p className="font-body text-sm italic text-foreground">“{story.reflectionPoint}”</p><p className={`mt-3 font-display text-xs ${theme.accent}`}>{story.completionSkill.icon} {story.completionSkill.name}</p><p className="font-body text-xs text-muted-foreground">{story.completionSkill.description}</p></div>}</motion.section>}

        <div className="mb-5 flex items-end justify-between"><div><div className={`flex items-center gap-1.5 ${theme.accent}`}><MapPin size={14} /><span className="font-body text-[9px] uppercase tracking-wider">Trilha da Orbe</span></div><h2 className="mt-1 font-display text-base text-foreground">Seu caminho de desafios</h2></div><span className="font-body text-[10px] text-muted-foreground">Siga os pontos</span></div>

        <section className="relative mx-auto max-w-xl pb-8">
          <div className={`absolute bottom-12 left-1/2 top-10 w-0.5 -translate-x-1/2 ${theme.line}`} />
          <div className="space-y-7">
            {challenges.map((challenge, index) => {
              const unlocked = isChallengeUnlocked(challenge.id);
              const completed = isChallengeCompleted(challenge.id);
              const progressEntry = state.challengeProgress[challenge.id];
              const current = index === currentIndex;
              const placeLeft = index % 2 === 0;
              return (
                <Fragment key={challenge.id}>
                <motion.div className={`relative flex ${placeLeft ? 'justify-start pr-[18%]' : 'justify-end pl-[18%]'}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: unlocked ? 1 : 0.4, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <div className={`absolute top-9 h-px w-[18%] ${theme.line} ${placeLeft ? 'left-[41%]' : 'right-[41%]'}`} />
                  {current && <motion.img src={CHARACTER_ART.mage} alt="Sua posição atual" className={`pointer-events-none absolute z-20 h-24 w-24 object-contain drop-shadow-2xl ${placeLeft ? '-right-1 top-0' : '-left-1 top-0'}`} animate={{ y: [0, -5, 0] }} transition={{ duration: 2.5, repeat: Infinity }} />}
                  <Button variant="ghost" disabled={!unlocked} onClick={() => navigate(`/challenge/${challenge.id}`)} className={`group relative z-10 h-auto w-[82%] flex-col items-stretch overflow-hidden whitespace-normal rounded-xl border p-0 text-left ${completed ? `${theme.border} bg-card` : unlocked ? 'border-border bg-card hover:border-accent/50' : 'border-border/50 bg-card/50'}`}>
                    <img src={getChallengeArt(challenge.id)} alt={`Desafio ${index + 1}: ${challenge.title}`} loading="lazy" className={`aspect-video w-full object-cover ${unlocked ? '' : 'grayscale'}`} />
                    <div className={`flex items-center gap-3 p-3 ${completed ? theme.bg : ''}`}>
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-display text-xs ${completed ? `${theme.node} ${theme.border}` : unlocked ? `${theme.bg} ${theme.accent} ${theme.border}` : 'border-border bg-secondary text-muted-foreground'}`}>{completed ? <Check size={17} /> : unlocked ? index + 1 : <Lock size={13} />}</span>
                      <span className="min-w-0 flex-1"><span className="block font-display text-xs leading-tight text-foreground">{challenge.title}</span><span className="mt-1 flex gap-2 font-body text-[9px] text-muted-foreground"><span>+{challenge.xpReward} XP</span>{challenge.cardReward && <span className={theme.accent}>{challenge.cardReward.icon} Carta</span>}</span></span>
                      {completed && <span className="flex shrink-0 gap-1">{progressEntry?.imageUrl && <ImageIcon size={12} className={theme.accent} />}{progressEntry?.response && <FileText size={12} className={theme.accent} />}</span>}
                    </div>
                    {unlocked && !completed && <span className="line-clamp-2 px-3 pb-3 font-body text-[10px] leading-relaxed text-muted-foreground">{challenge.objective}</span>}
                    {completed && (progressEntry?.imageUrl || progressEntry?.response) && <span className="flex gap-2 border-t border-border p-3">{progressEntry.imageUrl && <img src={progressEntry.imageUrl} alt="Arte do desafio" className="h-14 w-14 shrink-0 rounded-md border border-border object-cover" />}{progressEntry.response && <span className="line-clamp-3 font-body text-[9px] text-muted-foreground">{progressEntry.response}</span>}</span>}
                  </Button>
                </motion.div>
                {index === halfwayIndex && completedCount > halfwayIndex && <MilestoneBanner src={ORB_LEVEL_ART[orb.id][0]} alt="Marco alcançado: metade da orbe" />}
                {index === challenges.length - 1 && progress === 100 && (
                  <div className="space-y-5">
                    <MilestoneBanner src={ORB_LEVEL_ART[orb.id][1]} alt="Marco alcançado: orbe completa" />
                    <MilestoneBanner src={ORB_REWARD_ART[orb.id]} alt="Recompensa da orbe" />
                    {orb.id === 'yellow' && <>
                      <MilestoneBanner src={JOURNEY_FINALE_ART.victory} alt="Vitória" />
                      <MilestoneBanner src={JOURNEY_FINALE_ART.end} alt="O fim da jornada" />
                    </>}
                  </div>
                )}
                </Fragment>
              );
            })}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}