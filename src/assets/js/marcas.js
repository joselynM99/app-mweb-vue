import axios from 'axios';
import { KeycloakService } from './keycloak';

const API_BASE_URL = 'http://localhost:8080/inventario/marcas';

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
export const registrarMarcaFachada = async (marcaDTO) => {
  return await registrarMarca(marcaDTO);
};

export const actualizarMarcaFachada = async (id, marcaDTO) => {
  return await actualizarMarca(id, marcaDTO);
};

export const obtenerMarcaIdFachada = async (id) => {
  return await obtenerMarcaId(id);
};

export const listaMarcasFachada = async (idNegocio) => {
  return await listaMarcas(idNegocio);
};

export const listaMarcasPorNombreFachada = async (nombre, idNegocio) => {
  return await listaMarcasPorNombre(nombre, idNegocio);
};

export const desactivarMarcaFachada = async (id) => {
  return await desactivarMarca(id);
};

// Llamadas a la API
const registrarMarca = async (marcaDTO) => {
  return apiClient.post('/', marcaDTO).then(r => r.data);
};

const actualizarMarca = async (id, marcaDTO) => {
  return apiClient.put(`/${id}`, marcaDTO).then(r => r.data);
};

const obtenerMarcaId = async (id) => {
  return apiClient.get(`/${id}`).then(r => r.data);
};

const listaMarcas = async (idNegocio) => {
  return apiClient.get(`/?idNegocio=${idNegocio}`).then(r => r.data);
};

const listaMarcasPorNombre = async (nombre, idNegocio) => {
  return apiClient.get(`/buscar-por-nombre/${nombre}?idNegocio=${idNegocio}`).then(r => r.data);
};

const desactivarMarca = async (id) => {
  return apiClient.patch(`/${id}`).then(r => r.data);
};
