<template>
  <div class="bwrapper align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol>
          <CCard>
            <CCardBody class="p-3">
              <CForm @submit.prevent="registrarUsuario" novalidate :class="{ 'was-validated': wasValidated }">
                <p class="text-body-secondary"></p>
                <CAlert v-if="successMessage" color="success">{{ successMessage }}</CAlert>
                <CAlert v-if="errorMessage" color="danger">{{ errorMessage }}</CAlert>
                <CRow>
                  <CCol>
                    <div class="mb-2">
                      <label for="nombreUsuario" class="form-label">Nombre de usuario</label>
                      <CInputGroup>
                        <CInputGroupText>
                          <i class="fas fa-user fa-fw"></i>
                        </CInputGroupText>
                        <CFormInput id="nombreUsuario" v-model="usuario.nombreUsuario" placeholder="Nombre de usuario"
                          autocomplete="username" required />
                        <div class="invalid-feedback">El nombre de usuario es obligatorio</div>
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="correo" class="form-label">Correo electrónico</label>
                      <CInputGroup>
                        <CInputGroupText>
                          <i class="fas fa-envelope fa-fw"></i>
                        </CInputGroupText>
                        <CFormInput id="correo" v-model="usuario.correo" type="email" placeholder="Email"
                          autocomplete="email" required />
                        <div class="invalid-feedback">El correo es obligatorio y debe ser válido</div>
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="rol" class="form-label">Rol</label>
                      <CInputGroup>
                        <CInputGroupText>
                          <i class="fas fa-user-tag fa-fw"></i>
                        </CInputGroupText>
                        <CFormSelect id="rol" v-model="usuario.rol" required>
                          <option disabled :selected="!usuario.rol" value="">Seleccione un rol</option>
                          <option v-for="rol in filteredRoles" :key="rol.id" :value="rol.nombre">{{ rol.nombre }}
                          </option>
                        </CFormSelect>
                        <div class="invalid-feedback">El rol es obligatorio</div>
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="password" class="form-label">Contraseña</label>
                      <CInputGroup>
                        <CInputGroupText>
                          <i class="fas fa-lock fa-fw"></i>
                        </CInputGroupText>
                        <CFormInput id="password" v-model="usuario.password" type="password" placeholder="Contraseña"
                          autocomplete="new-password" required
                          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}" />
                        <div class="invalid-feedback">La contraseña debe tener al menos 8 caracteres, incluyendo una
                          letra mayúscula, una letra minúscula, un número y un carácter especial</div>
                      </CInputGroup>
                    </div>

                    <div class="mb-4">
                      <label for="passwordConfirm" class="form-label">Confirmar contraseña</label>
                      <CInputGroup>
                        <CInputGroupText>
                          <i class="fas fa-lock fa-fw"></i>
                        </CInputGroupText>
                        <CFormInput id="passwordConfirm" v-model="usuario.passwordConfirm" type="password"
                          placeholder="Repita la contraseña" autocomplete="new-password" required />
                        <div class="invalid-feedback">La confirmación de la contraseña es obligatoria y debe coincidir
                        </div>
                      </CInputGroup>
                    </div>
                  </CCol>
                  <CCol :md="6">
                    <div class="mb-2">
                      <label for="nombre" class="form-label">Nombre</label>
                      <CInputGroup>
                        <CInputGroupText>
                          <i class="fas fa-id-card fa-fw"></i>
                        </CInputGroupText>
                        <CFormInput id="nombre" v-model="usuario.nombre" placeholder="Nombre" required />
                        <div class="invalid-feedback">El nombre es obligatorio</div>
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="apellido" class="form-label">Apellido</label>
                      <CInputGroup>
                        <CInputGroupText>
                          <i class="fas fa-id-card-alt fa-fw"></i>
                        </CInputGroupText>
                        <CFormInput id="apellido" v-model="usuario.apellido" placeholder="Apellido" required />
                        <div class="invalid-feedback">El apellido es obligatorio</div>
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="telefono" class="form-label">Teléfono</label>
                      <CInputGroup>
                        <CInputGroupText>
                          <i class="fas fa-phone-alt fa-fw"></i>
                        </CInputGroupText>
                        <CFormInput id="telefono" v-model="usuario.telefono" type="tel" placeholder="0900000000" required
                          pattern="[0-9]{10}" />
                        <div class="invalid-feedback">El teléfono es obligatorio y debe contener solo números</div>
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="tipoIdentificacion" class="form-label">Tipo de identificación</label>
                      <CInputGroup>
                        <CInputGroupText>
                          <i class="fas fa-id-badge fa-fw"></i>
                        </CInputGroupText>
                        <CFormSelect id="tipoIdentificacion" v-model="usuario.tipoIdentificacion" required>
                          <option disabled :selected="!usuario.tipoIdentificacion" value="">Seleccione un tipo de
                            identificación</option>
                          <option v-for="tipo in tiposIdentificacion" :key="tipo" :value="tipo">{{ tipo }}</option>
                        </CFormSelect>
                        <div class="invalid-feedback">El tipo de identificación es obligatorio</div>
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="identificacion" class="form-label">Identificación</label>
                      <CInputGroup>
                        <CInputGroupText>
                          <i class="fas fa-id-card fa-fw"></i>
                        </CInputGroupText>
                        <CFormInput id="identificacion" v-model="usuario.identificacion" placeholder="Identificación"
                          required />
                        <div class="invalid-feedback">La identificación es obligatoria</div>
                      </CInputGroup>
                    </div>
                  </CCol>
                </CRow>
                <div class="d-grid" style="width:30%; margin: 5px auto;">
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
    this.negocioId = JSON.parse(sessionStorage.getItem('usuario')).negocioId || JSON.parse(sessionStorage.getItem('negocioId'));
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
      this.errorMessage = '';
      this.successMessage = '';

      // Validar que todos los campos estén completos
      if (!this.usuario.nombreUsuario || !this.usuario.correo || !this.usuario.nombre || !this.usuario.apellido ||
        !this.usuario.telefono || !this.usuario.identificacion || !this.usuario.tipoIdentificacion ||
        !this.usuario.rol || !this.usuario.passwordConfirm || !this.usuario.password) {
        this.errorMessage = 'Por favor, complete todos los campos obligatorios';
        this.isLoading = false;
        return;
      }

      // Validar que las contraseñas coincidan
      if (this.usuario.password !== this.usuario.passwordConfirm) {
        this.errorMessage = 'Las contraseñas no coinciden';
        this.isLoading = false;
        return;
      }

      // Validar que los campos cumplan con los patrones requeridos
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phonePattern = /^[0-9]{10}$/;
      const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}/;

      if (!emailPattern.test(this.usuario.correo)) {
        this.isLoading = false;
        return;
      }

      if (!phonePattern.test(this.usuario.telefono)) {
        this.isLoading = false;
        return;
      }

      if (!passwordPattern.test(this.usuario.password)) {
        this.isLoading = false;
        return;
      }

      // Si todos los campos son válidos, proceder con el registro
      this.isLoading = true;
      try {
        this.usuario.negocioId = this.negocioId;
        const response = await crearUsuarioFachada(this.usuario);
        this.successMessage = 'Usuario registrado exitosamente';
        this.errorMessage = '';
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

.form-label {
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
  display: block;
  text-align: left;
}
</style>
