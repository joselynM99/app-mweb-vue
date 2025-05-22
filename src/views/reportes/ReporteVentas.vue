<template>
  <div class="reporte-ventas-wrapper">
    <CCard>
      <CCardHeader class="d-flex justify-content-between align-items-center">
        <strong>Reporte de Ventas</strong>
        <div>
          <CButton color="success" size="sm" class="me-2" @click="exportarExcel"
            >Exportar Excel</CButton
          >
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
            <label>Vendedor</label>
            <CFormInput v-model="filtros.username" />
          </CCol>
          <CCol md="2">
            <CButton
              color="secondary"
              variant="outline"
              @click="buscar"
              :disabled="isLoading"
              class="w-100"
            >
              <CSpinner v-if="isLoading" size="sm" class="me-1" />
              Buscar
            </CButton>
          </CCol>
        </CRow>

        <CCard class="mt-4" v-if="ventas.length">
          <CCardHeader><strong>Resumen de Ventas</strong></CCardHeader>
          <CCardBody>
            <CTable>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell>Cantidad de ventas en efectivo</CTableDataCell>
                  <CTableDataCell>{{ resumenVentas.cantidadEfectivo }}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell>Total en efectivo</CTableDataCell>
                  <CTableDataCell class="text-success fw-bold">
                    {{ resumenVentas.totalEfectivo.toFixed(2) }}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell>Cantidad de ventas por transferencia</CTableDataCell>
                  <CTableDataCell>{{ resumenVentas.cantidadTransferencia }}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell>Total por transferencia</CTableDataCell>
                  <CTableDataCell class="text-primary fw-bold">
                    {{ resumenVentas.totalTransferencia.toFixed(2) }}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell scope="row">Cantidad total de ventas</CTableHeaderCell>
                  <CTableDataCell
                    ><strong>{{ resumenVentas.cantidad }}</strong></CTableDataCell
                  >
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell scope="row">Suma total de ventas</CTableHeaderCell>
                  <CTableDataCell
                    ><strong>{{ resumenVentas.totalVentas.toFixed(2) }}</strong>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>

        <CTable hover class="mt-4" v-if="ventasOrdenadas.length">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell @click="ordenarPor('fecha')" style="cursor: pointer">
                Fecha
                <i :class="orden.key === 'fecha' ? orden.icon : 'fas fa-sort'" />
              </CTableHeaderCell>
              <CTableHeaderCell @click="ordenarPor('numeroReferencia')" style="cursor: pointer">
                N° Ref
                <i :class="orden.key === 'numeroReferencia' ? orden.icon : 'fas fa-sort'" />
              </CTableHeaderCell>
              <CTableHeaderCell @click="ordenarPor('total')" style="cursor: pointer">
                Total
                <i :class="orden.key === 'total' ? orden.icon : 'fas fa-sort'" />
              </CTableHeaderCell>
              <CTableHeaderCell>Vendedor</CTableHeaderCell>
              <CTableHeaderCell>Pago</CTableHeaderCell>
              <CTableHeaderCell>Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow v-for="venta in ventasOrdenadas" :key="venta.numeroReferencia">
              <CTableDataCell>{{ formatDate(venta.fecha) }}</CTableDataCell>
              <CTableDataCell>{{ venta.numeroReferencia }}</CTableDataCell>
              <CTableDataCell>{{ venta.total }}</CTableDataCell>
              <CTableDataCell>{{ venta.vendedor }}</CTableDataCell>
              <CTableDataCell>
                <CBadge
                  :color="venta.pagoTransferencia ? 'primary' : 'success'"
                  class="text-white px-2"
                >
                  {{ venta.pagoTransferencia ? 'Transferencia' : 'Efectivo' }}
                </CBadge>
              </CTableDataCell>
              <CTableDataCell>
                <CButton color="info" size="sm" @click="verDetalle(venta.numeroReferencia)">
                  <i class="fas fa-eye"></i>
                </CButton>
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>

        <CAlert v-if="!ventas.length && !isLoading" color="info" class="mt-3">
          No hay resultados para los filtros aplicados.
        </CAlert>

        <CModal :visible="modalVisible" @close="modalVisible = false">
          <CModalHeader>Detalle de Venta</CModalHeader>
          <CModalBody>
            <div v-if="isLoadingDetalle"><CSpinner color="primary" /> Cargando detalle...</div>
            <div v-else>
              <p><strong>N°:</strong> {{ detalle.numeroReferencia }}</p>
              <p><strong>Cliente:</strong> {{ detalle.cliente }}</p>
              <p><strong>Vendedor:</strong> {{ detalle.username }}</p>
              <p><strong>Fecha:</strong> {{ formatDate(detalle.fecha) }}</p>
              <p><strong>Total:</strong> {{ detalle.total }}</p>
              <p>
                <strong>Pago: </strong>
                <CBadge
                  :color="detalle.pagoTransferencia ? 'primary' : 'success'"
                  class="text-white px-2"
                >
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
                      <CTableHeaderCell>Precio</CTableHeaderCell>
                      <CTableHeaderCell>Subtotal</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow v-for="prod in detalle.detalles" :key="prod.codigoBarras">
                      <CTableDataCell>{{ prod.nombre }}</CTableDataCell>
                      <CTableDataCell>{{ prod.codigoBarras }}</CTableDataCell>
                      <CTableDataCell>{{ prod.cantidad }}</CTableDataCell>
                      <CTableDataCell>{{ prod.precioVenta }}</CTableDataCell>
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
import {
  buscarVentasFachada,
  obtenerVentaPorNumeroReferenciaYNegocioFachada,
} from '@/assets/js/ventas'

