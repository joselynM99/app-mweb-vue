<template>
  <div class="bwrapper align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol>
          <CCard>
            <CCardBody class="p-4">
              <CForm @submit.prevent="registrarUsuario" novalidate :class="{ 'was-validated': wasValidated }">
                <h3>Registro</h3>
                <p class="text-body-secondary"></p>
                <CAlert v-if="successMessage" color="success">{{ successMessage }}</CAlert>
                <CAlert v-if="errorMessage" color="danger">{{ errorMessage }}</CAlert>
                <CRow>
                  <CCol>
                    <CInputGroup class="mb-3">
                      <CInputGroupText>
                        <i class="fas fa-user fa-fw"></i>
                      </CInputGroupText>
                      <CFormInput v-model="usuario.nombreUsuario" placeholder="Nombre de usuario" autocomplete="username" required />
                      <div class="invalid-feedback">El nombre de usuario es obligatorio</div>
                    </CInputGroup>

                    <CInputGroup class="mb-3">
                      <CInputGroupText>
                        <i class="fas fa-envelope fa-fw"></i>
                      </CInputGroupText>
                      <CFormInput v-model="usuario.correo" type="email" placeholder="Email" autocomplete="email" required />
                      <div class="invalid-feedback">El correo es obligatorio y debe ser válido</div>
                    </CInputGroup>

                    <CInputGroup class="mb-3">
                      <CInputGroupText>
                        <i class="fas fa-user-tag fa-fw"></i>
                      </CInputGroupText>
                      <CFormSelect v-model="usuario.rol" required>
                        <option disabled :selected="!usuario.rol" value="">Seleccione un rol</option>
                        <option v-for="rol in filteredRoles" :key="rol.id" :value="rol.nombre">{{ rol.nombre }}</option>
                      </CFormSelect>
                      <div class="invalid-feedback">El rol es obligatorio</div>
                    </CInputGroup>

                    <CInputGroup class="mb-3">
                      <CInputGroupText>
                        <i class="fas fa-lock fa-fw"></i>
                      </CInputGroupText>
                      <CFormInput v-model="usuario.password" type="password" placeholder="Contraseña" autocomplete="new-password" required pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}" />
                      <div class="invalid-feedback">La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula, un número y un carácter especial</div>
                    </CInputGroup>

                    <CInputGroup class="mb-4">
                      <CInputGroupText>
                        <i class="fas fa-lock fa-fw"></i>
                      </CInputGroupText>
                      <CFormInput v-model="usuario.passwordConfirm" type="password" placeholder="Repita la contraseña" autocomplete="new-password" required />
                      <div class="invalid-feedback">La confirmación de la contraseña es obligatoria y debe coincidir</div>
                    </CInputGroup>
                  </CCol>
                  <CCol :md="6">
                    <CInputGroup class="mb-3">
                      <CInputGroupText>
                        <i class="fas fa-id-card fa-fw"></i>
                      </CInputGroupText>
                      <CFormInput v-model="usuario.nombre" placeholder="Nombre" required />
                      <div class="invalid-feedback">El nombre es obligatorio</div>
                    </CInputGroup>

                    <CInputGroup class="mb-3">
                      <CInputGroupText>
                        <i class="fas fa-id-card-alt fa-fw"></i>
                      </CInputGroupText>
                      <CFormInput v-model="usuario.apellido" placeholder="Apellido" required />
                      <div class="invalid-feedback">El apellido es obligatorio</div>
                    </CInputGroup>

                    <CInputGroup class="mb-3">
                      <CInputGroupText>
                        <i class="fas fa-phone-alt fa-fw"></i>
                      </CInputGroupText>
                      <CFormInput v-model="usuario.telefono" type="tel" placeholder="Teléfono" required pattern="[0-9]{10}" />
                      <div class="invalid-feedback">El teléfono es obligatorio y debe contener solo números</div>
                    </CInputGroup>

                    <CInputGroup class="mb-3">
                      <CInputGroupText>
                        <i class="fas fa-id-badge fa-fw"></i>
                      </CInputGroupText>
                      <CFormSelect v-model="usuario.tipoIdentificacion" required>
                        <option disabled :selected="!usuario.tipoIdentificacion" value="">Seleccione un tipo de identificación</option>
                        <option v-for="tipo in tiposIdentificacion" :key="tipo" :value="tipo">{{ tipo }}</option>
                      </CFormSelect>
                      <div class="invalid-feedback">El tipo de identificación es obligatorio</div>
                    </CInputGroup>

                    <CInputGroup class="mb-3">
                      <CInputGroupText>
                        <i class="fas fa-id-card fa-fw"></i>
                      </CInputGroupText>
                      <CFormInput v-model="usuario.identificacion" placeholder="Identificación" required />
                      <div class="invalid-feedback">La identificación es obligatoria</div>
                    </CInputGroup>
                  </CCol>
                </CRow>
                <div class="d-grid" style="width:35%; margin: 5px auto;">
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
import { listarRolesFachada, crearUsuarioFachada } from '@/assets/js/usuarios';

