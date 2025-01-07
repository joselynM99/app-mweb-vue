<template>
    <div class="bwrapper align-items-center">
        <CContainer>
            <CRow class="justify-content-center">
                <CCol md="6" class="mt-2 ">
                    <CCard class="mb-2 custom-card">
                        <CCardHeader>
                            <h4 class="card-title">Cliente</h4>
                        </CCardHeader>
                        <CCardBody class="p-3">
                            <div class="d-flex justify-content-center mb-2">
                                <CButton style="font-size: small;" color="success" @click="seleccionarConsumidorFinal">
                                    Consumidor Final</CButton>
                            </div>

                            <CForm @submit.prevent="buscarCliente" novalidate>
                                <div class="d-flex mb-2">
                                    <CFormSelect v-model="modoBusqueda" class="me-1"
                                        style="width: 40%; font-size: small;">
                                        <option value="identificacion">Identificación</option>
                                        <option value="nombre">Nombre</option>
                                    </CFormSelect>
                                    <CInputGroup class="me-1">
                                        <CFormInput :id="modoBusqueda" v-model="criterioBusqueda"
                                            :placeholder="'Ingrese ' + modoBusqueda" required
                                            style="font-size: small;" />
                                        <CButton type="submit" color="secondary" style="font-size: small;">Buscar
                                        </CButton>
                                    </CInputGroup>
                                    <CButton color="success" @click="mostrarFormularioCrearCliente = true" class="me-1"
                                        style="font-size: small;">
                                        <i class="fas fa-plus"></i>
                                    </CButton>
                                </div>
                            </CForm>

                            <div v-if="isLoadingClientes" class="d-flex justify-content-center">
                                <CSpinner color="success" />
                            </div>

                            <div v-if="clienteEncontrado" class="d-flex align-items-center mt-4 mb-4">
                                <p class="text-start mb-0">
                                    <strong>Cliente:</strong> {{ clienteEncontrado.nombres + ' ' +
                                        clienteEncontrado.apellidos }} &nbsp;
                                    <strong>Identificación:</strong> {{ clienteEncontrado.identificacion }}
                                </p>
                                <CButton v-if="clienteEncontrado.identificacion !== '9999999999999'" color="info"
                                    @click="mostrarInformacionCliente = true"
                                    style="font-size: small; margin-left: 5px; padding: 0.2rem 0.4rem;">
                                    <i class="fas fa-info-circle"></i>
                                </CButton>
                            </div>
                            <div v-if="clientes.length > 0" class="mt-2">
                                <h5>Lista de Clientes</h5>
                                <div class="table-responsive table-scroll">
                                    <CTable hover class="table table-striped table-bordered">
                                        <CTableHead color="light">
                                            <CTableRow>
                                                <CTableHeaderCell scope="col">Identificación</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">Nombres</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">Apellidos</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">Acciones</CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            <CTableRow v-for="cliente in clientesFiltrados" :key="cliente.id">
                                                <CTableDataCell>{{ cliente.identificacion }}</CTableDataCell>
                                                <CTableDataCell>{{ cliente.nombres }}</CTableDataCell>
                                                <CTableDataCell>{{ cliente.apellidos }}</CTableDataCell>
                                                <CTableDataCell class="text-center">
                                                    <CButton color="success" @click="seleccionarCliente(cliente)"
                                                        class="small-button">
                                                        <i class="fas fa-check small-icon"></i>
                                                    </CButton>
                                                </CTableDataCell>
                                            </CTableRow>
                                        </CTableBody>
                                    </CTable>
                                </div>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol md="6" class="mt-2 ">
                    <CCard class="mb-2 custom-card">
                        <CCardHeader>
                            <h4 class="card-title">Completar Venta</h4>
                        </CCardHeader>
                        <CCardBody class="p-3">
                            <CForm @submit.prevent="finalizarVenta" novalidate
                                :class="{ 'was-validated': wasValidated }">
                                <CAlert v-if="successMessage" color="success">{{ successMessage }}</CAlert>
                                <CAlert v-if="errorMessage" color="danger">{{ errorMessage }}</CAlert>

                                <div class="mb-2">
                                    <label for="total" class="form-label">Total</label>
                                    <CInputGroup>
                                        <CInputGroupText><i class="fas fa-dollar-sign"></i></CInputGroupText>
                                        <CFormInput id="total" v-model="totalVenta" readonly disabled />
                                    </CInputGroup>
                                </div>

                                <div class="mb-2">
                                    <label for="montoRecibido" class="form-label">Monto Recibido</label>
                                    <CInputGroup>
                                        <CInputGroupText><i class="fas fa-dollar-sign"></i></CInputGroupText>
                                        <CFormInput id="montoRecibido" v-model="montoRecibido" readonly disabled />
                                    </CInputGroup>
                                </div>

                                <div class="mb-2">
                                    <label for="cambio" class="form-label">Cambio</label>
                                    <CInputGroup>
                                        <CInputGroupText><i class="fas fa-dollar-sign"></i></CInputGroupText>
                                        <CFormInput id="cambio" v-model="cambio" readonly disabled />
                                    </CInputGroup>
                                </div>

                                <div class="mb-2">
                                    <label class="form-label">Descuento</label>
                                    <CInputGroup>
                                        <CFormSelect v-model="tipoDescuento">
                                            <option value="porcentaje">Porcentaje</option>
                                            <option value="valor">Valor</option>
                                        </CFormSelect>
                                        <CFormInput id="valorDescuento" type="number" v-model="valorDescuento" />
                                        <CButton @click="aplicarDescuento" id="aplicarDescuento" type="button"
                                            color="secondary">Aplicar</CButton>
                                    </CInputGroup>
                                </div>

                                <div class="form-check form-switch mb-2 custom-checkbox">
                                    <input type="checkbox" class="form-check-input" id="pagoTransferencia"
                                        v-model="pagoTransferencia">
                                    <label class="form-check-label font-weight-bold" for="pagoTransferencia"
                                        style="margin-left: 5px;">
                                        PAGO CON TRANSFERENCIA
                                    </label>
                                </div>

                                <div class="mb-2">
                                    <label for="montoIngresado" class="form-label">Monto Ingresado</label>
                                    <CInputGroup>
                                        <CInputGroupText><i class="fas fa-dollar-sign"></i></CInputGroupText>
                                        <CFormInput id="montoIngresado" @keyup="calcularCambio" v-model="montoIngresado"
                                            type="number" required autofocus
                                            placeholder="Ingrese la cantidad recibida" />
                                    </CInputGroup>
                                </div>

                                <CButton v-if="montoIngresado === null || (cambio < 0)" type="button" color="danger"
                                    @click="generarDeuda">Generar Deuda</CButton>
                                <CButton v-else type="submit" color="success" :disabled="isLoadingVenta">
                                    Finalizar Venta
                                    <CSpinner v-if="isLoadingVenta" color="light" class="spinner-border-sm" />
                                </CButton>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CContainer>

        <CModal :visible="mostrarFormularioCrearCliente" @close="mostrarFormularioCrearCliente = false" size="lg"
            centered scrollable>
            <CModalHeader @close="mostrarInformacionCliente = false">
                <CModalTitle>Registrar Cliente</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <RegistrarClientes @cliente-registrado="clienteRegistrado" :identificacion="criterioBusqueda" />
            </CModalBody>
        </CModal>

        <CModal :visible="mostrarInformacionCliente" @close="mostrarInformacionCliente = false">
            <CModalHeader @close="mostrarInformacionCliente = false">
                <CModalTitle>Información del Cliente</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div class="text-start">
                    <CTable hover class="table table-striped table-bordered">
                        <CTableBody>
                            <CTableRow>
                                <CTableHeaderCell scope="row">Cliente</CTableHeaderCell>
                                <CTableDataCell v-if="clienteEncontrado.identificacion === '9999999999999'">Consumidor
                                    Final</CTableDataCell>
                                <CTableDataCell v-else>{{ clienteEncontrado.nombres + ' ' + clienteEncontrado.apellidos
                                    }}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableHeaderCell scope="row">Identificación</CTableHeaderCell>
                                <CTableDataCell>{{ clienteEncontrado.identificacion }}</CTableDataCell>
                            </CTableRow>
                            <CTableRow v-if="clienteEncontrado.identificacion !== '9999999999999'">
                                <CTableHeaderCell scope="row">Correo</CTableHeaderCell>
                                <CTableDataCell>{{ clienteEncontrado.correo }}</CTableDataCell>
                            </CTableRow>
                            <CTableRow v-if="clienteEncontrado.identificacion !== '9999999999999'">
                                <CTableHeaderCell scope="row">Teléfono</CTableHeaderCell>
                                <CTableDataCell>{{ clienteEncontrado.telefono }}</CTableDataCell>
                            </CTableRow>
                            <CTableRow v-if="clienteEncontrado.identificacion !== '9999999999999'">
                                <CTableHeaderCell scope="row">Dirección</CTableHeaderCell>
                                <CTableDataCell>{{ clienteEncontrado.direccion }}</CTableDataCell>
                            </CTableRow>
                        </CTableBody>
                    </CTable>
                </div>
            </CModalBody>
        </CModal>
    </div>
