import { useEffect, useState } from 'react';
import { Plus, Funnel, Rows, SquaresFour } from '@phosphor-icons/react';
import { transacaoApi } from '../api/transacaoApi';
import { categoriaApi } from '../api/categoriaApi';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import TransactionForm from '../components/TransactionForm';
import TransactionTable from '../components/TransactionTable';
import TransactionCards from '../components/TransactionCards';
import EmptyState from '../components/EmptyState';
import { TableSkeleton } from '../components/Skeleton';

function getDefaultView() {
  if (typeof window !== 'undefined' && window.innerWidth < 768) return 'cards';
  return localStorage.getItem('tx-view') || 'table';
}

export default function Transacoes() {
  const [transacoes, setTransacoes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [viewMode, setViewMode] = useState(getDefaultView);
  const [filters, setFilters] = useState({
    tipo: '',
    categoria_id: '',
    status: '',
    data_inicio: '',
    data_fim: '',
  });

  const loadData = () => {
    setLoading(true);
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '')
    );

    Promise.all([transacaoApi.listar(params), categoriaApi.listar()])
      .then(([transRes, catRes]) => {
        setTransacoes(transRes.data);
        setCategorias(catRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const switchView = (mode) => {
    setViewMode(mode);
    localStorage.setItem('tx-view', mode);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (transacao) => {
    setEditing(transacao);
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (editing) {
        await transacaoApi.editar(editing.id, formData);
      } else {
        await transacaoApi.salvar(formData);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao salvar transação.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await transacaoApi.deletar(deleteTarget.id);
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao excluir transação.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Transações
          </h1>
          <p className="text-sm text-neutral-500">Gerencie suas receitas e despesas</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-neutral-200 dark:border-neutral-700">
            <button
              type="button"
              onClick={() => switchView('table')}
              title="Visualização em tabela"
              className={`flex items-center justify-center rounded-l-md p-2 transition-colors ${
                viewMode === 'table'
                  ? 'bg-brand text-white'
                  : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <Rows size={16} />
            </button>
            <button
              type="button"
              onClick={() => switchView('cards')}
              title="Visualização em cards"
              className={`flex items-center justify-center rounded-r-md p-2 transition-colors ${
                viewMode === 'cards'
                  ? 'bg-brand text-white'
                  : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <SquaresFour size={16} />
            </button>
          </div>
          <button type="button" onClick={handleOpenCreate} className="btn-primary">
            <Plus size={17} />
            Nova Transação
          </button>
        </div>
      </div>

      <div className="surface rounded-xl p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
          <Funnel size={14} />
          Filtros
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <select
            name="tipo"
            value={filters.tipo}
            onChange={handleFilterChange}
            className="input-field"
          >
            <option value="">Todos os tipos</option>
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>
          <select
            name="categoria_id"
            value={filters.categoria_id}
            onChange={handleFilterChange}
            className="input-field"
          >
            <option value="">Todas categorias</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="input-field"
          >
            <option value="">Todos status</option>
            <option value="pago">Pago</option>
            <option value="pendente">Pendente</option>
          </select>
          <input
            type="date"
            name="data_inicio"
            value={filters.data_inicio}
            onChange={handleFilterChange}
            className="input-field [color-scheme:light] dark:[color-scheme:dark]"
          />
          <input
            type="date"
            name="data_fim"
            value={filters.data_fim}
            onChange={handleFilterChange}
            className="input-field [color-scheme:light] dark:[color-scheme:dark]"
          />
        </div>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : transacoes.length === 0 ? (
        <EmptyState
          title="Nenhuma transação encontrada"
          description="Adicione sua primeira transação para começar a controlar suas finanças."
          action={
            <button type="button" onClick={handleOpenCreate} className="btn-primary">
              <Plus size={16} />
              Nova Transação
            </button>
          }
        />
      ) : viewMode === 'table' ? (
        <TransactionTable
          transactions={transacoes}
          onEdit={handleOpenEdit}
          onDelete={setDeleteTarget}
        />
      ) : (
        <TransactionCards
          transactions={transacoes}
          onEdit={handleOpenEdit}
          onDelete={setDeleteTarget}
        />
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar Transação' : 'Nova Transação'}
      >
        <TransactionForm
          initialData={editing}
          categorias={categorias}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          loading={saving}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Excluir Transação"
        message={`Tem certeza que deseja excluir a transação "${deleteTarget?.description}"?`}
        loading={deleting}
      />
    </div>
  );
}
