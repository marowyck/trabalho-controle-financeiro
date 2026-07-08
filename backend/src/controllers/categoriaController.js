const db = require('../config/db');

const VALID_TYPES = ['receita', 'despesa'];

function listar(req, res) {
  const categorias = db
    .prepare(
      `SELECT id, user_id, name, type, color, icon, created_at
       FROM categories WHERE user_id = ? ORDER BY name ASC`
    )
    .all(req.userId);

  return res.json(categorias);
}

function buscar(req, res) {
  const categoria = db
    .prepare(
      `SELECT id, user_id, name, type, color, icon, created_at
       FROM categories WHERE id = ? AND user_id = ?`
    )
    .get(req.params.id, req.userId);

  if (!categoria) {
    return res.status(404).json({ message: 'Categoria não encontrada.' });
  }

  return res.json(categoria);
}

function salvar(req, res) {
  const { name, type, color, icon } = req.body;

  if (!name || !type) {
    return res.status(400).json({ message: 'Nome e tipo são obrigatórios.' });
  }

  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ message: 'Tipo deve ser receita ou despesa.' });
  }

  const result = db
    .prepare(
      `INSERT INTO categories (user_id, name, type, color, icon)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(req.userId, name, type, color || '#6366f1', icon || 'Tag');

  const categoria = db
    .prepare(
      `SELECT id, user_id, name, type, color, icon, created_at
       FROM categories WHERE id = ?`
    )
    .get(result.lastInsertRowid);

  return res.status(201).json(categoria);
}

function editar(req, res) {
  const { name, type, color, icon } = req.body;
  const { id } = req.params;

  const existing = db
    .prepare('SELECT id FROM categories WHERE id = ? AND user_id = ?')
    .get(id, req.userId);

  if (!existing) {
    return res.status(404).json({ message: 'Categoria não encontrada.' });
  }

  if (type && !VALID_TYPES.includes(type)) {
    return res.status(400).json({ message: 'Tipo deve ser receita ou despesa.' });
  }

  db.prepare(
    `UPDATE categories SET
      name = COALESCE(?, name),
      type = COALESCE(?, type),
      color = COALESCE(?, color),
      icon = COALESCE(?, icon)
     WHERE id = ? AND user_id = ?`
  ).run(name ?? null, type ?? null, color ?? null, icon ?? null, id, req.userId);

  const categoria = db
    .prepare(
      `SELECT id, user_id, name, type, color, icon, created_at
       FROM categories WHERE id = ?`
    )
    .get(id);

  return res.json(categoria);
}

function deletar(req, res) {
  const { id } = req.params;

  const existing = db
    .prepare('SELECT id FROM categories WHERE id = ? AND user_id = ?')
    .get(id, req.userId);

  if (!existing) {
    return res.status(404).json({ message: 'Categoria não encontrada.' });
  }

  const linked = db
    .prepare('SELECT id FROM transactions WHERE category_id = ? LIMIT 1')
    .get(id);

  if (linked) {
    return res.status(409).json({
      message: 'Não é possível excluir categoria com transações vinculadas.',
    });
  }

  db.prepare('DELETE FROM categories WHERE id = ? AND user_id = ?').run(id, req.userId);

  return res.json({ message: 'Categoria excluída com sucesso.' });
}

module.exports = { listar, buscar, salvar, editar, deletar };
