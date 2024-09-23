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

// Llamadas a la API
const actualizarNegocio = async (id, negocioDTO) => {
  return apiClient.put(`/${id}`, negocioDTO).then(r => r.data);
};

const obtenerNegocioPorId = async (id) => {
  return apiClient.get(`/${id}`).then(r => r.data);
};
