<template>
    <div>
        <AppSidebar />
        <div class="wrapper d-flex flex-column min-vh-100">
            <AppHeader />
            <div class="body flex-grow-1">
                <CContainer class="px-4" lg>
                    <div class="bwrapper align-items-center">
                        <CContainer>
                            <CRow class="justify-content-center">
                                <CCol md="20" sm="20">
                                    <CCard>
                                        <CCardBody class="p-4">
                                            <div class="d-flex justify-content-between align-items-center mb-3">
                                                <h5 class="mb-0">Deudas</h5>
                                            </div>
                                            <div class="row mb-3">
                                                <div class="col-12 col-md-3 mb-2">
                                                    <CFormInput v-model="filtros.cliente" @input="filtrarDeudas" placeholder="Buscar por cliente" />
                                                </div>
                                                <div class="col-12 col-md-3 mb-2">
                                                    <CFormSelect v-model="filtros.estado" @change="filtrarDeudas">
                                                        <option value="">Todos los estados</option>
                                                        <option value="true">Activa</option>
                                                        <option value="false">Pagada</option>
                                                    </CFormSelect>
                                                </div>
                                                <div class="col-12 col-md-3 mb-2">
                                                    <CFormInput type="datetime-local" v-model="filtros.fechaInicio" @change="filtrarDeudas" placeholder="Fecha y Hora Inicio" />
                                                </div>
                                                <div class="col-12 col-md-3 mb-2">
                                                    <CFormInput type="datetime-local" v-model="filtros.fechaFin" @change="filtrarDeudas" placeholder="Fecha y Hora Fin" />
                                                </div>
                                            </div>
                                            <CAlert v-if="mensajeInfo" color="info">{{ mensajeInfo }}</CAlert>
                                            <CAlert v-if="mensajeExito" color="info">{{ mensajeExito }}</CAlert>
                                            <CAlert v-if="mensajeError" color="danger">{{ mensajeError }}</CAlert>
                                            <CSpinner v-if="cargando" color="success" class="spinner-border-sm" />

                                            <CTable v-if="deudasFiltradas.length > 0" hover responsive>
                                                <CTableHead color="light">
                                                    <CTableRow>
                                                        <CTableHeaderCell scope="col">N° Referencia</CTableHeaderCell>
                                                        <CTableHeaderCell scope="col">Cliente</CTableHeaderCell>
                                                        <CTableHeaderCell scope="col">Fecha</CTableHeaderCell>
                                                        <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                                                        <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
                                                        <CTableHeaderCell scope="col" class="text-center">Acciones
                                                        </CTableHeaderCell>
                                                    </CTableRow>
                                                </CTableHead>
                                                <CTableBody>
                                                    <CTableRow v-for="deuda in deudasFiltradas" :key="deuda.id">
                                                        <CTableDataCell>{{ deuda.numeroReferencia }}</CTableDataCell>
                                                        <CTableDataCell>{{ deuda.clienteNombre }}</CTableDataCell>
                                                        <CTableDataCell>{{ formatFecha(deuda.fecha) }}</CTableDataCell>
                                                        <CTableDataCell>{{ deuda.total }}</CTableDataCell>
                                                        <CTableDataCell>{{ deuda.estado ? 'Activa' : 'Pagada' }}
                                                        </CTableDataCell>
                                                        <CTableDataCell class="text-center">
                                                            <button class="btn btn-info btn-sm w-75 mb-2"
                                                                @click="abrirModalDetalles(deuda)">
                                                                <i class="fas fa-eye"></i> Detalles
                                                            </button>
                                                            <button class="btn btn-success btn-sm w-75"
                                                                @click="abrirModalAbonos(deuda)">
                                                                <i class="fas fa-dollar-sign"></i> Abonos
                                                            </button>
                                                        </CTableDataCell>
                                                    </CTableRow>
                                                </CTableBody>
                                            </CTable>
                                            <CAlert v-if="!deudasFiltradas.length && !cargando" color="info">
                                                No se encontraron deudas.
                                            </CAlert>
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                            </CRow>
                        </CContainer>
                    </div>
                </CContainer>
            </div>
        </div>

        <!-- Modal de detalles de deuda -->
        <CModal :visible="visibleModalDetalles" @close="visibleModalDetalles = false">
            <CModalHeader @close="visibleModalDetalles = false">
                <CModalTitle>Detalles de la Deuda</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div v-if="deudaSeleccionada">
                    <div class="mb-0">
                        <strong>N° Referencia:</strong> {{ deudaSeleccionada.numeroReferencia }}
                    </div>
                    <div class="mb-0">
                        <strong>Cliente:</strong> {{ deudaSeleccionada.clienteNombre }}
                    </div>
                    <div class="mb-0">
                        <strong>Fecha:</strong> {{ formatFecha(deudaSeleccionada.fecha) }}
                    </div>
                    <div class="mb-0">
                        <strong>Total:</strong> {{ deudaSeleccionada.total }}
                    </div>
                    <div class="mb-0">
                        <strong>Estado:</strong> {{ deudaSeleccionada.estado ? 'Activa' : 'Pagada' }}
                    </div>
                    <h6 class="mt-2">Detalles:</h6>
                    <CTable hover responsive>
                        <CTableHead color="light">
                            <CTableRow>
                                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Cod. Barras</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Precio</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Subtotal</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow v-for="detalle in deudaSeleccionada.detalles" :key="detalle.codigoBarras">
                                <CTableDataCell>{{ detalle.cantidad }}</CTableDataCell>
                                <CTableDataCell>{{ detalle.codigoBarras }}</CTableDataCell>
                                <CTableDataCell>{{ detalle.nombre }}</CTableDataCell>
                                <CTableDataCell>{{ detalle.precioVenta }}</CTableDataCell>
                                <CTableDataCell>{{ detalle.subtotal }}</CTableDataCell>
                            </CTableRow>
                        </CTableBody>
                    </CTable>
                </div>
            </CModalBody>
        </CModal>

        <!-- Modal de abonos -->
        <CModal :visible="visibleModalAbonos" @close="visibleModalAbonos = false" size="lg">
            <CModalHeader @close="visibleModalAbonos = false">
                <CModalTitle>Registrar Abono</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div v-if="deudaSeleccionada">
                    <div class="mb-0">
                        <strong>N° Referencia:</strong> {{ deudaSeleccionada.numeroReferencia }}
                    </div>
                    <div class="mb-0">
                        <strong>Estado:</strong> {{ deudaSeleccionada.estado ? 'Activa' : 'Pagada' }}
                    </div>
                    <div class="mb-0">
                        <strong>Total Adeudado:</strong> {{ deudaSeleccionada.total }}
                    </div>
                    <h6 class="mt-0" v-if="deudaSeleccionada.estado">Registrar Abono:</h6>
                    <CForm v-if="deudaSeleccionada.estado" @submit.prevent="registrarAbono">
                        <CCard class="p-3">
                            <CFormLabel for="monto">Monto</CFormLabel>
                            <CFormInput type="number" id="monto" v-model="nuevoAbono.monto" required
                                :max="deudaSeleccionada.total" min="0.01" step="0.01" />
                            <div class="form-check form-switch mb-2 custom-checkbox">
                                <input type="checkbox" class="form-check-input" id="pagoTransferencia"
                                    v-model="nuevoAbono.pagoTransferencia">
                                <label class="form-check-label font-weight-bold" for="pagoTransferencia"
                                    style="margin-left: 5px;">
                                    PAGO CON TRANSFERENCIA
                                </label>
                            </div>
                            <div class="d-flex justify-content-center mt-3">
                                <CButton type="submit" color="success" class="w-50"
                                    :disabled="nuevoAbono.monto > deudaSeleccionada.total">Registrar</CButton>
                            </div>
                        </CCard>
                    </CForm>
                    <h6 class="mt-4">Lista de Abonos:</h6>
                    <CTable hover responsive>
                        <CTableHead color="light">
                            <CTableRow>
                                <CTableHeaderCell scope="col">Fecha</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Monto</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Pago</CTableHeaderCell>

                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow v-for="abono in deudaSeleccionada.abonos" :key="abono.id">
                                <CTableDataCell>{{ formatFecha(abono.fecha) }}</CTableDataCell>
                                <CTableDataCell>{{ abono.monto }}</CTableDataCell>
                                <CTableDataCell>{{ abono.pagoTransferencia ? 'Transferencia' : 'Efectivo' }}</CTableDataCell>
                            </CTableRow>
                        </CTableBody>
                    </CTable>
                </div>
            </CModalBody>

        </CModal>

    </div>
