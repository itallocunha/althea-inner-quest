import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import {
  Race, CharacterClass, RACE_LABELS, CLASS_LABELS,
  Attributes, DEFAULT_ATTRIBUTES, ATTRIBUTE_LABELS, AttributeKey,
} from '@/types/game';
import { CLASS_ART, RACE_ART } from '@/lib/journeyAssets';
import { ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';

const STEPS = ['Identidade', 'Raça', 'Classe', 'Atributos', 'História'];
const RACES: Race[] = ['human', 'elf', 'dwarf', 'draconian', 'fairy', 'orc'];
const CLASSES: CharacterClass[] = ['paladin', 'mage', 'warrior', 'archer', 'rogue'];

export default function CharacterCreation() {
  const navigate = useNavigate();
  const { createCharacter } = useGame();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState(14);
  const [race, setRace] = useState<Race>('human');
  const [charClass, setCharClass] = useState<CharacterClass>('paladin');
  const [attrs, setAttrs] = useState<Attributes>({ ...DEFAULT_ATTRIBUTES });
  const [freePoints, setFreePoints] = useState(10);
  const [backstory, setBackstory] = useState('');

  const addAttr = (key: AttributeKey) => {
    if (freePoints <= 0 || attrs[key] >= 10) return;
    setAttrs(p => ({ ...p, [key]: p[key] + 1 }));
    setFreePoints(p => p - 1);
  };

  const removeAttr = (key: AttributeKey) => {
    if (attrs[key] <= 0) return;
    setAttrs(p => ({ ...p, [key]: p[key] - 1 }));
    setFreePoints(p => p + 1);
  };

  const canNext = step === 0 ? name.trim().length > 0 : true;

  const finish = () => {
    createCharacter({ name, age, race, characterClass: charClass, attributes: attrs, level: 1, xp: 0, freePoints, backstory });
    navigate('/orbs');
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-md mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={`h-1 rounded-full ${i <= step ? 'gradient-accent' : 'bg-secondary'}`} />
            <span className={`text-[10px] font-body mt-1 block text-center ${i === step ? 'text-accent' : 'text-muted-foreground'}`}>{s}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
        >
          {step === 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-display text-accent">Quem é você, aventureiro?</h2>
              <div>
                <label className="text-sm font-body text-muted-foreground mb-1 block">Nome</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Seu nome de herói"
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-body focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div>
                <label className="text-sm font-body text-muted-foreground mb-1 block">Idade</label>
                <input
                  type="number"
                  min={12}
                  max={17}
                  value={age}
                  onChange={e => setAge(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-body focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-display text-accent">Escolha sua Raça</h2>
              <img src={RACE_ART[race].banner} alt={RACE_LABELS[race]} className="w-full rounded-xl border border-accent/40 shadow-lg shadow-black/40" />
              <div className="grid grid-cols-3 gap-2">
                {RACES.map(r => (
                  <motion.button
                    key={r}
                    onClick={() => setRace(r)}
                    whileTap={{ scale: 0.95 }}
                    aria-label={RACE_LABELS[r]}
                    aria-pressed={race === r}
                    className={`overflow-hidden rounded-xl border-2 p-0 transition-all ${
                      race === r ? 'border-accent glow-accent' : 'border-border opacity-70 hover:opacity-100 hover:border-primary'
                    }`}
                  >
                    <img src={RACE_ART[r].cover} alt="" loading="lazy" className="aspect-[2/3] w-full object-cover" />
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-display text-accent">Escolha sua Classe</h2>
              {/* The Paladino banner file is labelled "Draconianos", so classes preview their card instead. */}
              <img src={CLASS_ART[charClass].card} alt={CLASS_LABELS[charClass]} className="mx-auto w-1/2 rounded-xl shadow-lg shadow-black/50" />
              <div className="grid grid-cols-3 gap-2">
                {CLASSES.map(c => (
                  <motion.button
                    key={c}
                    onClick={() => setCharClass(c)}
                    whileTap={{ scale: 0.95 }}
                    aria-label={CLASS_LABELS[c]}
                    aria-pressed={charClass === c}
                    className={`overflow-hidden rounded-xl border-2 p-0 transition-all ${
                      charClass === c ? 'border-accent glow-accent' : 'border-border opacity-70 hover:opacity-100 hover:border-primary'
                    }`}
                  >
                    <img src={CLASS_ART[c].cover} alt="" loading="lazy" className="aspect-[2/3] w-full object-cover" />
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-display text-accent">Atributos</h2>
                <span className="text-sm font-body text-accent font-semibold">{freePoints} pontos</span>
              </div>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                {(Object.keys(attrs) as AttributeKey[]).map(key => (
                  <div key={key} className="flex items-center justify-between bg-card rounded-lg px-3 py-2 border border-border">
                    <span className="text-xs font-body flex-1">{ATTRIBUTE_LABELS[key]}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => removeAttr(key)} className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-accent">{attrs[key]}</span>
                      <button onClick={() => addAttr(key)} className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-display text-accent">Sua História</h2>
              <div className="flex justify-center gap-3">
                <img src={RACE_ART[race].card} alt={`Carta de raça: ${RACE_LABELS[race]}`} className="w-[46%] rounded-xl shadow-lg shadow-black/50" />
                <img src={CLASS_ART[charClass].card} alt={`Carta de classe: ${CLASS_LABELS[charClass]}`} className="w-[46%] rounded-xl shadow-lg shadow-black/50" />
              </div>
              <p className="text-sm text-muted-foreground font-body">Quem é você? O que te trouxe até aqui? Qual seu maior desafio?</p>
              <textarea
                value={backstory}
                onChange={e => setBackstory(e.target.value)}
                rows={8}
                placeholder="Conte sua história..."
                className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground font-body focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} className="flex-1 py-3 rounded-full border border-border text-foreground font-display flex items-center justify-center gap-2">
            <ChevronLeft size={16} /> Voltar
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canNext}
            className="flex-1 py-3 rounded-full gradient-accent text-accent-foreground font-display font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            Próximo <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={finish}
            className="flex-1 py-3 rounded-full gradient-accent text-accent-foreground font-display font-semibold glow-accent"
          >
            Iniciar Jornada ✨
          </button>
        )}
      </div>
    </div>
  );
}
