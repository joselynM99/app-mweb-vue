<template>
  <div class="bwrapper align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="8" sm="12">
          <CCard>
            <CCardBody class="p-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5>Categorías de productos</h5>
                <CButton color="success" @click="openCreateModal" class="btn-create">
                  <i class="fas fa-plus me-2"></i> Agregar
                </CButton>
              </div>

              <CInputGroup class="mb-2">
                <CInputGroupText>
                  <i class="fas fa-search fa-fw"></i>
                </CInputGroupText>
                <CFormInput v-model="searchQuery" @input="debouncedBuscarCategorias" placeholder="Buscar por nombre" />
              </CInputGroup>
              <CSpinner v-if="isLoadingCategorias" color="success" class="spinner-border-sm" />

              <CAlert v-if="infoMessage" color="info">{{ infoMessage }}</CAlert>
              <CAlert v-if="successMessage" color="info">{{ successMessage }}</CAlert>
              <CAlert v-if="errorMessage" color="danger">{{ errorMessage }}</CAlert>

              <CTable v-if="categorias.length > 0" hover>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell scope="col" class="text-left">Nombre</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style="width: 150px;" class="text-left">Descripción</CTableHeaderCell>
                    <CTableHeaderCell scope="col" class="text-center">Acciones</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow v-for="categoria in categorias" :key="categoria.id">
                    <CTableDataCell class="text-left">{{ categoria.nombre }}</CTableDataCell>
                    <CTableDataCell class="text-left" style="width: 150px;">{{ categoria.descripcion }}</CTableDataCell>
                    <CTableDataCell class="text-center">
                      <CButton color="warning" class="me-2" @click="editCategoria(categoria)">
                        <i class="fas fa-edit"></i>
                      </CButton>
                      <CButton color="danger" @click="confirmarDesactivacion(categoria)">
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
        <CModalTitle>{{ isEditing ? 'Actualizar' : 'Crear' }} Categoría</CModalTitle>
      </CModalHeader>
      <CModalBody>

        <CForm @submit.prevent="handleSubmit" novalidate :class="{ 'was-validated': wasValidated }">
          <div class="mb-2">
            <label for="nombre" class="form-label">Nombre</label>
            <CInputGroup>
              <CInputGroupText><i class="fas fa-tag"></i></CInputGroupText>
              <CFormInput id="nombre" v-model="categoria.nombre" placeholder="Nombre" required />
              <div class="invalid-feedback">El nombre es obligatorio</div>
            </CInputGroup>
          </div>
          <div class="mb-2">
            <label for="descripcion" class="form-label">Descripción</label>
            <CInputGroup>
              <CInputGroupText><i class="fas fa-info-circle"></i></CInputGroupText>
              <CFormInput id="descripcion" v-model="categoria.descripcion" placeholder="Descripción" required />
              <div class="invalid-feedback">La descripción es obligatoria</div>
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
      <CModalBody>¿Estás seguro de que deseas eliminar esta categoría?</CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="visibleConfirmacion = false">Cancelar</CButton>
        <CButton color="danger" @click="desactivarCategoriaConfirmada">
          Eliminar
          <CSpinner v-if="isLoadingDesactivar" color="light" class="spinner-border-sm" />
        </CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script>
import { debounce } from 'lodash';
import { registrarCategoriaFachada, actualizarCategoriaFachada, listaCategoriasFachada, listaCategoriasPorNombreFachada, desactivarCategoriaFachada } from '@/assets/js/categorias';

