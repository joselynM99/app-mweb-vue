<template>
    <div class="bwrapper align-items-center">
        <CContainer fluid>
            <CCard class="mb-2 custom-card">
                <CCardBody>
                    <h5>Contador de Efectivo</h5>
                    <form @submit.prevent="cerrarCaja">
                        <div class="table-responsive table-scroll">
                            <CTable hover class="table table-bordered">
                                <CTableBody>
                                    <CTableRow>
                                        <CTableDataCell>
                                            <label>$ 100</label>
                                            <CFormInput @keyup="contarEfectivo" @click="contarEfectivo" id="100"
                                                type="number" placeholder="0" />
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <label>ctvs 1.00</label>
                                            <CFormInput @keyup="contarEfectivo" @click="contarEfectivo" id="1.00"
                                                type="number" placeholder="0" />
                                        </CTableDataCell>
                                    </CTableRow>
                                    <CTableRow>
                                        <CTableDataCell>
                                            <label>$ 50</label>
                                            <CFormInput @keyup="contarEfectivo" @click="contarEfectivo" id="50"
                                                type="number" placeholder="0" />
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <label>ctvs 0.50</label>
                                            <CFormInput @keyup="contarEfectivo" @click="contarEfectivo" id="0.50"
                                                type="number" placeholder="0" />
                                        </CTableDataCell>
                                    </CTableRow>
                                    <CTableRow>
                                        <CTableDataCell>
                                            <label>$ 20</label>
                                            <CFormInput @keyup="contarEfectivo" @click="contarEfectivo" id="20"
                                                type="number" placeholder="0" />
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <label>ctvs 0.25</label>
                                            <CFormInput @keyup="contarEfectivo" @click="contarEfectivo" id="0.25"
                                                type="number" placeholder="0" />
                                        </CTableDataCell>
                                    </CTableRow>
                                    <CTableRow>
                                        <CTableDataCell>
                                            <label>$ 10</label>
                                            <CFormInput @keyup="contarEfectivo" @click="contarEfectivo" id="10"
                                                type="number" placeholder="0" />
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <label>ctvs 0.10</label>
                                            <CFormInput @keyup="contarEfectivo" @click="contarEfectivo" id="0.10"
                                                type="number" placeholder="0" />
                                        </CTableDataCell>
                                    </CTableRow>
                                    <CTableRow>
                                        <CTableDataCell>
                                            <label>$ 5</label>
                                            <CFormInput @keyup="contarEfectivo" @click="contarEfectivo" id="5"
                                                type="number" placeholder="0" />
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <label>ctvs 0.05</label>
                                            <CFormInput @keyup="contarEfectivo" @click="contarEfectivo" id="0.05"
                                                type="number" placeholder="0" />
                                        </CTableDataCell>
                                    </CTableRow>
                                    <CTableRow>
                                        <CTableDataCell>
                                            <label>$ 2</label>
                                            <CFormInput @keyup="contarEfectivo" @click="contarEfectivo" id="2"
                                                type="number" placeholder="0" />
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <label>ctvs 0.01</label>
                                            <CFormInput @keyup="contarEfectivo" @click="contarEfectivo" id="0.01"
                                                type="number" placeholder="0" />
                                        </CTableDataCell>
                                    </CTableRow>
                                    <CTableRow>
                                        <CTableDataCell>
                                            <label>$ 1</label>
                                            <CFormInput @keyup="contarEfectivo" @click="contarEfectivo" id="1"
                                                type="number" placeholder="0" />
                                        </CTableDataCell>
                                    </CTableRow>
                                </CTableBody>
                            </CTable>
                        </div>

                        <div class="totals-desktop">
                            <CTable class="totals-table">
                                <CTableRow>
                                    <CTableDataCell class="label" style="font-weight: bold;">Total Contado:
                                    </CTableDataCell>
                                    <CTableDataCell class="value total">{{ valorContable }}</CTableDataCell>
                                </CTableRow>
                            </CTable>
                        </div>

                        <div class="action-buttons">
                            <CButton type="submit" color="success" :disabled="isLoading">
                                <CSpinner v-if="isLoading" size="sm" /> Cerrar Caja
                            </CButton>
                        </div>
                    </form>
                </CCardBody>
            </CCard>
        </CContainer>
    </div>
