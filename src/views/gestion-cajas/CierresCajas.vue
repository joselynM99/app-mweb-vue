<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong style="margin-right:5px;">Cuadres de Caja</strong>
          <CSpinner v-if="isLoading" color="success" class="spinner-border-sm" />
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
                    <CCol md="4">
                      <div class="filter-item">
                        <label>Fecha y Hora Inicio:</label>
                        <CFormInput type="datetime-local" v-model="filtros.fechaInicio"
                          @change="debouncedBuscarCierresCajas" />
                      </div>
                    </CCol>
                    <CCol md="4">
                      <div class="filter-item">
                        <label>Fecha y Hora Fin:</label>
                        <CFormInput type="datetime-local" v-model="filtros.fechaFin"
                          @change="debouncedBuscarCierresCajas" />
                      </div>
                    </CCol>
                    <CCol md="4">
                      <div class="filter-item">
                        <label>Estado:</label>
                        <CFormSelect v-model="filtros.estado" @change="debouncedBuscarCierresCajas">
                          <option value="">Todos</option>
                          <option value="true">Activo</option>
                          <option value="false">Inactivo</option>
                        </CFormSelect>
                      </div>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCollapse>
          </div>
          <CInputGroup class="mt-3 mb-4" style="width: 100%;">
            <CFormInput v-model="searchQuery" @input="debouncedBuscarCierresCajas" placeholder="Buscar por usuario" />
            <CInputGroupText style="padding:0px 5px">
              <button @click="buscarCierresCajas" :disabled="isLoading"
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
            <CTable v-if="sortedCierresCajas.length > 0" hover>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell scope="col" class="text-center">Acciones</CTableHeaderCell>
                  <CTableHeaderCell scope="col" @click="sortBy('usuario')" style="cursor: pointer;">
                    Usuario
                    <i v-if="sortKey !== 'usuario'" class="fas fa-sort"></i>
                    <span v-if="sortKey === 'usuario'">
                      <i :class="sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
                    </span>
                  </CTableHeaderCell>

                  <CTableHeaderCell scope="col" @click="sortBy('fechaApertura')" style="cursor: pointer;">
                    Fecha Apertura
                    <i v-if="sortKey !== 'fechaApertura'" class="fas fa-sort"></i>
                    <span v-if="sortKey === 'fechaApertura'">
                      <i :class="sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
                    </span>
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" @click="sortBy('fechaCierre')" style="cursor: pointer;">
                    Fecha Cierre
                    <i v-if="sortKey !== 'fechaCierre'" class="fas fa-sort"></i>
                    <span v-if="sortKey === 'fechaCierre'">
                      <i :class="sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
                    </span>
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" @click="sortBy('valorApertura')" style="cursor: pointer;">
                    Valor Apertura
                    <i v-if="sortKey !== 'valorApertura'" class="fas fa-sort"></i>
                    <span v-if="sortKey === 'valorApertura'">
                      <i :class="sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
                    </span>
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" @click="sortBy('valorCierre')" style="cursor: pointer;">
                    Valor Cierre
                    <i v-if="sortKey !== 'valorCierre'" class="fas fa-sort"></i>
                    <span v-if="sortKey === 'valorCierre'">
                      <i :class="sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
                    </span>
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" @click="sortBy('saldoFinalEfectivo')" style="cursor: pointer;">
                    Saldo Final Efectivo
                    <i v-if="sortKey !== 'saldoFinalEfectivo'" class="fas fa-sort"></i>
                    <span v-if="sortKey === 'saldoFinalEfectivo'">
                      <i :class="sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
                    </span>
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" @click="sortBy('valorContable')" style="cursor: pointer;">
                    Valor Contable
                    <i v-if="sortKey !== 'valorContable'" class="fas fa-sort"></i>
                    <span v-if="sortKey === 'valorContable'">
                      <i :class="sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
                    </span>
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" @click="sortBy('diferencia')" style="cursor: pointer;">
                    Diferencia
                    <i v-if="sortKey !== 'diferencia'" class="fas fa-sort"></i>
                    <span v-if="sortKey === 'diferencia'">
                      <i :class="sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
                    </span>
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="cierre in sortedCierresCajas" :key="cierre.id"
                  :class="{ 'table-danger': cierre.diferencia < 0 }">
                  <CTableDataCell class="text-center">
                    <div class="action-buttons">
                      <CButton color="info" size="sm" @click="verDetallesCierre(cierre.id)">
                        <i class="fas fa-eye"></i>
                      </CButton>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ cierre.usuario }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ formatDate(cierre.fechaApertura) }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ formatDate(cierre.fechaCierre) }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ cierre.valorApertura }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ cierre.valorCierre }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ cierre.saldoFinalEfectivo }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ cierre.valorContable }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ cierre.diferencia }}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </div>
          <CAlert v-if="!sortedCierresCajas.length && !error && !isLoading && !infoMessage" color="info">
            No se encontraron cierres de caja.
          </CAlert>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import { debounce } from 'lodash';
