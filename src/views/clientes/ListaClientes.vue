<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong style="margin-right:5px;">Clientes</strong>
          <CSpinner v-if="isLoading" color="success" class="spinner-border-sm" />
          <CInputGroup class="float-end" style="width: 300px;">
            <CFormInput v-model="searchQuery" @input="buscarClientes" placeholder="Buscar por nombre" />
            <CInputGroupText style="padding:0px 5px">
              <button @click="buscarClientes" :disabled="isLoading"
                style="border: none; background: none; margin:0px; padding:5px">
                Buscar
                <CSpinner v-if="isLoading" color="ligth" class="spinner-border-sm" />
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
            <CTable v-if="clientes.length > 0" hover>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell scope="col" class="text-center">Acciones</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nombres</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Apellidos</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Correo</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Teléfono</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Identificación</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="cliente in clientes" :key="cliente.id">
                  <CTableDataCell class="text-center">
                    <div class="action-buttons">
                      <CButton color="success" size="sm" @click="actualizarCliente(cliente.identificacion)">
                        <i class="fas fa-edit"></i>
                      </CButton>
                      <CButton color="danger" size="sm" @click="confirmarDesactivacion(cliente)">
                        <i class="fas fa-trash-alt"></i>
                      </CButton>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ cliente.nombres }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ cliente.apellidos }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ cliente.correo }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ cliente.telefono }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ cliente.identificacion }}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </div>
          <CAlert v-if="!clientes.length && !error && !isLoading && !infoMessage" color="info">
            No se encontraron clientes para el negocio especificado.
          </CAlert>
        </CCardBody>
      </CCard>
    </CCol>

    <!-- Modal de confirmación -->
    <CModal :visible="visibleConfirmacion" @close="visibleConfirmacion = false">
      <CModalHeader @close="visibleConfirmacion = false">
        <CModalTitle>Confirmar eliminación</CModalTitle>
      </CModalHeader>
      <CModalBody>¿Estás seguro de que deseas eliminar este cliente?</CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="visibleConfirmacion = false">Cancelar</CButton>
        <CButton color="danger" @click="desactivarClienteConfirmado">
          Eliminar
          <CSpinner v-if="isDeleting" color="light" class="spinner-border-sm" />
        </CButton>
      </CModalFooter>
    </CModal>
  </CRow>
</template>

<script>
import { debounce } from 'lodash';
import { buscarClientesPorNombreFachada, obtenerClientesActivosPorNegocioFachada, desactivarClienteFachada } from '@/assets/js/clientes';

export default {
  data() {
    return {
      searchQuery: '',
      clientes: [],
      isLoading: false,
      error: null,
      infoMessage: null,
      isDeleting: false,
      clienteSeleccionado: null,
      visibleConfirmacion: false,
    };
  },
  methods: {
    async fetchClientes() {
      this.isLoading = true;
      this.error = null;
      this.infoMessage = null;
      try {
        const us = JSON.parse(sessionStorage.getItem('usuario')); // Parsear la cadena JSON a un objeto
        const negocioId = us ? us.negocioId : null;
        if (negocioId) {
          const response = await obtenerClientesActivosPorNegocioFachada(negocioId);
          this.clientes = response;
        } else {
          this.error = 'No se encontró el ID del negocio en la sesión.';
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.infoMessage = 'No se encontraron clientes';
        } else {
          this.error = 'Error al obtener la lista de clientes. Inténtalo de nuevo más tarde.';
        }
      } finally {
        this.isLoading = false;
      }
    },
    async buscarClientes() {
      if (!this.searchQuery) {
        this.fetchClientes();
        return;
      }

      this.isLoading = true;
      this.error = null;
      this.infoMessage = null;
      try {
        const us = JSON.parse(sessionStorage.getItem('usuario'));
        const negocioId = us ? us.negocioId : null;
        if (negocioId) {
          const response = await buscarClientesPorNombreFachada(this.searchQuery, negocioId);
          this.clientes = response;
        } else {
          this.error = 'No se encontró el ID del negocio en la sesión.';
        }
      } catch (err) {
        console.error('Error al buscar clientes:', err);
        if (err.response && err.response.status === 404) {
          this.infoMessage = 'No se encontraron clientes con el nombre especificado';
        } else {
          this.error = 'Error al obtener la lista de clientes. Inténtalo de nuevo más tarde.';
        }
      } finally {
        this.isLoading = false;
      }
    },
    confirmarDesactivacion(cliente) {
      this.clienteSeleccionado = cliente;
      this.visibleConfirmacion = true;
    },
    async desactivarClienteConfirmado() {
      this.isDeleting = true;
      try {
        await desactivarClienteFachada(this.clienteSeleccionado.id);
        this.clientes = this.clientes.filter(cliente => cliente.id !== this.clienteSeleccionado.id);
        this.visibleConfirmacion = false;
        this.clienteSeleccionado = null;
      } catch (err) {
        this.error = 'Error al eliminar el cliente. Inténtalo de nuevo más tarde.';
        this.visibleConfirmacion = false;
      } finally {
        this.isDeleting = false;
      }
    },
    actualizarCliente(identificacion) {
      this.$router.push({ path: '/clientes/actualizar', query: { identificacion } });
    },
    debouncedBuscarClientes: debounce(function () {
      this.buscarClientes();
    }, 300),
  },
  watch: {
    searchQuery() {
      this.debouncedBuscarClientes();
    },
  },
  mounted() {
    this.fetchClientes();
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
