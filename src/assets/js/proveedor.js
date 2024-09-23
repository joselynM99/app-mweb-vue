import axios from 'axios';
import { KeycloakService } from './keycloak';

const API_BASE_URL = 'http://localhost:8080/inventario/proveedores';

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
export const registrarProveedorFachada = async (proveedorDTO) => {
  return await registrarProveedor(proveedorDTO);
};

export const actualizarProveedorFachada = async (identificacion, proveedorDTO) => {
  return await actualizarProveedor(identificacion, proveedorDTO);
};

export const obtenerProveedorIdentificacionFachada = async (identificacion, idNegocio) => {
  return await obtenerProveedorIdentificacion(identificacion, idNegocio);
};

export const listaProveedoresFachada = async (idNegocio) => {
  return await listaProveedores(idNegocio);
};

export const listaProveedoresPorNombreComercialFachada = async (nombreComercial, idNegocio) => {
  return await listaProveedoresPorNombreComercial(nombreComercial, idNegocio);
};

export const desactivarProveedorFachada = async (id) => {
  return await desactivarProveedor(id);
};

// Llamadas a la API
const registrarProveedor = async (proveedorDTO) => {
  return apiClient.post('/', proveedorDTO).then(r => r.data);
};

const actualizarProveedor = async (identificacion, proveedorDTO) => {
  return apiClient.put(`/${identificacion}`, proveedorDTO).then(r => r.data);
};

const obtenerProveedorIdentificacion = async (identificacion, idNegocio) => {
  return apiClient.get(`/${identificacion}?idNegocio=${idNegocio}`).then(r => r.data);
};

const listaProveedores = async (idNegocio) => {
  return apiClient.get(`/?idNegocio=${idNegocio}`).then(r => r.data);
};

const listaProveedoresPorNombreComercial = async (nombreComercial, idNegocio) => {
  return apiClient.get(`/buscar-por-nombre/${nombreComercial}?idNegocio=${idNegocio}`).then(r => r.data);
};

const desactivarProveedor = async (id) => {
  return apiClient.patch(`/${id}`).then(r => r.data);
};