import { obtenerProductoCodigoBarrasFachada } from '@/assets/js/productos'

import { obtenerSubproductoCodigoBarrasFachada } from '@/assets/js/subproductos'

import { debounce } from 'lodash'
import * as XLSX from 'xlsx'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default {
  data() {
    return {
      filtros: {
        fechaInicio: '',
        fechaFin: '',
        numeroReferencia: '',
        username: '',
      },
      ventas: [],
      detalle: {},
      modalVisible: false,
      isLoading: false,
      isLoadingDetalle: false,
      idNegocio: null,
      orden: {
        key: '',
        asc: true,
        icon: '',
      },
    }
  },
  mounted() {
    this.idNegocio = JSON.parse(sessionStorage.getItem('usuario')).negocioId || JSON.parse(sessionStorage.getItem('negocioId'))
  },
  computed: {
    ventasOrdenadas() {
      if (!this.orden.key) return this.ventas
      return [...this.ventas].sort((a, b) => {
        const aVal = a[this.orden.key]
        const bVal = b[this.orden.key]
        return this.orden.asc ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1
      })
    },
    resumenVentas() {
      const resumen = {
        totalVentas: 0,
        cantidad: 0,
        totalEfectivo: 0,
        totalTransferencia: 0,
        cantidadEfectivo: 0,
        cantidadTransferencia: 0,
      }

      this.ventas.forEach((v) => {
        resumen.totalVentas += v.total
        resumen.cantidad++
        if (v.pagoTransferencia) {
          resumen.totalTransferencia += v.total
          resumen.cantidadTransferencia++
        } else {
          resumen.totalEfectivo += v.total
          resumen.cantidadEfectivo++
        }
      })

      return resumen
    },
  },
  methods: {
    buscar: debounce(async function () {
      this.isLoading = true
      try {
        const { fechaInicio, fechaFin, numeroReferencia, username } = this.filtros
        this.ventas = await buscarVentasFachada(
          numeroReferencia || null,
          fechaInicio || null,
          fechaFin || null,
          username || null,
          this.idNegocio,
        )
      } catch (error) {
        console.error('Error al buscar ventas:', error)
        this.ventas = []
      } finally {
        this.isLoading = false
      }
    }, 300),

    ordenarPor(campo) {
      if (this.orden.key === campo) {
        this.orden.asc = !this.orden.asc
      } else {
        this.orden.key = campo
        this.orden.asc = true
      }
      this.orden.icon = this.orden.asc ? 'fas fa-sort-up' : 'fas fa-sort-down'
    },
    
    async verDetalle(numeroReferencia) {
      this.modalVisible = true
      this.isLoadingDetalle = true
      try {
        this.detalle = await obtenerVentaPorNumeroReferenciaYNegocioFachada(
          numeroReferencia,
          this.idNegocio,
        )

        // Recorremos cada detalle para obtener nombre y precio
        for (const detalle of this.detalle.detalles) {
          const codigo = detalle.codigoBarras

          // Intentar obtener como producto
          let producto = null
          try {
            producto = await obtenerProductoCodigoBarrasFachada(codigo, this.idNegocio)
            detalle.nombre = producto.nombre
            detalle.precioVenta = producto.precioVenta
          } catch (errorProd) {
            // Si no es producto, buscar como subproducto
            try {
              const subproducto = await obtenerSubproductoCodigoBarrasFachada(
                codigo,
                this.idNegocio,
              )
              detalle.nombre = subproducto.nombre
              detalle.precioVenta = subproducto.precioVenta
            } catch (errorSub) {
              console.warn(`No se encontró ni producto ni subproducto para el código ${codigo}`)
              detalle.nombre = 'Producto no encontrado'
              detalle.precioVenta = 0
            }
          }
        }
      } catch (error) {
        console.error('Error al obtener detalle:', error)
        this.detalle = {}
      } finally {
        this.isLoadingDetalle = false
      }
    },

    exportarExcel() {
      const resumen = this.resumenVentas

      // Hoja 1: Resumen general
      const resumenData = [
        ['Reporte de Ventas'],
        [],
        ['Fecha Inicio', this.filtros.fechaInicio || 'N/A'],
        ['Fecha Fin', this.filtros.fechaFin || 'N/A'],
        ['Vendedor', this.filtros.username || 'Todos'],
        ['N° Referencia', this.filtros.numeroReferencia || 'Todos'],
        [],
        ['Campo', 'Valor'],
        ['Cantidad total de ventas', resumen.cantidad],
        ['Suma total', resumen.totalVentas.toFixed(2)],
        [
          'Ventas en efectivo',
          `${resumen.cantidadEfectivo} ($${resumen.totalEfectivo.toFixed(2)})`,
        ],
        [
          'Ventas por transferencia',
          `${resumen.cantidadTransferencia} ($${resumen.totalTransferencia.toFixed(2)})`,
        ],
      ]

      const hojaResumen = XLSX.utils.aoa_to_sheet(resumenData)

      // Hoja 2: Detalle de ventas
      const detalleData = [['Fecha', 'Número Ref', 'Total', 'Vendedor', 'Pago']]

      this.ventasOrdenadas.forEach((v) => {
        detalleData.push([
          this.formatDate(v.fecha),
          v.numeroReferencia,
          v.total,
          v.vendedor || v.username, // fallback por si "vendedor" es undefined
          v.pagoTransferencia ? 'Transferencia' : 'Efectivo',
        ])
      })

      const hojaDetalle = XLSX.utils.aoa_to_sheet(detalleData)

      // Crear libro y agregar hojas
      const libro = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(libro, hojaResumen, 'Resumen')
      XLSX.utils.book_append_sheet(libro, hojaDetalle, 'Ventas')

      // Guardar archivo
      XLSX.writeFile(libro, 'reporte_ventas.xlsx')
    },
    exportarPDF() {
      const printWindow = window.open('', '_blank', 'width=900,height=1200')
      const resumen = this.resumenVentas

      const html = `
    <html>
      <head>
        <title>Reporte de Ventas</title>
        <style>
          body { font-family: Arial, sans-serif; font-size: 12px; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #000; padding: 6px; text-align: left; }
          th { background-color: #f0f0f0; }
          h2, h3 { margin-top: 30px; }
        </style>
      </head>
      <body>
        <h1>Reporte de Ventas</h1>
        <p><strong>Fecha Inicio:</strong> ${this.filtros.fechaInicio || 'N/A'}</p>
        <p><strong>Fecha Fin:</strong> ${this.filtros.fechaFin || 'N/A'}</p>
        <p><strong>Vendedor:</strong> ${this.filtros.username || 'Todos'}</p>
        <p><strong>N° Referencia:</strong> ${this.filtros.numeroReferencia || 'Todos'}</p>

        <h2>Resumen General</h2>
        <table>
          <tr><th>Campo</th><th>Valor</th></tr>
          <tr><td>Cantidad total de ventas</td><td>${resumen.cantidad}</td></tr>
          <tr><td>Suma total</td><td>${resumen.totalVentas.toFixed(2)}</td></tr>
          <tr><td>Ventas en efectivo</td><td>${
            resumen.cantidadEfectivo
          } ($${resumen.totalEfectivo.toFixed(2)})</td></tr>
          <tr><td>Ventas por transferencia</td><td>${
            resumen.cantidadTransferencia
          } ($${resumen.totalTransferencia.toFixed(2)})</td></tr>
        </table>

        <h2>Detalle de Ventas</h2>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>N° Ref</th>
              <th>Total</th>
              <th>Vendedor</th>
              <th>Pago</th>
            </tr>
          </thead>
          <tbody>
            ${this.ventasOrdenadas
              .map(
                (v) => `
              <tr>
                <td>${this.formatDate(v.fecha)}</td>
                <td>${v.numeroReferencia}</td>
                <td>${v.total}</td>
                <td>${v.vendedor}</td>
                <td>${v.pagoTransferencia ? 'Transferencia' : 'Efectivo'}</td>
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
      </body>
    </html>
  `

      printWindow.document.open()
      printWindow.document.write(html)
      printWindow.document.close()

      printWindow.onload = () => {
        html2canvas(printWindow.document.body).then((canvas) => {
          const imgData = canvas.toDataURL('image/png')
          const pdf = new jsPDF('p', 'mm', 'a4')
          const pdfWidth = pdf.internal.pageSize.getWidth()
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width

          pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight)
          pdf.save('reporte-ventas.pdf')
          printWindow.close()
        })
      }
    },

    formatDate(fecha) {
      return new Date(fecha).toLocaleString('es-EC', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
  },
}
</script>
<style scoped>
.reporte-ventas-wrapper {
  padding: 15px;
}

.table-bordered th,
.table-bordered td {
  border: 1px solid #dee2e6;
}

.modal-table-wrapper {
  max-height: 60vh;
  overflow-y: auto;
  overflow-x: auto;
  margin-top: 1rem;
}
</style>
