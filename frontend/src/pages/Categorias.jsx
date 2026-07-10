import { useEffect, useState } from 'react';
import { Plus, PencilSimple, Trash } from '@phosphor-icons/react';
import { categoriaApi } from '../api/categoriaApi';
import { CategoryIcon } from '../utils/categoryIcons';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import CategoryForm from '../components/CategoryForm';
import EmptyState from '../components/EmptyState';
import { CardGridSkeleton } from '../components/Skeleton';

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadCategorias = () => {
    setLoading(true);
    categoriaApi
      .listar()
      .then(({ data }) => setCategorias(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  const handleOpenCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (categoria) => {
    setEditing(categoria);
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (editing) {
        await categoriaApi.editar(editing.id, formData);
      } else {
        await categoriaApi.salvar(formData);
      }
      setModalOpen(false);
      loadCategorias();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao salvar categoria.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await categoriaApi.deletar(deleteTarget.id);
      setDeleteTarget(null);
      loadCategorias();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao excluir categoria.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Categorias
          </h1>
          <p className="text-sm text-neutral-500">Gerencie suas categorias de receita e despesa</p>
        </div>
        <button type="button" onClick={handleOpenCreate} className="btn-primary">
          <Plus size={17} />
          Nova Categoria
        </button>
      </div>

      {loading ? (
        <CardGridSkeleton />
      ) : categorias.length === 0 ? (
        <EmptyState
          title="Nenhuma categoria cadastrada"
          description="Crie categorias para organizar melhor suas receitas e despesas."
          action={
            <button type="button" onClick={handleOpenCreate} className="btn-primary">
              <Plus size={16} />
              Nova Categoria
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categorias.map((cat) => (
            <div key={cat.id} className="surface group rounded-xl p-5 transition-all hover:shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border"
                    style={{
                      backgroundColor: `${cat.color}18`,
                      borderColor: `${cat.color}50`,
                      color: cat.color,
                    }}
                  >
                    <CategoryIcon name={cat.icon} size={20} weight="bold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {cat.name}
                    </h3>
                    <span
                      className={`mt-1 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                        cat.type === 'receita'
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-400'
                          : 'border-expense/30 bg-expense/5 text-expense'
                      }`}
                    >
                      {cat.type === 'receita' ? 'Receita' : 'Despesa'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(cat)}
                    className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                  >
                    <PencilSimple size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(cat)}
                    className="rounded-lg p-1.5 text-neutral-400 hover:bg-expense/10 hover:text-expense"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar Categoria' : 'Nova Categoria'}
      >
        <CategoryForm
          initialData={editing}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          loading={saving}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Excluir Categoria"
        message={`Tem certeza que deseja excluir a categoria "${deleteTarget?.name}"? Esta ação não pode ser desfeita.`}
        loading={deleting}
      />
    </div>
  );
}
