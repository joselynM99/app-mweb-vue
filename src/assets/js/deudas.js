import axios from 'axios';
import { KeycloakService } from './keycloak';

const API_URL = `${process.env.VUE_APP_API_TRANSACCIONES}/deudas`;


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
const generarDeuda = async (deuda) => {
  return apiClient.post('/', deuda).then(r => r.data);
};

const listaDeudas = async (idNegocio) => {
  return apiClient.get(`/?idNegocio=${idNegocio}`).then(r => r.data);
};

const obtenerDeuda = async (id) => {
  return apiClient.get(`/${id}`).then(r => r.data);
};

const obtenerDeudaPorNumeroReferencia = async (numeroReferencia, idNegocio) => {
  return apiClient.get(`/numero-referencia/${numeroReferencia}`, {
    params: { idNegocio }
  }).then(r => r.data);
};

const registrarAbono = async (abono) => {
  return apiClient.post('/abonos', abono).then(r => r.data);
};

// Métodos fachada
export const generarDeudaFachada = async (deuda) => {
  return await generarDeuda(deuda);
};

export const listaDeudasFachada = async (idNegocio) => {
  return await listaDeudas(idNegocio);
};

export const obtenerDeudaFachada = async (id) => {
  return await obtenerDeuda(id);
};

export const obtenerDeudaPorNumeroReferenciaFachada = async (numeroReferencia, idNegocio) => {
  return await obtenerDeudaPorNumeroReferencia(numeroReferencia, idNegocio);
};

export const registrarAbonoFachada = async (abono) => {
  return await registrarAbono(abono);
};