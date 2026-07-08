import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, ArrowRight } from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

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
    <div className="relative flex min-h-screen items-center justify-center bg-neutral-50 p-4 dark:bg-neutral-950">
      <ThemeToggle className="absolute right-4 top-4" />

      <div className="surface w-full max-w-md rounded-md p-8">
        <div className="mb-8">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-brand text-white">
            <Wallet size={20} weight="bold" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Criar conta
          </h1>
          <p className="mt-1 text-sm text-neutral-500">Comece a organizar suas finanças agora</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md border border-brand/30 bg-brand/5 px-4 py-2.5 text-sm text-brand">
              {error}
            </div>
          )}

          <div>
            <label className="label-field">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-field"
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
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
            {loading ? 'Cadastrando...' : 'Cadastrar'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Já tem conta?{' '}
          <Link to="/login" className="font-medium text-brand hover:text-brand-700">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
