import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { ATTRIBUTE_LABELS, AttributeKey, RACE_LABELS, CLASS_LABELS, RACE_ICONS, CLASS_ICONS, xpForCurrentLevel, XP_PER_LEVEL } from '@/types/game';
import { BottomNav } from '@/components/BottomNav';
import { ORBS, getChallengesForOrb } from '@/data/gameData';
import { Plus, RotateCcw, ChevronRight, Camera, Sword, Shield, Scroll, BookOpen } from 'lucide-react';
import { useState, useRef } from 'react';

const ORB_COLORS: Record<string, string> = {
  blue: 'from-blue-400 to-blue-600',
  green: 'from-emerald-400 to-emerald-600',
  purple: 'from-purple-400 to-purple-600',
  red: 'from-red-400 to-rose-600',
  yellow: 'from-amber-300 to-amber-500',
};

const ORB_NAMES_PT: Record<string, string> = {
  blue: 'Azul', green: 'Verde', purple: 'Roxa', red: 'Vermelha', yellow: 'Amarela',
};

export default function Profile() {
  const navigate = useNavigate();
  const { state, distributePoints, resetGame, getOrbProgress } = useGame();
  const [profileImage, setProfileImage] = useState<string | null>(() => {
    try { return localStorage.getItem('althea-profile-image'); } catch { return null; }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!state.character) { navigate('/'); return null; }
  const c = state.character;
  const currentXP = xpForCurrentLevel(c.xp);
  const xpPercent = (currentXP / XP_PER_LEVEL) * 100;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setProfileImage(dataUrl);
      localStorage.setItem('althea-profile-image', dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const quickLinks = [
    { label: 'Inventário', count: state.itemCards.length, to: '/inventory', emoji: '🎒', Icon: Sword },
    { label: 'Coleção de Medalhas', count: state.unlockedMedals.length, to: '/medals', emoji: '🏅', Icon: Shield },
    { label: 'Grimório de Habilidades', count: state.skillCards.length, to: '/grimoire', emoji: '📖', Icon: Scroll },
    { label: 'Histórias do Personagem', count: (state.stories || []).length, to: '/stories', emoji: '📚', Icon: BookOpen },
  ];

  // Total completed challenges
  const totalCompleted = Object.values(state.challengeProgress).filter(p => p.completed).length;

  return (
    <div className="min-h-screen pb-20 px-4 pt-6 max-w-md mx-auto">
      {/* Profile Header Card */}
      <div className="relative rounded-3xl overflow-hidden border border-border mb-6">
        {/* Banner - custom or gradient */}
        <div className="h-28 relative overflow-hidden group cursor-pointer" onClick={() => bannerInputRef.current?.click()}>
          {bannerImage ? (
            <img src={bannerImage} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="h-full bg-gradient-to-br from-primary via-primary/80 to-accent/30">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_60%)]" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera size={20} className="text-white" />
          </div>
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleBannerUpload}
          />
        </div>
        
        {/* Avatar */}
        <div className="flex justify-center -mt-12 relative z-10">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="relative group"
          >
            <div className="w-24 h-24 rounded-full border-4 border-card overflow-hidden shadow-lg">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full gradient-primary flex items-center justify-center text-5xl">
                  {RACE_ICONS[c.race]}
                </div>
              )}
            </div>
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera size={20} className="text-white" />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </button>
        </div>

        {/* Character Info */}
        <div className="bg-card px-5 pb-5 pt-3">
          <div className="text-center mb-4">
            <h1 className="text-xl font-display text-accent">{c.name}</h1>
            <p className="text-xs text-muted-foreground font-body mt-0.5">Idade: {c.age} anos</p>
          </div>

          {/* Race & Class badges */}
          <div className="flex justify-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30">
              <span className="text-base">{RACE_ICONS[c.race]}</span>
              <span className="text-[11px] font-display text-primary-foreground">{RACE_LABELS[c.race]}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30">
              <span className="text-base">{CLASS_ICONS[c.characterClass]}</span>
              <span className="text-[11px] font-display text-accent">{CLASS_LABELS[c.characterClass]}</span>
            </div>
          </div>

          {/* Artistic Level Display */}
          <div className="relative mb-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <motion.div
                    className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center shadow-lg"
                    animate={{ boxShadow: ['0 0 10px hsl(45 100% 65% / 0.3)', '0 0 25px hsl(45 100% 65% / 0.6)', '0 0 10px hsl(45 100% 65% / 0.3)'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-xl font-display font-bold text-accent-foreground">{c.level}</span>
                  </motion.div>
                </div>
                <div>
                  <p className="text-xs font-display text-foreground">Nível {c.level}</p>
                  <p className="text-[10px] font-body text-muted-foreground">{currentXP}/{XP_PER_LEVEL} XP</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-body text-accent">{c.xp} XP total</p>
                <p className="text-[10px] font-body text-muted-foreground">{totalCompleted} desafios</p>
              </div>
            </div>
            <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full gradient-accent rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {c.freePoints > 0 && (
        <motion.div
          className="bg-accent/10 rounded-xl border border-accent/30 p-3 mb-4 text-center"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="text-sm font-body text-accent font-semibold">✨ {c.freePoints} pontos livres para distribuir!</p>
        </motion.div>
      )}

      {/* Journey Progress */}
      <h2 className="font-display text-accent text-sm mb-3">Progresso nas Jornadas</h2>
      <div className="space-y-2 mb-6">
        {ORBS.map((orb, i) => {
          const progress = getOrbProgress(i);
          const challenges = getChallengesForOrb(orb.id);
          const completed = challenges.filter(ch => state.challengeProgress[ch.id]?.completed).length;
          const isUnlocked = i <= state.currentOrbIndex;
          const colors = ORB_COLORS[orb.id] || 'from-gray-400 to-gray-600';

          return (
            <motion.div
              key={orb.id}
              className={`rounded-xl border p-3 ${isUnlocked ? 'bg-card border-border' : 'bg-card/40 border-border/40 opacity-50'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isUnlocked ? 1 : 0.5, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors} flex items-center justify-center shrink-0`}>
                  <span className="text-lg">
                    {progress === 100 ? '✅' : isUnlocked ? '🔮' : '🔒'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="text-xs font-display text-foreground truncate">{orb.name}</h3>
                    <span className="text-[10px] font-body text-muted-foreground shrink-0">{completed}/{challenges.length}</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${colors}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Links */}
      <h2 className="font-display text-accent text-sm mb-3">Coleções</h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {quickLinks.map(({ label, count, to, emoji }, i) => (
          <motion.button
            key={to}
            onClick={() => navigate(to)}
            className="flex flex-col items-center gap-2 bg-card rounded-xl border border-border p-4 hover:border-accent/30 transition-colors"
            whileTap={{ scale: 0.96 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <span className="text-3xl">{emoji}</span>
            <div className="text-center">
              <p className="text-[11px] font-display text-foreground leading-tight">{label}</p>
              <p className="text-[10px] font-body text-accent mt-0.5">{count} {count === 1 ? 'item' : 'itens'}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Attributes */}
      <h2 className="font-display text-accent text-sm mb-3">Atributos</h2>
      <div className="bg-card rounded-xl border border-border p-4 mb-6">
        <div className="space-y-2.5">
          {(Object.keys(c.attributes) as AttributeKey[]).map(key => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-[10px] font-body text-muted-foreground w-28 truncate">{ATTRIBUTE_LABELS[key]}</span>
              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full gradient-accent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(c.attributes[key] / 10) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-[10px] font-body text-accent w-4 text-right">{c.attributes[key]}</span>
              {c.freePoints > 0 && c.attributes[key] < 10 && (
                <button onClick={() => distributePoints(key, 1)} className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <Plus size={9} className="text-accent" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <p className="text-xl font-display text-accent">{state.unlockedMedals.length}</p>
          <p className="text-[10px] font-body text-muted-foreground">Medalhas</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <p className="text-xl font-display text-accent">{state.itemCards.length}</p>
          <p className="text-[10px] font-body text-muted-foreground">Itens</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <p className="text-xl font-display text-accent">{state.skillCards.length}</p>
          <p className="text-[10px] font-body text-muted-foreground">Habilidades</p>
        </div>
      </div>

      <button
        onClick={() => { if (confirm('Resetar todo o progresso?')) resetGame(); }}
        className="w-full py-2 rounded-full border border-destructive/30 text-destructive text-sm font-body flex items-center justify-center gap-2"
      >
        <RotateCcw size={14} /> Resetar Jogo
      </button>

      <BottomNav />
    </div>
  );
}
