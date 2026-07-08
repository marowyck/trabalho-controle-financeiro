import api from './axios';

export const categoriaApi = {
  listar: () => api.get('/categorias/listar'),
  buscar: (id) => api.get(`/categorias/buscar/${id}`),
  salvar: (data) => api.post('/categorias/salvar', data),
  editar: (id, data) => api.put(`/categorias/editar/${id}`, data),
  deletar: (id) => api.delete(`/categorias/deletar/${id}`),
};
