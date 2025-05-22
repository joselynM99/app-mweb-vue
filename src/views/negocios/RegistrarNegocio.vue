<template>
    <div class="bwrapper align-items-center">
        <CContainer>
            <CRow class="justify-content-center">
                <CCol>
                    <CCard>
                        <CCardBody class="p-3">
                            <CForm @submit.prevent="registrarNegocioYUsuario" novalidate
                                :class="{ 'was-validated': wasValidated }">
                                <CAlert v-if="successMessage" color="success">{{ successMessage }}</CAlert>
                                <CAlert v-if="errorMessage" color="danger">{{ errorMessage }}</CAlert>
                                <CRow>
                                    <CCol md="6">
                                        <h5>Datos del Negocio</h5>
                                        <div class="mb-2">
                                            <label for="nombreComercial" class="form-label">Nombre Comercial</label>
                                            <CInputGroup>
                                                <CInputGroupText><i class="fas fa-building"></i></CInputGroupText>
                                                <CFormInput id="nombreComercial" v-model="negocio.nombreComercial"
                                                    placeholder="Nombre Comercial" required />
                                                <div class="invalid-feedback">El nombre comercial es obligatorio</div>
                                            </CInputGroup>
                                        </div>

                                        <div class="mb-2">
                                            <label for="direccion" class="form-label">Dirección</label>
                                            <CInputGroup>
                                                <CInputGroupText><i class="fas fa-map-marker-alt"></i></CInputGroupText>
                                                <CFormInput id="direccion" v-model="negocio.direccion"
                                                    placeholder="Dirección" required />
                                                <div class="invalid-feedback">La dirección es obligatoria</div>
                                            </CInputGroup>
                                        </div>

                                        <div class="mb-2">
                                            <label for="telefono" class="form-label">Teléfono</label>
                                            <CInputGroup>
                                                <CInputGroupText><i class="fas fa-phone"></i></CInputGroupText>
                                                <CFormInput id="telefono" v-model="negocio.telefono"
                                                    placeholder="Teléfono" required pattern="[0-9]{10}" />
                                                <div class="invalid-feedback">El teléfono es obligatorio y debe contener
                                                    solo números</div>
                                            </CInputGroup>
                                        </div>

                                        <div class="mb-2">
                                            <label for="razonSocial" class="form-label">Razón Social</label>
                                            <CInputGroup>
                                                <CInputGroupText><i class="fas fa-id-card"></i></CInputGroupText>
                                                <CFormInput id="razonSocial" v-model="negocio.razonSocial"
                                                    placeholder="Razón Social" required />
                                                <div class="invalid-feedback">La razón social es obligatoria</div>
                                            </CInputGroup>
                                        </div>

                                        <div class="mb-2">
                                            <label for="ruc" class="form-label">RUC</label>
                                            <CInputGroup>
                                                <CInputGroupText><i class="fas fa-id-card"></i></CInputGroupText>
                                                <CFormInput id="ruc" v-model="negocio.ruc" placeholder="RUC" required />
                                                <div class="invalid-feedback">El RUC es obligatorio</div>
                                            </CInputGroup>
                                        </div>
                                    </CCol>
                                    <CCol md="6">
                                        <h5>Datos del Usuario Principal</h5>
                                        <div class="mb-2">
                                            <label for="nombreUsuario" class="form-label">Nombre de usuario</label>
                                            <CInputGroup>
                                                <CInputGroupText><i class="fas fa-user"></i></CInputGroupText>
                                                <CFormInput id="nombreUsuario" v-model="usuario.nombreUsuario"
                                                    placeholder="Nombre de usuario" required />
                                                <div class="invalid-feedback">El nombre de usuario es obligatorio</div>
                                            </CInputGroup>
                                        </div>

                                        <div class="mb-2">
                                            <label for="correo" class="form-label">Correo electrónico</label>
                                            <CInputGroup>
                                                <CInputGroupText><i class="fas fa-envelope"></i></CInputGroupText>
                                                <CFormInput id="correo" v-model="usuario.correo" type="email"
                                                    placeholder="Email" required />
                                                <div class="invalid-feedback">El correo es obligatorio y debe ser válido
                                                </div>
                                            </CInputGroup>
                                        </div>

                                        <div class="mb-2">
                                            <label for="password" class="form-label">Contraseña</label>
                                            <CInputGroup>
                                                <CInputGroupText><i class="fas fa-lock"></i></CInputGroupText>
                                                <CFormInput id="password" v-model="usuario.password" type="password"
                                                    placeholder="Contraseña" required
                                                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}" />
                                                <div class="invalid-feedback">La contraseña debe tener al menos 8
                                                    caracteres, incluyendo una letra mayúscula, una letra minúscula, un
                                                    número y un carácter especial</div>
                                            </CInputGroup>
                                        </div>

                                        <div class="mb-2">
                                            <label for="passwordConfirm" class="form-label">Confirmar contraseña</label>
                                            <CInputGroup>
                                                <CInputGroupText><i class="fas fa-lock"></i></CInputGroupText>
                                                <CFormInput id="passwordConfirm" v-model="usuario.passwordConfirm"
                                                    type="password" placeholder="Repita la contraseña" required />
                                                <div class="invalid-feedback">La confirmación de la contraseña es
                                                    obligatoria y debe coincidir</div>
                                            </CInputGroup>
                                        </div>

                                        <div class="mb-2">
                                            <label for="nombre" class="form-label">Nombre</label>
                                            <CInputGroup>
                                                <CInputGroupText><i class="fas fa-id-card"></i></CInputGroupText>
                                                <CFormInput id="nombre" v-model="usuario.nombre" placeholder="Nombre"
                                                    required />
                                                <div class="invalid-feedback">El nombre es obligatorio</div>
                                            </CInputGroup>
                                        </div>

                                        <div class="mb-2">
                                            <label for="apellido" class="form-label">Apellido</label>
                                            <CInputGroup>
                                                <CInputGroupText><i class="fas fa-id-card-alt"></i></CInputGroupText>
                                                <CFormInput id="apellido" v-model="usuario.apellido"
                                                    placeholder="Apellido" required />
                                                <div class="invalid-feedback">El apellido es obligatorio</div>
                                            </CInputGroup>
                                        </div>

                                        <div class="mb-2">
                                            <label for="telefonoUsuario" class="form-label">Teléfono</label>
                                            <CInputGroup>
                                                <CInputGroupText><i class="fas fa-phone-alt"></i></CInputGroupText>
                                                <CFormInput id="telefonoUsuario" v-model="usuario.telefono" type="tel"
                                                    placeholder="0900000000" required pattern="[0-9]{10}" />
                                                <div class="invalid-feedback">El teléfono es obligatorio y debe contener
                                                    solo números</div>
                                            </CInputGroup>
                                        </div>

                                        <div class="mb-2">
                                            <label for="tipoIdentificacion" class="form-label">Tipo de identificación</label>
                                            <CInputGroup>
                                                <CInputGroupText><i class="fas fa-id-badge"></i></CInputGroupText>
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
                                                <CInputGroupText><i class="fas fa-id-card"></i></CInputGroupText>
                                                <CFormInput id="identificacion" v-model="usuario.identificacion"
                                                    placeholder="Identificación" required />
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
import { registrarNegocioFachada, registrarUsuarioFachada, buscarPorNombreComercialORazonSocialFachada } from '@/assets/js/negocios';

