<template>
  <div class="bwrapper align-items-center">
    <div class="ventas-container">
      <AppBreadcrumb />
    </div>

    <CContainer fluid>
      <CRow>
        <CCol md="6" class="mt-2">
          <CCard class="mb-2 custom-card">
            <CCardBody>

              <div class="alerts-container">
                <CSpinner v-if="isLoading" color="success" />
                <CAlert v-if="error" color="danger" dismissible @close="error = null">
                  {{ error }}
                </CAlert>
                <CAlert v-if="infoMessage" color="info" dismissible @close="infoMessage = null">
                  {{ infoMessage }}
                </CAlert>
              </div>
              <CInputGroup class="mt-1 mb-2" style="width: 100%;">
                <CFormInput v-model="textoBusqueda"
                  :placeholder="modoBusqueda === 'nombre' ? 'Buscar por nombre' : 'Buscar por código'"
                  @keyup.enter="agregarPorCodigo" />
                <CButton
                  :class="{ 'active-button': modoBusqueda === 'codigo', 'inactive-button': modoBusqueda !== 'codigo' }"
                  @click="cambiarModoBusqueda('codigo')" :disabled="isLoading">
                  Código
                </CButton>
                <CButton
                  :class="{ 'active-button': modoBusqueda === 'nombre', 'inactive-button': modoBusqueda !== 'nombre' }"
                  @click="cambiarModoBusqueda('nombre')" :disabled="isLoading">
                  Nombre
                </CButton>
              </CInputGroup>
              <div class="table-responsive table-scroll">
                <CTable hover class="table table-striped table-bordered">
                  <CTableHead color="light">
                    <CTableRow>
                      <CTableHeaderCell scope="col">Código</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Precio</CTableHeaderCell>
                      <CTableHeaderCell scope="col"></CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow v-for="item in itemsFiltrados" :key="item.codigoBarras">
                      <CTableDataCell>{{ item.codigoBarras }}</CTableDataCell>
                      <CTableDataCell>{{ item.nombre }}</CTableDataCell>
                      <CTableDataCell>{{ item.precioVenta }}</CTableDataCell>
                      <CTableDataCell class="text-center">
                        <CButton color="success" @click="agregarItem(item)" class="small-button">
                          <i class="fas fa-cart-plus small-icon"></i>
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </div>
              <CAlert v-if="itemsFiltrados.length === 0 && !error && !isLoading && !infoMessage" color="info">
                No se encontraron productos o subproductos.
              </CAlert>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md="6" class="mt-2">
          <CCard class="mb-2 custom-card table2">
            <CCardBody class="d-flex flex-column">

              <div v-if="isMobile" class="totals-mobile">
                <CTable class="totals-table">
                  <CTableRow>
                    <CTableDataCell class="label" style="font-weight: bold;">Total:</CTableDataCell>
                    <CTableDataCell class="value total">{{ totalSubtotal }}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell class="label">Total de productos:</CTableDataCell>
                    <CTableDataCell class="value quantity">{{ totalCantidad }}</CTableDataCell>
                  </CTableRow>
                </CTable>
              </div>
              <h6>Productos Seleccionados</h6>
              <div class="table-responsive table-scroll2">
                <CTable hover class="table table-striped table-bordered">
                  <CTableHead color="light">
                    <CTableRow>
                      <CTableHeaderCell scope="col"></CTableHeaderCell>
                      <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Cantidad</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Precio</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Subtotal</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Código</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow v-for="item in itemsSeleccionados" :key="item.codigoBarras">
                      <CTableDataCell class="text-center">
                        <CButton color="danger" @click="eliminarItem(item)" class="small-button">
                          <i class="fas fa-trash small-icon"></i>
                        </CButton>
                      </CTableDataCell>
                      <CTableDataCell>{{ item.nombre }}</CTableDataCell>
                      <CTableDataCell style="padding: 0.35px; padding-top: 0.35rem;">
                        <CFormInput type="number" v-model.number="item.cantidad" @keyup="actualizarSubtotal(item)"
                          @input="actualizarSubtotal(item)" min="1"
                          style="max-width: 70px; margin: 0px auto; font-size: 0.7rem; " />
                      </CTableDataCell>
                      <CTableDataCell>{{ item.precioVenta }}</CTableDataCell>
                      <CTableDataCell>{{ item.subtotal }}</CTableDataCell>

                      <CTableDataCell>{{ item.codigoBarras }}</CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </div>
              <div v-if="!isMobile" class="totals-desktop">
                <CTable class="totals-table">
                  <CTableRow>
                    <CTableDataCell class="label" style="font-weight: bold;">Total:</CTableDataCell>
                    <CTableDataCell class="value total">{{ totalSubtotal }}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell class="label">Total de productos:</CTableDataCell>
                    <CTableDataCell class="value quantity">{{ totalCantidad }}</CTableDataCell>
                  </CTableRow>
                </CTable>
              </div>
              <div class="action-buttons">
                <CButton color="danger" @click="limpiarCarrito">
                  <i class="fas fa-trash large-icon"></i> <span class="d-none d-md-inline">Limpiar Carrito</span>
                </CButton>
                <CButton color="primary" @click="completarVenta">
                  <i class="fas fa-check large-icon"></i> <span class="d-none d-md-inline">Terminar Venta</span>
                </CButton>
                <CButton color="warning" @click="goAdicionales">
                  <i class="fas fa-money-bill-wave large-icon"></i> <span class="d-none d-md-inline">Adicionales</span>
                </CButton>
                <CButton color="secondary" @click="goCerrarCaja">
                  <i class="fas fa-cash-register large-icon"></i> <span class="d-none d-md-inline">Cerrar Caja</span>
                </CButton>

                <CButton color="info" @click="goBack">
                  <i class="fas fa-arrow-left large-icon"></i> <span class="d-none d-md-inline">Volver</span>
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
  <div class="mobile-action-menu" v-if="isMobile">
    <CButton color="light" @click="limpiarCarrito">
      <i class="fas fa-trash large-icon"></i>
    </CButton>
    <CButton color="light" @click="completarVenta">
      <i class="fas fa-check large-icon"></i>
    </CButton>
    <CButton color="light" @click="goAdicionales">
      <i class="fas fa-money-bill-wave large-icon"></i>
    </CButton>
    <CButton color="light" @click="goCerrarCaja">
      <i class="fas fa-cash-register large-icon"></i>
    </CButton>
    <CButton color="light" @click="goBack">
      <i class="fas fa-arrow-left large-icon"></i>
    </CButton>
  </div>
