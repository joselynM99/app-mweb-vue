<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong style="margin-right:5px;">Productos</strong>
          <CSpinner v-if="isLoading" color="success" class="spinner-border-sm" />
          <CInputGroup class="float-end" style="width: 300px;">
            <CFormInput v-model="searchQuery" @input="buscarProductos" placeholder="Buscar por nombre" />
            <CInputGroupText style="padding:0px 5px">
              <button @click="buscarProductos" :disabled="isLoading"
                style="border: none; background: none; margin:0px; padding:5px">
                Buscar
                <CSpinner v-if="isLoading" color="light" class="spinner-border-sm" />
              </button>
            </CInputGroupText>
          </CInputGroup>
        </CCardHeader>
        <CCardBody>
          <CAlert v-if="error" color="danger" dismissible @close="error = null">
            {{ error }}
          </CAlert>
          <CAlert v-if="infoMessage" color="info" dismissible @close="infoMessage = null">
            {{ infoMessage }}
          </CAlert>
          <div class="table-responsive">
            <div class="scroll-indicator">
              <span class="arrow">←</span> Desliza para ver más <span class="arrow">→</span>
            </div>
            <CTable v-if="productos.length > 0" hover>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell scope="col" class="text-center">Acciones</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Cod. barras</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Descripción</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Costo</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Precio venta</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Stock</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="producto in productos" :key="producto.codigoBarras" :class="{ 'table-danger': producto.stockActual <= 0 }">
                  <CTableDataCell class="text-center">
                    <div class="action-buttons">
                      <CButton color="warning" size="sm" @click="actualizarProducto(producto.codigoBarras)">
                        <i class="fas fa-edit"></i>
                      </CButton>
                      <CButton color="danger" size="sm" @click="confirmarDesactivacion(producto)">
                        <i class="fas fa-trash-alt"></i>
                      </CButton>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ producto.codigoBarras }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ producto.nombre }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ producto.descripcion }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ producto.costoPromedio }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ producto.precioVenta }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ producto.stockActual }}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </div>
          <CAlert v-if="!productos.length && !error && !isLoading && !infoMessage" color="info">
            No se encontraron productos para el negocio especificado.
          </CAlert>
        </CCardBody>
      </CCard>
    </CCol>

    <!-- Modal de confirmación -->
    <CModal :visible="visibleConfirmacion" @close="visibleConfirmacion = false">
      <CModalHeader @close="visibleConfirmacion = false">
        <CModalTitle>Confirmar eliminación</CModalTitle>
      </CModalHeader>
      <CModalBody>¿Estás seguro de que deseas eliminar este producto?</CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="visibleConfirmacion = false">Cancelar</CButton>
        <CButton color="danger" @click="desactivarProductoConfirmado">
          Eliminar
          <CSpinner v-if="isDeleting" color="light" class="spinner-border-sm" />
        </CButton>
      </CModalFooter>
    </CModal>
  </CRow>
</template>

<script>
import { debounce } from 'lodash';
import {
  listaProductosFachada,
  listaProductosPorNombreFachada,
  desactivarProductoFachada,
} from '@/assets/js/productos';

export default {
  data() {
    return {
      searchQuery: '',
      productos: [],
      isLoading: false,
      error: null,
      infoMessage: null,
      isDeleting: false,
      productoSeleccionado: null,
      visibleConfirmacion: false,
    };
  },
  methods: {
    async fetchProductos() {
      this.isLoading = true;
      this.error = null;
      this.infoMessage = null;
      try {
        const negocioId = JSON.parse(sessionStorage.getItem('usuario')).negocioId;
        this.productos = await listaProductosFachada(negocioId);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.infoMessage = 'No se encontraron productos';
        } else {
          this.error = 'Error al cargar productos. Inténtalo de nuevo más tarde.';
        }
      } finally {
        this.isLoading = false;
      }
    },
    async buscarProductos() {
      if (!this.searchQuery) {
        this.fetchProductos();
        return;
      }

      this.isLoading = true;
      this.error = null;
      this.infoMessage = null;
      try {
        const negocioId = JSON.parse(sessionStorage.getItem('usuario')).negocioId;
        this.productos = await listaProductosPorNombreFachada(this.searchQuery, negocioId);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.infoMessage = 'No se encontraron productos con el nombre especificado';
        } else {
          this.error = 'Error al buscar productos. Inténtalo de nuevo más tarde.';
        }
      } finally {
        this.isLoading = false;
      }
    },
    confirmarDesactivacion(producto) {
      this.productoSeleccionado = producto;
      this.visibleConfirmacion = true;
    },
    async desactivarProductoConfirmado() {
      this.isDeleting = true;
      try {
        await desactivarProductoFachada(this.productoSeleccionado.id);
        this.productos = this.productos.filter(producto => producto.codigoBarras !== this.productoSeleccionado.codigoBarras);
        this.visibleConfirmacion = false;
        this.productoSeleccionado = null;
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.error = 'No se encontró el producto';
        } else {
          this.error = 'Error al eliminar el producto. Inténtalo de nuevo más tarde.';
        }
        this.visibleConfirmacion = false;
      } finally {
        this.isDeleting = false;
      }
    },
    actualizarProducto(codigoBarras) {
      this.$router.push({ name: 'Actualizar Productos', query: { codigoBarras } });
    },
    debouncedBuscarProductos: debounce(function () {
      this.buscarProductos();
    }, 300),
  },
  watch: {
    searchQuery() {
      this.debouncedBuscarProductos();
    },
  },
  mounted() {
    this.fetchProductos();
  },
};
</script>

<style scoped>
.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;
}

.text-wrap {
  max-width: 150px;
  word-wrap: break-word;
  white-space: normal;
}

.action-buttons {
  display: flex;
  gap: 5px;
  justify-content: center;
}

.scroll-indicator {
  display: none;
}

.table-danger {
  background-color: #f8d7da;
}

@media (max-width: 768px) {
  .scroll-indicator {
    display: block;
    position: relative;
    background-color: rgba(0, 0, 0, 0.1);
    color: #666;
    padding: 5px 10px;
    font-size: 0.8rem;
    text-align: center;
    margin-bottom: 10px;
    border-radius: 5px;
  }

  .scroll-indicator .arrow {
    font-size: 1rem;
    margin: 0 5px;
  }

  .table-responsive::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
    height: 7px;
  }

  .table-responsive::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, .5);
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, .5);
  }

  CTableHeaderCell {
    font-size: 0.9rem;
  }
}
</style>
