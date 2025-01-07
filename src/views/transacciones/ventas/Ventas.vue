<template>
  <div class="bwrapper align-items-center">
    <CContainer fluid>
      <CRow>
        <CCol md="6" class="mt-2">
          <CCard class="mb-2 custom-card">
            <CCardBody>
              <CSpinner v-if="isLoading" color="success" />
              <CAlert v-if="error" color="danger" dismissible @close="error = null">
                {{ error }}
              </CAlert>
              <CAlert v-if="infoMessage" color="info" dismissible @close="infoMessage = null">
                {{ infoMessage }}
              </CAlert>
              <div class="d-flex justify-content-center mb-3">
                <CButton
                  :class="{ 'active-button': modoBusqueda === 'codigo', 'inactive-button': modoBusqueda !== 'codigo' }"
                  @click="cambiarModoBusqueda('codigo')" :disabled="isLoading">
                  Código <span class="d-none d-md-inline">(F1)</span>
                </CButton>
                <CButton
                  :class="{ 'active-button': modoBusqueda === 'nombre', 'inactive-button': modoBusqueda !== 'nombre' }"
                  @click="cambiarModoBusqueda('nombre')" :disabled="isLoading">
                  Nombre <span class="d-none d-md-inline">(F2)</span>
                </CButton>
              </div>
              <CInputGroup class="mt-3 mb-4" style="width: 100%;">
                <CFormInput v-model="textoBusqueda"
                  :placeholder="modoBusqueda === 'nombre' ? 'Buscar por nombre' : 'Buscar por código'"
                  @keyup.enter="agregarPorCodigo" />
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
          <CCard class="mb-2 custom-card">
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
              <h5>Productos Seleccionados</h5>
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
                <CButton color="warning">
                  <i class="fas fa-money-bill-wave large-icon"></i> <span class="d-none d-md-inline">Adicionales</span>
                </CButton>
                <CButton color="secondary">
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
    <CButton color="light">
      <i class="fas fa-money-bill-wave large-icon"></i>
    </CButton>
    <CButton color="light">
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

import { buscarCuadreCajaActivoPorUsuarioFachada } from '@/assets/js/gestion-cajas';

export default {
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
    this.idNegocio = JSON.parse(sessionStorage.getItem('usuario')).negocioId;
    this.usuario = JSON.parse(sessionStorage.getItem('usuario')).nombreUsuario;

    try {
      const resultado = await buscarCuadreCajaActivoPorUsuarioFachada(this.usuario, this.idNegocio);
      if (!resultado) {
        this.$router.push({ name: 'AbrirCaja' });
      } else {
        this.fetchItems();
      }
    } catch (error) {
      console.error('Error al verificar cuadre de caja activo:', error);
      this.error = 'Error al verificar cuadre de caja activo. Inténtalo de nuevo más tarde.';
    }

    window.addEventListener('keydown', this.handleKeydown);
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeydown);
    window.removeEventListener('resize', this.handleResize);
  },


  methods: {
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
      this.$router.go(-1);
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
        this.productos = await listaProductosFachada(this.idNegocio);
        this.subproductos = await listaSubproductosFachada(this.idNegocio);
      } catch (err) {
        this.error = 'Error al cargar productos y subproductos. Inténtalo de nuevo más tarde.';
      } finally {
        this.isLoading = false;
      }
    },
    handleKeydown(event) {
      if (event.key === 'F1') {
        event.preventDefault();
        this.cambiarModoBusqueda('codigo');
      } else if (event.key === 'F2') {
        event.preventDefault();
        this.cambiarModoBusqueda('nombre');
      }
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
.custom-card {
  background-color: transparent;
  border-color: #3b3b3b;
  height: 96vh;
}

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;
}

.table-scroll {
  max-height: 70vh;

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

  .action-buttons {
    display: none !important;
  }

  .mobile-action-menu {
    display: flex;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #f8f9fa;
    border-top: 1px solid transparent;
    padding: 0.5rem 0;
    z-index: 1000;
  }

  .mobile-action-menu .btn {
    flex: 1;
    margin: 0 0.5rem;
    font-size: 0.85rem;
    border-radius: 47%;
  }

  .mobile-action-menu .large-icon {
    font-size: 1.25rem;
  }

  .table-scroll {
    max-height: 50vh !important;
    overflow-y: auto;
  }

  .totals-mobile {
    margin-bottom: 1rem;
  }
}
</style>
