<template>
  <div class="reporte-compras-wrapper">
    <CCard>
      <CCardHeader class="d-flex justify-content-between align-items-center">
        <strong>Reporte de Compras</strong>
        <div>
          <CButton color="success" size="sm" class="me-2" @click="exportarExcel">Exportar Excel</CButton>
          <CButton color="danger" size="sm" @click="exportarPDF">Exportar PDF</CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        <CRow class="mb-3 align-items-end">
          <CCol md="3">
            <label>Fecha Inicio</label>
            <CFormInput type="datetime-local" v-model="filtros.fechaInicio" />
          </CCol>
          <CCol md="3">
            <label>Fecha Fin</label>
            <CFormInput type="datetime-local" v-model="filtros.fechaFin" />
          </CCol>
          <CCol md="2">
            <label>N° Referencia</label>
            <CFormInput v-model="filtros.numeroReferencia" />
          </CCol>
          <CCol md="2">
            <label>Usuario</label>
            <CFormInput v-model="filtros.username" />
          </CCol>
          <CCol md="2">
            <CButton color="secondary" variant="outline" @click="buscar" :disabled="isLoading" class="w-100">
              <CSpinner v-if="isLoading" size="sm" class="me-1" /> Buscar
            </CButton>
          </CCol>
        </CRow>

        <CCard class="mt-4" v-if="compras.length">
          <CCardHeader><strong>Resumen de Compras</strong></CCardHeader>
          <CCardBody>
            <CTable>
              <CTableBody>
                <CTableRow><CTableDataCell>Cantidad de compras en efectivo</CTableDataCell><CTableDataCell>{{ resumenCompras.cantidadEfectivo }}</CTableDataCell></CTableRow>
                <CTableRow><CTableDataCell>Total en efectivo</CTableDataCell><CTableDataCell class="text-success fw-bold">{{ resumenCompras.totalEfectivo.toFixed(2) }}</CTableDataCell></CTableRow>
                <CTableRow><CTableDataCell>Cantidad de compras por transferencia</CTableDataCell><CTableDataCell>{{ resumenCompras.cantidadTransferencia }}</CTableDataCell></CTableRow>
                <CTableRow><CTableDataCell>Total por transferencia</CTableDataCell><CTableDataCell class="text-primary fw-bold">{{ resumenCompras.totalTransferencia.toFixed(2) }}</CTableDataCell></CTableRow>
                <CTableRow><CTableHeaderCell scope="row">Cantidad total de compras</CTableHeaderCell><CTableDataCell><strong>{{ resumenCompras.cantidad }}</strong></CTableDataCell></CTableRow>
                <CTableRow><CTableHeaderCell scope="row">Suma total de compras</CTableHeaderCell><CTableDataCell><strong>{{ resumenCompras.totalCompras.toFixed(2) }}</strong></CTableDataCell></CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>

        <CTable hover class="mt-4" v-if="comprasOrdenadas.length">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell @click="ordenarPor('fecha')" style="cursor: pointer">Fecha</CTableHeaderCell>
              <CTableHeaderCell @click="ordenarPor('numeroReferencia')" style="cursor: pointer">N° Ref</CTableHeaderCell>
              <CTableHeaderCell @click="ordenarPor('total')" style="cursor: pointer">Total</CTableHeaderCell>
              <CTableHeaderCell>Usuario</CTableHeaderCell>
              <CTableHeaderCell>Pago</CTableHeaderCell>
              <CTableHeaderCell>Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow v-for="compra in comprasOrdenadas" :key="compra.numeroReferencia">
              <CTableDataCell>{{ formatDate(compra.fecha) }}</CTableDataCell>
              <CTableDataCell>{{ compra.numeroReferencia }}</CTableDataCell>
              <CTableDataCell>{{ compra.total }}</CTableDataCell>
              <CTableDataCell>{{ compra.usuario }}</CTableDataCell>
              <CTableDataCell>
                <CBadge :color="compra.pagoTransferencia ? 'primary' : 'success'" class="text-white px-2">
                  {{ compra.pagoTransferencia ? 'Transferencia' : 'Efectivo' }}
                </CBadge>
              </CTableDataCell>
              <CTableDataCell>
                <CButton color="info" size="sm" @click="verDetalle(compra.numeroReferencia)">
                  <i class="fas fa-eye"></i>
                </CButton>
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>

        <CAlert v-if="!compras.length && !isLoading" color="info" class="mt-3">
          No hay resultados para los filtros aplicados.
        </CAlert>

        <!-- Modal para Detalle de Compra -->
        <CModal :visible="modalVisible" @close="modalVisible = false">
          <CModalHeader>Detalle de Compra</CModalHeader>
          <CModalBody>
            <div v-if="isLoadingDetalle"><CSpinner color="primary" /> Cargando detalle...</div>
            <div v-else>
              <p><strong>N°:</strong> {{ detalle.numeroReferencia }}</p>
              <p><strong>Proveedor:</strong> {{ detalle.proveedor }}</p>
              <p><strong>Usuario:</strong> {{ detalle.username }}</p>
              <p><strong>Fecha:</strong> {{ formatDate(detalle.fecha) }}</p>
              <p><strong>Total:</strong> {{ detalle.total }}</p>
              <p>
                <strong>Pago: </strong>
                <CBadge :color="detalle.pagoTransferencia ? 'primary' : 'success'" class="text-white px-2">
                  {{ detalle.pagoTransferencia ? 'Transferencia' : 'Efectivo' }}
                </CBadge>
              </p>
              <p><strong>Detalles:</strong></p>
              <div class="modal-table-wrapper">
                <CTable class="table-bordered">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Producto</CTableHeaderCell>
                      <CTableHeaderCell>Código</CTableHeaderCell>
                      <CTableHeaderCell>Cantidad</CTableHeaderCell>
                      <CTableHeaderCell>Costo</CTableHeaderCell>
                      <CTableHeaderCell>Subtotal</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow v-for="prod in detalle.detalles" :key="prod.codigoBarras">
                      <CTableDataCell>{{ prod.nombre }}</CTableDataCell>
                      <CTableDataCell>{{ prod.codigoBarras }}</CTableDataCell>
                      <CTableDataCell>{{ prod.cantidad }}</CTableDataCell>
                      <CTableDataCell>{{ prod.precioCompra }}</CTableDataCell>
                      <CTableDataCell>{{ prod.subtotal }}</CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </div>
            </div>
          </CModalBody>
        </CModal>
      </CCardBody>
    </CCard>
  </div>
