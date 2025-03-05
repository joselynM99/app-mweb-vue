<template>
        <router-view></router-view>

  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong style="margin-right:5px;">Productos</strong>
          <CSpinner v-if="isLoading" color="success" class="spinner-border-sm" />
          <CButton color="success" size="sm" @click="goToRegistrarProducto" style="float: right;">
            Registrar Producto
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CAlert v-if="error" color="danger" dismissible @close="error = null">
            {{ error }}
          </CAlert>
          <CAlert v-if="infoMessage" color="info" dismissible @close="infoMessage = null">
            {{ infoMessage }}
          </CAlert>
          <div class="filters">
            <CCollapse :visible="true">
              <CCard class="mt-3">
                <CCardBody>
                  <strong>Filtros</strong>
                  <CRow>
                    <CCol md="3">
                      <div class="filter-item">
                        <label>Marca:</label>
                        <select v-model="filtros.marca" @change="filtrarProductos" class="form-select">
                          <option value="">Todas</option>
                          <option v-for="marca in [...new Set(productos.map(p => p.marca))]" :key="marca"
                            :value="marca">{{ marca }}</option>
                        </select>
                      </div>
                    </CCol>
                    <CCol md="3">
                      <div class="filter-item">
                        <label>Categoría:</label>
                        <select v-model="filtros.categoria" @change="filtrarProductos" class="form-select">
                          <option value="">Todas</option>
                          <option v-for="categoria in [...new Set(productos.map(p => p.categoria))]" :key="categoria"
                            :value="categoria">{{ categoria }}</option>
                        </select>
                      </div>
                    </CCol>
                    <CCol md="3">
                      <div class="filter-item">
                        <label>Proveedor:</label>
                        <select v-model="filtros.proveedor" @change="filtrarProductos" class="form-select">
                          <option value="">Todos</option>
                          <option v-for="proveedor in [...new Set(productos.map(p => p.proveedor))]" :key="proveedor"
                            :value="proveedor">{{ proveedor }}</option>
                        </select>
                      </div>
                    </CCol>
                    <CCol md="3">
                      <div class="filter-item">
                        <label>Impuesto:</label>
                        <select v-model="filtros.impuesto" @change="filtrarProductos" class="form-select">
                          <option value="">Todos</option>
                          <option v-for="impuesto in [...new Set(productos.map(p => p.impuesto))]" :key="impuesto"
                            :value="impuesto">{{ impuesto }}</option>
                        </select>
                      </div>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCollapse>
          </div>
          <CInputGroup class="mt-3 mb-4" style="width: 100%;">
            <CFormInput v-model="searchQuery" @input="debouncedBuscarProductos" placeholder="Buscar por nombre" />
            <CInputGroupText style="padding:0px 5px">
              <button @click="buscarProductos" :disabled="isLoading"
                style="border: none; background: none; margin:0px; padding:5px">
                Buscar
                <CSpinner v-if="isLoading" color="light" class="spinner-border-sm" />
              </button>
            </CInputGroupText>
          </CInputGroup>
          <div class="table-responsive">
            <div class="scroll-indicator">
              <span class="arrow"><i class="fas fa-arrow-left"></i></span> Desliza para ver más <span class="arrow"><i
                  class="fas fa-arrow-right"></i></span>
            </div>
            <CTable v-if="sortedProductos.length > 0" hover>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell scope="col" class="text-center">Acciones</CTableHeaderCell>
                  <CTableHeaderCell scope="col" @click="sortBy('codigoBarras')" style="cursor: pointer;">
                    Cod. barras
                    <i v-if="sortKey !== 'codigoBarras'" class="fas fa-sort"></i>
                    <span v-if="sortKey === 'codigoBarras'">
                      <i :class="sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
                    </span>
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" @click="sortBy('nombre')" style="cursor: pointer;">
                    Nombre
                    <i v-if="sortKey !== 'nombre'" class="fas fa-sort"></i>
                    <span v-if="sortKey === 'nombre'">
                      <i :class="sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
                    </span>
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" @click="sortBy('descripcion')" style="cursor: pointer;">
                    Descripción
                    <i v-if="sortKey !== 'descripcion'" class="fas fa-sort"></i>
                    <span v-if="sortKey === 'descripcion'">
                      <i :class="sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
                    </span>
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" @click="sortBy('costoPromedio')" style="cursor: pointer;">
                    Costo
                    <i v-if="sortKey !== 'costoPromedio'" class="fas fa-sort"></i>
                    <span v-if="sortKey === 'costoPromedio'">
                      <i :class="sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
                    </span>
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" @click="sortBy('precioVenta')" style="cursor: pointer;">
                    Precio venta
                    <i v-if="sortKey !== 'precioVenta'" class="fas fa-sort"></i>
                    <span v-if="sortKey === 'precioVenta'">
                      <i :class="sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
                    </span>
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" @click="sortBy('stockActual')" style="cursor: pointer;">
                    Stock
                    <i v-if="sortKey !== 'stockActual'" class="fas fa-sort"></i>
                    <span v-if="sortKey === 'stockActual'">
                      <i :class="sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
                    </span>
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="producto in sortedProductos" :key="producto.codigoBarras"
                  :class="{ 'table-danger': producto.stockActual <= 0 }">
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
          <CAlert v-if="!sortedProductos.length && !error && !isLoading && !infoMessage" color="info">
            No se encontraron productos.
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
      filtros: {
        marca: '',
        categoria: '',
        proveedor: '',
        impuesto: ''
      },
      sortKey: '',
      sortOrder: 'asc'
    };
  },
  computed: {
    sortedProductos() {
      const sorted = [...this.filtrarProductos()];
      if (this.sortKey) {
        sorted.sort((a, b) => {
          let aValue = a[this.sortKey];
          let bValue = b[this.sortKey];

          if (typeof aValue === 'string') aValue = aValue.toLowerCase();
          if (typeof bValue === 'string') bValue = bValue.toLowerCase();

          if (aValue < bValue) return this.sortOrder === 'asc' ? -1 : 1;
          if (aValue > bValue) return this.sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }
      return sorted;
    },
    needsScroll() {
      const container = this.$refs.tableContainer;
      return container && container.scrollWidth > container.clientWidth;
    }
  },
  methods: {

    goToRegistrarProducto() {
      this.$router.push({ name: 'Registrar Producto' });
    },
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
    filtrarProductos() {
      return this.productos.filter(producto => {
        return (
          (!this.filtros.marca || producto.marca === this.filtros.marca) &&
          (!this.filtros.categoria || producto.categoria === this.filtros.categoria) &&
          (!this.filtros.proveedor || producto.proveedor === this.filtros.proveedor) &&
          (!this.filtros.impuesto || producto.impuesto === this.filtros.impuesto)
        );
      });
    },
    actualizarProducto(codigoBarras) {
      this.$router.push({ name: 'Actualizar Productos', query: { codigoBarras } });
    },
    confirmarDesactivacion(producto) {
      this.productoSeleccionado = producto;
      this.visibleConfirmacion = true;
    },
    async desactivarProductoConfirmado() {
      this.isDeleting = true;
      try {
        await desactivarProductoFachada(this.productoSeleccionado.id);
        this.productos = this.productos.filter(p => p.codigoBarras !== this.productoSeleccionado.codigoBarras);
        this.visibleConfirmacion = false;
      } catch (err) {
        this.error = 'Error al desactivar el producto. Inténtalo de nuevo más tarde.';
      } finally {
        this.isDeleting = false;
      }
    },
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc';
      }
    },
    debouncedBuscarProductos: debounce(function () {
      this.buscarProductos();
    }, 300)
  },
  watch: {
    searchQuery() {
      this.debouncedBuscarProductos();
    },
  },
  mounted() {
    this.fetchProductos();
  }
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

.filters {
  margin-bottom: 20px;
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
