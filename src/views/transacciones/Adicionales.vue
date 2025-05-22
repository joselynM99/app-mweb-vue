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
                                                <h5 class="mb-0">Adicionales</h5>
                                                <CButton color="success" @click="abrirModalCrear" class="btn-create">
                                                    <i class="fas fa-plus me-2"></i> Registrar
                                                </CButton>
                                            </div>
                                            <CAlert v-if="mensajeInfo" color="info">{{ mensajeInfo }}</CAlert>
                                            <CAlert v-if="mensajeExito" color="info">{{ mensajeExito }}</CAlert>
                                            <CAlert v-if="mensajeError" color="danger">{{ mensajeError }}</CAlert>
                                            <CSpinner v-if="cargando" color="success" class="spinner-border-sm" />

                                            <CTabs :activeItemKey="tabActiva"
                                                @update:activeItemKey="tabActiva = $event">
                                                <CTabList variant="tabs">
                                                    <CTab itemKey="ingresos">Ingresos</CTab>
                                                    <CTab itemKey="egresos">Egresos</CTab>
                                                </CTabList>
                                                <CTabContent>
                                                    <CTabPanel itemKey="ingresos">
                                                        <CTable v-if="ingresos.length > 0" hover responsive>
                                                            <CTableHead color="light">
                                                                <CTableRow>
                                                                    <CTableHeaderCell scope="col">Valor
                                                                    </CTableHeaderCell>
                                                                    <CTableHeaderCell scope="col">Motivo
                                                                    </CTableHeaderCell>
                                                                    <CTableHeaderCell scope="col">Fecha
                                                                    </CTableHeaderCell>
                                                                    <CTableHeaderCell scope="col">Método de Pago
                                                                    </CTableHeaderCell>
                                                                    <CTableHeaderCell scope="col" class="text-center">
                                                                        Acciones
                                                                    </CTableHeaderCell>
                                                                </CTableRow>
                                                            </CTableHead>
                                                            <CTableBody>
                                                                <CTableRow v-for="ingreso in ingresos"
                                                                    :key="ingreso.id">
                                                                    <CTableDataCell>{{ ingreso.valor }}</CTableDataCell>
                                                                    <CTableDataCell>{{ ingreso.motivo }}
                                                                    </CTableDataCell>
                                                                    <CTableDataCell>{{ formatFecha(ingreso.fecha) }}
                                                                    </CTableDataCell>
                                                                    <CTableDataCell>{{ ingreso.pagoPorTransferencia ?
                                                                        'Transferencia' :
                                                                        'Efectivo' }}</CTableDataCell>
                                                                    <CTableDataCell class="text-center">
                                                                        <CButton color="danger" size="sm"
                                                                            @click="confirmarDesactivacion(ingreso)">
                                                                            <i class="fas fa-trash-alt"></i>
                                                                        </CButton>
                                                                    </CTableDataCell>
                                                                </CTableRow>
                                                            </CTableBody>
                                                        </CTable>
                                                        <CAlert v-if="!ingresos.length && !cargando" color="info">
                                                            No se encontraron ingresos activos.
                                                        </CAlert>
                                                    </CTabPanel>
                                                    <CTabPanel itemKey="egresos">
                                                        <CTable v-if="egresos.length > 0" hover responsive>
                                                            <CTableHead color="light">
                                                                <CTableRow>
                                                                    <CTableHeaderCell scope="col">Valor
                                                                    </CTableHeaderCell>
                                                                    <CTableHeaderCell scope="col">Motivo
                                                                    </CTableHeaderCell>
                                                                    <CTableHeaderCell scope="col">Fecha
                                                                    </CTableHeaderCell>
                                                                    <CTableHeaderCell scope="col">Método de Pago
                                                                    </CTableHeaderCell>
                                                                    <CTableHeaderCell scope="col" class="text-center">
                                                                        Acciones
                                                                    </CTableHeaderCell>
                                                                </CTableRow>
                                                            </CTableHead>
                                                            <CTableBody>
                                                                <CTableRow v-for="egreso in egresos" :key="egreso.id">
                                                                    <CTableDataCell>{{ egreso.valor }}</CTableDataCell>
                                                                    <CTableDataCell>{{ egreso.motivo }}</CTableDataCell>
                                                                    <CTableDataCell>{{ formatFecha(egreso.fecha) }}
                                                                    </CTableDataCell>
                                                                    <CTableDataCell>{{ egreso.pagoPorTransferencia ?
                                                                        'Transferencia' :
                                                                        'Efectivo' }}</CTableDataCell>
                                                                    <CTableDataCell class="text-center">
                                                                        <CButton color="danger" size="sm"
                                                                            @click="confirmarDesactivacion(egreso)">
                                                                            <i class="fas fa-trash-alt"></i>
                                                                        </CButton>
                                                                    </CTableDataCell>
                                                                </CTableRow>
                                                            </CTableBody>
                                                        </CTable>
                                                        <CAlert v-if="!egresos.length && !cargando" color="info">
                                                            No se encontraron egresos activos.
                                                        </CAlert>
                                                    </CTabPanel>
                                                </CTabContent>
                                            </CTabs>
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                            </CRow>
                        </CContainer>

                        <!-- Modal de creación -->
                        <CModal :visible="visibleModalCrear" @close="visibleModalCrear = false">
                            <CModalHeader @close="visibleModalCrear = false">
                                <CModalTitle>Registrar Adicional</CModalTitle>
                            </CModalHeader>
                            <CModalBody>
                                <CForm @submit.prevent="registrarAdicional" novalidate
                                    :class="{ 'was-validated': fueValidado }">
                                    <div class="mb-3">
                                        <label for="valor" class="form-label">Valor</label>
                                        <CInputGroup>
                                            <CFormInput id="valor" v-model="adicional.valor" placeholder="Valor"
                                                required type="number" step="0.01" />
                                            <div class="invalid-feedback">El valor es obligatorio</div>
                                        </CInputGroup>
                                    </div>
                                    <div class="mb-3">
                                        <label for="motivo" class="form-label">Motivo</label>
                                        <CInputGroup>
                                            <CFormInput id="motivo" v-model="adicional.motivo" placeholder="Motivo"
                                                required />
                                            <div class="invalid-feedback">El motivo es obligatorio</div>
                                        </CInputGroup>
                                    </div>
                                    <div class="mb-3">
                                        <label for="tipo" class="form-label">Tipo</label>
                                        <CInputGroup>
                                            <CFormSelect id="tipo" v-model="adicional.tipoString" required>
                                                <option value="true">Ingreso</option>
                                                <option value="false">Egreso</option>
                                            </CFormSelect>
                                            <div class="invalid-feedback">El tipo es obligatorio</div>
                                        </CInputGroup>
                                    </div>
                                    <div class="mb-3">
                                        <label for="pagoPorTransferencia" class="form-label">Método de Pago</label>
                                        <CInputGroup>
                                            <CFormSelect id="pagoPorTransferencia"
                                                v-model="adicional.pagoPorTransferenciaString" required>
                                                <option value="true">Transferencia</option>
                                                <option value="false">Efectivo</option>
                                            </CFormSelect>
                                            <div class="invalid-feedback">El método de pago es obligatorio</div>
                                        </CInputGroup>
                                    </div>
                                    <div class="d-grid">
                                        <CButton color="success" type="submit" :disabled="cargando"
                                            style="width: 50%; margin: 0 auto;">
                                            Registrar
                                            <CSpinner v-if="cargando" color="light" class="spinner-border-sm" />
                                        </CButton>
                                    </div>
                                </CForm>
                            </CModalBody>
                        </CModal>

                        <!-- Modal de confirmación -->
                        <CModal :visible="visibleConfirmacion" @close="visibleConfirmacion = false">
                            <CModalHeader @close="visibleConfirmacion = false">
                                <CModalTitle>Confirmar Eliminación</CModalTitle>
                            </CModalHeader>
                            <CModalBody>¿Estás seguro de que deseas eliminar este adicional?</CModalBody>
                            <CModalFooter>
                                <CButton color="secondary" @click="visibleConfirmacion = false">Cancelar</CButton>
                                <CButton color="danger" @click="desactivarAdicionalConfirmado">
                                    Eliminar
                                    <CSpinner v-if="cargandoDesactivar" color="light" class="spinner-border-sm" />
                                </CButton>
                            </CModalFooter>
                        </CModal>
                    </div>

                </CContainer>
            </div>

        </div>
    </div>