export default {
    data() {
        return {
            negocio: {
                nombreComercial: '',
                direccion: '',
                telefono: '',
                razonSocial: '',
                ruc: ''
            },
            usuario: {
                nombreUsuario: '',
                correo: '',
                password: '',
                passwordConfirm: '',
                nombre: '',
                apellido: '',
                telefono: '',
                identificacion: '',
                tipoIdentificacion: '',
                rol: 'PROPIETARIO'
            },
            tiposIdentificacion: ['CEDULA', 'RUC', 'PASAPORTE', 'PLACA', 'INTERNACIONAL'],
            successMessage: '',
            errorMessage: '',
            wasValidated: false,
            isLoading: false
        };
    },
    methods: {
        resetForm() {
            this.negocio = {
                nombreComercial: '',
                direccion: '',
                telefono: '',
                razonSocial: '',
                ruc: ''
            };
            this.usuario = {
                nombreUsuario: '',
                correo: '',
                password: '',
                passwordConfirm: '',
                nombre: '',
                apellido: '',
                telefono: '',
                identificacion: '',
                tipoIdentificacion: '',
                rol: 'PROPIETARIO'
            };
            this.wasValidated = false;
        },
        async registrarNegocioYUsuario() {
            this.wasValidated = true;
            this.errorMessage = '';
            this.successMessage = '';

            // Validar que todos los campos estén completos
            if (!this.negocio.nombreComercial || !this.negocio.direccion || !this.negocio.telefono ||
                !this.negocio.razonSocial || !this.negocio.ruc || !this.usuario.nombreUsuario || !this.usuario.correo ||
                !this.usuario.password || !this.usuario.passwordConfirm || !this.usuario.nombre || !this.usuario.apellido ||
                !this.usuario.telefono || !this.usuario.identificacion || !this.usuario.tipoIdentificacion) {
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
                this.errorMessage = 'El correo no es válido';
                this.isLoading = false;
                return;
            }

            if (!phonePattern.test(this.usuario.telefono)) {
                this.errorMessage = 'El teléfono no es válido';
                this.isLoading = false;
                return;
            }

            if (!passwordPattern.test(this.usuario.password)) {
                this.errorMessage = 'La contraseña no cumple con los requisitos';
                this.isLoading = false;
                return;
            }

            // Si todos los campos son válidos, proceder con el registro
            this.isLoading = true;
            try {
                // Registrar el negocio
                await registrarNegocioFachada(this.negocio);

                const negocios = await buscarPorNombreComercialORazonSocialFachada(this.negocio.razonSocial);
                const negocio = negocios[0];

                this.usuario.negocioId = negocio.id;
                await registrarUsuarioFachada(this.usuario);

                this.successMessage = 'Negocio y usuario registrados exitosamente';
                this.errorMessage = '';
                this.resetForm();
            } catch (error) {
                this.errorMessage = 'Ha ocurrido un error al registrar el negocio y el usuario';
                this.successMessage = '';
                console.error('Error al registrar negocio y usuario:', error);
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