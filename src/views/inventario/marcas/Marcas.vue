<template>
  <div class="bwrapper align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="8" sm="12">
          <CCard>
            <CCardBody class="p-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5>Marcas de productos</h5>
                <CButton color="success" @click="openCreateModal" class="btn-create">
                  <i class="fas fa-plus me-2"></i> Agregar
                </CButton>
              </div>
              <CInputGroup class="mb-2">
                <CInputGroupText>
                  <i class="fas fa-search fa-fw"></i>
                </CInputGroupText>
                <CFormInput v-model="searchQuery" @input="debouncedBuscarMarcas" placeholder="Buscar por nombre" />
              </CInputGroup>
              <CSpinner v-if="isLoadingMarcas" color="success" class="spinner-border-sm" />

              <CAlert v-if="infoMessage" color="info">{{ infoMessage }}</CAlert>
              <CAlert v-if="errorMessage" color="danger">{{ errorMessage }}</CAlert>
              <CAlert v-if="successMessage" color="success">{{ successMessage }}</CAlert>

              <CTable v-if="marcas.length > 0" hover>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                    <CTableHeaderCell scope="col" class="text-center">Acciones</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow v-for="marca in marcas" :key="marca.id">
                    <CTableDataCell class="text-center">{{ marca.nombre }}</CTableDataCell>
                    <CTableDataCell class="text-center">
                      <CButton color="warning" class="me-2" @click="editMarca(marca)">
                        <i class="fas fa-edit"></i>
                      </CButton>
                      <CButton color="danger" @click="confirmarDesactivacion(marca)">
                        <i class="fas fa-trash-alt"></i>
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>

            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>

    <!-- Modal de creación/actualización -->
    <CModal :visible="visibleCreateModal || visibleUpdateModal" @close="closeModal">
      <CModalHeader @close="closeModal">
        <CModalTitle>{{ isEditing ? 'Actualizar' : 'Crear' }} Marca</CModalTitle>
      </CModalHeader>
      <CModalBody>

        <CForm @submit.prevent="handleSubmit" novalidate :class="{ 'was-validated': wasValidated }">
          <div class="mb-2">
            <label for="nombre" class="form-label">Nombre</label>
            <CInputGroup>
              <CInputGroupText><i class="fas fa-tag"></i></CInputGroupText>
              <CFormInput id="nombre" v-model="marca.nombre" placeholder="Nombre" required />
              <div class="invalid-feedback">El nombre es obligatorio</div>
            </CInputGroup>
          </div>
          <div class="d-grid" style="width:50%; margin: 5px auto;">
            <CButton :color="isEditing ? 'warning' : 'success'" type="submit" :disabled="isLoading">
              {{ isEditing ? 'Actualizar' : 'Crear' }}
              <CSpinner v-if="isLoading" color="light" class="spinner-border-sm" />
            </CButton>
          </div>
        </CForm>
      </CModalBody>
    </CModal>

    <!-- Modal de confirmación -->
    <CModal :visible="visibleConfirmacion" @close="visibleConfirmacion = false">
      <CModalHeader @close="visibleConfirmacion = false">
        <CModalTitle>Confirmar eliminación</CModalTitle>
      </CModalHeader>
      <CModalBody>¿Estás seguro de que deseas eliminar esta marca?</CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="visibleConfirmacion = false">Cancelar</CButton>
        <CButton color="danger" @click="desactivarMarcaConfirmada">
          Eliminar
          <CSpinner v-if="isLoadingDesactivar" color="light" class="spinner-border-sm" />
        </CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script>
import { debounce } from 'lodash';
import { registrarMarcaFachada, actualizarMarcaFachada, listaMarcasFachada, listaMarcasPorNombreFachada, desactivarMarcaFachada } from '@/assets/js/marcas';

