import axios from 'axios';
import { KeycloakService } from './keycloak';

const API_BASE_URL = `${process.env.VUE_APP_API_TRANSACCIONES}/ventas`;

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

const obtenerVentasPorCuadreCaja = async (idCuadreCaja) => {
  return apiClient.get(`/cuadre-caja/${idCuadreCaja}`).then(r => r.data);
};

export const obtenerVentasPorCuadreCajaFachada = async (idCuadreCaja) => {
  return await obtenerVentasPorCuadreCaja(idCuadreCaja);
};

const obtenerVentaPorNumeroReferenciaYNegocio = async (numeroReferencia, idNegocio) => {
  return apiClient.get(`/detalle/${numeroReferencia}`, {
    params: {
      idNegocio
    }
  }).then(r => r.data);
};

export const obtenerVentaPorNumeroReferenciaYNegocioFachada = async (numeroReferencia, idNegocio) => {
  return await obtenerVentaPorNumeroReferenciaYNegocio(numeroReferencia, idNegocio);
};

const buscarVentas = async (numeroReferencia, fechaInicio, fechaFin, username, idNegocio) => {
  return apiClient.get('/buscar', {
    params: {
      numeroReferencia,
      fechaInicio,
      fechaFin,
      username,
      idNegocio
    }
  }).then(r => r.data);
};

export const buscarVentasFachada = async (numeroReferencia, fechaInicio, fechaFin, username, idNegocio) => {
  return await buscarVentas(numeroReferencia, fechaInicio, fechaFin, username, idNegocio);
};



const obtenerProductosMasVendidos = async (fechaInicio, fechaFin, idNegocio, limite) => {
  return apiClient.get('/mas-vendidos', {
    params: {
      fechaInicio,
      fechaFin,
      idNegocio,
      limite
    }
  }).then(r => r.data);
};

export const obtenerProductosMasVendidosFachada = async (fechaInicio, fechaFin, idNegocio, limite = 10) => {
  return await obtenerProductosMasVendidos(fechaInicio, fechaFin, idNegocio, limite);
};