</template>

<script>
import {
  listaProductosFachada,
} from '@/assets/js/productos';

import {
  listaSubproductosFachada,
} from '@/assets/js/subproductos';
import AppBreadcrumb from '@/components/AppBreadcrumb.vue'

import { buscarCuadreCajaActivoPorUsuarioFachada } from '@/assets/js/gestion-cajas';

export default {
  components: {
    AppBreadcrumb
  },
  data() {
    return {
      usuario: null,
      idNegocio: null,
      productos: [],
      subproductos: [],
      textoBusqueda: '',
      isLoading: false,
      modoBusqueda: 'codigo',
      error: null,
      infoMessage: null,
      itemsSeleccionados: [],
      isMobile: window.innerWidth <= 768
    };
  },
  computed: {
    itemsFiltrados() {
      const query = this.textoBusqueda.toLowerCase();
      return [...this.productos, ...this.subproductos].filter(item => {
        if (this.modoBusqueda === 'nombre') {
          return item.nombre.toLowerCase().includes(query);
        } else if (this.modoBusqueda === 'codigo') {
          return item.codigoBarras.toLowerCase().includes(query);
        }
        return true;
      });
    },
    totalCantidad() {
      return this.itemsSeleccionados.reduce((total, item) => total + item.cantidad, 0);
    },
    totalSubtotal() {
      return this.itemsSeleccionados.reduce((total, item) => total + parseFloat(item.subtotal), 0).toFixed(2);
    }
  },
  async mounted() {
    this.idNegocio = JSON.parse(sessionStorage.getItem('usuario')).negocioId || JSON.parse(sessionStorage.getItem('negocioId'));
    this.usuario = JSON.parse(sessionStorage.getItem('usuario')).nombreUsuario;

    // Si es móvil, captura globalmente el error para evitar que se muestre
    if (this.isMobile) {
      window.addEventListener('error', this.handleGlobalErrors);
    }

    try {
      const resultado = await buscarCuadreCajaActivoPorUsuarioFachada(this.usuario, this.idNegocio);
      if (!resultado) {
        this.$router.push({ name: 'Abrir Caja' });
      } else {
        this.fetchItems();
      }
    } catch (error) {
      console.error('Error al verificar cuadre de caja activo:', error);
      this.error = 'Error al verificar cuadre de caja activo. Inténtalo de nuevo más tarde.';
    }

    this.debouncedResize = this.debounce(this.handleResize, 250);
    window.addEventListener('resize', this.debouncedResize);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.debouncedResize);
    if (this.isMobile) {
      window.removeEventListener('error', this.handleGlobalErrors);
    }
    window.removeEventListener('keydown', this.handleKeydown);
  },


  methods: {

    handleGlobalErrors(e) {
      if (e.message && e.message.includes("ResizeObserver loop completed with undelivered notifications")) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    },
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    completarVenta() {
      if (this.itemsSeleccionados.length === 0) {
        this.error = 'No hay productos seleccionados para la venta.';
        return;
      }
      const datosVenta = {
        itemsSeleccionados: this.itemsSeleccionados,
        totalSubtotal: this.totalSubtotal,
        totalCantidad: this.totalCantidad
      };

      sessionStorage.setItem('datosVenta', JSON.stringify(datosVenta));

      this.$router.push({ name: 'CompletarVenta' });
    },


    goBack() {
      this.$router.push({ name: 'Transacciones' });
    },

    goAdicionales() {
      this.$router.push({ name: 'Adicionales' });
    },

    goCerrarCaja() {
      this.$router.push({ name: 'Cerrar Caja' });
    },
    cambiarModoBusqueda(mode) {
      this.modoBusqueda = mode;
      this.textoBusqueda = '';
    },
    async fetchItems() {
      this.isLoading = true;
      this.error = null;
      this.infoMessage = null;

      try {
        const productos = await listaProductosFachada(this.idNegocio);
        this.productos = productos || [];
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.productos = [];
        } else {
          this.error = 'Error al cargar productos. Inténtalo de nuevo más tarde.';
        }
      }

      try {
        const subproductos = await listaSubproductosFachada(this.idNegocio);
        this.subproductos = subproductos || [];
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.subproductos = [];
        } else {
          this.error = 'Error al cargar subproductos. Inténtalo de nuevo más tarde.';
        }
      }

      if (this.productos.length === 0 && this.subproductos.length === 0) {
        this.infoMessage = 'No se encontraron productos o subproductos.';
      }

      this.isLoading = false;
    },

    handleResize() {
      const newIsMobile = window.innerWidth <= 768;
      if (this.isMobile !== newIsMobile) {
        this.isMobile = newIsMobile;
      }
    },
    agregarItem(item) {
      const existingItem = this.itemsSeleccionados.find(i => i.codigoBarras === item.codigoBarras);
      if (existingItem) {
        existingItem.cantidad += 1;
        existingItem.subtotal = (existingItem.cantidad * existingItem.precioVenta).toFixed(2);
      } else {
        const newItem = {
          cantidad: 1,
          codigoBarras: item.codigoBarras,
          nombre: item.nombre,
          precioVenta: item.precioVenta,
          subtotal: item.precioVenta.toFixed(2)
        };
        this.itemsSeleccionados.push(newItem);
      }
    },
    actualizarSubtotal(item) {
      item.subtotal = (item.cantidad * item.precioVenta).toFixed(2);
    },
    eliminarItem(item) {
      const index = this.itemsSeleccionados.indexOf(item);
      if (index > -1) {
        this.itemsSeleccionados.splice(index, 1);
      }
    },
    limpiarCarrito() {
      this.itemsSeleccionados = [];
    },
    agregarPorCodigo() {
      if (this.modoBusqueda === 'codigo') {
        const allItems = [...this.productos, ...this.subproductos];
        const item = allItems.find(p => p.codigoBarras === this.textoBusqueda);
        if (item) {
          this.agregarItem(item);
          this.textoBusqueda = '';
        } else {
          this.error = 'Producto no encontrado';
        }
      }
    }
  },



};
</script>

