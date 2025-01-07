import axios from 'axios';
import { KeycloakService } from './keycloak';

const API_BASE_URL = 'http://localhost:9090/ventas';

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
const registrarVentas = async (ventaRequestDTO) => {
  return apiClient.post('/', ventaRequestDTO).then(r => r.data);
};

export const registrarVentasFachada = async (ventaRequestDTO) => {
  return await registrarVentas(ventaRequestDTO);
};