import axios from 'axios';
import { KeycloakService } from './keycloak';

const API_BASE_URL = 'http://localhost:8080/inventario/subproductos';

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
export const registrarSubproductoFachada = async (subproductoDTO) => {
  return await registrarSubproducto(subproductoDTO);
};

export const actualizarSubproductoFachada = async (codigoBarras, subproductoDTO) => {
  return await actualizarSubproducto(codigoBarras, subproductoDTO);
};

export const obtenerSubproductoCodigoBarrasFachada = async (codigoBarras, idNegocio) => {
  return await obtenerSubproductoCodigoBarras(codigoBarras, idNegocio);
};

export const listaSubproductosFachada = async (idNegocio) => {
  return await listaSubproductos(idNegocio);
};

export const listaSubproductosPorNombreFachada = async (nombre, idNegocio) => {
  return await listaSubproductosPorNombre(nombre, idNegocio);
};

export const desactivarSubproductoFachada = async (id) => {
  return await desactivarSubproducto(id);
};

// Llamadas a la API
const registrarSubproducto = async (subproductoDTO) => {
  return apiClient.post('/', subproductoDTO).then(r => r.data);
};

const actualizarSubproducto = async (codigoBarras, subproductoDTO) => {
  return apiClient.put(`/${codigoBarras}`, subproductoDTO).then(r => r.data);
};

const obtenerSubproductoCodigoBarras = async (codigoBarras, idNegocio) => {
  return apiClient.get(`/${codigoBarras}?idNegocio=${idNegocio}`).then(r => r.data);
};

const listaSubproductos = async (idNegocio) => {
  return apiClient.get(`/?idNegocio=${idNegocio}`).then(r => r.data);
};

const listaSubproductosPorNombre = async (nombre, idNegocio) => {
  return apiClient.get(`/buscar-por-nombre/${nombre}?idNegocio=${idNegocio}`).then(r => r.data);
};

const desactivarSubproducto = async (id) => {
  return apiClient.patch(`/${id}`).then(r => r.data);
};