</template>

<script>
import { cerrarCajaFachada, obtenerAdicionalesActivosPorCuadreCajaFachada, buscarCuadreCajaActivoPorUsuarioFachada } from '@/assets/js/gestion-cajas';
import { obtenerComprasPorCuadreCajaFachada } from '@/assets/js/compras';
import { obtenerVentasPorCuadreCajaFachada } from '@/assets/js/ventas';
import AppBreadcrumb from '@/components/AppBreadcrumb.vue';

export default {
    components: {
        AppBreadcrumb
    },
    data() {
        return {
            valorContable: 0,
            saldo: null,
            comision: null,
            total: null,
            observacion: "",
            valorVentasEfectivo: 0,
            valorVentasTransferencia: 0,
            valorComprasEfectivo: 0,
            valorComprasTransferencia: 0,
            valorIngresosAdicionalesEfectivo: 0,
            valorIngresosAdicionalesTransferencia: 0,
            valorEgresosAdicionalesEfectivo: 0,
            valorEgresosAdicionalesTransferencia: 0,
            valorApertura: 0,
            diferencia: 0,
            cuadreCajaId: null,
            isLoading: false,
            error: null,
            infoMessage: null,
            usuario: null,
            idNegocio: null,
        };
    },
    async mounted() {
        this.isLoading = true;
        try {
            this.idNegocio = JSON.parse(sessionStorage.getItem('usuario')).negocioId;
            this.usuario = JSON.parse(sessionStorage.getItem('usuario')).nombreUsuario;

            const { id, valorApertura } = await buscarCuadreCajaActivoPorUsuarioFachada(this.usuario, this.idNegocio);
            if (!id) {
                this.$router.push({ name: 'Abrir Caja' });
            } else {
                this.cuadreCajaId = id;
                this.valorApertura = parseFloat(valorApertura.toFixed(2));
                await this.obtenerDatos();
            }
        } catch (error) {
            console.error('Error al montar el componente:', error);
            this.error = 'Error al montar el componente. Inténtalo de nuevo más tarde.';
        } finally {
            this.isLoading = false;
        }
    },
    methods: {
        async obtenerDatos() {
            this.isLoading = true;
            try {
                await this.obtenerVentas();
                await this.obtenerCompras();
                await this.obtenerAdicionales();
                this.calcularValorFaltante();
            } catch (error) {
                console.error('Error al obtener datos:', error);
                this.error = 'Error al obtener datos. Inténtalo de nuevo más tarde.';
            } finally {
                this.isLoading = false;
            }
        },
        async obtenerVentas() {
            try {
                const ventas = await obtenerVentasPorCuadreCajaFachada(this.cuadreCajaId);
                ventas.forEach(venta => {
                    if (venta.pagoTransferencia) {
                        this.valorVentasTransferencia += parseFloat(venta.total.toFixed(2));
                    } else {
                        this.valorVentasEfectivo += parseFloat(venta.total.toFixed(2));
                    }
                });
            } catch (error) {
                console.error('Error al obtener ventas:', error);
                this.error = 'Error al obtener ventas. Inténtalo de nuevo más tarde.';
            }
        },
        async obtenerCompras() {
            try {
                const compras = await obtenerComprasPorCuadreCajaFachada(this.cuadreCajaId);
                compras.forEach(compra => {
                    if (compra.pagoTransferencia) {
                        this.valorComprasTransferencia += parseFloat(compra.total.toFixed(2));
                    } else {
                        this.valorComprasEfectivo += parseFloat(compra.total.toFixed(2));
                    }
                });
            } catch (error) {
                console.error('Error al obtener compras:', error);
                this.error = 'Error al obtener compras. Inténtalo de nuevo más tarde.';
            }
        },
        async obtenerAdicionales() {
            try {
                const adicionales = await obtenerAdicionalesActivosPorCuadreCajaFachada(this.cuadreCajaId);
                adicionales.forEach(adicional => {
                    if (adicional.tipo) {
                        if (adicional.pagoPorTransferencia) {
                            this.valorIngresosAdicionalesTransferencia += parseFloat(adicional.valor.toFixed(2));
                        } else {
                            this.valorIngresosAdicionalesEfectivo += parseFloat(adicional.valor.toFixed(2));
                        }
                    } else {
                        if (adicional.pagoPorTransferencia) {
                            this.valorEgresosAdicionalesTransferencia += parseFloat(adicional.valor.toFixed(2));
                        } else {
                            this.valorEgresosAdicionalesEfectivo += parseFloat(adicional.valor.toFixed(2));
                        }
                    }
                });
            } catch (error) {
                console.error('Error al obtener adicionales:', error);
                this.error = 'Error al obtener adicionales. Inténtalo de nuevo más tarde.';
            }
        },
        contarEfectivo() {
            let b100 = isNaN(parseInt(document.getElementById('100').value)) ? 0 : parseInt(document.getElementById('100').value);
            let b50 = isNaN(parseInt(document.getElementById('50').value)) ? 0 : parseInt(document.getElementById('50').value);
            let b20 = isNaN(parseInt(document.getElementById('20').value)) ? 0 : parseInt(document.getElementById('20').value);
            let b10 = isNaN(parseInt(document.getElementById('10').value)) ? 0 : parseInt(document.getElementById('10').value);
            let b5 = isNaN(parseInt(document.getElementById('5').value)) ? 0 : parseInt(document.getElementById('5').value);
            let b2 = isNaN(parseInt(document.getElementById('2').value)) ? 0 : parseInt(document.getElementById('2').value);
            let b1 = isNaN(parseInt(document.getElementById('1').value)) ? 0 : parseInt(document.getElementById('1').value);

            let m100 = isNaN(parseFloat(document.getElementById('1.00').value)) ? 0 : parseFloat(document.getElementById('1.00').value);
            let m050 = isNaN(parseFloat(document.getElementById('0.50').value)) ? 0 : parseFloat(document.getElementById('0.50').value);
            let m025 = isNaN(parseFloat(document.getElementById('0.25').value)) ? 0 : parseFloat(document.getElementById('0.25').value);
            let m010 = isNaN(parseFloat(document.getElementById('0.10').value)) ? 0 : parseFloat(document.getElementById('0.10').value);
            let m005 = isNaN(parseFloat(document.getElementById('0.05').value)) ? 0 : parseFloat(document.getElementById('0.05').value);
            let m001 = isNaN(parseFloat(document.getElementById('0.01').value)) ? 0 : parseFloat(document.getElementById('0.01').value);

            let cb100 = b100 * 100;
            let cb50 = b50 * 50;
            let cb20 = b20 * 20;
            let cb10 = b10 * 10;
            let cb5 = b5 * 5;
            let cb2 = b2 * 2;
            let cb1 = b1 * 1;

            let cm1 = m100 * 1;
            let cm50 = m050 * 0.50;
            let cm25 = m025 * 0.25;
            let cm10 = m010 * 0.10;
            let cm05 = m005 * 0.05;
            let cm01 = m001 * 0.01;

            this.valorContable = Number((cb100 + cb50 + cb20 + cb10 + cb5 + cb2 + cb1 + cm1 + cm50 + cm25 + cm10 + cm05 + cm01).toFixed(2));
            this.calcularValorFaltante();
        },
        calcularValorFaltante() {
            let efectivoContado = this.valorContable;
            let totalIngresosEfectivo = this.valorVentasEfectivo + this.valorIngresosAdicionalesEfectivo + this.valorApertura;
            let totalEgresosEfectivo = this.valorComprasEfectivo + this.valorEgresosAdicionalesEfectivo;
            let saldoTotalEfectivo = totalIngresosEfectivo - totalEgresosEfectivo;

            this.diferencia = Number((efectivoContado - saldoTotalEfectivo).toFixed(2));
        },
        cerrarCaja() {
            this.isLoading = true;

            let totalIngresosEfectivo = Number((this.valorVentasEfectivo + this.valorIngresosAdicionalesEfectivo + this.valorApertura).toFixed(2));
            let totalIngresosTransferencia = Number((this.valorVentasTransferencia + this.valorIngresosAdicionalesTransferencia).toFixed(2));
            let totalGastosEfectivo = Number((this.valorComprasEfectivo + this.valorEgresosAdicionalesEfectivo).toFixed(2));
            let totalGastosTransferencia = Number((this.valorComprasTransferencia + this.valorEgresosAdicionalesTransferencia).toFixed(2));
            let saldoFinalEfectivo = Number((totalIngresosEfectivo - totalGastosEfectivo).toFixed(2));
            let saldoFinalTransferencia = Number((totalIngresosTransferencia - totalGastosTransferencia).toFixed(2));
            const cierre = {
                id: this.cuadreCajaId,
                usuario: this.usuario,
                idNegocio: this.idNegocio,
                fechaCierre: new Date().toISOString(),
                totalIngresosEfectivo: totalIngresosEfectivo,
                totalIngresosTransferencia: totalIngresosTransferencia,
                totalGastosEfectivo: totalGastosEfectivo,
                totalGastosTransferencia: totalGastosTransferencia,
                saldoFinalEfectivo: saldoFinalEfectivo,
                saldoFinalTransferencia: saldoFinalTransferencia,
                valorContable: this.valorContable,
                diferencia: this.diferencia,
                valorCierre: Number((saldoFinalEfectivo + saldoFinalTransferencia).toFixed(2)),
                valorApertura: this.valorApertura,
                estado: false,
                cajaId: this.cajaId
            };

            console.log('Cierre de caja:', cierre);

            cerrarCajaFachada(cierre)
                .then(() => {
                    this.infoMessage = 'Cierre de caja exitoso.';
                    this.isLoading = false;
                    this.$router.push({ name: 'Abrir Caja' });

                })
                .catch(err => {
                    console.error('Error al cerrar caja:', err);
                    this.error = 'Error al cerrar caja. Inténtalo de nuevo más tarde.';
                });
        }
    }
};
</script>

<style scoped>
.custom-card .card-body {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: 96vh;
}

.table-scroll {
    flex: 1;
    min-height: 0;
    max-height: calc(70vh - 110px);
    overflow-y: auto;
}

.totals-desktop {
    display: flex;
    gap: 5px;
    justify-content: flex-end;
    position: relative;
    margin-top: 20px;
}

.totals-table {
    width: auto;
    text-align: right;
    border: 1px solid #c0bbbb;
}

.totals-table .label {
    padding-right: 10px;
    font-size: 0.9rem;
    border: 1px solid #c0bbbb;
    text-align: right;
}

.totals-table .value {
    font-size: 1rem;
    padding-left: 10px;
    border: 1px solid #c0bbbb;
}

.totals-table .total {
    font-weight: bold;
    text-align: left;
}

.totals-table .quantity {
    font-size: 0.8rem;
    text-align: left;
}

.action-buttons {
    display: flex;
    gap: 7px;
    justify-content: center;
    position: relative;
    margin-top: 5px;
}

.action-buttons .btn {
    min-width: 18%;
    align-items: center;
    justify-content: center;
    font-size: 1.0rem;
    gap: 5px;
}

.large-icon {
    font-size: 1.70rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 3px auto;
}
</style>