export default {
  data() {
    return {
      negocioId: null,
      categoria: {
        id: null,
        nombre: '',
        descripcion: '',
        idNegocio: null
      },
      categorias: [],
      searchQuery: '',
      successMessage: '',
      errorMessage: '',
      infoMessage: '',
      wasValidated: false,
      isLoading: false,
      isLoadingCategorias: false,
      isLoadingDesactivar: false,
      visibleCreateModal: false,
      visibleUpdateModal: false,
      visibleConfirmacion: false,
      categoriaSeleccionada: null,
      isEditing: false
    };
  },
  mounted() {
    this.negocioId = JSON.parse(sessionStorage.getItem('usuario')).negocioId  || JSON.parse(sessionStorage.getItem('negocioId'));
    this.fetchCategorias();
  },
  created() {
    this.debouncedBuscarCategorias = debounce(this.buscarCategorias, 300);
  },
  methods: {
    async fetchCategorias() {
      this.isLoadingCategorias = true;
      this.errorMessage = '';
      this.infoMessage = '';
      try {
        const response = await listaCategoriasFachada(this.negocioId);
        this.categorias = response;
        if (this.categorias.length === 0) {
          this.infoMessage = 'No se encontraron categorías activas para el negocio especificado.';
        }
      } catch (err) {
        console.error('Error al obtener las categorías:', err);
        if (err.response && err.response.status === 404) {
          this.infoMessage = 'No se encontraron categorías para su negocio.';
        } else {
          this.errorMessage = 'Error al obtener la lista de categorías. Inténtalo de nuevo más tarde.';
        }
      } finally {
        this.isLoadingCategorias = false;
      }
    },
    async buscarCategorias() {
      if (!this.searchQuery) {
        this.fetchCategorias();
        return;
      }

      this.isLoadingCategorias = true;
      this.errorMessage = '';
      this.infoMessage = '';
      try {
        const response = await listaCategoriasPorNombreFachada(this.searchQuery, this.negocioId);
        this.categorias = response;
        if (this.categorias.length === 0) {
          this.infoMessage = 'No se encontraron categorías con el nombre especificado';
        }
      } catch (err) {
        console.error('Error al buscar categorías:', err);
        if (err.response && err.response.status === 404) {
          this.infoMessage = 'No se encontraron categorías con el nombre especificado';
        } else {
          this.errorMessage = 'Error al obtener la lista de categorías. Inténtalo de nuevo más tarde.';
        }
      } finally {
        this.isLoadingCategorias = false;
      }
    },
    async handleSubmit() {
      this.wasValidated = true;
      this.errorMessage = '';
      this.successMessage = '';

      if (!this.categoria.nombre || !this.categoria.descripcion) {
        this.errorMessage = 'Por favor, complete todos los campos obligatorios';
        return;
      }

      this.isLoading = true;
      try {
        if (this.isEditing) {
          await actualizarCategoriaFachada(this.categoria.id, this.categoria);
          this.successMessage = 'Categoría actualizada exitosamente';
        } else {
          this.categoria.idNegocio = this.negocioId;
          await registrarCategoriaFachada(this.categoria);
          this.successMessage = 'Categoría creada exitosamente';
        }
        this.resetForm();
        this.fetchCategorias();
        this.closeModal();
      } catch (error) {
        this.errorMessage = 'Ha ocurrido un error al guardar la categoría';
        console.error('Error al guardar la categoría:', error);
      } finally {
        this.isLoading = false;
      }
    },
    editCategoria(categoria) {
      this.categoria = { ...categoria };
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
    confirmarDesactivacion(categoria) {
      this.categoriaSeleccionada = categoria;
      this.visibleConfirmacion = true;
    },
    async desactivarCategoriaConfirmada() {
      this.isLoadingDesactivar = true;
      try {
        await desactivarCategoriaFachada(this.categoriaSeleccionada.id);
        this.successMessage = 'Categoría eliminada exitosamente';
        this.fetchCategorias();
        this.resetForm();
      } catch (error) {
        this.errorMessage = 'Ha ocurrido un error al eliminar la categoría';
        console.error('Error al eliminar la categoría:', error);
      } finally {
        this.isLoadingDesactivar = false;
        this.visibleConfirmacion = false;
      }
    },
    resetForm() {
      this.categoria = {
        id: null,
        nombre: '',
        descripcion: '',
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