</template>


<script>
import { buscarComprasFachada, obtenerCompraPorNumeroReferenciaYNegocioFachada } from '@/assets/js/compras';
import { obtenerProductoCodigoBarrasFachada } from '@/assets/js/productos';
import { obtenerSubproductoCodigoBarrasFachada } from '@/assets/js/subproductos';

import { debounce } from 'lodash';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default {
  data() {
    return {
      filtros: {
        fechaInicio: '',
        fechaFin: '',
        numeroReferencia: '',
        username: '',
      },
      compras: [],
      detalle: {},
      modalVisible: false,
      isLoading: false,
      isLoadingDetalle: false,
      idNegocio: null,
      orden: { key: '', asc: true, icon: '' },
    }
  },
  mounted() {
    this.idNegocio = JSON.parse(sessionStorage.getItem('usuario')).negocioId || JSON.parse(sessionStorage.getItem('negocioId'));
  },
  computed: {
    comprasOrdenadas() {
      if (!this.orden.key) return this.compras;
      return [...this.compras].sort((a, b) => {
        const aVal = a[this.orden.key];
        const bVal = b[this.orden.key];
        return this.orden.asc ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
      });
    },
    resumenCompras() {
      const resumen = {
        totalCompras: 0,
        cantidad: 0,
        totalEfectivo: 0,
        totalTransferencia: 0,
        cantidadEfectivo: 0,
        cantidadTransferencia: 0,
      };
      this.compras.forEach(c => {
        resumen.totalCompras += c.total;
        resumen.cantidad++;
        if (c.pagoTransferencia) {
          resumen.totalTransferencia += c.total;
          resumen.cantidadTransferencia++;
        } else {
          resumen.totalEfectivo += c.total;
          resumen.cantidadEfectivo++;
        }
      });
      return resumen;
    }
  },
  methods: {
    buscar: debounce(async function () {
      this.isLoading = true;
      try {
        const { fechaInicio, fechaFin, numeroReferencia, username } = this.filtros;
        this.compras = await buscarComprasFachada(
          numeroReferencia || null,
          fechaInicio || null,
          fechaFin || null,
          username || null,
          this.idNegocio
        );
      } catch (error) {
        console.error('Error al buscar compras:', error);
        this.compras = [];
      } finally {
        this.isLoading = false;
      }
    }, 300),

    async verDetalle(numeroReferencia) {
      this.modalVisible = true;
      this.isLoadingDetalle = true;
      try {
        this.detalle = await obtenerCompraPorNumeroReferenciaYNegocioFachada(numeroReferencia, this.idNegocio);

        for (const item of this.detalle.detalles) {
          const codigo = item.codigoBarras;
          try {
            const producto = await obtenerProductoCodigoBarrasFachada(codigo, this.idNegocio);
            item.nombre = producto.nombre;
            item.precioCompra = producto.costoPromedio;
          } catch (errorProducto) {
            try {
              const subproducto = await obtenerSubproductoCodigoBarrasFachada(codigo, this.idNegocio);
              item.nombre = subproducto.nombre;
              item.precioCompra = subproducto.costoPromedio;
            } catch (errorSubproducto) {
              item.nombre = 'Producto no encontrado';
              item.precioCompra = 0;
            }
          }
        }
      } catch (error) {
        console.error('Error al obtener detalle de compra:', error);
        this.detalle = {};
      } finally {
        this.isLoadingDetalle = false;
      }
    },

    ordenarPor(campo) {
      if (this.orden.key === campo) {
        this.orden.asc = !this.orden.asc;
      } else {
        this.orden.key = campo;
        this.orden.asc = true;
      }
      this.orden.icon = this.orden.asc ? 'fas fa-sort-up' : 'fas fa-sort-down';
    },
    exportarExcel() {
      const resumen = this.resumenCompras;
      const resumenData = [
        ['Reporte de Compras'],
        [],
        ['Fecha Inicio', this.filtros.fechaInicio || 'N/A'],
        ['Fecha Fin', this.filtros.fechaFin || 'N/A'],
        ['Usuario', this.filtros.username || 'Todos'],
        ['N° Referencia', this.filtros.numeroReferencia || 'Todos'],
        [],
        ['Campo', 'Valor'],
        ['Cantidad total de compras', resumen.cantidad],
        ['Suma total', resumen.totalCompras.toFixed(2)],
        ['Compras en efectivo', `${resumen.cantidadEfectivo} ($${resumen.totalEfectivo.toFixed(2)})`],
        ['Compras por transferencia', `${resumen.cantidadTransferencia} ($${resumen.totalTransferencia.toFixed(2)})`]
      ];
      const hojaResumen = XLSX.utils.aoa_to_sheet(resumenData);
      const detalleData = [['Fecha', 'Número Ref', 'Total', 'Usuario', 'Pago']];
      this.comprasOrdenadas.forEach(c => {
        detalleData.push([
          this.formatDate(c.fecha),
          c.numeroReferencia,
          c.total,
          c.usuario,
          c.pagoTransferencia ? 'Transferencia' : 'Efectivo'
        ]);
      });
      const hojaDetalle = XLSX.utils.aoa_to_sheet(detalleData);
      const libro = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(libro, hojaResumen, 'Resumen');
      XLSX.utils.book_append_sheet(libro, hojaDetalle, 'Compras');
      XLSX.writeFile(libro, 'reporte_compras.xlsx');
    },
    exportarPDF() {
      const resumen = this.resumenCompras;
      const printWindow = window.open('', '_blank', 'width=900,height=1200');
      const html = `
        <html><head><title>Reporte de Compras</title>
        <style>
        body { font-family: Arial, sans-serif; font-size: 12px; padding: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        th { background-color: #f0f0f0; }
        h2 { margin-top: 30px; }
        </style>
        </head><body>
        <h1>Reporte de Compras</h1>
        <p><strong>Fecha Inicio:</strong> ${this.filtros.fechaInicio || 'N/A'}</p>
        <p><strong>Fecha Fin:</strong> ${this.filtros.fechaFin || 'N/A'}</p>
        <p><strong>Usuario:</strong> ${this.filtros.username || 'Todos'}</p>
        <p><strong>N° Referencia:</strong> ${this.filtros.numeroReferencia || 'Todos'}</p>
        <h2>Resumen General</h2>
        <table>
        <tr><th>Campo</th><th>Valor</th></tr>
        <tr><td>Cantidad total de compras</td><td>${resumen.cantidad}</td></tr>
        <tr><td>Suma total</td><td>${resumen.totalCompras.toFixed(2)}</td></tr>
        <tr><td>Compras en efectivo</td><td>${resumen.cantidadEfectivo} ($${resumen.totalEfectivo.toFixed(2)})</td></tr>
        <tr><td>Compras por transferencia</td><td>${resumen.cantidadTransferencia} ($${resumen.totalTransferencia.toFixed(2)})</td></tr>
        </table>
        <h2>Detalle de Compras</h2>
        <table><thead><tr><th>Fecha</th><th>N° Ref</th><th>Total</th><th>Usuario</th><th>Pago</th></tr></thead>
        <tbody>
        ${this.comprasOrdenadas.map(c => `
          <tr><td>${this.formatDate(c.fecha)}</td><td>${c.numeroReferencia}</td><td>${c.total}</td><td>${c.usuario}</td><td>${c.pagoTransferencia ? 'Transferencia' : 'Efectivo'}</td></tr>
        `).join('')}
        </tbody>
        </table>
        </body></html>`;

      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();

      printWindow.onload = () => {
        html2canvas(printWindow.document.body).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

          pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
          pdf.save('reporte_compras.pdf');
          printWindow.close();
        });
      };
    },
    formatDate(fecha) {
      return new Date(fecha).toLocaleString('es-EC', {
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
      });
    }
  }
}
</script>

<style scoped>
.reporte-compras-wrapper {
  padding: 15px;
}
</style>
