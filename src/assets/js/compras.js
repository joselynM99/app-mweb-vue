import axios from 'axios';
import { KeycloakService } from './keycloak';

const API_URL = 'http://localhost:9090/compras';

const apiClient = axios.create({
  baseURL: API_URL,
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

// Llamadas a la API
const registrarCompras = async (compra) => {
  return apiClient.post('/', compra).then(r => r.data);
};

const obtenerComprasPorCuadreCaja = async (idCuadreCaja) => {
  return apiClient.get(`/cuadre-caja/${idCuadreCaja}`).then(r => r.data);
};

const obtenerCompraPorNumeroReferenciaYNegocio = async (numeroReferencia, idNegocio) => {
  return apiClient.get(`/detalle/${numeroReferencia}`, {
    params: { idNegocio }
  }).then(r => r.data);
};

const buscarCompras = async (numeroReferencia, fechaInicio, fechaFin, username, idNegocio) => {
  return apiClient.get('/buscar', {
    params: { numeroReferencia, fechaInicio, fechaFin, username, idNegocio }
  }).then(r => r.data);
};

// Métodos fachada
export const registrarComprasFachada = async (compra) => {
  return await registrarCompras(compra);
};

export const obtenerComprasPorCuadreCajaFachada = async (idCuadreCaja) => {
  return await obtenerComprasPorCuadreCaja(idCuadreCaja);
};

export const obtenerCompraPorNumeroReferenciaYNegocioFachada = async (numeroReferencia, idNegocio) => {
  return await obtenerCompraPorNumeroReferenciaYNegocio(numeroReferencia, idNegocio);
};

export const buscarComprasFachada = async (numeroReferencia, fechaInicio, fechaFin, username, idNegocio) => {
  return await buscarCompras(numeroReferencia, fechaInicio, fechaFin, username, idNegocio);
};