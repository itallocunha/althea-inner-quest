import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { BottomNav } from '@/components/BottomNav';
import { Plus, Save, X, Pencil, Trash2, GripVertical, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CharacterStory } from '@/types/game';

export default function CharacterStories() {
  const navigate = useNavigate();
  const { state, addStory, editStory, deleteStory, reorderStories } = useGame();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  if (!state.character) { navigate('/'); return null; }

  const stories = state.stories || [];

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    if (editingId) {
      editStory(editingId, title.trim(), content.trim());
      setEditingId(null);
    } else {
      addStory(title.trim(), content.trim());
    }
    setTitle('');
    setContent('');
    setShowForm(false);
  };

  const handleEdit = (story: CharacterStory) => {
    setEditingId(story.id);
    setTitle(story.title);
    setContent(story.content);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja apagar esta história?')) {
      deleteStory(id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setTitle('');
    setContent('');
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display text-accent flex items-center gap-2">
            <BookOpen size={24} /> Crônicas
          </h1>
          <p className="text-xs text-muted-foreground font-body mt-1">
            As histórias do seu personagem
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 text-xs font-body text-accent-foreground bg-accent rounded-full px-4 py-2"
          >
            <Plus size={14} /> Nova História
          </button>
        )}
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="bg-card rounded-2xl border border-accent/30 p-5 mb-6 relative overflow-hidden"
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/60 via-accent to-accent/60" />
            <p className="text-xs font-display text-accent mb-3">
              {editingId ? '✏️ Editando História' : '📝 Nova História'}
            </p>
            <Input
              placeholder="Título da história..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-3 bg-secondary border-border text-sm font-display"
            />
            <Textarea
              placeholder="Conte a história do seu personagem, suas conquistas, aventuras e momentos marcantes..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mb-4 bg-secondary border-border text-sm font-body min-h-[150px]"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={!title.trim() || !content.trim()}
                className="flex-1 py-2.5 rounded-full bg-accent text-accent-foreground text-sm font-body flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
              >
                <Save size={14} /> {editingId ? 'Salvar Alterações' : 'Salvar História'}
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2.5 rounded-full border border-border text-muted-foreground text-sm font-body hover:bg-secondary transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {stories.length === 0 && !showForm && (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-accent/10 mx-auto flex items-center justify-center mb-4">
            <span className="text-4xl">📚</span>
          </div>
          <p className="text-sm text-muted-foreground font-body mb-1">Nenhuma história escrita ainda.</p>
          <p className="text-xs text-muted-foreground font-body">Conte as aventuras do seu personagem!</p>
        </div>
      )}

      {/* Stories list with reorder */}
      {stories.length > 0 && (
        <Reorder.Group
          axis="y"
          values={stories}
          onReorder={reorderStories}
          className="space-y-4"
        >
          {stories.map((story, i) => (
            <Reorder.Item key={story.id} value={story}>
              <motion.div
                className="bg-card rounded-2xl border border-border relative overflow-hidden group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {/* Book spine decoration */}
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-accent via-accent/60 to-accent/20 rounded-l-2xl" />
                
                {/* Drag handle */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                  <GripVertical size={16} className="text-muted-foreground" />
                </div>

                <div className="pl-5 pr-4 py-4">
                  {/* Title and date */}
                  <div className="flex items-start justify-between mb-2 pr-6">
                    <h3 className="font-display text-base text-accent leading-tight">{story.title}</h3>
                  </div>
                  <span className="text-[10px] font-body text-muted-foreground block mb-3">
                    📅 {new Date(story.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>

                  {/* Content */}
                  <p className="text-xs text-muted-foreground font-body leading-relaxed whitespace-pre-wrap mb-4">
                    {story.content}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <button
                      onClick={() => handleEdit(story)}
                      className="flex items-center gap-1.5 text-[10px] font-body text-accent hover:text-accent/80 transition-colors px-3 py-1.5 rounded-full border border-accent/20 hover:bg-accent/10"
                    >
                      <Pencil size={10} /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(story.id)}
                      className="flex items-center gap-1.5 text-[10px] font-body text-destructive hover:text-destructive/80 transition-colors px-3 py-1.5 rounded-full border border-destructive/20 hover:bg-destructive/10"
                    >
                      <Trash2 size={10} /> Apagar
                    </button>
                  </div>
                </div>
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      <BottomNav />
    </div>
  );
}
