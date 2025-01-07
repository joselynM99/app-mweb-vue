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
                  <button @click="buscarCliente" :disabled="isLoadingBuscar" style="border: none; background: none; margin:0px; padding:5px">
                    Buscar
                    <CSpinner v-if="isLoadingBuscar" color="light" class="spinner-border-sm" />
                  </button>
                </CInputGroupText>
              </CInputGroup>
              <hr />
              <CForm @submit.prevent="actualizarCliente" novalidate :class="{ 'was-validated': wasValidated }">
                <CAlert v-if="successMessage" color="success">{{ successMessage }}</CAlert>
                <CAlert v-if="errorMessage" color="danger">{{ errorMessage }}</CAlert>
                <CRow>
                  <CCol md="6">
                    <div class="mb-2">
                      <label for="nombres" class="form-label">Nombres</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-user"></i></CInputGroupText>
                        <CFormInput id="nombres" v-model="cliente.nombres" placeholder="Nombres" required />
                        <div class="invalid-feedback">Los nombres son obligatorios</div>
                      </CInputGroup>
                    </div>
                    <div class="mb-2">
                      <label for="apellidos" class="form-label">Apellidos</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-user"></i></CInputGroupText>
                        <CFormInput id="apellidos" v-model="cliente.apellidos" placeholder="Apellidos" required />
                        <div class="invalid-feedback">Los apellidos son obligatorios</div>
                      </CInputGroup>
                    </div>
                    <div class="mb-2">
                      <label for="correo" class="form-label">Correo</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-envelope"></i></CInputGroupText>
                        <CFormInput id="correo" v-model="cliente.correo" type="email" placeholder="Email" autocomplete="email" required />
                        <div class="invalid-feedback">El correo es obligatorio y debe ser válido</div>
                      </CInputGroup>
                    </div>
                    <div class="mb-2">
                      <label for="telefono" class="form-label">Teléfono</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-phone"></i></CInputGroupText>
                        <CFormInput id="telefono" v-model="cliente.telefono" placeholder="0900000000"  pattern="[0-9]{10}" required />
                        <div class="invalid-feedback">El teléfono es obligatorio y debe contener solo números</div>
                      </CInputGroup>
                    </div>
                  </CCol>
                  <CCol md="6">
                    <div class="mb-2">
                      <label for="tipoId" class="form-label">Tipo de identificación</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-id-card"></i></CInputGroupText>
                        <CFormSelect id="tipoId" v-model="cliente.tipoId" required>
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
                        <CFormInput id="identificacion" v-model="cliente.identificacion" placeholder="Identificación" required />
                        <div class="invalid-feedback">La identificación es obligatoria</div>
                      </CInputGroup>
                    </div>
                    <div class="mb-2">
                      <label for="direccion" class="form-label">Dirección</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-map-marker-alt"></i></CInputGroupText>
                        <CFormInput id="direccion" v-model="cliente.direccion" placeholder="Dirección" required />
                        <div class="invalid-feedback">La dirección es obligatoria</div>
                      </CInputGroup>
                    </div>
                  </CCol>
                </CRow>
                <div class="d-grid" style="width:30%; margin: 5px auto;">
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
import { obtenerClientePorIdentificacionFachada, actualizarClienteFachada } from '@/assets/js/clientes';

export default {
  data() {
    return {
      searchIdentificacion: '',
      cliente: {
        nombres: '',
        apellidos: '',
        correo: '',
        telefono: '',
        identificacion: '',
        tipoId: '',
        direccion: '',
        idNegocio: null,
        activo: true
      },
      tiposIdentificacion: ['CEDULA', 'RUC', 'PASAPORTE', 'PLACA', 'INTERNACIONAL'],
      successMessage: '',
      errorMessage: '',
      wasValidated: false,
      isLoadingBuscar: false,
      isLoadingActualizar: false,
      visibleConfirmacion: false,
      negocioId: JSON.parse(sessionStorage.getItem('usuario')).negocioId
    };
  },
  watch: {
    '$route.query.identificacion': {
      immediate: true,
      handler(newIdentificacion) {
        if (newIdentificacion) {
          this.searchIdentificacion = newIdentificacion;
          this.buscarCliente();
        }
      }
    }
  },
  methods: {
    async buscarCliente() {
      this.isLoadingBuscar = true;
      this.errorMessage = '';
      this.successMessage = '';
      try {
        const clienteData = await obtenerClientePorIdentificacionFachada(this.searchIdentificacion, this.negocioId);
        this.cliente = { ...clienteData, password: '', passwordConfirm: '' }; // Reset passwords
        this.successMessage = '';
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = 'Cliente no encontrado';
        this.successMessage = '';
        console.error('Error al buscar cliente:', error);
      } finally {
        this.isLoadingBuscar = false;
      }
    },
    async actualizarCliente() {
      this.wasValidated = true;
      this.errorMessage = '';
      this.successMessage = '';

      // Validar que todos los campos estén completos
      if (!this.cliente.nombres || !this.cliente.apellidos || !this.cliente.correo || !this.cliente.telefono ||
        !this.cliente.identificacion || !this.cliente.tipoId || !this.cliente.direccion) {
        this.errorMessage = 'Por favor, complete todos los campos obligatorios';
        return;
      }

      // Validar que los campos cumplan con los patrones requeridos
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phonePattern = /^[0-9]{10}$/;

      if (!emailPattern.test(this.cliente.correo)) {
        this.errorMessage = 'El correo no es válido';
        return;
      }

      if (!phonePattern.test(this.cliente.telefono)) {
        this.errorMessage = 'El teléfono no es válido';
        return;
      }

      // Si todos los campos son válidos, proceder con la actualización
      this.isLoadingActualizar = true;
      try {
        const response = await actualizarClienteFachada(this.searchIdentificacion, this.cliente);
        this.successMessage = 'Cliente actualizado exitosamente';
        this.errorMessage = '';
        console.log('Cliente actualizado:', response);
        this.resetForm();
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.errorMessage = 'Cliente no encontrado';
        } else {
          this.errorMessage = 'Ha ocurrido un error al actualizar el cliente';
        }
        this.successMessage = '';
        console.error('Error al actualizar cliente:', error);
      } finally {
        this.isLoadingActualizar = false;
      }
    },
    resetForm() {
      this.cliente = {
        nombres: '',
        apellidos: '',
        correo: '',
        telefono: '',
        identificacion: '',
        tipoId: '',
        direccion: '',
        idNegocio: this.negocioId,
        activo: true
      };
      this.wasValidated = false;
    }
  },
  mounted() {
    const identificacion = this.$route.query.identificacion;
    if (identificacion) {
      this.searchIdentificacion = identificacion;
      this.buscarCliente();
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
