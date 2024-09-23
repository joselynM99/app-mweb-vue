import axios from 'axios';
import { KeycloakService } from './keycloak';

const API_BASE_URL = 'http://localhost:8080/inventario/impuestos';

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
export const registrarImpuestoFachada = async (impuestoDTO) => {
  return await registrarImpuesto(impuestoDTO);
};

export const actualizarImpuestoFachada = async (id, impuestoDTO) => {
  return await actualizarImpuesto(id, impuestoDTO);
};

export const obtenerImpuestoIdFachada = async (id) => {
  return await obtenerImpuestoId(id);
};

export const listaImpuestosFachada = async () => {
  return await listaImpuestos();
};

export const desactivarImpuestoFachada = async (id) => {
  return await desactivarImpuesto(id);
};

// Llamadas a la API
const registrarImpuesto = async (impuestoDTO) => {
  return apiClient.post('/', impuestoDTO).then(r => r.data);
};

const actualizarImpuesto = async (id, impuestoDTO) => {
  return apiClient.put(`/${id}`, impuestoDTO).then(r => r.data);
};

const obtenerImpuestoId = async (id) => {
  return apiClient.get(`/${id}`).then(r => r.data);
};

const listaImpuestos = async () => {
  return apiClient.get('/').then(r => r.data);
};

const desactivarImpuesto = async (id) => {
  return apiClient.patch(`/${id}/desactivar`).then(r => r.data);
};
