<template>
  <router-view></router-view>

  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong style="margin-right:5px;">Subproductos</strong>
          <CSpinner v-if="isLoading" color="success" class="spinner-border-sm" />
          <CButton color="success" size="sm" @click="goToRegistrarSubproducto" style="float: right;">
            Registrar Subproducto
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
                        <select v-model="filtros.marca" @change="filtrarSubproductos" class="form-select">
                          <option value="">Todas</option>
                          <option v-for="marca in [...new Set(subproductos.map(p => p.marca))]" :key="marca"
                            :value="marca">{{ marca }}</option>
                        </select>
                      </div>
                    </CCol>
                    <CCol md="3">
                      <div class="filter-item">
                        <label>Categoría:</label>
                        <select v-model="filtros.categoria" @change="filtrarSubproductos" class="form-select">
                          <option value="">Todas</option>
                          <option v-for="categoria in [...new Set(subproductos.map(p => p.categoria))]" :key="categoria"
                            :value="categoria">{{ categoria }}</option>
                        </select>
                      </div>
                    </CCol>
                    <CCol md="3">
                      <div class="filter-item">
                        <label>Subproducto:</label>
                        <select v-model="filtros.proveedor" @change="filtrarSubproductos" class="form-select">
                          <option value="">Todos</option>
                          <option v-for="proveedor in [...new Set(subproductos.map(p => p.proveedor))]" :key="proveedor"
                            :value="proveedor">{{ proveedor }}</option>
                        </select>
                      </div>
                    </CCol>
                    <CCol md="3">
                      <div class="filter-item">
                        <label>Impuesto:</label>
                        <select v-model="filtros.impuesto" @change="filtrarSubproductos" class="form-select">
                          <option value="">Todos</option>
                          <option v-for="impuesto in [...new Set(subproductos.map(p => p.impuesto))]" :key="impuesto"
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
            <CFormInput v-model="searchQuery" @input="debouncedBuscarSubproductos" placeholder="Buscar por nombre" />
            <CInputGroupText style="padding:0px 5px">
              <button @click="buscarSubproductos" :disabled="isLoading"
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
            <CTable v-if="sortedSubproductos.length > 0" hover>
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
                <CTableRow v-for="subproducto in sortedSubproductos" :key="subproducto.codigoBarras"
                  :class="{ 'table-danger': subproducto.stockActual <= 0 }">
                  <CTableDataCell class="text-center">
                    <div class="action-buttons">
                      <CButton color="warning" size="sm" @click="actualizarSubproducto(subproducto.codigoBarras)">
                        <i class="fas fa-edit"></i>
                      </CButton>
                      <CButton color="danger" size="sm" @click="confirmarDesactivacion(subproducto)">
                        <i class="fas fa-trash-alt"></i>
                      </CButton>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ subproducto.codigoBarras }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ subproducto.nombre }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ subproducto.descripcion }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ subproducto.costoPromedio }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ subproducto.precioVenta }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ subproducto.stockActual }}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </div>
          <CAlert v-if="!sortedSubproductos.length && !error && !isLoading && !infoMessage" color="info">
            No se encontraron subproductos.
          </CAlert>
        </CCardBody>
      </CCard>
    </CCol>

    <!-- Modal de confirmación -->
    <CModal :visible="visibleConfirmacion" @close="visibleConfirmacion = false">
      <CModalHeader @close="visibleConfirmacion = false">
        <CModalTitle>Confirmar eliminación</CModalTitle>
      </CModalHeader>
      <CModalBody>¿Estás seguro de que deseas eliminar este subproducto?</CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="visibleConfirmacion = false">Cancelar</CButton>
        <CButton color="danger" @click="desactivarSubproductoConfirmado">
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
  listaSubproductosFachada,
  listaSubproductosPorNombreFachada,
  desactivarSubproductoFachada,
} from '@/assets/js/subproductos';

export default {
  data() {
    return {
      searchQuery: '',
      subproductos: [],
      isLoading: false,
      error: null,
      infoMessage: null,
      isDeleting: false,
      subproductoSeleccionado: null,
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
    sortedSubproductos() {
      const sorted = [...this.filtrarSubproductos()];
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
    goToRegistrarSubproducto() {
      this.$router.push({ name: 'Registrar Subproducto' });
    },

    async fetchSubproductos() {
      this.isLoading = true;
      this.error = null;
      this.infoMessage = null;
      try {
        const negocioId = JSON.parse(sessionStorage.getItem('usuario')).negocioId || JSON.parse(sessionStorage.getItem('negocioId'));
        this.subproductos = await listaSubproductosFachada(negocioId);


      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.infoMessage = 'No se encontraron subproductos';
        } else {
          this.error = 'Error al cargar subproductos. Inténtalo de nuevo más tarde.';
        }
      } finally {
        this.isLoading = false;
      }
    },
    async buscarSubproductos() {
      if (!this.searchQuery) {
        this.fetchSubproductos();
        return;
      }

      this.isLoading = true;
      this.error = null;
      this.infoMessage = null;
      try {
        const negocioId = JSON.parse(sessionStorage.getItem('usuario')).negocioId || JSON.parse(sessionStorage.getItem('negocioId'));
        this.subproductos = await listaSubproductosPorNombreFachada(this.searchQuery, negocioId);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.infoMessage = 'No se encontraron subproductos con el nombre especificado';
        } else {
          this.error = 'Error al buscar subproductos. Inténtalo de nuevo más tarde.';
        }
      } finally {
        this.isLoading = false;
      }
    },
    filtrarSubproductos() {
      return this.subproductos.filter(subproducto => {
        return (
          (!this.filtros.marca || subproducto.marca === this.filtros.marca) &&
          (!this.filtros.categoria || subproducto.categoria === this.filtros.categoria) &&
          (!this.filtros.proveedor || subproducto.proveedor === this.filtros.proveedor) &&
          (!this.filtros.impuesto || subproducto.impuesto === this.filtros.impuesto)
        );
      });
    },
    actualizarSubproducto(codigoBarras) {
      this.$router.push({ name: 'Actualizar Subproducto', query: { codigoBarras } });
    },

    confirmarDesactivacion(subproducto) {
      this.subproductoSeleccionado = subproducto;
      this.visibleConfirmacion = true;
    },
    async desactivarSubproductoConfirmado() {
      this.isDeleting = true;
      try {
        await desactivarSubproductoFachada(this.subproductoSeleccionado.id);
        this.subproductos = this.subproductos.filter(p => p.codigoBarras !== this.subproductoSeleccionado.codigoBarras);
        this.visibleConfirmacion = false;
      } catch (err) {
        this.error = 'Error al desactivar el subproducto. Inténtalo de nuevo más tarde.';
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
    debouncedBuscarSubproductos: debounce(function () {
      this.buscarSubproductos();
    }, 300)
  },
  watch: {
    searchQuery() {
      this.debouncedBuscarSubproductos();
    },
  },
  mounted() {
    this.fetchSubproductos();
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
