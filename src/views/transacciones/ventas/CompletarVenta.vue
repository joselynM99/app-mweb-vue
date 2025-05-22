<template>
    <div class="bwrapper align-items-center">
        <CContainer>
            <CRow class="justify-content-center">

                <CButton color="success" @click="goBack" class="fixed-top-right">
                    <i class="fas fa-arrow-left"></i>
                </CButton>

                <CCol md="4" class="mt-2">
                    <CCard class="mb-2 custom-card">
                        <CCardHeader>
                            <h5 class="card-title">Cliente</h5>
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
                <CCol md="4" class="mt-2">
                    <CCard class="mb-2 custom-card">
                        <CCardHeader>
                            <h5 class="card-title">Resumen de venta</h5>
                        </CCardHeader>
                        <CCardBody class="p-3">
                            <div class="invoice-summary text-start">
                                <h6>Productos:</h6>
                                <div class="table-responsive">
                                    <CTable hover class="table table-striped table-bordered">
                                        <CTableHead color="light">
                                            <CTableRow>
                                                <CTableHeaderCell scope="col">Producto</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">Cantidad</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">Precio</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">Subtotal</CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            <CTableRow v-for="(item, index) in carrito" :key="index">
                                                <CTableDataCell>{{ item.nombre }}</CTableDataCell>
                                                <CTableDataCell>{{ item.cantidad }}</CTableDataCell>
                                                <CTableDataCell>{{ item.precioVenta }}</CTableDataCell>
                                                <CTableDataCell>{{ (item.cantidad * item.precioVenta).toFixed(2) }}
                                                </CTableDataCell>
                                            </CTableRow>
                                        </CTableBody>
                                    </CTable>
                                </div>
                                <p><strong>Total Venta:</strong> {{ totalVenta }}</p>
                                <p><strong>Monto Ingresado:</strong> {{ montoIngresado }}</p>
                                <p><strong>Cambio:</strong> {{ cambio }}</p>
                            </div>
                            <CAlert v-if="successMessage" color="success">{{ successMessage }}</CAlert>
                            <CAlert v-if="errorMessage" color="danger">{{ errorMessage }}</CAlert>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol md="4" class="mt-2">
                    <CCard class="mb-2 custom-card">
                        <CCardHeader>
                            <h5 class="card-title">Completar Venta</h5>
                        </CCardHeader>
                        <CCardBody class="p-3">
                            <CForm @submit.prevent="finalizarVenta" novalidate
                                :class="{ 'was-validated': wasValidated }">


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
                                <div class="form-check form-switch mt-2">
                                    <input class="form-check-input" type="checkbox" id="imprimir" v-model="imprimir">
                                    <label class="form-check-label" for="imprimir">Imprimir</label>
                                </div>
                                <CButton v-if="montoIngresado === null || (cambio < 0)" type="button" color="danger"
                                    @click="generarDeuda">Generar Deuda
                                    <CSpinner v-if="isLoadingVenta" color="light" class="spinner-border-sm" />

                                </CButton>
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
import { obtenerNegocioPorIdFachada } from '@/assets/js/negocios';
import { generarDeudaFachada } from '@/assets/js/deudas';

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
            clientes: [],
            imprimir: false

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
            this.negocioId = JSON.parse(sessionStorage.getItem('usuario')).negocioId    || JSON.parse(sessionStorage.getItem('negocioId'));
            this.cargarClientes();
            this.obtenerCuadreCaja();

        } else {
            this.errorMessage = 'No se encontraron datos de venta';
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
            if (this.isLoadingVenta) return;

            if (this.clienteEncontrado.identificacion === '9999999999999' || this.clienteEncontrado.identificacion == null) {
                this.errorMessage = 'No se puede generar deuda a Consumidor Final';
                return;
            }
            this.isLoadingVenta = true;

            const deuda = {
                total: this.totalVenta,
                montoRecibido: this.montoRecibido,
                clienteId: this.clienteEncontrado.identificacion,
                idCuadreCaja: this.cuadreCajaId,
                idNegocio: this.negocioId,
                detalles: this.carrito,
            };


            generarDeudaFachada(deuda)
                .then(() => {
                    this.successMessage = 'Deuda generada exitosamente';
                    this.errorMessage = '';
                    this.ventaFinalizada = true;
                    this.goBack();

                })
                .catch(error => {
                    console.error('Error al generar deuda:', error);
                    this.errorMessage = 'Ha ocurrido un error al generar la deuda';
                    this.successMessage = '';
                })
                .finally(() => {
                    this.isLoadingVenta = false;
                });


        },

        goBack() {
            this.$router.push({ name: 'Ventas' });
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


            this.isLoadingVenta = true;
            registrarVentasFachada(venta)
                .then(() => {
                    this.successMessage = 'Venta registrada exitosamente';
                    this.errorMessage = '';
                    this.ventaFinalizada = true;

                    if (this.imprimir) {
                        this.imprimirTicket();
                    }

                    sessionStorage.removeItem('datosVenta');
                    this.goBack(); // ✅ solo se redirige si todo sale bien
                })
                .catch(error => {
                    console.error('Error al registrar la venta:', error);
                    this.errorMessage = 'Ha ocurrido un error al registrar la venta';
                    this.successMessage = '';
                })
                .finally(() => {
                    this.isLoadingVenta = false;
                });

        },



        async imprimirTicket() {
            const now = new Date();
            const { nombreComercial, ruc } = await obtenerNegocioPorIdFachada(this.negocioId);
            let ticketContent = `
            <div style="font-family: 'Courier New', Courier, monospace; width: 80mm;">
                <div style="text-align: center;">
                    <h2 style="font-size: 12px;">Comprobante de Venta</h2>
                    <h2 style="font-size: 18px;">${nombreComercial}</h2>
                    <p style="font-size: 12px;">RUC: ${ruc}</p>
                    <p style="font-size: 12px;">${now.toLocaleDateString()} ${now.toLocaleTimeString()}</p>
                </div>
                <hr style="border: 1px dashed black;">
                <p style="font-size: 12px;"><strong>Cliente:</strong> ${this.clienteEncontrado.nombres} ${this.clienteEncontrado.apellidos}</p>
                <p style="font-size: 12px;"><strong>Identificación:</strong> ${this.clienteEncontrado.identificacion}</p>
                <hr style="border: 1px dashed black;">
                <table style="width:100%; font-size: 12px;">
                    <thead>
                        <tr>
                            <th style="text-align: left;">Cant</th>
                            <th style="text-align: left;">Producto</th>
                            <th style="text-align: right;">Precio</th>
                            <th style="text-align: right;">Subt</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.carrito.map(item => `
                        <tr>
                            <td>${item.cantidad}</td>
                            <td>${item.nombre} - ${item.codigoBarras}</td>
                            <td style="text-align: right;">$${parseFloat(item.precioVenta).toFixed(2)}</td>
                            <td style="text-align: right;">$${(item.cantidad * parseFloat(item.precioVenta)).toFixed(2)}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
                <hr style="border: 1px dashed black;">
                <p style="font-size: 12px;">Total: $${Number(this.totalVenta).toFixed(2)}</p>
                <p style="font-size: 12px;">Recibido: $${this.montoRecibido}</p>
                <p style="font-size: 12px;">Cambio: $${this.cambio}</p>
                <p style="text-align: center; font-size: 12px;">¡Gracias por su compra!</p>
            </div>
            `;

            // **Crear un iframe oculto y enviar a imprimir**
            const iframe = document.createElement("iframe");
            iframe.style.display = "none";
            document.body.appendChild(iframe);

            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(ticketContent);
            iframe.contentWindow.document.close();

            iframe.contentWindow.focus();
            iframe.contentWindow.print();

            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);
        },


        async cargarClientes() {
            this.isLoadingClientes = true;
            try {
                this.clientes = await obtenerClientesActivosPorNegocioFachada(this.negocioId);
            } catch (error) {
                if (error.response && error.response.status !== 404) {
                    this.errorMessage = 'Error al cargar clientes';
                }
            } finally {
                this.isLoadingClientes = false;
            }
        },

        async cargarClientes() {
            this.isLoadingClientes = true;
            try {
                this.clientes = await obtenerClientesActivosPorNegocioFachada(this.negocioId);
            } catch (error) {
                if (error.response && error.response.status !== 404) {
                    this.errorMessage = 'Error al cargar clientes';
                }
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

.table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    position: relative;
    max-height: 300px;
    /* Ajusta este valor según sea necesario */
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

.fixed-top-right {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 1000;
    max-width: 50px;
}
</style>