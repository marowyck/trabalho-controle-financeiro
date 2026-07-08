const db = require('../config/db');

const VALID_TYPES = ['receita', 'despesa'];
const VALID_PAYMENT_METHODS = [
  'dinheiro',
  'cartao_credito',
  'cartao_debito',
  'pix',
  'transferencia',
  'boleto',
];
const VALID_STATUS = ['pago', 'pendente'];

function formatTransaction(row) {
  return {
    id: row.id,
    user_id: row.user_id,
    category_id: row.category_id,
    description: row.description,
    amount: row.amount,
    date: row.date,
    type: row.type,
    payment_method: row.payment_method,
    status: row.status,
    notes: row.notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
    category_name: row.category_name,
    category_color: row.category_color,
  };
}

function buildListQuery(userId, filters) {
  let sql = `
    SELECT t.*, c.name AS category_name, c.color AS category_color
    FROM transactions t
    JOIN categories c ON c.id = t.category_id
    WHERE t.user_id = ?
  `;
  const params = [userId];

  if (filters.tipo) {
    sql += ' AND t.type = ?';
    params.push(filters.tipo);
  }
  if (filters.categoria_id) {
    sql += ' AND t.category_id = ?';
    params.push(filters.categoria_id);
  }
  if (filters.status) {
    sql += ' AND t.status = ?';
    params.push(filters.status);
  }
  if (filters.data_inicio) {
    sql += ' AND t.date >= ?';
    params.push(filters.data_inicio);
  }
  if (filters.data_fim) {
    sql += ' AND t.date <= ?';
    params.push(filters.data_fim);
  }

  sql += ' ORDER BY t.date DESC, t.id DESC';

  return { sql, params };
}

function listar(req, res) {
  const filters = {
    tipo: req.query.tipo,
    categoria_id: req.query.categoria_id,
    status: req.query.status,
    data_inicio: req.query.data_inicio,
    data_fim: req.query.data_fim,
  };

  const { sql, params } = buildListQuery(req.userId, filters);
  const transacoes = db.prepare(sql).all(...params).map(formatTransaction);

  return res.json(transacoes);
}

function buscar(req, res) {
  const transacao = db
    .prepare(
      `SELECT t.*, c.name AS category_name, c.color AS category_color
       FROM transactions t
       JOIN categories c ON c.id = t.category_id
       WHERE t.id = ? AND t.user_id = ?`
    )
    .get(req.params.id, req.userId);

  if (!transacao) {
    return res.status(404).json({ message: 'Transação não encontrada.' });
  }

  return res.json(formatTransaction(transacao));
}

function validateTransactionBody(body, isUpdate = false) {
  const {
    description,
    amount,
    date,
    type,
    category_id,
    payment_method,
    status,
    notes,
  } = body;

  if (!isUpdate) {
    if (!description || !amount || !date || !type || !category_id || !payment_method) {
      return 'Descrição, valor, data, tipo, categoria e forma de pagamento são obrigatórios.';
    }
  }

  if (type && !VALID_TYPES.includes(type)) {
    return 'Tipo deve ser receita ou despesa.';
  }

  if (payment_method && !VALID_PAYMENT_METHODS.includes(payment_method)) {
    return 'Forma de pagamento inválida.';
  }

  if (status && !VALID_STATUS.includes(status)) {
    return 'Status deve ser pago ou pendente.';
  }

  if (amount !== undefined && Number(amount) <= 0) {
    return 'O valor deve ser maior que zero.';
  }

  return null;
}

function categoryBelongsToUser(categoryId, userId) {
  return db
    .prepare('SELECT id FROM categories WHERE id = ? AND user_id = ?')
    .get(categoryId, userId);
}

