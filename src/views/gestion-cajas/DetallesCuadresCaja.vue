<template>
  <div class="bwrapper align-items-center">
    <CContainer fluid>
      <CCard class="mb-4">
        <CCardBody v-if="loading">
          <div class="text-center py-5">
            <CSpinner color="primary" />
            <p>Cargando datos del cierre...</p>
          </div>
        </CCardBody>

        <CCardBody v-else>
          <CRow class="mb-3">
            <CCol>
              <CButton color="primary" class="me-2" @click="exportarPDF">Exportar a PDF</CButton>
              <CButton color="success" @click="exportarExcel">Exportar a Excel</CButton>
            </CCol>
          </CRow>

          <CRow class="mb-3">
            <CCol><strong>Fecha Apertura:</strong> {{ formatDate(cierre.fechaApertura) }}</CCol>
            <CCol><strong>Fecha Cierre:</strong> {{ formatDate(cierre.fechaCierre) }}</CCol>
          </CRow>
          <CRow class="mb-4">
            <CCol><strong>Cajero:</strong> {{ cierre.usuario }}</CCol>
            <CCol><strong>Caja:</strong> {{ cierre.cajaNombre || 'N/A' }}</CCol>
          </CRow>

          <h5 class="mt-3">Lista de Ingresos</h5>
          <CTable striped bordered small class="mb-4">
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>Fecha</CTableHeaderCell>
                <CTableHeaderCell>Valor</CTableHeaderCell>
                <CTableHeaderCell>Información</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="(item, i) in ingresos" :key="i">
                <CTableDataCell>{{ formatDate(item.fecha) }}</CTableDataCell>
                <CTableDataCell class="text-start">{{ formatDecimal(item.valor) }}</CTableDataCell>
                <CTableDataCell>{{ item.informacion }}</CTableDataCell>
              </CTableRow>
              <CTableRow color="light">
                <CTableDataCell class="text-end"><strong>Total Ingresos</strong></CTableDataCell>
                <CTableDataCell colspan="2" class="text-start"><strong>{{ formatDecimal(totalIngresos) }}</strong>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>

          <h5 class="mt-4">Lista de Egresos</h5>
          <CTable striped bordered small class="mb-4">
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>Fecha</CTableHeaderCell>
                <CTableHeaderCell>Valor</CTableHeaderCell>
                <CTableHeaderCell>Información</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="(item, i) in egresos" :key="i">
                <CTableDataCell>{{ formatDate(item.fecha) }}</CTableDataCell>
                <CTableDataCell class="text-start">{{ formatDecimal(item.valor) }}</CTableDataCell>
                <CTableDataCell>{{ item.informacion }}</CTableDataCell>
              </CTableRow>
              <CTableRow color="light">
                <CTableDataCell class="text-end"><strong>Total Egresos</strong></CTableDataCell>
                <CTableDataCell colspan="2" class="text-start"><strong>{{ formatDecimal(totalEgresos) }}</strong>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>

          <h4 class="mt-5">Resumen General</h4>
          <CTable striped bordered small class="mb-5 resumen-table" style="width: 60%">
            <!-- INGRESOS -->
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell colspan="2" class="text-center">INGRESOS</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableDataCell>Ingresos en Efectivo</CTableDataCell>
                <CTableDataCell class="text-start">{{ formatDecimal(cierre.totalIngresosEfectivo) }}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>Ingresos por Transferencia</CTableDataCell>
                <CTableDataCell class="text-start">{{ formatDecimal(cierre.totalIngresosTransferencia) }}
                </CTableDataCell>
              </CTableRow>
              <CTableRow color="light">
                <CTableDataCell class="text-end"><strong>Total Ingresos</strong></CTableDataCell>
                <CTableDataCell class="text-start"><strong>{{ formatDecimal(totalIngresos) }}</strong></CTableDataCell>
              </CTableRow>
            </CTableBody>

            <!-- Separador -->
            <tbody>
              <tr>
                <td colspan="2" style="height: 20px; border: none; background: transparent;"></td>
              </tr>
            </tbody>

            <!-- EGRESOS -->
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell colspan="2" class="text-center">EGRESOS</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableDataCell class="text-start">Gastos en Efectivo</CTableDataCell>
                <CTableDataCell class="text-start">{{ formatDecimal(cierre.totalGastosEfectivo) }}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell class="text-start">Gastos por Transferencia</CTableDataCell>
                <CTableDataCell class="text-start">{{ formatDecimal(cierre.totalGastosTransferencia) }}</CTableDataCell>
              </CTableRow>
              <CTableRow color="light">
                <CTableDataCell class="text-end"><strong>Total Egresos</strong></CTableDataCell>
                <CTableDataCell class="text-start"><strong>{{ formatDecimal(totalEgresos) }}</strong></CTableDataCell>
              </CTableRow>
            </CTableBody>

            <!-- Separador -->
            <tbody>
              <tr>
                <td colspan="2" style="height: 20px; border: none; background: transparent;"></td>
              </tr>
            </tbody>

            <!-- TOTALES Y RESULTADOS -->
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell colspan="2" class="text-center">TOTALES Y RESULTADOS</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableDataCell>Saldo Final Efectivo</CTableDataCell>
                <CTableDataCell class="text-start">{{ formatDecimal(cierre.saldoFinalEfectivo) }}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>Saldo Final Transferencia</CTableDataCell>
                <CTableDataCell class="text-start">{{ formatDecimal(cierre.saldoFinalTransferencia) }}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>Valor Contable</CTableDataCell>
                <CTableDataCell class="text-start">{{ formatDecimal(cierre.valorContable) }}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>Diferencia (Contable - Saldo Efectivo)</CTableDataCell>
                <CTableDataCell :class="[
                  cierre.diferencia < 0 ? 'text-danger' : 'text-success',
                  'text-start'
                ]">
                  {{ formatDecimal(cierre.diferencia) }}
                </CTableDataCell>
              </CTableRow>
              <CTableRow color="light">
                <CTableDataCell class="text-end"><strong>Valor de Cierre Final</strong></CTableDataCell>
                <CTableDataCell class="text-start"><strong>{{ formatDecimal(cierre.valorCierre) }}</strong>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CContainer>
  </div>
