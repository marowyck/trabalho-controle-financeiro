import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  SquaresFour,
  ArrowsLeftRight,
  Tag,
  SignOut,
  List,
  X,
  CaretLeft,
  CaretRight,
} from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

const navItems = [
  { to: '/', label: 'Dashboard', icon: SquaresFour },
  { to: '/transacoes', label: 'Transações', icon: ArrowsLeftRight },
  { to: '/categorias', label: 'Categorias', icon: Tag },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });

  const closeSidebar = () => setSidebarOpen(false);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('sidebar-collapsed', String(next));
  };

  const initials = (user?.name || '?')
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex min-h-screen">
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={closeSidebar} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-neutral-200 bg-white transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-950 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'lg:w-[68px]' : ''}`}
      >
        <div
          className={`flex items-center border-b border-neutral-200 px-4 py-5 dark:border-neutral-800 ${
            collapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          {!collapsed && (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <Logo size={30} />
              <p className="truncate text-sm font-bold tracking-tight text-neutral-900 dark:text-white">
                iFinance
              </p>
            </div>
          )}
          {collapsed && <Logo size={30} />}

          <div className={`flex items-center gap-1 ${collapsed ? 'hidden lg:flex' : ''}`}>
            <button
              type="button"
              className="hidden rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 lg:flex"
              onClick={toggleCollapsed}
              title={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
            >
              {collapsed ? <CaretRight size={16} /> : <CaretLeft size={16} />}
            </button>
            <button
              type="button"
              className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 lg:hidden"
              onClick={closeSidebar}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={closeSidebar}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  collapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? 'bg-brand/10 text-brand dark:bg-brand/15 dark:text-brand-500'
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900/60 dark:hover:text-neutral-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {!collapsed && (
                    <span
                      className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-brand transition-opacity ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  )}
                  <Icon size={20} weight={isActive ? 'bold' : 'regular'} />
                  {!collapsed && <span>{label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-neutral-200 p-3 dark:border-neutral-800">
          {!collapsed && (
            <div className="mb-2 flex items-center gap-3 rounded-md px-2 py-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand/10 text-xs font-bold text-brand">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  {user?.name}
                </p>
                <p className="truncate text-xs text-neutral-500">{user?.email}</p>
              </div>
              <ThemeToggle />
            </div>
          )}

          {collapsed && (
            <div className="mb-2 flex justify-center py-1">
              <div
                title={user?.name}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand/10 text-xs font-bold text-brand"
              >
                {initials}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={logout}
            title="Sair"
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-neutral-500 transition-colors hover:bg-expense/10 hover:text-expense dark:text-neutral-400 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <SignOut size={19} />
            {!collapsed && <span>Sair</span>}
          </button>

          {collapsed && (
            <div className="mt-2 flex justify-center">
              <ThemeToggle />
            </div>
          )}
        </div>
      </aside>

      <div className={`flex flex-1 flex-col overflow-hidden`}>
        <header className="flex items-center justify-between border-b border-neutral-200 px-4 py-4 dark:border-neutral-800 lg:hidden">
          <button
            type="button"
            className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            onClick={() => setSidebarOpen(true)}
          >
            <List size={22} />
          </button>
          <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white">
            <Logo size={22} />
            iFinance
          </div>
          <ThemeToggle />
        </header>

        <main className="flex-1 bg-neutral-50 p-6 dark:bg-neutral-950 lg:p-10">
          <div className="mx-auto max-w-6xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
