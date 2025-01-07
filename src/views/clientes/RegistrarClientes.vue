<template>
  <div class="bwrapper align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol>
          <CCard>
            <CCardBody class="p-3">
              <CForm @submit.prevent="registrarCliente" novalidate :class="{ 'was-validated': wasValidated }">
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
                      <label for="correo" class="form-label">Correo electrónico</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-envelope"></i></CInputGroupText>
                        <CFormInput id="correo" v-model="cliente.correo" type="email" placeholder="Email"
                          autocomplete="email" required />
                        <div class="invalid-feedback">El correo es obligatorio y debe ser válido</div>
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="telefono" class="form-label">Teléfono</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-phone"></i></CInputGroupText>
                        <CFormInput id="telefono" v-model="cliente.telefono" placeholder="0900000000" required
                          pattern="[0-9]{10}" />

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
                        <CFormInput id="identificacion" v-model="cliente.identificacion" placeholder="Identificación"
                          required />
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
import { crearClienteFachada } from '@/assets/js/clientes';

export default {
  data() {
    return {
      negocioId: null,
      cliente: {
        nombres: '',
        apellidos: '',
        correo: '',
        telefono: '',
        identificacion: '',
        tipoId: '',
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
    this.negocioId = JSON.parse(sessionStorage.getItem('usuario')).negocioId;
  },
  methods: {
    resetForm() {
      this.cliente = {
        nombres: '',
        apellidos: '',
        correo: '',
        telefono: '',
        identificacion: '',
        tipoId: '',
        direccion: '',
        idNegocio: this.negocioId
      };
      this.wasValidated = false;
    },

    async registrarCliente() {
      this.wasValidated = true;
      this.errorMessage = '';
      this.successMessage = '';

      // Validar que todos los campos estén completos y sean válidos
      if (!this.cliente.nombres || !this.cliente.apellidos || !this.cliente.correo ||
        !this.cliente.identificacion || !this.cliente.tipoId ||
        !this.cliente.direccion) {
        this.errorMessage = 'Por favor, complete todos los campos obligatorios correctamente';
        return;
      }

      // Validar el correo electrónico
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.cliente.correo)) {
        this.errorMessage = 'El correo no es válido';
        return;
      }

      // Si todos los campos son válidos, proceder con el registro
      this.isLoading = true;
      this.cliente.idNegocio = this.negocioId;
      try {
        const response = await crearClienteFachada(this.cliente);
        this.successMessage = 'Cliente registrado exitosamente';
        this.errorMessage = '';
        this.resetForm();
        this.$emit('cliente-registrado', response.data); // Emitir evento con el cliente registrado
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.errorMessage = 'Ya existe un cliente con el mismo número de identificación';
        } else {
          this.errorMessage = 'Ha ocurrido un error al registrar el cliente';
        }
        this.successMessage = '';
        console.error('Error al registrar cliente:', error);
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

.is-invalid {
  border-color: #dc3545;
}

/* Evitar que el input se ponga verde si no es válido */
.form-control.is-invalid:valid {
  border-color: #ced4da;
  background-image: none;
}
</style>