import { buscarCuadreCajaFachada } from '@/assets/js/gestion-cajas';

export default {
  data() {
    return {
      searchQuery: '',
      cierresCajas: [],
      isLoading: false,
      error: null,
      infoMessage: null,
      filtros: {
        fechaInicio: '',
        fechaFin: '',
        estado: '', 
      },
      sortKey: '',
      sortOrder: 'asc'
    };
  },
  computed: {
    sortedCierresCajas() {
      let resultados = [...this.cierresCajas];

      // 🔍 Filtro por nombre de usuario
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        resultados = resultados.filter(cierre =>
          cierre.usuario?.toLowerCase().includes(query)
        );
      }

      // Ordenamiento
      if (this.sortKey) {
        resultados.sort((a, b) => {
          let aValue = a[this.sortKey];
          let bValue = b[this.sortKey];

          if (typeof aValue === 'string') aValue = aValue.toLowerCase();
          if (typeof bValue === 'string') bValue = bValue.toLowerCase();

          if (aValue < bValue) return this.sortOrder === 'asc' ? -1 : 1;
          if (aValue > bValue) return this.sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }

      return resultados;
    }
  },
  methods: {
    async fetchCierresCajas() {
      this.isLoading = true;
      this.error = null;
      this.infoMessage = null;
      try {
        const usuario = JSON.parse(sessionStorage.getItem('usuario')).nombreUsuario;
        const fechaInicio = this.filtros.fechaInicio || null;
        const fechaFin = this.filtros.fechaFin || null;
        const estado = this.filtros.estado !== '' ? this.filtros.estado : null;
        const negocioId = JSON.parse(sessionStorage.getItem('usuario')).negocioId || JSON.parse(sessionStorage.getItem('negocioId'));
        this.cierresCajas = await buscarCuadreCajaFachada(usuario, fechaInicio, fechaFin, estado, negocioId);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.infoMessage = 'No se encontraron cierres de caja';
        } else {
          this.error = 'Error al cargar cierres de caja. Inténtalo de nuevo más tarde.';
        }
      } finally {
        this.isLoading = false;
      }
    },
    async buscarCierresCajas() {
      this.fetchCierresCajas();
    },
    verDetallesCierre(id) {
      this.$router.push({ name: 'Detalles Cuadre Caja', query: { id } });

    },
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc';
      }
    },
    formatDate(date) {
      if (!date || new Date(date).getFullYear() < 2000) {
        return '';
      }
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
      return new Date(date).toLocaleString('es-ES', options);
    },
    debouncedBuscarCierresCajas: debounce(function () {
      this.buscarCierresCajas();
    }, 300)
  },
  watch: {
    searchQuery() {
      this.debouncedBuscarCierresCajas();
    },
  },
  mounted() {
    this.fetchCierresCajas();
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