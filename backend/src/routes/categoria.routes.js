const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  listar,
  buscar,
  salvar,
  editar,
  deletar,
} = require('../controllers/categoriaController');

const router = express.Router();

router.use(authMiddleware);

router.get('/listar', listar);
router.get('/buscar/:id', buscar);
router.post('/salvar', salvar);
router.put('/editar/:id', editar);
router.delete('/deletar/:id', deletar);

module.exports = router;
