<template>
  <router-view></router-view>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong style="margin-right:5px;">Proveedores</strong>
          <CSpinner v-if="isLoading" color="success" class="spinner-border-sm" />
          <CButton color="success" size="sm" @click="goToRegistrarProveedor" style="float: right;">
            Registrar Proveedor
          </CButton>
          
        </CCardHeader>
        <CCardBody>
          <CInputGroup  style="width: 300px; margin-bottom: 10px;">
            <CFormInput v-model="searchQuery" @input="buscarProveedores" placeholder="Buscar por nombre comercial" />
            <CInputGroupText style="padding:0px 5px">
              <button @click="buscarProveedores" :disabled="isLoading"
                style="border: none; background: none; margin:0px; padding:5px">
                Buscar
                <CSpinner v-if="isLoading" color="ligth" class="spinner-border-sm" />
              </button>
            </CInputGroupText>
          </CInputGroup>
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
            <CTable v-if="proveedores.length > 0" hover>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell scope="col" class="text-center">Acciones</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Razón Social</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nombre Comercial</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Correo</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Teléfono</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Identificación</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="proveedor in proveedores" :key="proveedor.id">
                  <CTableDataCell class="text-center">
                    <div class="action-buttons">
                      <CButton color="warning" size="sm" @click="actualizarProveedor(proveedor.identificacion)">
                        <i class="fas fa-edit"></i>
                      </CButton>
                      <CButton color="danger" size="sm" @click="confirmarDesactivacion(proveedor)">
                        <i class="fas fa-trash-alt"></i>
                      </CButton>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ proveedor.razonSocial }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ proveedor.nombreComercial }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ proveedor.correo }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ proveedor.telefono }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ proveedor.identificacion }}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </div>
          <CAlert v-if="!proveedores.length && !error && !isLoading && !infoMessage" color="info">
            No se encontraron proveedores para el negocio especificado.
          </CAlert>
        </CCardBody>
      </CCard>
    </CCol>

    <!-- Modal de confirmación -->
    <CModal :visible="visibleConfirmacion" @close="visibleConfirmacion = false">
      <CModalHeader @close="visibleConfirmacion = false">
        <CModalTitle>Confirmar eliminación</CModalTitle>
      </CModalHeader>
      <CModalBody>¿Estás seguro de que deseas eliminar este proveedor?</CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="visibleConfirmacion = false">Cancelar</CButton>
        <CButton color="danger" @click="desactivarProveedorConfirmado">
          Eliminar
          <CSpinner v-if="isDeleting" color="light" class="spinner-border-sm" />
        </CButton>
      </CModalFooter>
    </CModal>
  </CRow>
</template>

<script>
import { debounce } from 'lodash';
import { listaProveedoresFachada, listaProveedoresPorNombreComercialFachada, desactivarProveedorFachada } from '@/assets/js/proveedor';

export default {
  data() {
    return {
      searchQuery: '',
      proveedores: [],
      isLoading: false,
      error: null,
      infoMessage: null,
      isDeleting: false,
      proveedorSeleccionado: null,
      visibleConfirmacion: false,
    };
  },
  methods: {
    goToRegistrarProveedor() {
      this.$router.push({ name: 'Registrar Proveedor' });
    },

    async fetchProveedores() {
      this.isLoading = true;
      this.error = null;
      this.infoMessage = null;
      try {
        const us = JSON.parse(sessionStorage.getItem('usuario')); // Parsear la cadena JSON a un objeto
        const negocioId = us ? us.negocioId : null;
        if (negocioId) {
          const response = await listaProveedoresFachada(negocioId);
          this.proveedores = response;
        } else {
          this.error = 'No se encontró el ID del negocio en la sesión.';
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.infoMessage = 'No se encontraron proveedores';
        } else {
          this.error = 'Error al obtener la lista de proveedores. Inténtalo de nuevo más tarde.';
        }
      } finally {
        this.isLoading = false;
      }
    },
    async buscarProveedores() {
      if (!this.searchQuery) {
        this.fetchProveedores();
        return;
      }

      this.isLoading = true;
      this.error = null;
      this.infoMessage = null;
      try {
        const us = JSON.parse(sessionStorage.getItem('usuario'));
        const negocioId = us ? us.negocioId : null;
        if (negocioId) {
          const response = await listaProveedoresPorNombreComercialFachada(this.searchQuery, negocioId);
          this.proveedores = response;
        } else {
          this.error = 'No se encontró el ID del negocio en la sesión.';
        }
      } catch (err) {
        console.error('Error al buscar proveedores:', err);
        if (err.response && err.response.status === 404) {
          this.infoMessage = 'No se encontraron proveedores con el nombre especificado';
        } else {
          this.error = 'Error al obtener la lista de proveedores. Inténtalo de nuevo más tarde.';
        }
      } finally {
        this.isLoading = false;
      }
    },
    confirmarDesactivacion(proveedor) {
      this.proveedorSeleccionado = proveedor;
      this.visibleConfirmacion = true;
    },
    async desactivarProveedorConfirmado() {
      this.isDeleting = true;
      try {
        await desactivarProveedorFachada(this.proveedorSeleccionado.id);
        this.proveedores = this.proveedores.filter(proveedor => proveedor.id !== this.proveedorSeleccionado.id);
        this.visibleConfirmacion = false;
        this.proveedorSeleccionado = null;
      } catch (err) {
        this.error = 'Error al eliminar el proveedor. Inténtalo de nuevo más tarde.';
        this.visibleConfirmacion = false;
      } finally {
        this.isDeleting = false;
      }
    },
    actualizarProveedor(identificacion) {
      this.$router.push({ path: '/inventario/proveedores/actualizar', query: { identificacion } });
    },
    debouncedBuscarProveedores: debounce(function () {
      this.buscarProveedores();
    }, 300),
  },
  watch: {
    searchQuery() {
      this.debouncedBuscarProveedores();
    },
  },
  mounted() {
    this.fetchProveedores();
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
