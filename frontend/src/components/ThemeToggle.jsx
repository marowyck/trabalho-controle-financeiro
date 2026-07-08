import { Sun, MoonStars } from '@phosphor-icons/react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Alternar tema"
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-neutral-300 text-neutral-600 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 ${className}`}
    >
      {theme === 'dark' ? <Sun size={17} /> : <MoonStars size={17} />}
    </button>
  );
}
