import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { ATTRIBUTE_LABELS, AttributeKey, RACE_LABELS, CLASS_LABELS, RACE_ICONS, CLASS_ICONS } from '@/types/game';
import { XPBar } from '@/components/XPBar';
import { BottomNav } from '@/components/BottomNav';
import { Plus, RotateCcw, Backpack, Trophy, BookOpen, ScrollText, ChevronRight, Save, X } from 'lucide-react';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

export default function Profile() {
  const navigate = useNavigate();
  const { state, distributePoints, resetGame, addStory } = useGame();
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [storyTitle, setStoryTitle] = useState('');
  const [storyContent, setStoryContent] = useState('');

  if (!state.character) {
    navigate('/');
    return null;
  }

  const c = state.character;

  const handleSaveStory = () => {
    if (!storyTitle.trim() || !storyContent.trim()) return;
    addStory(storyTitle.trim(), storyContent.trim());
    setStoryTitle('');
    setStoryContent('');
    setShowStoryForm(false);
  };

  const quickLinks = [
    { icon: Backpack, label: 'Inventário', count: state.itemCards.length, to: '/inventory', emoji: '🎒' },
    { icon: Trophy, label: 'Coleção de Medalhas', count: state.unlockedMedals.length, to: '/medals', emoji: '🏅' },
    { icon: BookOpen, label: 'Grimório de Habilidades', count: state.skillCards.length, to: '/grimoire', emoji: '📖' },
  ];

  return (
    <div className="min-h-screen pb-20 px-4 pt-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 rounded-full gradient-primary mx-auto flex items-center justify-center text-4xl mb-2 glow-primary">
          {RACE_ICONS[c.race]}
        </div>
        <h1 className="text-2xl font-display text-accent">{c.name}</h1>
        <p className="text-sm text-muted-foreground font-body">
          {RACE_LABELS[c.race]} • {CLASS_LABELS[c.characterClass]} {CLASS_ICONS[c.characterClass]}
        </p>
        <p className="text-xs text-muted-foreground font-body">Idade: {c.age}</p>
      </div>

      <div className="mb-6">
        <XPBar />
      </div>

      {/* Quick Navigation Buttons */}
      <div className="space-y-2 mb-6">
        {quickLinks.map(({ icon: Icon, label, count, to, emoji }) => (
          <motion.button
            key={to}
            onClick={() => navigate(to)}
            className="w-full flex items-center gap-3 bg-card rounded-xl border border-border p-3 hover:border-accent/30 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-2xl">{emoji}</span>
            <div className="flex-1 text-left">
              <p className="text-sm font-display text-foreground">{label}</p>
              <p className="text-[10px] font-body text-muted-foreground">{count} {count === 1 ? 'item' : 'itens'}</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </motion.button>
        ))}
      </div>

      {/* Character Stories Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-accent text-sm flex items-center gap-2">
            <ScrollText size={16} /> Histórias do Personagem
          </h2>
          <button
            onClick={() => setShowStoryForm(true)}
            className="text-[10px] font-body text-accent border border-accent/30 rounded-full px-3 py-1 hover:bg-accent/10 transition-colors"
          >
            + Nova História
          </button>
        </div>

        {showStoryForm && (
          <motion.div
            className="bg-card rounded-xl border border-accent/30 p-4 mb-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Input
              placeholder="Título da história..."
              value={storyTitle}
              onChange={(e) => setStoryTitle(e.target.value)}
              className="mb-2 bg-secondary border-border text-sm font-display"
            />
            <Textarea
              placeholder="Conte a história do seu personagem, suas conquistas, aventuras e momentos marcantes..."
              value={storyContent}
              onChange={(e) => setStoryContent(e.target.value)}
              className="mb-3 bg-secondary border-border text-sm font-body min-h-[120px]"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveStory}
                disabled={!storyTitle.trim() || !storyContent.trim()}
                className="flex-1 py-2 rounded-full gradient-accent text-accent-foreground text-sm font-body flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <Save size={14} /> Salvar História
              </button>
              <button
                onClick={() => { setShowStoryForm(false); setStoryTitle(''); setStoryContent(''); }}
                className="px-4 py-2 rounded-full border border-border text-muted-foreground text-sm font-body"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {(!state.stories || state.stories.length === 0) && !showStoryForm ? (
          <div className="text-center py-8 bg-card rounded-xl border border-border">
            <span className="text-3xl block mb-2">📚</span>
            <p className="text-xs text-muted-foreground font-body">Nenhuma história escrita ainda.</p>
            <p className="text-[10px] text-muted-foreground font-body">Conte as aventuras do seu personagem!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {state.stories?.map((story, i) => (
              <motion.div
                key={story.id}
                className="bg-card rounded-xl border border-border p-4 relative overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {/* Book-like decoration */}
                <div className="absolute top-0 left-0 w-1 h-full bg-accent/40 rounded-l-xl" />
                <div className="pl-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-display text-sm text-accent">{story.title}</h3>
                    <span className="text-[9px] font-body text-muted-foreground whitespace-nowrap ml-2">
                      {new Date(story.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-body mt-2 leading-relaxed whitespace-pre-wrap">
                    {story.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {c.freePoints > 0 && (
        <div className="bg-accent/10 rounded-xl border border-accent/30 p-3 mb-4 text-center">
          <p className="text-sm font-body text-accent font-semibold">{c.freePoints} pontos livres para distribuir!</p>
        </div>
      )}

      {/* Attributes */}
      <h2 className="font-display text-accent text-sm mb-3">Atributos</h2>
      <div className="space-y-2 mb-6">
        {(Object.keys(c.attributes) as AttributeKey[]).map(key => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-xs font-body text-muted-foreground flex-1 truncate">{ATTRIBUTE_LABELS[key]}</span>
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full gradient-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(c.attributes[key] / 10) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-xs font-body text-accent w-5 text-right">{c.attributes[key]}</span>
            {c.freePoints > 0 && c.attributes[key] < 10 && (
              <button onClick={() => distributePoints(key, 1)} className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                <Plus size={10} className="text-accent" />
              </button>
            )}
          </div>
        ))}
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
