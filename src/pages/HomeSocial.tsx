import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { RACE_LABELS, xpForCurrentLevel, XP_PER_LEVEL } from '@/types/game';
import { MOCK_FEED, FeedPost } from '@/data/feedData';
import { BottomNav } from '@/components/BottomNav';
import { Heart, MessageCircle, Share2, Gamepad2, User, Backpack, Trophy, Star, Sparkles, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  const quickActions = [
    { icon: Gamepad2, label: 'Jogar', to: '/journeys', accent: true },
    { icon: User, label: 'Perfil', to: '/profile', accent: false },
    { icon: Backpack, label: 'Inventário', to: '/inventory', accent: false },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-md border-b border-border px-4 pt-4 pb-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full gradient-primary overflow-hidden glow-primary border border-accent/40">
              <img src={RACE_ART[c.race].cover} alt={RACE_LABELS[c.race]} className="w-full h-full object-cover object-top" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-lg text-accent truncate">{c.name}</h1>
              <p className="text-xs text-muted-foreground font-body">Nível {c.level}</p>
            </div>
          </div>
          {/* XP Bar */}
          <div className="w-full">
            <div className="flex justify-between mb-1">
              <span className="text-[10px] font-body text-muted-foreground">XP Global</span>
              <span className="text-[10px] font-body text-accent">{currentXP}/{XP_PER_LEVEL}</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full gradient-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {quickActions.map(({ icon: Icon, label, to, accent }) => (
            <motion.button
              key={to}
              onClick={() => navigate(to)}
              className={`py-3 rounded-xl flex flex-col items-center gap-1.5 font-body text-xs ${
                accent
                  ? 'gradient-accent text-accent-foreground font-semibold glow-accent'
                  : 'bg-card border border-border text-foreground'
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Icon size={20} />
              {label}
            </motion.button>
          ))}
        </div>

        <motion.section
          className="relative mb-7 min-h-48 overflow-hidden rounded-2xl border border-accent/30 bg-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img
            src={ORB_BACKGROUND_ART[resume.orb.id]}
            alt={`Lauro diante da ${resume.orb.name}`}
            className="absolute inset-0 h-full w-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" />
          <div className="relative z-10 flex min-h-48 max-w-[66%] flex-col justify-center p-5">
            <div className="mb-2 flex items-center gap-1.5 text-accent">
              <MapPin size={14} />
              <span className="font-body text-[10px] font-semibold uppercase tracking-wider">Continue de onde parou</span>
            </div>
            <h2 className="font-display text-base leading-tight text-foreground">{resume.orb.name}</h2>
            <p className="mb-4 mt-1 font-body text-xs text-muted-foreground">
              {resume.label}{resume.challenge ? ` · ${resume.challenge.title}` : ''}
            </p>
            <Button
              onClick={() => navigate(resume.destination)}
              className="w-fit rounded-full bg-accent px-4 text-accent-foreground hover:bg-accent/90"
            >
              Continuar jornada <ArrowRight />
            </Button>
          </div>
        </motion.section>

        {/* Feed */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-accent text-sm">Comunidade</h2>
          <span className="text-[10px] text-muted-foreground font-body">Recentes</span>
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