</template>

<script>

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

import {
  obtenerAdicionalesActivosPorCuadreCajaFachada,
  obtenerCierrePorIdFachada
} from '@/assets/js/gestion-cajas';

import { obtenerComprasPorCuadreCajaFachada } from '@/assets/js/compras';
import { obtenerVentasPorCuadreCajaFachada } from '@/assets/js/ventas';
import { obtenerAbonosPorCuadreCajaFachada } from '@/assets/js/deudas';


export default {
  data() {
    return {
      cierre: {},
      ingresos: [],
      egresos: [],
      ventas: [],
      compras: [],
      abonos: [],
      adicionales: [],
      loading: true
    };
  },
  computed: {
    totalIngresos() {
      return (
        parseFloat(this.cierre.totalIngresosEfectivo || 0) +
        parseFloat(this.cierre.totalIngresosTransferencia || 0)
      );
    },
    totalEgresos() {
      return (
        parseFloat(this.cierre.totalGastosEfectivo || 0) +
        parseFloat(this.cierre.totalGastosTransferencia || 0)
      );
    }
  },
  methods: {
    async cargarDatos() {
      try {
        const id = this.$route.query.id;
        const cierreData = await obtenerCierrePorIdFachada(id);
        this.cierre = cierreData || {};

        const [ventas, compras, adicionales, abonos] = await Promise.all([
          obtenerVentasPorCuadreCajaFachada(id),
          obtenerComprasPorCuadreCajaFachada(id),
          obtenerAdicionalesActivosPorCuadreCajaFachada(id),
          obtenerAbonosPorCuadreCajaFachada(id)
        ]);

        this.abonos = abonos;

        this.ventas = ventas;
        this.compras = compras;
        this.adicionales = adicionales;

        this.prepararDetalles();
      } catch (error) {
        console.error('Error al cargar los datos del reporte:', error);
      } finally {
        this.loading = false;
      }
    },
    prepararDetalles() {
      this.ingresos = [];
      this.egresos = [];

      this.ventas.forEach(v => {
        this.ingresos.push({
          fecha: v.fecha,
          valor: v.total,
          informacion: `VENTA ${v.numeroReferencia || 'N/A'} - ${v.pagoTransferencia ? 'TRANSFERENCIA' : 'EFECTIVO'}`
        });

      });

      this.compras.forEach(c => {
        this.egresos.push({
          fecha: c.fecha,
          valor: c.total,
          informacion: `COMPRA ${c.numeroReferencia || 'N/A'} - ${c.pagoTransferencia ? 'TRANSFERENCIA' : 'EFECTIVO'}`
        });
      });

      this.adicionales.forEach(a => {
        const targetList = a.tipo ? this.ingresos : this.egresos;
        const tipo = a.tipo ? 'INGRESO' : 'EGRESO';
        const metodo = a.pagoPorTransferencia ? 'TRANSFERENCIA' : 'EFECTIVO';
        targetList.push({ fecha: a.fecha, valor: a.valor, informacion: `${tipo} ADICIONAL - ${metodo}` });
      });

      this.abonos.forEach(a => {
        this.ingresos.push({
          fecha: a.fecha,
          valor: a.monto,
          informacion: `ABONO DE DEUDA - ${a.pagoTransferencia ? 'TRANSFERENCIA' : 'EFECTIVO'}`
        });
      });


      this.ingresos.push({ fecha: this.cierre.fechaApertura, valor: this.cierre.valorApertura || 0, informacion: 'VALOR DE APERTURA - EFECTIVO' });
    },
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleString('es-EC', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    formatDecimal(value) {
      return value != null ? Number(value).toFixed(2) : '0.00';
    },

    exportarPDF() {
      // Crear ventana nueva con contenido renderizado
      const printWindow = window.open('', '_blank', 'width=800,height=1000');
      const doc = printWindow.document;

      const html = `
        <html>
          <head>
            <title>Reporte de Cuadre de Caja</title>
            <style>
              body { font-family: Arial, sans-serif; font-size: 12px; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { border: 1px solid #000; padding: 6px; text-align: left; }
              h2, h3 { margin-top: 30px; }
            </style>
          </head>
          <body>
            <h2>Reporte de Cuadre de Caja</h2>
            <p><strong>Fecha Apertura:</strong> ${this.formatDate(this.cierre.fechaApertura)}</p>
            <p><strong>Fecha Cierre:</strong> ${this.formatDate(this.cierre.fechaCierre)}</p>
            <p><strong>Cajero:</strong> ${this.cierre.usuario}</p>
            <p><strong>Caja:</strong> ${this.cierre.cajaNombre || 'N/A'}</p>

            <h3>Lista de Ingresos</h3>
            <table>
              <thead>
                <tr><th>Fecha</th><th>Valor</th><th>Información</th></tr>
              </thead>
              <tbody>
                ${this.ingresos.map(i => `
                  <tr>
                    <td>${this.formatDate(i.fecha)}</td>
                    <td>${this.formatDecimal(i.valor)}</td>
                    <td>${i.informacion}</td>
                  </tr>
                `).join('')}
                <tr>
                  <td colspan="2"><strong>Total Ingresos</strong></td>
                  <td><strong>${this.formatDecimal(this.totalIngresos)}</strong></td>
                </tr>
              </tbody>
            </table>

            <h3>Lista de Egresos</h3>
            <table>
              <thead>
                <tr><th>Fecha</th><th>Valor</th><th>Información</th></tr>
              </thead>
              <tbody>
                ${this.egresos.map(e => `
                  <tr>
                    <td>${this.formatDate(e.fecha)}</td>
                    <td>${this.formatDecimal(e.valor)}</td>
                    <td>${e.informacion}</td>
                  </tr>
                `).join('')}
                <tr>
                  <td colspan="2"><strong>Total Egresos</strong></td>
                  <td><strong>${this.formatDecimal(this.totalEgresos)}</strong></td>
                </tr>
              </tbody>
            </table>

            <h3>Resumen General</h3>
            <table>
              <tbody>
                <tr><td>Ingresos en Efectivo</td><td>${this.formatDecimal(this.cierre.totalIngresosEfectivo)}</td></tr>
                <tr><td>Ingresos por Transferencia</td><td>${this.formatDecimal(this.cierre.totalIngresosTransferencia)}</td></tr>
                <tr><td><strong>Total Ingresos</strong></td><td><strong>${this.formatDecimal(this.totalIngresos)}</strong></td></tr>
                <tr><td>Gastos en Efectivo</td><td>${this.formatDecimal(this.cierre.totalGastosEfectivo)}</td></tr>
                <tr><td>Gastos por Transferencia</td><td>${this.formatDecimal(this.cierre.totalGastosTransferencia)}</td></tr>
                <tr><td><strong>Total Egresos</strong></td><td><strong>${this.formatDecimal(this.totalEgresos)}</strong></td></tr>
                <tr><td>Saldo Final Efectivo</td><td>${this.formatDecimal(this.cierre.saldoFinalEfectivo)}</td></tr>
                <tr><td>Saldo Final Transferencia</td><td>${this.formatDecimal(this.cierre.saldoFinalTransferencia)}</td></tr>
                <tr><td>Valor Contable</td><td>${this.formatDecimal(this.cierre.valorContable)}</td></tr>
                <tr><td>Diferencia</td><td>${this.formatDecimal(this.cierre.diferencia)}</td></tr>
                <tr><td><strong>Valor de Cierre Final</strong></td><td><strong>${this.formatDecimal(this.cierre.valorCierre)}</strong></td></tr>
              </tbody>
            </table>
          </body>
        </html>
      `;

      doc.open();
      doc.write(html);
      doc.close();

      // Esperar a que se renderice y luego usar html2canvas
      printWindow.onload = () => {
        html2canvas(printWindow.document.body).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

          pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
          pdf.save('reporte-cierre.pdf');
          printWindow.close();
        });
      };
    },

    exportarExcel() {
      const ingresosData = this.ingresos.map(i => ({
        Fecha: this.formatDate(i.fecha),
        Valor: this.formatDecimal(i.valor),
        Informacion: i.informacion
      }));

      const egresosData = this.egresos.map(e => ({
        Fecha: this.formatDate(e.fecha),
        Valor: this.formatDecimal(e.valor),
        Informacion: e.informacion
      }));

      const resumen = [
        { Concepto: 'Fecha Apertura', Valor: this.formatDate(this.cierre.fechaApertura) },
        { Concepto: 'Fecha Cierre', Valor: this.formatDate(this.cierre.fechaCierre) },
        { Concepto: 'Cajero', Valor: this.cierre.usuario },
        { Concepto: 'Caja', Valor: this.cierre.cajaNombre || 'N/A' },
        { Concepto: 'Ingresos en Efectivo', Valor: this.formatDecimal(this.cierre.totalIngresosEfectivo) },
        { Concepto: 'Ingresos por Transferencia', Valor: this.formatDecimal(this.cierre.totalIngresosTransferencia) },
        { Concepto: 'Total Ingresos', Valor: this.formatDecimal(this.totalIngresos) },
        { Concepto: 'Gastos en Efectivo', Valor: this.formatDecimal(this.cierre.totalGastosEfectivo) },
        { Concepto: 'Gastos por Transferencia', Valor: this.formatDecimal(this.cierre.totalGastosTransferencia) },
        { Concepto: 'Total Egresos', Valor: this.formatDecimal(this.totalEgresos) },
        { Concepto: 'Saldo Final Efectivo', Valor: this.formatDecimal(this.cierre.saldoFinalEfectivo) },
        { Concepto: 'Saldo Final Transferencia', Valor: this.formatDecimal(this.cierre.saldoFinalTransferencia) },
        { Concepto: 'Valor Contable', Valor: this.formatDecimal(this.cierre.valorContable) },
        { Concepto: 'Diferencia', Valor: this.formatDecimal(this.cierre.diferencia) },
        { Concepto: 'Valor de Cierre Final', Valor: this.formatDecimal(this.cierre.valorCierre) }
      ];

      const wb = XLSX.utils.book_new();
      const sheet3 = XLSX.utils.json_to_sheet(ingresosData);
      const sheet2 = XLSX.utils.json_to_sheet(egresosData);
      const sheet1 = XLSX.utils.json_to_sheet(resumen);

      XLSX.utils.book_append_sheet(wb, sheet1, 'Resumen');
      XLSX.utils.book_append_sheet(wb, sheet2, 'Egresos');
      XLSX.utils.book_append_sheet(wb, sheet3, 'Ingresos');

      XLSX.writeFile(wb, 'reporte-cierre.xlsx');
    }


  },
  mounted() {
    this.cargarDatos();
  }
};
</script>

<style scoped>
.text-danger {
  color: red;
}

.text-success {
  color: green;
}

.bg-primary {
  background-color: #dff0ff !important;
}

.text-end {
  text-align: right;
}

.text-start {
  text-align: left;
}

.text-center {
  text-align: center;
}
</style>
