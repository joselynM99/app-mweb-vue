<template>
  <div class="bwrapper align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol>
          <CCard style="margin-bottom:12px;">
            <CCardBody class="p-4">
              <h5 v-if="isCurrentUser">Perfil de Usuario</h5>
              <CInputGroup v-if="!isCurrentUser" class="mb-2">
                <CInputGroupText>
                  <i class="fas fa-search fa-fw"></i>
                </CInputGroupText>
                <CFormInput v-model="searchUsername" placeholder="Buscar por nombre de usuario" required />
                <CInputGroupText style="padding:0px 5px">
                  <button @click="buscarUsuario" :disabled="isLoadingBuscar" style="border: none; background: none; margin:0px; padding:5px">
                    Buscar
                    <CSpinner v-if="isLoadingBuscar" color="success" class="spinner-border-sm" />
                  </button>
                </CInputGroupText>
              </CInputGroup>
              <hr />
              <CForm @submit.prevent="actualizarUsuario" novalidate :class="{ 'was-validated': wasValidated }">

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
                        <CFormInput id="nombreUsuario" v-model="usuario.nombreUsuario" placeholder="Nombre de usuario" autocomplete="username" required />
                        <div class="invalid-feedback">El nombre de usuario es obligatorio</div>
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="correo" class="form-label">Correo</label>
                      <CInputGroup>
                        <CInputGroupText>
                          <i class="fas fa-envelope fa-fw"></i>
                        </CInputGroupText>
                        <CFormInput id="correo" v-model="usuario.correo" type="email" placeholder="Email" autocomplete="email" required />
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
                          <option v-for="rol in filteredRoles" :key="rol.id" :value="rol.nombre">{{ rol.nombre }}</option>
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
                        <CFormInput id="password" v-model="usuario.password" type="password" placeholder="Contraseña" autocomplete="new-password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}" required />
                        <div class="invalid-feedback">La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula, un número y un carácter especial</div>
                      </CInputGroup>
                    </div>

                    <div class="mb-4">
                      <label for="passwordConfirm" class="form-label">Confirmar contraseña</label>
                      <CInputGroup>
                        <CInputGroupText>
                          <i class="fas fa-lock fa-fw"></i>
                        </CInputGroupText>
                        <CFormInput id="passwordConfirm" v-model="usuario.passwordConfirm" type="password" placeholder="Repita la contraseña" autocomplete="new-password" required />
                        <div class="invalid-feedback">La confirmación de la contraseña es obligatoria y debe coincidir</div>
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
                        <CFormInput id="telefono" v-model="usuario.telefono" type="tel" placeholder="Teléfono" required pattern="[0-9]{10}" />
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
                          <option disabled :selected="!usuario.tipoIdentificacion" value="">Seleccione un tipo de identificación</option>
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
                        <CFormInput id="identificacion" v-model="usuario.identificacion" placeholder="Identificación" required />
                        <div class="invalid-feedback">La identificación es obligatoria</div>
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

    <!-- Modal de confirmación -->
    <CModal :visible="visibleConfirmacion" @close="visibleConfirmacion = false">
      <CModalHeader @close="visibleConfirmacion = false">
        <CModalTitle>Confirmar Actualización</CModalTitle>
      </CModalHeader>
      <CModalBody>¿Estás seguro de que deseas actualizar tu perfil? Esto cerrará tu sesión actual.</CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="visibleConfirmacion = false">Cancelar</CButton>
        <CButton color="success" @click="confirmarActualizacion">
          Confirmar
          <CSpinner v-if="isLoadingActualizar" color="light" class="spinner-border-sm" />
        </CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script>
import { listarRolesFachada, actualizarUsuarioFachada } from '@/assets/js/usuarios';
import { KeycloakService } from '@/assets/js/keycloak';
import { buscarUsuarioPorNombreUsuarioNegocioFachada } from '../../assets/js/usuarios';

