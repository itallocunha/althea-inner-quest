import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { CLASS_LABELS, RACE_LABELS, xpForCurrentLevel, XP_PER_LEVEL } from '@/types/game';
import { MOCK_FEED, FeedPost } from '@/data/feedData';
import { BottomNav } from '@/components/BottomNav';
import { Heart, MessageCircle, Share2, Trophy, Star, Sparkles, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { LevelMedallion, OrnateDivider, XpMeter } from '@/components/rpg/Ornaments';
import { RpgIcon, RpgIconName } from '@/components/rpg/RpgIcon';
import { BACKGROUND_ART, CHARACTER_ART, LOGO_VIDEO, ORB_BACKGROUND_ART, RACE_ART } from '@/lib/journeyAssets';
import { getJourneyResume } from '@/lib/journeyProgress';

function FeedCard({ post }: { post: FeedPost }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const typeIcon = {
    medal: <Trophy size={14} className="text-accent" />,
    levelup: <TrendingUp size={14} className="text-accent" />,
    challenge: <Star size={14} className="text-accent" />,
    achievement: <Sparkles size={14} className="text-accent" />,
  };

  return (
    <motion.div
      className="bg-card rounded-xl border border-border p-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-xl">
          {post.userAvatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-sm text-foreground truncate">{post.userName}</p>
          <p className="text-[10px] text-muted-foreground font-body">Nível {post.userLevel} · {post.timeAgo}</p>
        </div>
        {typeIcon[post.type]}
      </div>

      <p className="text-sm font-body text-foreground mb-1">{post.content}</p>
      {post.detail && (
        <p className="text-xs font-body text-muted-foreground mb-3">{post.detail}</p>
      )}

      <div className="flex items-center gap-4 pt-2 border-t border-border">
        <button
          onClick={() => { setLiked(!liked); setLikeCount(l => liked ? l - 1 : l + 1); }}
          className="flex items-center gap-1.5 text-xs font-body text-muted-foreground hover:text-accent transition-colors"
        >
          <Heart size={14} className={liked ? 'fill-accent text-accent' : ''} />
          {likeCount}
        </button>
        <button className="flex items-center gap-1.5 text-xs font-body text-muted-foreground hover:text-accent transition-colors">
          <MessageCircle size={14} />
          {post.comments}
        </button>
        <button className="flex items-center gap-1.5 text-xs font-body text-muted-foreground hover:text-accent transition-colors ml-auto">
          <Share2 size={14} />
        </button>
      </div>
    </motion.div>
  );
}

export default function HomeSocial() {
  const navigate = useNavigate();
  const { state } = useGame();
  const c = state.character;

  // If no character, show onboarding splash
  if (!c) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-end pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-background">
          <video
            src={LOGO_VIDEO}
            poster={BACKGROUND_ART.logoPulse}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            className="h-full w-full object-contain object-[center_8%] sm:object-cover sm:object-center [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)] sm:[mask-image:none]"
          />
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-background via-background/70 to-transparent hidden sm:block" />
          <div className="absolute inset-x-0 bottom-52 flex justify-center sm:hidden">
            <motion.img
              src={CHARACTER_ART.action}
              alt="Lauro, o guia da jornada"
              className="h-[34vh] max-h-72 object-contain drop-shadow-[0_0_30px_rgba(255,180,60,0.45)]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            />
          </div>
        </div>
        <motion.div
          className="relative z-10 text-center px-6 max-w-md w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="sr-only">Althea — Uma Aventura de Autoconhecimento</h1>
          <motion.p
            className="text-sm text-muted-foreground font-body tracking-widest uppercase mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Rede Social de Jornadas Evolutivas
          </motion.p>
          <motion.button
            onClick={() => navigate('/create')}
            className="w-full py-3.5 rounded-full gradient-accent text-accent-foreground font-display font-semibold text-lg glow-accent"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            Criar Personagem
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const currentXP = xpForCurrentLevel(c.xp);
  const xpPercent = (currentXP / XP_PER_LEVEL) * 100;
  const resume = getJourneyResume(state);

  const quickActions: { icon: RpgIconName; label: string; to: string; accent: boolean }[] = [
    { icon: 'sword', label: 'Jogar', to: '/journeys', accent: true },
    { icon: 'helm', label: 'Herói', to: '/profile', accent: false },
    { icon: 'chest', label: 'Inventário', to: '/inventory', accent: false },
  ];

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="relative border-b border-[hsl(var(--gold-deep)/0.8)] bg-gradient-to-b from-[hsl(268_42%_15%/0.95)] to-[hsl(266_48%_9%/0.9)] px-4 pt-4 pb-3 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.9)] backdrop-blur-md">
        <span className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent" />
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-4 mb-3">
            <LevelMedallion level={c.level} src={RACE_ART[c.race].cover} alt={RACE_LABELS[c.race]} size={60} />
            <div className="flex-1 min-w-0">
              <h1 className="text-gold font-title text-xl font-bold leading-tight truncate">{c.name}</h1>
              <p className="font-display text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {RACE_LABELS[c.race]} · {CLASS_LABELS[c.characterClass]}
              </p>
            </div>
          </div>
          <XpMeter percent={xpPercent} label="Experiência" value={`${currentXP}/${XP_PER_LEVEL}`} />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-5">
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mb-7">
          {quickActions.map(({ icon, label, to, accent }) => (
            <motion.button
              key={to}
              onClick={() => navigate(to)}
              className={`flex flex-col items-center gap-2 rounded-2xl py-3 font-display text-[11px] font-bold uppercase tracking-[0.14em] ${
                accent
                  ? 'gradient-accent text-accent-foreground'
                  : 'bg-card border border-border text-foreground'
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              {accent ? (
                <RpgIcon name={icon} size={26} strokeWidth={1.9} />
              ) : (
                <span className="rune-socket-square h-9 w-9"><RpgIcon name={icon} size={20} /></span>
              )}
              {label}
            </motion.button>
          ))}
        </div>

        <motion.section
          className="rpg-frame relative mb-8 min-h-52 overflow-hidden rounded-2xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img
            src={ORB_BACKGROUND_ART[resume.orb.id]}
            alt={`Lauro diante da ${resume.orb.name}`}
            className="absolute inset-0 h-full w-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" />
          <div className="relative z-10 flex min-h-52 max-w-[68%] flex-col justify-center p-6">
            <div className="mb-2 flex items-center gap-1.5 text-accent">
              <RpgIcon name="map" size={15} />
              <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em]">Missão em andamento</span>
            </div>
            <h2 className="text-gold font-title text-lg font-bold leading-tight">{resume.orb.name}</h2>
            <p className="mb-4 mt-1 font-body text-sm text-foreground/80">
              {resume.label}{resume.challenge ? ` · ${resume.challenge.title}` : ''}
            </p>
            <button
              onClick={() => navigate(resume.destination)}
              className="gradient-accent flex w-fit items-center gap-2 rounded-full px-5 py-2 font-display text-xs font-bold uppercase tracking-[0.14em] text-accent-foreground"
            >
              Continuar <ArrowRight size={15} />
            </button>
          </div>
        </motion.section>

        {/* Feed */}
        <div className="mb-4">
          <h2 className="text-gold text-center font-title text-lg font-bold">Crônicas da Guilda</h2>
          <OrnateDivider className="mt-2" />
        </div>
        <div className="space-y-3">
          {MOCK_FEED.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <FeedCard post={post} />
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
