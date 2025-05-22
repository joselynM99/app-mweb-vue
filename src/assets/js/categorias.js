import axios from 'axios';
import { KeycloakService } from './keycloak';


const API_BASE_URL = `${process.env.VUE_APP_API_INVENTARIO}/inventario/categorias`;


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  responseType: 'json',
  responseEncoding: 'utf8'
});

apiClient.interceptors.request.use(config => {
  const token = KeycloakService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Métodos fachada
export const registrarCategoriaFachada = async (categoriaDTO) => {
  return await registrarCategoria(categoriaDTO);
};

export const actualizarCategoriaFachada = async (id, categoriaDTO) => {
  return await actualizarCategoria(id, categoriaDTO);
};

export const obtenerCategoriaIdFachada = async (id) => {
  return await obtenerCategoriaId(id);
};

export const listaCategoriasFachada = async (idNegocio) => {
  return await listaCategorias(idNegocio);
};

export const listaCategoriasPorNombreFachada = async (nombre, idNegocio) => {
  return await listaCategoriasPorNombre(nombre, idNegocio);
};

export const desactivarCategoriaFachada = async (id) => {
  return await desactivarCategoria(id);
};

// Llamadas a la API
const registrarCategoria = async (categoriaDTO) => {
  return apiClient.post('/', categoriaDTO).then(r => r.data);
};

const actualizarCategoria = async (id, categoriaDTO) => {
  return apiClient.put(`/${id}`, categoriaDTO).then(r => r.data);
};

const obtenerCategoriaId = async (id) => {
  return apiClient.get(`/${id}`).then(r => r.data);
};

const listaCategorias = async (idNegocio) => {
  return apiClient.get(`/?idNegocio=${idNegocio}`).then(r => r.data);
};

const listaCategoriasPorNombre = async (nombre, idNegocio) => {
  return apiClient.get(`/buscar-por-nombre/${nombre}?idNegocio=${idNegocio}`).then(r => r.data);
};

const desactivarCategoria = async (id) => {
  return apiClient.patch(`/${id}`).then(r => r.data);
};