export default {
  data() {
    return {
      searchUsername: '',
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
      isLoadingBuscar: false,
      isLoadingActualizar: false,
      visibleConfirmacion: false,
      loggedInUsername: JSON.parse(sessionStorage.getItem('usuario')).nombreUsuario
    };
  },
  computed: {
    filteredRoles() {
      return this.roles.filter(rol => rol.nombre !== 'ADMINISTRADOR');
    },
    isCurrentUser() {
      return this.searchUsername === this.loggedInUsername;
    }
  },
  watch: {
    '$route.query.username': {
      immediate: true,
      handler(newUsername) {
        if (newUsername) {
          this.searchUsername = newUsername;
          this.buscarUsuario();
        }
      }
    }
  },
  mounted() {
    this.fetchRoles();
    this.negocioId = JSON.parse(sessionStorage.getItem('usuario')).negocioId;
    const username = this.$route.query.username;
    if (username) {
      this.searchUsername = username;
      this.buscarUsuario();
    }
  },
  methods: {
    async fetchRoles() {
      try {
        this.roles = await listarRolesFachada();
      } catch (error) {
        console.error('Error al listar roles:', error);
      }
    },
    async buscarUsuario() {
      this.isLoadingBuscar = true;
      try {

        const usuarioData = await buscarUsuarioPorNombreUsuarioNegocioFachada(this.searchUsername, JSON.parse(sessionStorage.getItem('usuario')).negocioId);

        console.log('Usuario encontrado:', usuarioData);
        this.usuario = { ...usuarioData, password: '', passwordConfirm: '' }; // Reset passwords
        this.successMessage = '';
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = 'Usuario no encontrado';
        this.successMessage = '';
        console.error('Error al buscar usuario:', error);
      } finally {
        this.isLoadingBuscar = false;
      }
    },
    async actualizarUsuario() {
      this.wasValidated = true;
      this.errorMessage = '';
      this.successMessage = '';

      // Validar que todos los campos estén completos
      if (!this.usuario.nombreUsuario || !this.usuario.correo || !this.usuario.nombre || !this.usuario.apellido ||
        !this.usuario.telefono || !this.usuario.identificacion || !this.usuario.tipoIdentificacion ||
        !this.usuario.rol || !this.usuario.passwordConfirm || !this.usuario.password) {
        this.errorMessage = 'Por favor, complete todos los campos obligatorios';
        return;
      }

      // Validar que las contraseñas coincidan si se han proporcionado
      if (this.usuario.password && this.usuario.password !== this.usuario.passwordConfirm) {
        this.errorMessage = 'Las contraseñas no coinciden';
        return;
      }

      // Validar que los campos cumplan con los patrones requeridos
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phonePattern = /^[0-9]{10}$/;
      const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}/;

      if (!emailPattern.test(this.usuario.correo)) {
        return;
      }

      if (!phonePattern.test(this.usuario.telefono)) {
        return;
      }

      if (this.usuario.password && !passwordPattern.test(this.usuario.password)) {
        return;
      }

      // Si todos los campos son válidos, proceder con la actualización
      if (this.isCurrentUser) {
        this.visibleConfirmacion = true;
      } else {
        await this.confirmarActualizacion();
      }
    },


    async confirmarActualizacion() {
      this.isLoadingActualizar = true;
      try {
        this.usuario.negocioId = this.negocioId;
        console.log('Usuario a actualizar:', this.usuario);
        const response = await actualizarUsuarioFachada(this.usuario.keycloakId, this.usuario);
        this.successMessage = 'Usuario actualizado exitosamente';
        this.errorMessage = '';
        console.log('Usuario actualizado:', response);
        this.resetForm();
        if (this.isCurrentUser) {
          await KeycloakService.logout();
        }
      } catch (error) {
        this.errorMessage = 'Ha ocurrido un error al actualizar el usuario';
        this.successMessage = '';
        console.error('Error al actualizar usuario:', error);
      } finally {
        this.isLoadingActualizar = false;
        this.visibleConfirmacion = false;
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