</template>
<script>
import { debounce } from 'lodash';
import { listaDeudasFachada, obtenerDeudaFachada, registrarAbonoFachada } from '@/assets/js/deudas';
import { buscarCuadreCajaActivoPorUsuarioFachada } from '@/assets/js/gestion-cajas';
import AppHeader from '@/components/AppHeader';
import AppSidebar from '@/components/AppSidebar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default {
    components: {
        AppHeader,
        AppSidebar
    },
    data() {
        return {
            usuario: null,
            idNegocio: null,
            deudas: [],
            deudasFiltradas: [],
            deudaSeleccionada: null,
            nuevoAbono: {
                monto: 0,
                idDeuda: null,
                idCuadreCaja: null,
                pagoTransferencia: false
            },
            filtros: {
                cliente: '',
                estado: '',
                fechaInicio: '',
                fechaFin: ''
            },
            mensajeExito: '',
            mensajeError: '',
            mensajeInfo: '',
            cargando: false,
            visibleModalDetalles: false,
            visibleModalAbonos: false
        };
    },
    async mounted() {
        this.idNegocio = JSON.parse(sessionStorage.getItem('usuario')).negocioId;
        this.usuario = JSON.parse(sessionStorage.getItem('usuario')).nombreUsuario;
        this.obtenerDeudas();
    },
    methods: {
        async obtenerDeudas() {
            this.cargando = true;
            try {
                const deudas = await listaDeudasFachada(this.idNegocio);
                this.deudas = (deudas || []).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                this.deudasFiltradas = this.deudas;
            } catch (error) {
                this.mensajeError = 'Error al obtener las deudas';
                console.error('Error al obtener las deudas:', error);
            } finally {
                this.cargando = false;
            }
        },
        async abrirModalDetalles(deuda) {
            try {
                const detallesDeuda = await obtenerDeudaFachada(deuda.id);
                this.deudaSeleccionada = detallesDeuda;
                this.visibleModalDetalles = true;
            } catch (error) {
                this.mensajeError = 'Error al obtener los detalles de la deuda';
                console.error('Error al obtener los detalles de la deuda:', error);
            }
        },
        async abrirModalAbonos(deuda) {
            try {
                const detallesDeuda = await obtenerDeudaFachada(deuda.id);
                this.deudaSeleccionada = detallesDeuda;
                this.visibleModalAbonos = true;
            } catch (error) {
                this.mensajeError = 'Error al obtener los detalles de la deuda';
                console.error('Error al obtener los detalles de la deuda:', error);
            }
        },
        async registrarAbono() {
            try {
                this.nuevoAbono.idDeuda = this.deudaSeleccionada.id;
                this.nuevoAbono.idCuadreCaja = await this.obtenerCuadreCajaActivo();
                console.log('nuevoAbono:', this.nuevoAbono);
                await registrarAbonoFachada(this.nuevoAbono);
                this.mensajeExito = 'Abono registrado exitosamente';
                this.visibleModalAbonos = false;
                this.obtenerDeudas();
            } catch (error) {
                this.mensajeError = 'Error al registrar el abono';
                console.error('Error al registrar el abono:', error);
            }
        },
        async obtenerCuadreCajaActivo() {
            try {
                const cuadreCaja = await buscarCuadreCajaActivoPorUsuarioFachada(this.usuario, this.idNegocio);
                return cuadreCaja.id;
            } catch (error) {
                this.mensajeError = 'Error al obtener el cuadre de caja activo';
                console.error('Error al obtener el cuadre de caja activo:', error);
            }
        },
        filtrarDeudas: debounce(function() {
            this.deudasFiltradas = this.deudas.filter(deuda => {
                const clienteMatch = deuda.clienteNombre.toLowerCase().includes(this.filtros.cliente.toLowerCase());
                const estadoMatch = this.filtros.estado === '' || deuda.estado.toString() === this.filtros.estado;
                const fechaInicioMatch = this.filtros.fechaInicio === '' || new Date(deuda.fecha) >= new Date(this.filtros.fechaInicio);
                const fechaFinMatch = this.filtros.fechaFin === '' || new Date(deuda.fecha) <= new Date(this.filtros.fechaFin);
                return clienteMatch && estadoMatch && fechaInicioMatch && fechaFinMatch;
            });
        }, 300),
        formatFecha(fecha) {
            return format(new Date(fecha), 'dd/MM/yyyy HH:mm:ss', { locale: es });
        }
    }
};
</script>