export default {
  data() {
    return {
      negocioId: null,
      marca: {
        id: null,
        nombre: '',
        idNegocio: null
      },
      marcas: [],
      searchQuery: '',
      successMessage: '',
      errorMessage: '',
      infoMessage: '',
      wasValidated: false,
      isLoading: false,
      isLoadingMarcas: false,
      isLoadingDesactivar: false,
      visibleCreateModal: false,
      visibleUpdateModal: false,
      visibleConfirmacion: false,
      marcaSeleccionada: null,
      isEditing: false
    };
  },
  mounted() {
    this.negocioId = JSON.parse(sessionStorage.getItem('usuario')).negocioId;
    this.fetchMarcas();
  },
  created() {
    this.debouncedBuscarMarcas = debounce(this.buscarMarcas, 300);
  },
  methods: {
    async fetchMarcas() {
      this.isLoadingMarcas = true;
      this.errorMessage = '';
      this.infoMessage = '';
      try {
        const response = await listaMarcasFachada(this.negocioId);
        this.marcas = response;
        if (this.marcas.length === 0) {
          this.infoMessage = 'No se encontraron marcas activas para el negocio especificado.';
        }
      } catch (err) {
        console.error('Error al obtener las marcas:', err);
        if (err.response && err.response.status === 404) {
          this.infoMessage = 'No se encontraron marcas para su negocio.';
        } else {
          this.errorMessage = 'Error al obtener la lista de marcas. Inténtalo de nuevo más tarde.';
        }
      } finally {
        this.isLoadingMarcas = false;
      }
    },
    async buscarMarcas() {
      if (!this.searchQuery) {
        this.fetchMarcas();
        return;
      }

      this.isLoadingMarcas = true;
      this.errorMessage = '';
      this.infoMessage = '';
      try {
        const response = await listaMarcasPorNombreFachada(this.searchQuery, this.negocioId);
        this.marcas = response;
        if (this.marcas.length === 0) {
          this.infoMessage = 'No se encontraron marcas con el nombre especificado';
        }
      } catch (err) {
        console.error('Error al buscar marcas:', err);
        if (err.response && err.response.status === 404) {
          this.infoMessage = 'No se encontraron marcas con el nombre especificado';
        } else {
          this.errorMessage = 'Error al obtener la lista de marcas. Inténtalo de nuevo más tarde.';
        }
      } finally {
        this.isLoadingMarcas = false;
      }
    },
    async handleSubmit() {
      this.wasValidated = true;
      this.errorMessage = '';
      this.successMessage = '';

      if (!this.marca.nombre) {
        this.errorMessage = 'Por favor, complete todos los campos obligatorios';
        return;
      }

      this.isLoading = true;
      try {
        if (this.isEditing) {
          await actualizarMarcaFachada(this.marca.id, this.marca);
          this.successMessage = 'Marca actualizada exitosamente';
        } else {
          this.marca.idNegocio = this.negocioId;
          await registrarMarcaFachada(this.marca);
          this.successMessage = 'Marca creada exitosamente';
        }
        this.resetForm();
        this.fetchMarcas();
        this.closeModal();
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.errorMessage = 'Ya existe una marca con el mismo nombre para este negocio';
        } else {
          this.errorMessage = 'Ha ocurrido un error al guardar la marca';
        }
        console.error('Error al guardar la marca:', error);
      } finally {
        this.isLoading = false;
      }
    },
    editMarca(marca) {
      this.marca = { ...marca };
      this.isEditing = true;
      this.visibleUpdateModal = true;
    },
    openCreateModal() {
      this.resetForm();
      this.visibleCreateModal = true;
    },
    closeModal() {
      this.visibleCreateModal = false;
      this.visibleUpdateModal = false;
    },
    confirmarDesactivacion(marca) {
      this.marcaSeleccionada = marca;
      this.visibleConfirmacion = true;
    },
    async desactivarMarcaConfirmada() {
      this.isLoadingDesactivar = true;
      try {
        await desactivarMarcaFachada(this.marcaSeleccionada.id);
        this.successMessage = 'Marca eliminada exitosamente';
        this.fetchMarcas();
        this.resetForm();
      } catch (error) {
        this.errorMessage = 'Ha ocurrido un error al eliminar la marca';
        console.error('Error al eliminar la marca:', error);
      } finally {
        this.isLoadingDesactivar = false;
        this.visibleConfirmacion = false;
      }
    },
    resetForm() {
      this.marca = {
        id: null,
        nombre: '',
        idNegocio: this.negocioId
      };
      this.wasValidated = false;
      this.isEditing = false;
    }
  }
};
</script>

<style scoped>
.bwrapper {
  justify-content: center;
  align-items: center;
  height: 50vh;
  text-align: center;
}

.CCard {
  margin: 0;
  padding: 0;
}

.form-label {
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
  display: block;
  text-align: left;
}

.me-2 {
  margin-right: 0.5rem;
}

.btn-create {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .bwrapper {
    flex-direction: column;
  }
}

.text-left {
  text-align: left;
}
</style>
