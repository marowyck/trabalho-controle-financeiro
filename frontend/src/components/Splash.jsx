import { motion } from 'framer-motion';
import Logo from './Logo';

export default function Splash() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4, ease: 'easeInOut' } }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
        className="flex flex-col items-center gap-4"
      >
        <div className="rounded-2xl bg-white/15 p-5 shadow-xl">
          <Logo size={56} />
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold tracking-tight text-white">iFinance</p>
          <p className="mt-1 text-sm text-white/70">Controle financeiro pessoal</p>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 flex items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-white/50"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
