<template>
  <div class="reporte-productos-wrapper">
    <CCard>
      <CCardHeader class="d-flex justify-content-between align-items-center">
        <strong>Productos/Subproductos Más Vendidos</strong>
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
            <label>Límite</label>
            <CFormInput type="number" v-model.number="filtros.limite" min="1" />
          </CCol>
          <CCol md="2">
            <CButton color="secondary" variant="outline" @click="buscar" :disabled="isLoading" class="w-100">
              <CSpinner v-if="isLoading" size="sm" class="me-1" /> Buscar
            </CButton>
          </CCol>
        </CRow>

        <CTable hover class="mt-4" v-if="productos.length">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>Código</CTableHeaderCell>
              <CTableHeaderCell>Nombre</CTableHeaderCell>
              <CTableHeaderCell>Cantidad Vendida</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow v-for="prod in productos" :key="prod.codigo">
              <CTableDataCell>{{ prod.codigo }}</CTableDataCell>
              <CTableDataCell>{{ prod.nombre }}</CTableDataCell>
              <CTableDataCell>{{ prod.totalVendido }}</CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>

        <CAlert v-if="!productos.length && !isLoading" color="info" class="mt-3">
          No hay resultados para los filtros aplicados.
        </CAlert>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import { obtenerProductosMasVendidosFachada } from '@/assets/js/ventas';
import { obtenerProductoCodigoBarrasFachada } from '@/assets/js/productos';
import { obtenerSubproductoCodigoBarrasFachada } from '@/assets/js/subproductos';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default {
  data() {
    return {
      filtros: {
        fechaInicio: '',
        fechaFin: '',
        limite: 10,
      },
      productos: [],
      isLoading: false,
      idNegocio: null,
    };
  },
  mounted() {
    this.idNegocio = JSON.parse(sessionStorage.getItem('usuario')).negocioId || JSON.parse(sessionStorage.getItem('negocioId'));
  },
  methods: {
    async buscar() {
      this.isLoading = true;
      this.productos = [];
      try {
        const { fechaInicio, fechaFin, limite } = this.filtros;
        const productosBase = await obtenerProductosMasVendidosFachada(
          fechaInicio || null,
          fechaFin || null,
          this.idNegocio,
          limite
        );

        for (const p of productosBase) {
          try {
            const prod = await obtenerProductoCodigoBarrasFachada(p.codigo, this.idNegocio);
            p.nombre = prod.nombre;
          } catch (e1) {
            try {
              const sub = await obtenerSubproductoCodigoBarrasFachada(p.codigo, this.idNegocio);
              p.nombre = sub.nombre;
            } catch (e2) {
              p.nombre = 'Desconocido';
            }
          }
        }

        this.productos = productosBase;
      } catch (error) {
        console.error('Error al buscar productos más vendidos:', error);
        this.productos = [];
      } finally {
        this.isLoading = false;
      }
    },
    exportarExcel() {
      const data = [
        ['Código', 'Nombre', 'Cantidad Vendida'],
        ...this.productos.map(p => [p.codigo, p.nombre, p.totalVendido])
      ];
      const hoja = XLSX.utils.aoa_to_sheet(data);
      const libro = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(libro, hoja, 'Más Vendidos');
      XLSX.writeFile(libro, 'reporte_productos_mas_vendidos.xlsx');
    },
    exportarPDF() {
      const tablaHtml = `
        <html><head><style>
        body { font-family: Arial; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #000; padding: 4px; text-align: left; }
        th { background-color: #eee; }
        </style></head><body>
        <h2>Reporte Productos/Subproductos Más Vendidos</h2>
        <p><strong>Fecha Inicio:</strong> ${this.filtros.fechaInicio || 'N/A'}</p>
        <p><strong>Fecha Fin:</strong> ${this.filtros.fechaFin || 'N/A'}</p>
        <table>
          <thead><tr><th>Código</th><th>Nombre</th><th>Cantidad Vendida</th></tr></thead>
          <tbody>
            ${this.productos.map(p => `
              <tr><td>${p.codigo}</td><td>${p.nombre}</td><td>${p.totalVendido}</td></tr>
            `).join('')}
          </tbody>
        </table>
        </body></html>`;

      const printWindow = window.open('', '_blank');
      printWindow.document.open();
      printWindow.document.write(tablaHtml);
      printWindow.document.close();

      printWindow.onload = () => {
        html2canvas(printWindow.document.body).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
          pdf.save('reporte_productos_mas_vendidos.pdf');
          printWindow.close();
        });
      };
    }
  }
}
</script>

<style scoped>
.reporte-productos-wrapper {
  padding: 15px;
}
</style>
