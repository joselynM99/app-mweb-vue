<template>
  <div class="bwrapper align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="8" sm="12">
          <CCard>
            <CCardBody class="p-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="mb-0">Cajas del Negocio</h5>
                <CButton color="success" @click="openCreateModal" class="btn-create">
                  <i class="fas fa-plus me-2"></i> Agregar
                </CButton>
              </div>
              <CSpinner v-if="isLoadingCajas" color="primary" class="spinner-border-sm" />
              <CTable v-if="cajas.length > 0" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                    <CTableHeaderCell scope="col" class="text-center">Acciones</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow v-for="caja in cajas" :key="caja.id">
                    <CTableDataCell>{{ caja.nombre }}</CTableDataCell>
                    <CTableDataCell class="text-center">
                      <CButton color="warning" size="sm" @click="openUpdateModal(caja)" class="me-2">
                        <i class="fas fa-edit"></i>
                      </CButton>
                      <CButton color="danger" size="sm" @click="confirmarDesactivacion(caja)">
                        <i class="fas fa-trash-alt"></i>
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
              <CAlert v-if="!cajas.length && !isLoadingCajas" color="info">
                No se encontraron cajas activas para el negocio especificado.
              </CAlert>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>

    <!-- Modal de creación -->
    <CModal :visible="visibleCreateModal" @close="visibleCreateModal = false">
      <CModalHeader @close="visibleCreateModal = false">
        <CModalTitle>Crear Caja</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm @submit.prevent="handleSubmitCreate" novalidate :class="{ 'was-validated': wasValidated }">
          <div class="mb-3">
            <label for="nombreCajaCreate" class="form-label">Nombre de Caja</label>
            <CInputGroup>
              <CFormInput id="nombreCajaCreate" v-model="caja.nombre" placeholder="Nombre de Caja" required />
              <div class="invalid-feedback">El nombre de la caja es obligatorio</div>
            </CInputGroup>
          </div>
          <div class="d-grid">
            <CButton color="primary" type="submit" :disabled="isLoading">
              Crear
              <CSpinner v-if="isLoading" color="light" class="spinner-border-sm" />
            </CButton>
          </div>
        </CForm>
      </CModalBody>
    </CModal>

    <!-- Modal de actualización -->
    <CModal :visible="visibleUpdateModal" @close="visibleUpdateModal = false">
      <CModalHeader @close="visibleUpdateModal = false">
        <CModalTitle>Actualizar Caja</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm @submit.prevent="handleSubmitUpdate" novalidate :class="{ 'was-validated': wasValidated }">
          <div class="mb-3">
            <label for="nombreCajaUpdate" class="form-label">Nombre de Caja</label>
            <CInputGroup>
              <CFormInput id="nombreCajaUpdate" v-model="caja.nombre" placeholder="Nombre de Caja" required />
              <div class="invalid-feedback">El nombre de la caja es obligatorio</div>
            </CInputGroup>
          </div>
          <div class="d-grid">
            <CButton color="warning" type="submit" :disabled="isLoading">
              Actualizar
              <CSpinner v-if="isLoading" color="light" class="spinner-border-sm" />
            </CButton>
          </div>
        </CForm>
      </CModalBody>
    </CModal>

    <!-- Modal de confirmación -->
    <CModal :visible="visibleConfirmacion" @close="visibleConfirmacion = false">
      <CModalHeader @close="visibleConfirmacion = false">
        <CModalTitle>Confirmar Eliminación</CModalTitle>
      </CModalHeader>
      <CModalBody>¿Estás seguro de que deseas eliminar esta caja?</CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="visibleConfirmacion = false">Cancelar</CButton>
        <CButton color="danger" @click="desactivarCajaConfirmada">
          Eliminar
          <CSpinner v-if="isLoadingDesactivar" color="light" class="spinner-border-sm" />
        </CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script>
import { crearCajaFachada, obtenerCajasActivasPorNegocioFachada, desactivarCajaFachada, actualizarCajaFachada } from '@/assets/js/gestion-cajas';

export default {
  data() {
    return {
      negocioId: null,
      caja: {
        id: null,
        nombre: '',
        idNegocio: null
      },
      cajas: [],
      successMessage: '',
      errorMessage: '',
      wasValidated: false,
      isLoading: false,
      isLoadingCajas: false,
      isLoadingDesactivar: false,
      visibleCreateModal: false,
      visibleUpdateModal: false,
      visibleConfirmacion: false,
      cajaSeleccionada: null,
      isEditing: false
    };
  },
  mounted() {
    this.negocioId = JSON.parse(sessionStorage.getItem('usuario')).negocioId;
    this.fetchCajas();
  },
  methods: {
    async fetchCajas() {
      this.isLoadingCajas = true;
      try {
        this.cajas = await obtenerCajasActivasPorNegocioFachada(this.negocioId);
      } catch (error) {
        this.errorMessage = 'Error al obtener las cajas activas';
        console.error('Error al obtener las cajas activas:', error);
      } finally {
        this.isLoadingCajas = false;
      }
    },
    openCreateModal() {
      this.resetForm();
      this.visibleCreateModal = true;
    },
    openUpdateModal(caja) {
      this.caja = { ...caja };
      this.visibleUpdateModal = true;
    },
    async handleSubmitCreate() {
      this.wasValidated = true;
      this.errorMessage = '';
      this.successMessage = '';

      if (!this.caja.nombre) {
        this.errorMessage = 'Por favor, complete todos los campos obligatorios';
        return;
      }

      this.isLoading = true;
      try {
        this.caja.idNegocio = this.negocioId;
        await crearCajaFachada(this.caja);
        this.successMessage = 'Caja creada exitosamente';
        this.fetchCajas();
        this.visibleCreateModal = false;
      } catch (error) {
        this.errorMessage = 'Ha ocurrido un error al guardar la caja';
        console.error('Error al guardar la caja:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async handleSubmitUpdate() {
      this.wasValidated = true;
      this.errorMessage = '';
      this.successMessage = '';

      if (!this.caja.nombre) {
        this.errorMessage = 'Por favor, complete todos los campos obligatorios';
        return;
      }

      this.isLoading = true;
      try {
        this.caja.idNegocio = this.negocioId;
        await actualizarCajaFachada(this.caja);
        this.successMessage = 'Caja actualizada exitosamente';
        this.fetchCajas();
        this.visibleUpdateModal = false;
      } catch (error) {
        this.errorMessage = 'Ha ocurrido un error al actualizar la caja';
        console.error('Error al actualizar la caja:', error);
      } finally {
        this.isLoading = false;
      }
    },
    confirmarDesactivacion(caja) {
      this.cajaSeleccionada = caja;
      this.visibleConfirmacion = true;
    },
    async desactivarCajaConfirmada() {
      this.isLoadingDesactivar = true;
      try {
        await desactivarCajaFachada(this.cajaSeleccionada.id);
        this.successMessage = 'Caja eliminada exitosamente';
        this.fetchCajas();
      } catch (error) {
        this.errorMessage = 'Ha ocurrido un error al eliminar la caja';
        console.error('Error al eliminar la caja:', error);
      } finally {
        this.isLoadingDesactivar = false;
        this.visibleConfirmacion = false;
      }
    },
    resetForm() {
      this.caja = {
        id: null,
        nombre: ''
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
  font-size: 0.9rem;
  color: #495057;
  margin-bottom: 0.5rem;
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
</style>
