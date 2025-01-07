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
                  :class="{ 'active-button': searchMode === 'codigo', 'inactive-button': searchMode !== 'codigo' }"
                  @click="setSearchMode('codigo')" :disabled="isLoading">
                  Código <span class="d-none d-md-inline">(F1)</span>
                </CButton>
                <CButton
                  :class="{ 'active-button': searchMode === 'nombre', 'inactive-button': searchMode !== 'nombre' }"
                  @click="setSearchMode('nombre')" :disabled="isLoading">
                  Nombre <span class="d-none d-md-inline">(F2)</span>
                </CButton>
              </div>
              <CInputGroup class="mt-3 mb-4" style="width: 100%;">
                <CFormInput v-model="searchQuery"
                  :placeholder="searchMode === 'nombre' ? 'Buscar por nombre' : 'Buscar por código'"
                  @keyup.enter="handleEnterKey" />
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
                    <CTableRow v-for="item in filteredItems" :key="item.codigoBarras">
                      <CTableDataCell>{{ item.codigoBarras }}</CTableDataCell>
                      <CTableDataCell>{{ item.nombre }}</CTableDataCell>
                      <CTableDataCell>{{ item.precioVenta }}</CTableDataCell>
                      <CTableDataCell class="text-center">
                        <CButton color="success" @click="addItem(item)" class="small-button">
                          <i class="fas fa-cart-plus small-icon"></i>
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </div>
              <CAlert v-if="filteredItems.length === 0 && !error && !isLoading && !infoMessage" color="info">
                No se encontraron productos o subproductos.
              </CAlert>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md="6" class="mt-2">
          <CCard class="mb-2 custom-card">
            <CCardBody>
              <h5>Productos Seleccionados</h5>
              <div class="table-responsive">
                <CTable hover class="table table-striped table-bordered">
                  <CTableHead color="light">
                    <CTableRow>
                      <CTableHeaderCell scope="col">Código</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Precio</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Cantidad</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Subtotal</CTableHeaderCell>
                      <CTableHeaderCell scope="col"></CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow v-for="item in selectedItems" :key="item.codigoBarras">
                      <CTableDataCell>{{ item.codigoBarras }}</CTableDataCell>
                      <CTableDataCell>{{ item.nombre }}</CTableDataCell>
                      <CTableDataCell>{{ item.precioVenta }}</CTableDataCell>
                      <CTableDataCell style="padding: 0.5px; padding-top: 0.35rem;">
                        <CFormInput type="number" v-model.number="item.cantidad" @keyup="updateSubtotal(item)"
                          @input="updateSubtotal(item)" min="1"
                          style="max-width: 75px; margin: 0px auto; font-size: 0.70rem; " />
                      </CTableDataCell>
                      <CTableDataCell>{{ item.subtotal }}</CTableDataCell>
                      <CTableDataCell class="text-center">
                        <CButton color="danger" @click="removeItem(item)" class="small-button">
                          <i class="fas fa-trash small-icon"></i>
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </div>
              <div class="action-buttons">
                <CButton color="danger" @click="clearCart">Limpiar Carrito</CButton>
                <CButton color="primary">Terminar Venta</CButton>
                <CButton color="warning">Agregar Adicionales</CButton>
                <CButton color="secondary">Cerrar Caja</CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
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
      searchQuery: '',
      isLoading: false,
      searchMode: 'codigo',
      error: null,
      infoMessage: null,
      selectedItems: []
    };
  },
  computed: {
    filteredItems() {
      const query = this.searchQuery.toLowerCase();
      return [...this.productos, ...this.subproductos].filter(item => {
        if (this.searchMode === 'nombre') {
          return item.nombre.toLowerCase().includes(query);
        } else if (this.searchMode === 'codigo') {
          return item.codigoBarras.toLowerCase().includes(query);
        }
        return true;
      });
    }
  },
  async mounted() {
    this.idNegocio = JSON.parse(sessionStorage.getItem('usuario')).negocioId;
    this.usuario = JSON.parse(sessionStorage.getItem('usuario')).nombreUsuario;

    // Comprobar si ya existe una caja abierta
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

    // Agregar listener para teclas F1 y F2
    window.addEventListener('keydown', this.handleKeydown);
  },
  beforeDestroy() {
    // Remover listener para teclas F1 y F2
    window.removeEventListener('keydown', this.handleKeydown);
  },
  methods: {
    setSearchMode(mode) {
      this.searchMode = mode;
      this.searchQuery = '';
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
        this.setSearchMode('codigo');
      } else if (event.key === 'F2') {
        event.preventDefault();
        this.setSearchMode('nombre');
      }
    },
    addItem(item) {
      const existingItem = this.selectedItems.find(i => i.codigoBarras === item.codigoBarras);
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
        this.selectedItems.push(newItem);
      }
    },
    updateSubtotal(item) {
      item.subtotal = (item.cantidad * item.precioVenta).toFixed(2);
    },
    removeItem(item) {
      const index = this.selectedItems.indexOf(item);
      if (index > -1) {
        this.selectedItems.splice(index, 1);
      }
    },
    clearCart() {
      this.selectedItems = [];
    },
    handleEnterKey() {
      if (this.searchMode === 'codigo') {
        const allItems = [...this.productos, ...this.subproductos];
        const item = allItems.find(p => p.codigoBarras === this.searchQuery);
        if (item) {
          this.addItem(item);
          this.searchQuery = ''; // Limpiar el campo de búsqueda después de agregar el producto
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
}

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;
}

.table-scroll {
  max-height: 70vh; /* Ajusta la altura máxima según sea necesario */
  overflow-y: auto;
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
  gap: 10px;
  justify-content: flex-end;
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.scroll-indicator {
  display: none;
}

.filters {
  margin-bottom: 20px;
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
  /* Ajusta el ancho según sea necesario */
  padding: 0.25rem;
  /* Ajusta el padding según sea necesario */
  font-size: 0.75rem;
  /* Ajusta el tamaño de la fuente según sea necesario */
}

/* Estilos responsivos para dispositivos móviles */
@media (max-width: 768px) {
  .table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .table {
    width: 100%;
    table-layout: fixed; /* Forza el ajuste de las columnas */
  }

  .table th,
  .table td {
    font-size: 0.7rem; /* Reduce aún más el tamaño del texto */
    padding: 4px; /* Reduce el espacio interno */
    white-space: normal; /* Permite que el texto salte de línea */
  }

  .table td {
    word-wrap: break-word; /* Permite que el texto largo salte de línea */
    text-align: center; /* Centra el contenido */
  }

  .d-md-inline {
    display: none !important;
  }

  .table-responsive::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 5px;
    height: 5px;
  }

  .table-responsive::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }

  .action-buttons {
    flex-direction: column;
    bottom: 0;
    right: 0;
    width: 100%;
    background-color: #fff;
    border-top: 1px solid #ddd;
    padding: 10px;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  }

  .action-buttons .btn {
    width: 100%;
    margin-bottom: 5px;
  }
}
</style>