import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  SquaresFour,
  ArrowsLeftRight,
  Tag,
  SignOut,
  List,
  X,
  Wallet,
} from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { to: '/', label: 'Dashboard', icon: SquaresFour },
  { to: '/transacoes', label: 'Transações', icon: ArrowsLeftRight },
  { to: '/categorias', label: 'Categorias', icon: Tag },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);
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
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-neutral-200 bg-white transition-transform dark:border-neutral-800 dark:bg-neutral-950 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-5 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-white">
              <Wallet size={16} weight="bold" />
            </div>
            <p className="text-sm font-semibold leading-tight text-neutral-900 dark:text-white">
              Controle Financeiro
            </p>
          </div>
          <button
            type="button"
            className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 lg:hidden"
            onClick={closeSidebar}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-white'
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900/60 dark:hover:text-neutral-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-brand transition-opacity ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <Icon size={19} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-neutral-200 p-3 dark:border-neutral-800">
          <div className="mb-2 flex items-center gap-3 rounded-md px-2 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-xs font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
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
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium text-neutral-500 transition-colors hover:bg-brand/10 hover:text-brand dark:text-neutral-400"
          >
            <SignOut size={19} />
            Sair
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-neutral-200 px-4 py-4 dark:border-neutral-800 lg:hidden">
          <button
            type="button"
            className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            onClick={() => setSidebarOpen(true)}
          >
            <List size={22} />
          </button>
          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white">
            <Wallet size={17} className="text-brand" weight="bold" />
            Controle Financeiro
          </div>
          <ThemeToggle />
        </header>

        <main className="flex-1 bg-neutral-50 p-4 dark:bg-neutral-950 lg:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
