import axios from 'axios';
import { KeycloakService } from './keycloak';

const API_BASE_URL = 'http://localhost:8080/inventario/productos';

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
export const registrarProductoFachada = async (productoDTO) => {
  return await registrarProducto(productoDTO);
};

export const actualizarProductoFachada = async (codigoBarras, productoDTO) => {
  return await actualizarProducto(codigoBarras, productoDTO);
};

export const obtenerProductoCodigoBarrasFachada = async (codigoBarras, idNegocio) => {
  return await obtenerProductoCodigoBarras(codigoBarras, idNegocio);
};

export const listaProductosFachada = async (idNegocio) => {
  return await listaProductos(idNegocio);
};

export const listaProductosPorNombreFachada = async (nombre, idNegocio) => {
  return await listaProductosPorNombre(nombre, idNegocio);
};

export const desactivarProductoFachada = async (id) => {
  return await desactivarProducto(id);
};

export const listaProductosPorProveedorFachada = async (idNegocio, proveedorId) => {
  return await listaProductosPorProveedor(idNegocio, proveedorId);
};

// Llamadas a la API
const registrarProducto = async (productoDTO) => {
  return apiClient.post('/', productoDTO).then(r => r.data);
};

const actualizarProducto = async (codigoBarras, productoDTO) => {
  return apiClient.put(`/${codigoBarras}`, productoDTO).then(r => r.data);
};

const obtenerProductoCodigoBarras = async (codigoBarras, idNegocio) => {
  return apiClient.get(`/${codigoBarras}?idNegocio=${idNegocio}`).then(r => r.data);
};

const listaProductos = async (idNegocio) => {
  return apiClient.get(`/?idNegocio=${idNegocio}`).then(r => r.data);
};

const listaProductosPorNombre = async (nombre, idNegocio) => {
  return apiClient.get(`/buscar-por-nombre/${nombre}?idNegocio=${idNegocio}`).then(r => r.data);
};

const desactivarProducto = async (id) => {
  return apiClient.patch(`/${id}`).then(r => r.data);
};

const listaProductosPorProveedor = async (idNegocio, proveedorId) => {
  return apiClient.get(`/proveedor/${proveedorId}?idNegocio=${idNegocio}`).then(r => r.data);
};