<style scoped>
.custom-card .card-body {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 96vh;
}

.alerts-container {
  flex-shrink: 0;
}

.table-scroll {
  flex: 1;
  min-height: 0;
  max-height: calc(70vh - 120px);
  overflow-y: auto;
}

.table-scroll2 {
  flex: 1;
  min-height: 0;
  max-height: calc(59vh - 120px);
  overflow-y: auto;
}

.d-flex.justify-content-center.mb-3 {
  flex-shrink: 0;
}

.mt-3.mb-4 {
  flex-shrink: 0;
}

.custom-card {
  background-color: transparent;
  border-color: #3b3b3b;
  height: 89vh;
}

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;
}

.table-scroll {
  max-height: 85vh;

}

.table-scroll2 {
  max-height: 59vh;
}


.table {
  width: 100%;
  table-layout: auto;
  border-collapse: collapse;
}

.table td {
  word-wrap: break-word;
  white-space: normal;
  text-align: center;
  word-break: break-word;
  overflow-wrap: break-word;
}

.table th {
  font-size: 0.85rem;
  text-align: center;
}

.table td {
  font-size: 0.8rem;
}

.text-wrap {
  max-width: 150px;
  word-wrap: break-word;
  white-space: normal;
}

.action-buttons {
  display: flex;
  gap: 7px;
  justify-content: flex-start;
  position: relative;
  margin-top: 0px;
}

