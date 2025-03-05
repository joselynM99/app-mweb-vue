import axios from 'axios';
import { KeycloakService } from './keycloak';

const API_BASE_URL = 'http://localhost:9091/gestion-cajas';

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
export const crearCajaFachada = async (cajaDTO) => {
  return await crearCaja(cajaDTO);
};

export const obtenerCajasActivasPorNegocioFachada = async (idNegocio) => {
  return await obtenerCajasActivasPorNegocio(idNegocio);
};

export const desactivarCajaFachada = async (idCaja) => {
  return await desactivarCaja(idCaja);
};

export const actualizarCajaFachada = async (cajaDTO) => {
  return await actualizarCaja(cajaDTO);
};

export const buscarCuadreCajaActivoPorUsuarioFachada = async (usuario, idNegocio) => {
  return await buscarCuadreCajaActivoPorUsuario(usuario, idNegocio);
};

export const abrirCajaFachada = async (cuadreCajaDTO) => {
  return await abrirCaja(cuadreCajaDTO);
};

export const registrarAdicionalFachada = async (adicionalesDTO) => {
  return await registrarAdicional(adicionalesDTO);
};

export const obtenerAdicionalesActivosPorCuadreCajaFachada = async (idCuadreCaja) => {
  return await obtenerAdicionalesActivosPorCuadreCaja(idCuadreCaja);
};

export const desactivarAdicionalFachada = async (idAdicional) => {
  return await desactivarAdicional(idAdicional);
};

export const buscarCuadreCajaFachada = async (usuario, fechaInicio, fechaFin, estado, idNegocio) => {
  return await buscarCuadreCaja(usuario, fechaInicio, fechaFin, estado, idNegocio);
};

export const cerrarCajaFachada = async (cuadreCajaDTO) => {
  return await cerrarCaja(cuadreCajaDTO);
};

// Llamadas a la API
const crearCaja = async (cajaDTO) => {
  return apiClient.post('/caja', cajaDTO).then(r => r.data);
};

const obtenerCajasActivasPorNegocio = async (idNegocio) => {
  return apiClient.get(`/cajas-activas/${idNegocio}`).then(r => r.data);
};

const desactivarCaja = async (idCaja) => {
  return apiClient.patch(`/caja/desactivar/${idCaja}`).then(r => r.data);
};

const actualizarCaja = async (cajaDTO) => {
  return apiClient.put('/caja', cajaDTO).then(r => r.data);
};

const buscarCuadreCajaActivoPorUsuario = async (usuario, idNegocio) => {
  return apiClient.get(`/activo-usuario`, {
    params: {
      usuario,
      idNegocio
    }
  }).then(r => r.data);
};

const abrirCaja = async (cuadreCajaDTO) => {
  return apiClient.post('/abrir', cuadreCajaDTO).then(r => r.data);
};

const registrarAdicional = async (adicionalesDTO) => {
  return apiClient.post('/adicional', adicionalesDTO).then(r => r.data);
};

const obtenerAdicionalesActivosPorCuadreCaja = async (idCuadreCaja) => {
  return apiClient.get(`/adicionales-activos/${idCuadreCaja}`).then(r => r.data);
};

const desactivarAdicional = async (idAdicional) => {
  return apiClient.patch(`/adicional/desactivar/${idAdicional}`).then(r => r.data);
};

const buscarCuadreCaja = async (usuario, fechaInicio, fechaFin, estado, idNegocio) => {
  return apiClient.get(`/buscar`, {
    params: {
      usuario,
      fechaInicio,
      fechaFin,
      estado,
      idNegocio
    }
  }).then(r => r.data);
};

const cerrarCaja = async (cuadreCajaDTO) => {
  return apiClient.put('/cerrar', cuadreCajaDTO).then(r => r.data);
};