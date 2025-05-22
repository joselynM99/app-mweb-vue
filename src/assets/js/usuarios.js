import axios from 'axios';
import { KeycloakService } from './keycloak';

const API_BASE_URL = `${process.env.VUE_APP_API_NEGOCIOS}/negocios`;


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


//Métodos fachada
export const buscarUsuarioPorNombreUsuarioFachada = async (username) => {
  return await buscarUsuarioPorNombreUsuario(username);
};

export const buscarUsuarioPorNombreUsuarioNegocioFachada = async (username, idNegocio) => {
  return await buscarUsuarioPorNombreUsuarioNegocio(username, idNegocio);
};


export const crearUsuarioFachada = async (usuarioDTO) => {
  return await crearUsuario(usuarioDTO);
};

export const listarUsuariosPorNegocioFachada = async (negocioId) => {
  return await listarUsuariosPorNegocio(negocioId);
};


export const eliminarUsuarioFachada = async (usuarioId, idNegocio) => {
  return await eliminarUsuario(usuarioId, idNegocio);
};

export const listarRolesFachada = async () => {
  return await listarRoles();
};

export const actualizarUsuarioFachada = async (userId, usuarioDTO) => {
  return await actualizarUsuario(userId, usuarioDTO);
};

//Llamadas a la API

const buscarUsuarioPorNombreUsuario = async (username) => {
  return apiClient.get('/usuarios/buscar', {
    params: { username }
  }).then(r => r.data);
};

const buscarUsuarioPorNombreUsuarioNegocio = async (username, idNegocio) => {
  return apiClient.get('/usuarios/buscarPorNegocio', {
    params: { username, idNegocio }
  }).then(r => r.data);
};

const crearUsuario = async (usuarioDTO) => {
  return apiClient.post('/usuarios', usuarioDTO).then(r => r.data);
};

const listarUsuariosPorNegocio = async (negocioId) => {
  return apiClient.get(`/${negocioId}/usuarios`).then(r => r.data);
};

const eliminarUsuario = async (usuarioId, idNegocio) => {
  return apiClient.delete(`/usuarios/${usuarioId}`, {
    params: { idNegocio }
  }).then(r => r.data);

};
const listarRoles = async () => {
  return apiClient.get('/roles').then(r => r.data);
};

const actualizarUsuario = async (userId, usuarioDTO) => {
  return apiClient.put(`/usuarios/${userId}`, usuarioDTO).then(r => r.data);
};