.action-buttons .btn {
  min-width: 18%;
  align-items: center;
  justify-content: center;
  font-size: 1.0rem;
  gap: 5px;
}

.large-icon {
  font-size: 1.70rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 3px auto;
}

.active-button {
  background-color: #28a745 !important;
  border-color: #28a745 !important;
  color: rgb(255, 255, 255) !important;
  border-radius: 0 !important;
}

.active-button:first-child {
  border-top-left-radius: 5px !important;
  border-bottom-left-radius: 5px !important;
}

.active-button:last-child {
  border-top-right-radius: 5px !important;
  border-bottom-right-radius: 5px !important;
}

.inactive-button {
  background-color: rgba(255, 255, 255, 0) !important;
  border-color: #28a745 !important;
  color: #28a745 !important;
  border-radius: 0 !important;
}

.inactive-button:first-child {
  border-top-left-radius: 5px !important;
  border-bottom-left-radius: 5px !important;
}

.inactive-button:last-child {
  border-top-right-radius: 5px !important;
  border-bottom-right-radius: 5px !important;
}

.small-button {
  padding: 0.20rem 0.5rem;
  font-size: 0.75rem;
}

.small-icon {
  font-size: 0.75rem;
}

.small-input {
  width: 60px;
  padding: 0.25rem;
  font-size: 0.75rem;
}

.totals-desktop {
  display: flex;
  gap: 5px;
  justify-content: flex-end;
  position: relative;
  margin-top: auto;
}

.totals-table {
  width: auto;
  text-align: right;
  border: 1px solid #c0bbbb;
}

.totals-table .label {
  padding-right: 10px;
  font-size: 0.9rem;
  border: 1px solid #c0bbbb;
  text-align: right;
}

.totals-table .value {
  font-size: 1rem;
  padding-left: 10px;
  border: 1px solid #c0bbbb;
}

.totals-table .total {
  font-weight: bold;
  text-align: left;
  ;
}

.totals-table .quantity {
  font-size: 0.8rem;
  text-align: left;
}

@media (max-width: 768px) {
  .custom-card {
    height: auto !important;

  }

  .table2 {
    margin-bottom: 30px !important;
  }

  .custom-card .card-body {
    max-height: calc(100vh - 60px) !important;
  }

  .table-scroll {
    max-height: calc(50vh - 60px) !important;
  }

  .table-scroll2 {
    max-height: calc(50vh - 60px) !important;
  }

  .mobile-action-menu {
    display: flex;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #f8f9fa;
    border-top: 1px solid #dee2e6;
    padding: 0.5rem 0;
    z-index: 1000;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }

  .bwrapper {
    padding-bottom: 70px !important;
  }

  .mobile-action-menu .btn {
    flex: 1;
    margin: 0 0.25rem;
    padding: 0.5rem;
    border-radius: 8px !important;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .action-buttons {
    display: none;
  }
}

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;
  max-width: 100%;
}

.ventas-container {
  margin: 5px;
  padding: 5px;
  border: 1px solid #7a7a7a;
  border-radius: 8px;
  background-color: transparent;
}
</style>