</template>
<script>
import { obtenerClientePorIdentificacionFachada, buscarClientesPorNombreFachada, obtenerClientesActivosPorNegocioFachada } from '@/assets/js/clientes';
import RegistrarClientes from '@/views/clientes/RegistrarClientes.vue';
import { buscarCuadreCajaActivoPorUsuarioFachada } from '@/assets/js/gestion-cajas';
import { registrarVentasFachada } from '@/assets/js/ventas';

export default {
    components: {
        RegistrarClientes
    },
    data() {
        return {
            isLoadingClientes: false,
            isLoadingVenta: false,
            totalVenta: null,
            tipoDescuento: 'porcentaje',
            valorDescuento: 0,
            montoIngresado: null,
            montoRecibido: null,
            cambio: null,
            cliente: null,
            carrito: [],
            usuario: null,
            negocioId: null,
            ventaFinalizada: false,
            pagoTransferencia: false,
            successMessage: '',
            errorMessage: '',
            wasValidated: false,
            criterioBusqueda: '',
            clienteEncontrado: {
                nombres: 'Consumidor Final',
                apellidos: '',
                correo: '',
                telefono: '',
                identificacion: '9999999999999',
                direccion: ''
            },
            cuadreCajaId: null,
            mostrarFormularioCrearCliente: false,
            mostrarInformacionCliente: false,
            modoBusqueda: 'identificacion',
            clientes: []
        };
    },
    computed: {
        clientesFiltrados() {
            return this.clientes.filter(cliente => {
                if (this.modoBusqueda === 'identificacion') {
                    return cliente.identificacion.includes(this.criterioBusqueda);
                } else {
                    const criterio = this.criterioBusqueda.toLowerCase();
                    return cliente.nombres.toLowerCase().includes(criterio) || cliente.apellidos.toLowerCase().includes(criterio);
                }
            });
        }
    },
    mounted() {
        const datosVenta = JSON.parse(sessionStorage.getItem('datosVenta') || '{}');

        if (datosVenta && Object.keys(datosVenta).length) {
            this.totalVenta = datosVenta.totalSubtotal;
            this.carrito = datosVenta.itemsSeleccionados;
            this.usuario = JSON.parse(sessionStorage.getItem('usuario')).nombreUsuario;
            this.negocioId = JSON.parse(sessionStorage.getItem('usuario')).negocioId;
            this.cargarClientes();
            this.obtenerCuadreCaja();

        } else {
            console.error('No se encontraron datos de venta');
        }
    },
    methods: {
        async obtenerCuadreCaja() {
            const { id } = await buscarCuadreCajaActivoPorUsuarioFachada(this.usuario, this.negocioId);
            this.cuadreCajaId = id;
        },

        aplicarDescuento() {
            if (this.tipoDescuento === 'porcentaje') {
                this.totalVenta = Number((this.totalVenta - (this.totalVenta * this.valorDescuento / 100)).toFixed(2));
            } else {
                this.totalVenta = Number((this.totalVenta - this.valorDescuento).toFixed(2));
            }
        },
        calcularCambio() {
            this.montoRecibido = this.montoIngresado;
            this.cambio = Number((this.montoIngresado - this.totalVenta).toFixed(2));
        },
        generarDeuda() {
            // Implementar lógica para generar deuda
        },

        goBack() {
            this.$router.go(-1);
        },
        finalizarVenta() {
            if (this.isLoadingVenta) return; // Evitar múltiples envíos

            this.wasValidated = true;
            if (this.montoIngresado === null || this.cambio < 0) {
                return;
            }

            const venta = {
                total: this.totalVenta,
                montoRecibido: this.montoRecibido,
                cliente: this.clienteEncontrado.identificacion === '9999999999999' ? null : this.clienteEncontrado.identificacion,
                idCuadreCaja: this.cuadreCajaId,
                idNegocio: this.negocioId,
                detalles: this.carrito,
                username: this.usuario,
                pagoTransferencia: this.pagoTransferencia,
                descuento: {
                    tipoDescuento: this.tipoDescuento === 'porcentaje',
                    valorDescuento: this.valorDescuento
                }
            };

            console.log(JSON.stringify(venta));

            this.isLoadingVenta = true;
            registrarVentasFachada(venta)
                .then(() => {
                    this.successMessage = 'Venta registrada exitosamente';
                    this.errorMessage = '';
                    this.ventaFinalizada = true;
                    sessionStorage.removeItem('datosVenta');
                    this.goBack();

                })
                .catch(error => {
                    this.errorMessage = 'Ha ocurrido un error al registrar la venta';
                    this.successMessage = '';
                    console.error('Error al registrar venta:', error);
                })
                .finally(() => {
                    this.isLoadingVenta = false;
                });
        },
        async cargarClientes() {
            this.isLoadingClientes = true;
            try {
                this.clientes = await obtenerClientesActivosPorNegocioFachada(this.negocioId);
            } catch (error) {
                this.errorMessage = 'Error al cargar clientes';
                console.error('Error al cargar clientes:', error);
                this.isLoadingClientes = false;
            } finally {
                this.isLoadingClientes = false;
            }
        },
        async buscarCliente() {
            if (this.modoBusqueda === 'identificacion') {
                try {
                    const clientePorIdentificacion = await obtenerClientePorIdentificacionFachada(this.criterioBusqueda, this.negocioId);
                    if (clientePorIdentificacion) {
                        this.clienteEncontrado = clientePorIdentificacion;
                        this.mostrarFormularioCrearCliente = false;
                        return;
                    }
                } catch (error) {
                    if (error.response && error.response.status !== 404) {
                        console.error('Error al buscar cliente por identificación:', error);
                    }
                }
            } else if (this.modoBusqueda === 'nombre') {
                try {
                    const clientesPorNombre = await buscarClientesPorNombreFachada(this.criterioBusqueda, this.negocioId);
                    if (clientesPorNombre && clientesPorNombre.length > 0) {
                        this.clienteEncontrado = clientesPorNombre[0];
                        this.mostrarFormularioCrearCliente = false;
                        return;
                    }
                } catch (error) {
                    if (error.response && error.response.status !== 404) {
                        console.error('Error al buscar cliente por nombre:', error);
                    }
                }
            }

            this.clienteEncontrado = {
                nombres: 'Consumidor',
                apellidos: 'Final',
                correo: '',
                telefono: '',
                identificacion: '9999999999',
                direccion: ''
            };
            this.mostrarFormularioCrearCliente = false;
        },
        seleccionarCliente(cliente) {
            this.clienteEncontrado = cliente;
            this.mostrarFormularioCrearCliente = false;
        },
        seleccionarConsumidorFinal() {
            this.clienteEncontrado = {
                nombres: 'Consumidor',
                apellidos: 'Final',
                correo: '',
                telefono: '',
                identificacion: '9999999999999',
                direccion: ''
            };
            this.mostrarFormularioCrearCliente = false;
        },
        clienteRegistrado(cliente) {
            this.clienteEncontrado = cliente;
            this.mostrarFormularioCrearCliente = false;
            this.cargarClientes();
        }
    }
};
</script>

