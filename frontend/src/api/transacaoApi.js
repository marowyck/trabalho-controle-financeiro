import api from './axios';

export const transacaoApi = {
  listar: (params) => api.get('/transacoes/listar', { params }),
  buscar: (id) => api.get(`/transacoes/buscar/${id}`),
  salvar: (data) => api.post('/transacoes/salvar', data),
  editar: (id, data) => api.put(`/transacoes/editar/${id}`, data),
  deletar: (id) => api.delete(`/transacoes/deletar/${id}`),
  resumo: () => api.get('/transacoes/resumo'),
};