export default {
  data() {
    return {
      negocioId: null,
      usuario: {
        negocioId: null,
        nombreUsuario: '',
        correo: '',
        password: '',
        passwordConfirm: '',
        nombre: '',
        apellido: '',
        telefono: '',
        identificacion: '',
        tipoIdentificacion: '',
        rol: ''
      },
      roles: [],
      tiposIdentificacion: ['CEDULA', 'RUC', 'PASAPORTE', 'PLACA', 'INTERNACIONAL'],
      successMessage: '',
      errorMessage: '',
      wasValidated: false,
      isLoading: false
    };
  },
  computed: {
    filteredRoles() {
      return this.roles.filter(rol => rol.nombre !== 'ADMINISTRADOR');
    }
  },
  mounted() {
    this.fetchRoles();
    this.negocioId = JSON.parse(sessionStorage.getItem('usuario')).negocioId;
  },
  methods: {
    async fetchRoles() {
      try {
        this.roles = await listarRolesFachada();
      } catch (error) {
        console.error('Error al listar roles:', error);
      }
    },
    resetForm() {
      this.usuario = {
        negocioId: null,
        nombreUsuario: '',
        correo: '',
        password: '',
        passwordConfirm: '',
        nombre: '',
        apellido: '',
        telefono: '',
        identificacion: '',
        tipoIdentificacion: '',
        rol: ''
      };
      this.wasValidated = false;
    },
    async registrarUsuario() {
      this.wasValidated = true;
      this.isLoading = true;

      // Validar que todos los campos estén completos
      if (!this.usuario.nombreUsuario || !this.usuario.correo || !this.usuario.password || !this.usuario.passwordConfirm ||
          !this.usuario.nombre || !this.usuario.apellido || !this.usuario.telefono || !this.usuario.identificacion ||
          !this.usuario.tipoIdentificacion || !this.usuario.rol) {
        this.errorMessage = 'Por favor, complete todos los campos obligatorios';
        this.successMessage = '';
        this.isLoading = false;
        return;
      }

      // Validar que las contraseñas coincidan
      if (this.usuario.password !== this.usuario.passwordConfirm) {
        this.errorMessage = 'Las contraseñas no coinciden';
        this.successMessage = '';
        this.isLoading = false;
        return;
      }

      try {
        this.usuario.negocioId = this.negocioId;
        const response = await crearUsuarioFachada(this.usuario);
        this.successMessage = 'Usuario registrado exitosamente';
        this.errorMessage = '';
        console.log('Usuario registrado:', response);
        this.resetForm();
      } catch (error) {
        this.errorMessage = 'Ha ocurrido un error al registrar el usuario, intente con otro nombre de usuario o correo';
        this.successMessage = '';
        console.error('Error al registrar usuario:', error);
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
</style>
