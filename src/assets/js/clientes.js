import axios from 'axios';
import { KeycloakService } from './keycloak';

const API_BASE_URL = 'http://localhost:9090/clientes';

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
export const crearClienteFachada = async (clienteDTO) => {
  return await crearCliente(clienteDTO);
};


export const obtenerClientesActivosPorNegocioFachada = async (idNegocio) => {
  return await obtenerClientesActivosPorNegocio(idNegocio);
};

export const desactivarClienteFachada = async (idCliente) => {
  return await desactivarCliente(idCliente);
};

export const actualizarClienteFachada = async (identificacion, clienteDTO) => {
  return await actualizarCliente(identificacion, clienteDTO);
};


export const obtenerClientePorIdentificacionFachada = async (identificacion, idNegocio) => {
  return await obtenerClientePorIdentificacion(identificacion, idNegocio);
};

export const buscarClientesPorNombreFachada = async (nombre, idNegocio) => {
  return await buscarClientesPorNombre(nombre, idNegocio);
};

// Llamadas a la API
const crearCliente = async (clienteDTO) => {
  return apiClient.post('/', clienteDTO).then(r => r.data);
};

const obtenerClientesActivosPorNegocio = async (idNegocio) => {
  return apiClient.get(`/?idNegocio=${idNegocio}`).then(r => r.data);
};

const desactivarCliente = async (idCliente) => {
  return apiClient.patch(`/${idCliente}`).then(r => r.data);
};

const actualizarCliente = async (identificacion, clienteDTO) => {
  return apiClient.put(`/${identificacion}`, clienteDTO).then(r => r.data);
};

const obtenerClientePorIdentificacion = async (identificacion, idNegocio) => {
  return apiClient.get(`/${identificacion}?idNegocio=${idNegocio}`).then(r => r.data);
};

const buscarClientesPorNombre = async (nombre, idNegocio) => {
  return apiClient.get(`/buscar-por-nombre/${nombre}?idNegocio=${idNegocio}`).then(r => r.data);
};
