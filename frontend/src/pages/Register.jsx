import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle } from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';

const FEATURES = [
  'Controle receitas e despesas em tempo real',
  'Gráficos e relatórios visuais do seu dinheiro',
  'Categorias personalizadas para cada hábito',
];

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao cadastrar.');
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-[3] flex-col justify-between bg-brand p-12 lg:flex">
        <div className="flex items-center gap-3">
          <Logo size={36} />
          <span className="text-xl font-bold tracking-tight text-white">iFinance</span>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold leading-snug text-white">
              Comece hoje a cuidar<br />do seu dinheiro.
            </h2>
            <p className="mt-3 text-base text-white/70">
              Crie sua conta gratuitamente e tenha total visibilidade das suas finanças pessoais.
            </p>
          </div>
          <div className="space-y-4">
            {FEATURES.map((feat) => (
              <div key={feat} className="flex items-center gap-3">
                <CheckCircle size={20} weight="fill" className="shrink-0 text-white/80" />
                <p className="text-sm text-white/90">{feat}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="relative flex flex-[2] flex-col items-center justify-center bg-neutral-50 p-8 dark:bg-neutral-950">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="mb-3 flex items-center gap-2">
              <Logo size={28} />
              <span className="text-base font-bold text-neutral-900 dark:text-white">iFinance</span>
            </div>
          </div>

          <div className="mb-7">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Criar sua conta
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Comece a organizar suas finanças agora
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-expense/30 bg-expense/5 px-4 py-2.5 text-sm text-expense">
                {error}
              </div>
            )}

            <div>
              <label className="label-field">Nome completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-field"
                placeholder="João Silva"
              />
            </div>

            <div>
              <label className="label-field">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="label-field">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="input-field"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Cadastrando...' : 'Criar conta'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Já tem conta?{' '}
            <Link to="/login" className="font-semibold text-brand hover:text-brand-700">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
