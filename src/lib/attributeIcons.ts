import {
  Brain, Dumbbell, Heart, Shield, Gem, MessageCircle, Users, Target, Palette, Flame, Crown, Settings,
  HeartHandshake, Puzzle, Waves, Sparkles, BookOpen, Zap, Eye, Mountain, Clover, Hourglass, Compass,
  Megaphone, Moon, Swords, Flower2, type LucideIcon,
} from 'lucide-react';
import { AttributeKey } from '@/types/game';

/** Line icons for every attribute, drawn inside gold rune sockets instead of emoji. */
export const ATTRIBUTE_ICONS: Record<AttributeKey, LucideIcon> = {
  intelligence: Brain,
  physicalStrength: Dumbbell,
  emotionalStrength: Heart,
  resilience: Shield,
  selfKnowledge: Gem,
  communication: MessageCircle,
  teamwork: Users,
  focus: Target,
  creativity: Palette,
  determination: Flame,
  leadership: Crown,
  selfManagement: Settings,
  empathy: HeartHandshake,
  problemSolving: Puzzle,
  adaptability: Waves,
  charisma: Sparkles,
  wisdom: BookOpen,
  agility: Zap,
  perception: Eye,
  endurance: Mountain,
  luck: Clover,
  discipline: Hourglass,
  strategy: Compass,
  persuasion: Megaphone,
  intuition: Moon,
  courage: Swords,
  patience: Flower2,
};