<style scoped>
.form-check {
    display: flex;
    align-items: center;
}

.form-check-label {
    margin-left: 8px;
}

.form-check-input {
    width: 43px;
    height: 22px;

    transition: background-color 0.3s ease, border-color 0.3s ease;
}

.form-check-input:checked {
    background-color: #5bc75b;
    border-color: #5bc75b;
    box-shadow: 0 0 0 0.2rem rgba(97, 187, 97, 0.5);
}

.form-check-input:focus {
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(144, 238, 144, 0.5);
}


.custom-card {
    background-color: transparent;
    border-color: #3b3b3b;
    height: 96vh !important;
}


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

.table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    position: relative;
}

.table-scroll {
    max-height: 70vh;
}

.table {
    width: 100%;
    table-layout: auto;
    border-collapse: collapse;
}

.table td {
    word-wrap: break-word;
    white-space: normal;
    text-align: left;
    word-break: break-word;
    overflow-wrap: break-word;
}

.table th {
    font-size: 0.85rem;
    text-align: left;
}

.table td {
    font-size: 0.8rem;
}

.text-wrap {
    max-width: 150px;
    word-wrap: break-word;
    white-space: normal;
}

.small-button {
    padding: 0.20rem 0.5rem;
    font-size: 0.75rem;
}

.small-icon {
    font-size: 0.75rem;
}

@media (max-width: 768px) {
    .custom-card {
        height: auto !important;
    }
}
</style>