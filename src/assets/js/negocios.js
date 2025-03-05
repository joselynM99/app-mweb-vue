import axios from 'axios';
import { KeycloakService } from './keycloak';

const API_BASE_URL = 'http://localhost:9092/negocios';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(config => {
  const token = KeycloakService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Métodos fachada
export const actualizarNegocioFachada = async (id, negocioDTO) => {
  return await actualizarNegocio(id, negocioDTO);
};

export const obtenerNegocioPorIdFachada = async (id) => {
  return await obtenerNegocioPorId(id);
};

export const listarRolesFachada = async () => {
  return await listarRoles();
};

export const registrarUsuarioFachada = async (usuarioDTO) => {
  return await registrarUsuario(usuarioDTO);
};

export const actualizarUsuarioFachada = async (keycloakId, usuarioDTO) => {
  return await actualizarUsuario(keycloakId, usuarioDTO);
};

export const listarUsuariosPorNegocioFachada = async (negocioId) => {
  return await listarUsuariosPorNegocio(negocioId);
};

export const buscarUsuarioPorNombreUsuarioNegocioFachada = async (username, idNegocio) => {
  return await buscarUsuarioPorNombreUsuarioNegocio(username, idNegocio);
};

export const buscarUsuarioPorNombreUsuarioFachada = async (username) => {
  return await buscarUsuarioPorNombreUsuario(username);
};

export const eliminarUsuarioFachada = async (id, idNegocio) => {
  return await eliminarUsuario(id, idNegocio);
};

export const registrarNegocioFachada = async (negocioDTO) => {
  return await registrarNegocio(negocioDTO);
};

export const buscarPorNombreComercialORazonSocialFachada = async (query) => {
  return await buscarPorNombreComercialORazonSocial(query);
};

export const buscarPorRucFachada = async (ruc) => {
  return await buscarPorRuc(ruc);
};

export const listaNegociosFachada = async () => {
  return await listaNegocios();
};

export const desactivarNegocioFachada = async (id) => {
  return await desactivarNegocio(id);
};

export const activarNegocioFachada = async (id) => {
  return await activarNegocio(id);
};

// Llamadas a la API
const actualizarNegocio = async (id, negocioDTO) => {
  return apiClient.put(`/${id}`, negocioDTO).then(r => r.data);
};

const obtenerNegocioPorId = async (id) => {
  return apiClient.get(`/${id}`).then(r => r.data);
};

const listarRoles = async () => {
  return apiClient.get('/roles').then(r => r.data);
};

const registrarUsuario = async (usuarioDTO) => {
  return apiClient.post('/usuarios', usuarioDTO).then(r => r.data);
};

const actualizarUsuario = async (keycloakId, usuarioDTO) => {
  return apiClient.put(`/usuarios/${keycloakId}`, usuarioDTO).then(r => r.data);
};

const listarUsuariosPorNegocio = async (negocioId) => {
  return apiClient.get(`/${negocioId}/usuarios`).then(r => r.data);
};

const buscarUsuarioPorNombreUsuarioNegocio = async (username, idNegocio) => {
  return apiClient.get(`/usuarios/buscarPorNegocio`, { params: { username, idNegocio } }).then(r => r.data);
};

const buscarUsuarioPorNombreUsuario = async (username) => {
  return apiClient.get(`/usuarios/buscar`, { params: { username } }).then(r => r.data);
};

const eliminarUsuario = async (id, idNegocio) => {
  return apiClient.delete(`/usuarios/${id}`, { params: { idNegocio } }).then(r => r.data);
};

const registrarNegocio = async (negocioDTO) => {
  return apiClient.post('/', negocioDTO).then(r => r.data);
};

const buscarPorNombreComercialORazonSocial = async (query) => {
  return apiClient.get('/buscar', { params: { query } }).then(r => r.data);
};

const buscarPorRuc = async (ruc) => {
  return apiClient.get('/buscarPorRuc', { params: { ruc } }).then(r => r.data);
};

const listaNegocios = async () => {
  return apiClient.get('/').then(r => r.data);
};

const desactivarNegocio = async (id) => {
  return apiClient.patch(`/${id}`).then(r => r.data);
};

const activarNegocio = async (id) => {
  return apiClient.patch(`/activar/${id}`).then(r => r.data);
};