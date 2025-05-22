<template>
  <div class="bwrapper align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol>
          <CCard>
            <CCardBody class="p-3">
              <CForm @submit.prevent="registrarProveedor" novalidate :class="{ 'was-validated': wasValidated }">
                <CAlert v-if="successMessage" color="success">{{ successMessage }}</CAlert>
                <CAlert v-if="errorMessage" color="danger">{{ errorMessage }}</CAlert>
                <CRow>
                  <CCol md="6">
                    <div class="mb-2">
                      <label for="razonSocial" class="form-label">Razón Social</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-building"></i></CInputGroupText>
                        <CFormInput id="razonSocial" v-model="proveedor.razonSocial" placeholder="Razón Social" required />
                        <div class="invalid-feedback">La razón social es obligatoria</div>
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="nombreComercial" class="form-label">Nombre Comercial</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-store"></i></CInputGroupText>
                        <CFormInput id="nombreComercial" v-model="proveedor.nombreComercial" placeholder="Nombre Comercial" required />
                        <div class="invalid-feedback">El nombre comercial es obligatorio</div>
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="correo" class="form-label">Correo</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-envelope"></i></CInputGroupText>
                        <CFormInput id="correo" v-model="proveedor.correo" type="email" placeholder="Email" autocomplete="email" required />
                        <div class="invalid-feedback">El correo es obligatorio y debe ser válido</div>
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="telefono" class="form-label">Teléfono</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-phone"></i></CInputGroupText>
                        <CFormInput id="telefono" v-model="proveedor.telefono" placeholder="Teléfono" required />
                        <div class="invalid-feedback">El teléfono es obligatorio</div>
                      </CInputGroup>
                    </div>
                  </CCol>
                  <CCol md="6">
                    <div class="mb-2">
                      <label for="tipoId" class="form-label">Tipo de identificación</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-id-card"></i></CInputGroupText>
                        <CFormSelect id="tipoId" v-model="proveedor.tipoIdentificacion" required>
                          <option value="" disabled selected>Seleccione un tipo de identificación</option>
                          <option v-for="tipo in tiposIdentificacion" :key="tipo" :value="tipo">{{ tipo }}</option>
                        </CFormSelect>
                        <div class="invalid-feedback">El tipo de identificación es obligatorio</div>
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="identificacion" class="form-label">Identificación</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-id-badge"></i></CInputGroupText>
                        <CFormInput id="identificacion" v-model="proveedor.identificacion" placeholder="Identificación" required />
                        <div class="invalid-feedback">La identificación es obligatoria</div>
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="direccion" class="form-label">Dirección</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-map-marker-alt"></i></CInputGroupText>
                        <CFormInput id="direccion" v-model="proveedor.direccion" placeholder="Dirección" required />
                        <div class="invalid-feedback">La dirección es obligatoria</div>
                      </CInputGroup>
                    </div>
                  </CCol>
                </CRow>
                <div class="d-grid" style="width:30%; margin: 2px auto;">
                  <CButton color="success" type="submit" :disabled="isLoading">
                    Registrar
                    <CSpinner v-if="isLoading" color="light" class="spinner-border-sm" />
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
import { registrarProveedorFachada } from '@/assets/js/proveedor';

export default {
  data() {
    return {
      negocioId: null,
      proveedor: {
        tipoIdentificacion: '',
        identificacion: '',
        razonSocial: '',
        nombreComercial: '',
        telefono: '',
        correo: '',
        direccion: '',
        idNegocio: null
      },
      tiposIdentificacion: ['CEDULA', 'RUC', 'PASAPORTE', 'PLACA', 'INTERNACIONAL'],
      successMessage: '',
      errorMessage: '',
      wasValidated: false,
      isLoading: false
    };
  },
  mounted() {
    this.negocioId = JSON.parse(sessionStorage.getItem('usuario')).negocioId || JSON.parse(sessionStorage.getItem('negocioId'));
  },
  methods: {
    resetForm() {
      this.proveedor = {
        tipoIdentificacion: '',
        identificacion: '',
        razonSocial: '',
        nombreComercial: '',
        telefono: '',
        correo: '',
        direccion: '',
        idNegocio: this.negocioId
      };
      this.wasValidated = false;
    },
    async registrarProveedor() {
      this.wasValidated = true;
      this.errorMessage = '';
      this.successMessage = '';

      // Validar que todos los campos estén completos
      if (!this.proveedor.tipoIdentificacion || !this.proveedor.identificacion || !this.proveedor.razonSocial || !this.proveedor.nombreComercial ||
        !this.proveedor.telefono || !this.proveedor.correo || !this.proveedor.direccion) {
        this.errorMessage = 'Por favor, complete todos los campos obligatorios';
        this.isLoading = false;
        return;
      }

      // Validar que los campos cumplan con los patrones requeridos
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phonePattern = /^[0-9]{10}$/;

      if (!emailPattern.test(this.proveedor.correo)) {
        this.errorMessage = 'El correo no es válido';
        this.isLoading = false;
        return;
      }

      if (!phonePattern.test(this.proveedor.telefono)) {
        this.errorMessage = 'El teléfono no es válido';
        this.isLoading = false;
        return;
      }

      // Si todos los campos son válidos, proceder con el registro
      this.isLoading = true;
      this.proveedor.idNegocio = this.negocioId;
      try {
        const response = await registrarProveedorFachada(this.proveedor);
        this.successMessage = 'Proveedor registrado exitosamente';
        this.errorMessage = '';
        this.resetForm();
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.errorMessage = 'Ya existe un proveedor con el mismo número de identificación';
        } else {
          this.errorMessage = 'Ha ocurrido un error al registrar el proveedor';
        }
        this.successMessage = '';
        console.error('Error al registrar proveedor:', error);
      } finally {
        this.isLoading = false;
      }
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