</template>

<script>
import { registrarAdicionalFachada, obtenerAdicionalesActivosPorCuadreCajaFachada, desactivarAdicionalFachada, buscarCuadreCajaActivoPorUsuarioFachada } from '@/assets/js/gestion-cajas';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
export default {
    components: {
        AppHeader,
        AppSidebar
    },
    data() {
        return {
            usuario: null,
            idNegocio: null,
            cuadreCajaId: null,
            adicional: {
                cuadreCajaId: null,
                valor: null,
                fecha: null,
                motivo: '',
                activo: true,
                tipo: true,
                tipoString: 'true',
                pagoPorTransferenciaString: 'false'
            },
            ingresos: [],
            egresos: [],
            mensajeExito: '',
            mensajeError: '',
            mensajeInfo: '',
            fueValidado: false,
            cargando: false,
            cargandoDesactivar: false,
            visibleModalCrear: false,
            visibleConfirmacion: false,
            adicionalSeleccionado: null,
            tabActiva: 'ingresos'
        };
    },
    async mounted() {
        this.idNegocio = JSON.parse(sessionStorage.getItem('usuario')).negocioId || JSON.parse(sessionStorage.getItem('negocioId'));
        this.usuario = JSON.parse(sessionStorage.getItem('usuario')).nombreUsuario;

        try {
            const resultado = await buscarCuadreCajaActivoPorUsuarioFachada(this.usuario, this.idNegocio);

            if (!resultado) {
                this.$router.push({ name: 'Abrir Caja' });
            } else {
                this.cuadreCajaId = resultado.id;
                this.obtenerAdicionales();
            }
        } catch (error) {
            console.error('Error al verificar cuadre de caja activo:', error);
            this.mensajeError = 'Error al verificar cuadre de caja activo. Inténtalo de nuevo más tarde.';
        }
    },
    methods: {
        async obtenerAdicionales() {
            this.cargando = true;
            try {
                const adicionales = await obtenerAdicionalesActivosPorCuadreCajaFachada(this.cuadreCajaId);

                this.ingresos = adicionales.filter(adicional => adicional.tipo);
                this.egresos = adicionales.filter(adicional => !adicional.tipo);
            } catch (error) {
                this.mensajeError = 'Error al obtener los adicionales activos';
                console.error('Error al obtener los adicionales activos:', error);
            } finally {
                this.cargando = false;
            }
        },
        async registrarAdicional() {
            this.fueValidado = true;
            this.mensajeError = '';
            this.mensajeExito = '';

            if (!this.adicional.valor || !this.adicional.motivo) {
                this.mensajeError = 'Por favor, complete todos los campos obligatorios';
                return;
            }

            this.cargando = true;
            try {
                this.adicional.cuadreCajaId = this.cuadreCajaId;
                this.adicional.fecha = new Date().toISOString();
                this.adicional.tipo = this.adicional.tipoString === 'true';
                this.adicional.pagoPorTransferencia = this.adicional.pagoPorTransferenciaString === 'true';
                await registrarAdicionalFachada(this.adicional);
                this.mensajeExito = 'Adicional registrado exitosamente';
                this.obtenerAdicionales();
                this.reiniciarFormulario();
                this.visibleModalCrear = false;
            } catch (error) {
                this.mensajeError = 'Ha ocurrido un error al registrar el adicional';
                console.error('Error al registrar el adicional:', error);
            } finally {
                this.cargando = false;
            }
        },
        confirmarDesactivacion(adicional) {
            this.adicionalSeleccionado = adicional;
            this.visibleConfirmacion = true;
        },
        async desactivarAdicionalConfirmado() {
            this.cargandoDesactivar = true;
            try {
                await desactivarAdicionalFachada(this.adicionalSeleccionado.id);
                this.mensajeExito = 'Adicional eliminado exitosamente';
                this.obtenerAdicionales();
            } catch (error) {
                this.mensajeError = 'Ha ocurrido un error al eliminar el adicional';
                console.error('Error al eliminar el adicional:', error);
            } finally {
                this.cargandoDesactivar = false;
                this.visibleConfirmacion = false;
            }
        },
        abrirModalCrear() {
            this.reiniciarFormulario();
            this.visibleModalCrear = true;
        },
        reiniciarFormulario() {
            this.adicional = {
                cuadreCajaId: null,
                valor: null,
                fecha: null,
                motivo: '',
                activo: true,
                tipo: true,
                tipoString: 'true',
                pagoPorTransferenciaString: 'false'
            };
            this.fueValidado = false;
        },
        formatFecha(fecha) {
            return format(new Date(fecha), 'dd/MM/yyyy HH:mm:ss', { locale: es });
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
    font-size: 0.9rem;
    color: #495057;
    margin-bottom: 0.5rem;
    display: block;
    text-align: left;
}

.me-2 {
    margin-right: 0.5rem;
}

.btn-create {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

@media (max-width: 768px) {
    .bwrapper {
        flex-direction: column;
    }
}

.table {
    width: 100%;
    table-layout: auto;
    border-collapse: collapse;
}

.table td {
    word-wrap: break-word;
    white-space: normal;
    text-align: center;
    word-break: break-word;
    overflow-wrap: break-word;
}

.table th {
    font-size: 0.85rem;
    text-align: center;
}

.table td {
    font-size: 0.8rem;
}
</style>