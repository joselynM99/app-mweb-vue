<template>
  <div class="bwrapper align-items-center">
    <CContainer style="max-width:600px">
      <CRow class="justify-content-center">
        <CCol>
          <CCard style="margin-bottom:12px;">
            <CCardBody class="p-4">
              <h5>Perfil de negocio</h5>
              <CForm @submit.prevent="actualizarNegocio" novalidate :class="{ 'was-validated': wasValidated }">
                <p class="text-body-secondary"></p>
                <CAlert v-if="successMessage" color="success">{{ successMessage }}</CAlert>
                <CAlert v-if="errorMessage" color="danger">{{ errorMessage }}</CAlert>
                <CRow>
                  <CCol>
                    <div class="mb-2">
                      <label for="nombreComercial" class="form-label">Nombre Comercial</label>
                      <CInputGroup>
                        <CInputGroupText>
                          <i class="fas fa-building fa-fw"></i>
                        </CInputGroupText>
                        <CFormInput id="nombreComercial" v-model="negocio.nombreComercial"
                          placeholder="Nombre Comercial" :readonly="isEmpleado" required />
                        <div class="invalid-feedback">El nombre comercial es obligatorio</div>
                      </CInputGroup>
                    </div>
                    <div class="mb-2">
                      <label for="direccion" class="form-label">Dirección</label>
                      <CInputGroup>
                        <CInputGroupText>
                          <i class="fas fa-map-marker-alt fa-fw"></i>
                        </CInputGroupText>
                        <CFormInput id="direccion" v-model="negocio.direccion" placeholder="Dirección" :readonly="isEmpleado" required />
                        <div class="invalid-feedback">La dirección es obligatoria</div>
                      </CInputGroup>
                    </div>
                    <div class="mb-2">
                      <label for="telefono" class="form-label">Teléfono</label>
                      <CInputGroup>
                        <CInputGroupText>
                          <i class="fas fa-phone-alt fa-fw"></i>
                        </CInputGroupText>
                        <CFormInput id="telefono" v-model="negocio.telefono" type="tel" placeholder="Teléfono" :readonly="isEmpleado" required
                          pattern="[0-9]{10}" />
                        <div class="invalid-feedback">El teléfono es obligatorio y debe contener solo números</div>
                      </CInputGroup>
                    </div>
                    <div class="mb-2">
                      <label for="razonSocial" class="form-label">Razón Social</label>
                      <CInputGroup>
                        <CInputGroupText>
                          <i class="fas fa-id-card fa-fw"></i>
                        </CInputGroupText>
                        <CFormInput id="razonSocial" v-model="negocio.razonSocial" placeholder="Razón Social" :readonly="isEmpleado"
                          required />
                        <div class="invalid-feedback">La razón social es obligatoria</div>
                      </CInputGroup>
                    </div>
                    <div class="mb-2">
                      <label for="ruc" class="form-label">RUC</label>
                      <CInputGroup>
                        <CInputGroupText>
                          <i class="fas fa-id-card fa-fw"></i>
                        </CInputGroupText>
                        <CFormInput id="ruc" v-model="negocio.ruc" placeholder="RUC" :readonly="isEmpleado" required />
                        <div class="invalid-feedback">El RUC es obligatorio</div>
                      </CInputGroup>
                    </div>
                  </CCol>
                </CRow>
                <div v-if="!isEmpleado" class="d-grid" style="width:35%; margin: 5px auto;">
                  <CButton color="success" type="submit" :disabled="isLoadingActualizar">
                    Actualizar
                    <CSpinner v-if="isLoadingActualizar" color="light" class="spinner-border-sm" />
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import { actualizarNegocioFachada, obtenerNegocioPorIdFachada } from '@/assets/js/negocios';

export default {
 
  data() {
    return {
      negocio: {
        id: null,
        nombreComercial: '',
        direccion: '',
        telefono: '',
        razonSocial: '',
        ruc: '',
        activo: true
      },
      successMessage: '',
      errorMessage: '',
      wasValidated: false,
      isLoadingBuscar: false,
      isLoadingActualizar: false,
      negocioId: '',
      rolUsuario: ''
    };
  },
  computed: {
    isEmpleado() {
      return this.rolUsuario === 'EMPLEADO';
    }
  },
  async mounted() {
    const usuario = JSON.parse(sessionStorage.getItem('usuario'));
    this.negocioId = usuario.negocioId || JSON.parse(sessionStorage.getItem('negocioId'));
    this.rolUsuario = usuario.rol;
    await this.buscarNegocio(this.negocioId);
  },
  methods: {
    async buscarNegocio(id) {
      this.isLoadingBuscar = true;
      try {
        const negocioData = await obtenerNegocioPorIdFachada(id);
        this.negocio = { ...negocioData };
        this.successMessage = '';
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = 'Negocio no encontrado';
        this.successMessage = '';
        console.error('Error al buscar negocio:', error);
      } finally {
        this.isLoadingBuscar = false;
      }
    },
    async actualizarNegocio() {
      this.wasValidated = true;
      this.isLoadingActualizar = true;

      // Validar que todos los campos estén completos
      if (!this.negocio.nombreComercial || !this.negocio.direccion || !this.negocio.telefono ||
        !this.negocio.razonSocial || !this.negocio.ruc) {
        this.errorMessage = 'Por favor, complete todos los campos obligatorios';
        this.successMessage = '';
        this.isLoadingActualizar = false;
        return;
      }

      try {
        const response = await actualizarNegocioFachada(this.negocioId, this.negocio);
        this.successMessage = 'Negocio actualizado exitosamente';
        this.errorMessage = '';
        await this.buscarNegocio(this.negocioId);
      } catch (error) {
        this.errorMessage = 'Ha ocurrido un error al actualizar el negocio';
        this.successMessage = '';
        console.error('Error al actualizar negocio:', error);
      } finally {
        this.isLoadingActualizar = false;
      }
    },
    resetForm() {
      this.negocio = {
        id: null,
        nombreComercial: '',
        direccion: '',
        telefono: '',
        razonSocial: '',
        ruc: '',
        activo: true
      };
      this.wasValidated = false;
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
</style>