function salvar(req, res) {
  const error = validateTransactionBody(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }

  const {
    description,
    amount,
    date,
    type,
    category_id,
    payment_method,
    status,
    notes,
  } = req.body;

  if (!categoryBelongsToUser(category_id, req.userId)) {
    return res.status(400).json({ message: 'Categoria inválida.' });
  }

  const result = db
    .prepare(
      `INSERT INTO transactions
        (user_id, category_id, description, amount, date, type, payment_method, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      req.userId,
      category_id,
      description,
      Number(amount),
      date,
      type,
      payment_method,
      status || 'pago',
      notes || null
    );

  const transacao = db
    .prepare(
      `SELECT t.*, c.name AS category_name, c.color AS category_color
       FROM transactions t
       JOIN categories c ON c.id = t.category_id
       WHERE t.id = ?`
    )
    .get(result.lastInsertRowid);

  return res.status(201).json(formatTransaction(transacao));
}

function editar(req, res) {
  const { id } = req.params;
  const error = validateTransactionBody(req.body, true);
  if (error) {
    return res.status(400).json({ message: error });
  }

  const existing = db
    .prepare('SELECT id FROM transactions WHERE id = ? AND user_id = ?')
    .get(id, req.userId);

  if (!existing) {
    return res.status(404).json({ message: 'Transação não encontrada.' });
  }

  const {
    description,
    amount,
    date,
    type,
    category_id,
    payment_method,
    status,
    notes,
  } = req.body;

  if (category_id && !categoryBelongsToUser(category_id, req.userId)) {
    return res.status(400).json({ message: 'Categoria inválida.' });
  }

  db.prepare(
    `UPDATE transactions SET
      description = COALESCE(?, description),
      amount = COALESCE(?, amount),
      date = COALESCE(?, date),
      type = COALESCE(?, type),
      category_id = COALESCE(?, category_id),
      payment_method = COALESCE(?, payment_method),
      status = COALESCE(?, status),
      notes = COALESCE(?, notes),
      updated_at = datetime('now')
     WHERE id = ? AND user_id = ?`
  ).run(
    description ?? null,
    amount !== undefined ? Number(amount) : null,
    date ?? null,
    type ?? null,
    category_id ?? null,
    payment_method ?? null,
    status ?? null,
    notes ?? null,
    id,
    req.userId
  );

  const transacao = db
    .prepare(
      `SELECT t.*, c.name AS category_name, c.color AS category_color
       FROM transactions t
       JOIN categories c ON c.id = t.category_id
       WHERE t.id = ?`
    )
    .get(id);

  return res.json(formatTransaction(transacao));
}

function deletar(req, res) {
  const { id } = req.params;

  const existing = db
    .prepare('SELECT id FROM transactions WHERE id = ? AND user_id = ?')
    .get(id, req.userId);

  if (!existing) {
    return res.status(404).json({ message: 'Transação não encontrada.' });
  }

  db.prepare('DELETE FROM transactions WHERE id = ? AND user_id = ?').run(id, req.userId);

  return res.json({ message: 'Transação excluída com sucesso.' });
}

function resumo(req, res) {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const totals = db
    .prepare(
      `SELECT
        COALESCE(SUM(CASE WHEN type = 'receita' THEN amount ELSE 0 END), 0) AS total_receitas,
        COALESCE(SUM(CASE WHEN type = 'despesa' THEN amount ELSE 0 END), 0) AS total_despesas
       FROM transactions
       WHERE user_id = ? AND status = 'pago'`
    )
    .get(req.userId);

  const monthTotals = db
    .prepare(
      `SELECT
        COALESCE(SUM(CASE WHEN type = 'receita' THEN amount ELSE 0 END), 0) AS receitas_mes,
        COALESCE(SUM(CASE WHEN type = 'despesa' THEN amount ELSE 0 END), 0) AS despesas_mes
       FROM transactions
       WHERE user_id = ? AND status = 'pago' AND strftime('%Y-%m', date) = ?`
    )
    .get(req.userId, currentMonth);

  const despesasPorCategoria = db
    .prepare(
      `SELECT c.name, c.color, COALESCE(SUM(t.amount), 0) AS total
       FROM transactions t
       JOIN categories c ON c.id = t.category_id
       WHERE t.user_id = ? AND t.type = 'despesa' AND t.status = 'pago'
       GROUP BY c.id, c.name, c.color
       ORDER BY total DESC`
    )
    .all(req.userId);

  const totaisPorMes = db
    .prepare(
      `SELECT
        strftime('%Y-%m', date) AS mes,
        COALESCE(SUM(CASE WHEN type = 'receita' THEN amount ELSE 0 END), 0) AS receitas,
        COALESCE(SUM(CASE WHEN type = 'despesa' THEN amount ELSE 0 END), 0) AS despesas
       FROM transactions
       WHERE user_id = ? AND status = 'pago'
         AND date >= date('now', '-5 months', 'start of month')
       GROUP BY strftime('%Y-%m', date)
       ORDER BY mes ASC`
    )
    .all(req.userId);

  const saldo = totals.total_receitas - totals.total_despesas;
  const saldoMes = monthTotals.receitas_mes - monthTotals.despesas_mes;

  return res.json({
    saldo,
    total_receitas: totals.total_receitas,
    total_despesas: totals.total_despesas,
    receitas_mes: monthTotals.receitas_mes,
    despesas_mes: monthTotals.despesas_mes,
    saldo_mes: saldoMes,
    despesas_por_categoria: despesasPorCategoria,
    totais_por_mes: totaisPorMes,
  });
}

module.exports = { listar, buscar, salvar, editar, deletar, resumo };
