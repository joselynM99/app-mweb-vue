<template>
  <div class="bwrapper align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="6" sm="12">
          <CCard>
            <CCardBody class="p-3">
              <h5>{{ isEditing ? 'Actualizar' : 'Crear' }} Caja</h5>
              <CAlert v-if="successMessage" color="success">{{ successMessage }}</CAlert>
              <CAlert v-if="errorMessage" color="danger">{{ errorMessage }}</CAlert>
              <CForm @submit.prevent="handleSubmit" novalidate :class="{ 'was-validated': wasValidated }">
                <CRow>
                  <CCol>
                    <div class="mb-2">
                      <label for="nombreCaja" class="form-label">Nombre de Caja</label>
                      <CInputGroup>
                        <CFormInput id="nombreCaja" v-model="caja.nombre" placeholder="Nombre de Caja" required />
                        <div class="invalid-feedback">El nombre de la caja es obligatorio</div>
                      </CInputGroup>
                    </div>
                  </CCol>
                </CRow>
                <div class="d-grid" style="width:50%; margin: 5px auto;">
                  <CButton :color="isEditing ? 'warning' : 'success'" type="submit" :disabled="isLoading">
                    {{ isEditing ? 'Actualizar' : 'Crear' }}
                    <CSpinner v-if="isLoading" color="light" class="spinner-border-sm" />
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md="6" sm="12">
          <CCard>
            <CCardBody class="p-3">
              <h5>Cajas del Negocio</h5>
              <CSpinner v-if="isLoadingCajas" color="success" class="spinner-border-sm" />
              <CTable v-if="cajas.length > 0" hover>
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
                      <CButton color="warning" size="sm" @click="editCaja(caja)" class="me-2">
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
    async handleSubmit() {
      this.wasValidated = true;
      this.errorMessage = '';
      this.successMessage = '';

      if (!this.caja.nombre) {
        this.errorMessage = 'Por favor, complete todos los campos obligatorios';
        return;
      }

      this.isLoading = true;
      try {
        if (this.isEditing) {
          this.caja.idNegocio = this.negocioId;
          await actualizarCajaFachada(this.caja);
          this.successMessage = 'Caja actualizada exitosamente';
        } else {
          this.caja.idNegocio = this.negocioId;
          await crearCajaFachada(this.caja);
          this.successMessage = 'Caja creada exitosamente';
        }
        this.resetForm();
        this.fetchCajas();
      } catch (error) {
        this.errorMessage = 'Ha ocurrido un error al guardar la caja';
        console.error('Error al guardar la caja:', error);
      } finally {
        this.isLoading = false;
      }
    },
    editCaja(caja) {
      this.caja = { ...caja };
      this.isEditing = true;
      this.scrollToForm();
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
        this.resetForm();
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
    },
    scrollToForm() {
      this.$nextTick(() => {
        const formElement = this.$el.querySelector('form');
        formElement.scrollIntoView({ behavior: 'smooth' });
      });
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

@media (max-width: 768px) {
  .bwrapper {
    flex-direction: column;
  }
}
</style>
