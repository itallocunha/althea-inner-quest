import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import heroBg from '@/assets/hero-bg.jpg';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 gradient-hero-overlay" />
      </div>

      <motion.div
        className="relative z-10 text-center px-6 max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-5xl md:text-6xl font-display font-bold text-accent mb-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Althea
        </motion.h1>
        <motion.p
          className="text-sm md:text-base text-muted-foreground font-body tracking-widest uppercase mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Uma Jornada do Autoconhecimento
        </motion.p>

        <div className="space-y-3">
          <motion.button
            onClick={() => navigate('/create')}
            className="w-full py-3.5 rounded-full gradient-accent text-accent-foreground font-display font-semibold text-lg glow-accent"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            Começar Jornada
          </motion.button>

          <motion.button
            onClick={() => navigate('/orbs')}
            className="w-full py-3.5 rounded-full border border-primary bg-primary/20 text-foreground font-display font-medium text-lg"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            Continuar
          </motion.button>

          <motion.button
            onClick={() => navigate('/profile')}
            className="w-full py-3 rounded-full text-muted-foreground font-body text-sm"
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Meu Personagem
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
