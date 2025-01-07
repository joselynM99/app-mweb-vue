<template>
  <div class="bwrapper align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol>
          <CCard style="margin-bottom:12px;">
            <CCardBody class="p-4">
              <CInputGroup class="mb-2">
                <CInputGroupText>
                  <i class="fas fa-search fa-fw"></i>
                </CInputGroupText>
                <CFormInput v-model="searchIdentificacion" placeholder="Buscar por identificación" required />
                <CInputGroupText style="padding:0px 5px">
                  <button @click="buscarProveedor" :disabled="isLoadingBuscar" style="border: none; background: none; margin:0px; padding:5px">
                    Buscar
                    <CSpinner v-if="isLoadingBuscar" color="light" class="spinner-border-sm" />
                  </button>
                </CInputGroupText>
              </CInputGroup>
              <hr />
              <CForm @submit.prevent="actualizarProveedor" novalidate :class="{ 'was-validated': wasValidated }">
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
                <div class="d-grid" style="width:35%; margin: 5px auto;">
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
import { obtenerProveedorIdentificacionFachada, actualizarProveedorFachada } from '@/assets/js/proveedor';

export default {
  data() {
    return {
      searchIdentificacion: '',
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
      isLoadingBuscar: false,
      isLoadingActualizar: false,
      negocioId: JSON.parse(sessionStorage.getItem('usuario')).negocioId
    };
  },
  watch: {
    '$route.query.identificacion': {
      immediate: true,
      handler(newIdentificacion) {
        if (newIdentificacion) {
          this.searchIdentificacion = newIdentificacion;
          this.buscarProveedor();
        }
      }
    }
  },
  methods: {
    async buscarProveedor() {
      this.isLoadingBuscar = true;
      this.errorMessage = '';
      this.successMessage = '';
      try {
        const proveedorData = await obtenerProveedorIdentificacionFachada(this.searchIdentificacion, this.negocioId);
        this.proveedor = { ...proveedorData };
        this.successMessage = '';
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = 'Proveedor no encontrado';
        this.successMessage = '';
        console.error('Error al buscar proveedor:', error);
      } finally {
        this.isLoadingBuscar = false;
      }
    },
    async actualizarProveedor() {
      this.wasValidated = true;
      this.errorMessage = '';
      this.successMessage = '';

      // Validar que todos los campos estén completos
      if (!this.proveedor.tipoIdentificacion || !this.proveedor.identificacion || !this.proveedor.razonSocial || !this.proveedor.nombreComercial ||
        !this.proveedor.telefono || !this.proveedor.correo || !this.proveedor.direccion) {
        this.errorMessage = 'Por favor, complete todos los campos obligatorios';
        return;
      }

      // Validar que los campos cumplan con los patrones requeridos
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phonePattern = /^[0-9]{10}$/;

      if (!emailPattern.test(this.proveedor.correo)) {
        this.errorMessage = 'El correo no es válido';
        return;
      }

      if (!phonePattern.test(this.proveedor.telefono)) {
        this.errorMessage = 'El teléfono no es válido';
        return;
      }

      // Si todos los campos son válidos, proceder con la actualización
      this.isLoadingActualizar = true;
      try {
        const response = await actualizarProveedorFachada(this.searchIdentificacion, this.proveedor);
        this.successMessage = 'Proveedor actualizado exitosamente';
        this.errorMessage = '';
        this.resetForm();
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.errorMessage = 'Proveedor no encontrado';
        } else {
          this.errorMessage = 'Ha ocurrido un error al actualizar el proveedor';
        }
        this.successMessage = '';
        console.error('Error al actualizar proveedor:', error);
      } finally {
        this.isLoadingActualizar = false;
      }
    },
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
    }
  },
  mounted() {
    const identificacion = this.$route.query.identificacion;
    if (identificacion) {
      this.searchIdentificacion = identificacion;
      this.buscarProveedor();
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
