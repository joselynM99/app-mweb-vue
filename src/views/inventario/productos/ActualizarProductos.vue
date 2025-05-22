<template>
  <div class="bwrapper align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol>
          <CCard style="margin-bottom:12px;">
            <CCardBody class="p-4">
              <CInputGroup class="mb-2">
                <CInputGroupText>
                  <i class="fas fa-search fa-fw"></i>
                </CInputGroupText>
                <CFormInput v-model="searchCodigoBarras" placeholder="Buscar por código de barras" required />
                <CInputGroupText style="padding:0px 5px">
                  <button @click="buscarProducto" :disabled="isLoadingBuscar"
                    style="border: none; background: none; margin:0px; padding:5px">
                    Buscar
                    <CSpinner v-if="isLoadingBuscar" color="light" class="spinner-border-sm" />
                  </button>
                </CInputGroupText>
                <CInputGroupText style="padding:0px 5px">
                  <button @click="abrirCamara('search')" style="border: none; background: none; margin:0px; padding:5px"
                    type="button">
                    <i class="fas fa-camera"></i>
                  </button>
                </CInputGroupText>
              </CInputGroup>
              <div id="scanner-container" style="width: 100%; height: auto; display: none; "></div>
              <hr />
              <div v-if="isLoadingListas" class="text-center mt-3">
                <CSpinner color="success" />
                <p>Cargando...</p>
              </div>
              <CForm v-else @submit.prevent="actualizarProducto" novalidate :class="{ 'was-validated': wasValidated }">
                <CAlert v-if="successMessage" color="success">{{ successMessage }}</CAlert>
                <CAlert v-if="errorMessage" color="danger">{{ errorMessage }}</CAlert>
                <CRow>
                  <CCol md="6">
                    <div class="mb-2">
                      <CFormLabel for="codigoBarras">Código de Barras</CFormLabel>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-barcode"></i></CInputGroupText>
                        <CFormInput id="codigoBarras" v-model="producto.codigoBarras" required />
                        <CInputGroupText style="padding:0px 5px">
                          <button @click="abrirCamara('producto')"
                            style="border: none; background: none; margin:0px; padding:5px" type="button">
                            <i class="fas fa-camera"></i>
                          </button>
                        </CInputGroupText>
                      </CInputGroup>
                    </div>
                    <div class="mb-2">
                      <CFormLabel for="nombre">Nombre</CFormLabel>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-tag"></i></CInputGroupText>
                        <CFormInput id="nombre" v-model="producto.nombre" required />
                      </CInputGroup>
                    </div>
                    <div class="mb-2">
                      <CFormLabel for="descripcion">Descripción</CFormLabel>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-info-circle"></i></CInputGroupText>
                        <CFormInput id="descripcion" v-model="producto.descripcion" />
                      </CInputGroup>
                    </div>
                    <div class="mb-2">
                      <CFormLabel for="proveedor">Proveedor</CFormLabel>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-truck"></i></CInputGroupText>
                        <CFormSelect id="proveedor" v-model="producto.proveedor" :disabled="isLoadingListas">
                          <option :value="null" disabled selected>Seleccione un proveedor</option>
                          <option v-for="proveedor in proveedores" :key="proveedor.identificacion"
                            :value="String(proveedor.identificacion)">
                            {{ proveedor.nombreComercial }}
                          </option>
                        </CFormSelect>
                      </CInputGroup>
                    </div>
                    <div class="mb-2">
                      <CFormLabel for="categoria">Categoría</CFormLabel>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-list"></i></CInputGroupText>
                        <CFormSelect id="categoria" v-model="producto.categoria" :disabled="isLoadingListas">
                          <option :value="null" disabled selected>Seleccione una categoría</option>
                          <option v-for="categoria in categorias" :key="categoria.id" :value="String(categoria.id)">
                            {{ categoria.nombre }}
                          </option>
                        </CFormSelect>
                      </CInputGroup>
                    </div>
                    <div class="mb-2">
                      <CFormLabel for="marca">Marca</CFormLabel>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-tag"></i></CInputGroupText>
                        <CFormSelect id="marca" v-model="producto.marca" :disabled="isLoadingListas">
                          <option :value="null" disabled selected>Seleccione una marca</option>
                          <option v-for="marca in marcas" :key="marca.id" :value="String(marca.id)">
                            {{ marca.nombre }}
                          </option>
                        </CFormSelect>
                      </CInputGroup>
                    </div>
                  </CCol>
                  <CCol md="6">
                    <div class="mb-2">
                      <CFormLabel for="costoPromedio">Costo Promedio</CFormLabel>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-dollar-sign"></i></CInputGroupText>
                        <CFormInput id="costoPromedio" v-model="producto.costoPromedio" @input="validateAndCalculate"
                          required />
                      </CInputGroup>
                      <div class="invalid-feedback">El costo promedio es obligatorio</div>
                    </div>
                    <div class="mb-2">
                      <CFormLabel for="utilidad">Utilidad</CFormLabel>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-percentage"></i></CInputGroupText>
                        <CFormInput id="utilidad" v-model="producto.utilidad" @input="validateAndCalculate" />
                        <CFormSelect v-model="tipoUtilidad" @change="validateAndCalculate">
                          <option value="porcentaje">Porcentaje</option>
                          <option value="valor">Valor</option>
                        </CFormSelect>
                      </CInputGroup>
                      <div class="invalid-feedback">La utilidad es obligatoria</div>
                    </div>
                    <div class="mb-2">
                      <CFormLabel for="precioSinImpuestos">Precio Sin Impuestos</CFormLabel>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-dollar-sign"></i></CInputGroupText>
                        <CFormInput id="precioSinImpuestos" v-model="producto.precioSinImpuestos" readonly />
                      </CInputGroup>
                    </div>
                    <div class="mb-2">
                      <CFormLabel for="impuesto">Impuesto</CFormLabel>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-percentage"></i></CInputGroupText>
                        <CFormSelect id="impuesto" v-model="producto.impuesto" @change="validateAndCalculate" required
                          :disabled="isLoadingListas">
                          <option :value="null" disabled selected>Seleccione un impuesto</option>
                          <option v-for="impuesto in impuestos" :key="impuesto.id" :value="String(impuesto.id)">
                            {{ impuesto.tipoImpuesto }} - {{ impuesto.valor }}%
                          </option>
                        </CFormSelect>
                      </CInputGroup>
                      <div class="invalid-feedback">El impuesto es obligatorio</div>
                    </div>
                    <div class="mb-2">
                      <CFormLabel for="precioVenta">Precio de Venta</CFormLabel>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-dollar-sign"></i></CInputGroupText>
                        <CFormInput id="precioVenta" v-model="producto.precioVenta" readonly />
                      </CInputGroup>
                    </div>
                    <div class="mb-2">
                      <CFormLabel for="stockActual">Stock Actual</CFormLabel>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-box"></i></CInputGroupText>
                        <CFormInput id="stockActual" v-model="producto.stockActual" @input="validateAndCalculate"
                          required />
                      </CInputGroup>
                      <div class="invalid-feedback">El stock actual es obligatorio</div>
                    </div>
                  </CCol>
                </CRow>
                <div class="d-grid" style="width:35%; margin: 5px auto;">
                  <CButton color="success" type="submit" :disabled="isLoadingActualizar">
                    Actualizar
                    <CSpinner v-if="isLoadingActualizar" color="light" class="spinner-border-sm" />
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
import { obtenerProductoCodigoBarrasFachada, actualizarProductoFachada } from '@/assets/js/productos';
import { listaProveedoresFachada } from '@/assets/js/proveedor';
import { listaCategoriasFachada } from '@/assets/js/categorias';
import { listaMarcasFachada } from '@/assets/js/marcas';
import { listaImpuestosFachada } from '@/assets/js/impuestos';
import { debounce } from 'lodash';
import Quagga from 'quagga'; // Importamos QuaggaJS

export default {
  data() {
    return {
      searchCodigoBarras: '',
      producto: {
        codigoBarras: '',
        nombre: '',
        descripcion: '',
        costoPromedio: 0,
        utilidad: 0,
        precioSinImpuestos: 0,
        precioVenta: 0,
        stockActual: 0,
        activo: true,
        proveedor: null,
        impuesto: null,
        categoria: null,
        marca: null,
        idNegocio: null
      },
      tipoUtilidad: 'porcentaje',
      proveedores: [],
      categorias: [],
      marcas: [],
      impuestos: [],
      successMessage: '',
      errorMessage: '',
      wasValidated: false,
      isLoadingBuscar: false,
      isLoadingActualizar: false,
      isLoadingListas: true,
      negocioId: JSON.parse(sessionStorage.getItem('usuario')).negocioId || JSON.parse(sessionStorage.getItem('negocioId')),
    };
  },
  watch: {
    '$route.query.codigoBarras': {
      immediate: true,
      handler(newCodigoBarras) {
        if (newCodigoBarras) {
          this.searchCodigoBarras = newCodigoBarras;
          this.buscarProducto();
        }
      }
    }
  },
  methods: {
    async buscarProducto() {
      this.isLoadingBuscar = true;
      this.errorMessage = '';
      this.successMessage = '';
      try {
        const productoData = await obtenerProductoCodigoBarrasFachada(this.searchCodigoBarras, this.negocioId);
        this.producto = { ...productoData };
        this.successMessage = '';
        this.errorMessage = '';
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.errorMessage = 'Producto no encontrado';
        } else {
          this.errorMessage = 'Ha ocurrido un error al buscar el producto';
        }
        this.successMessage = '';
        console.error('Error al buscar producto:', error);
      } finally {
        this.isLoadingBuscar = false;
      }
    },
    async cargarListas() {
      this.isLoadingListas = true; // Mostrar el spinner mientras se cargan las listas
      try {
        // Manejar cada llamada de manera independiente
        try {
          this.proveedores = await listaProveedoresFachada(this.negocioId);
        } catch (error) {
          console.error('Error al cargar proveedores:', error);
        }

        try {
          this.categorias = await listaCategoriasFachada(this.negocioId);
        } catch (error) {
          console.error('Error al cargar categorías:', error);
        }

        try {
          this.marcas = await listaMarcasFachada(this.negocioId);
        } catch (error) {
          console.error('Error al cargar marcas:', error);
        }

        try {
          const impuestos = await listaImpuestosFachada();
          this.impuestos = impuestos.map(impuesto => ({
            ...impuesto,
            id: String(impuesto.id) // Convertir id a cadena
          }));
        } catch (error) {
          console.error('Error al cargar impuestos:', error);
        }
      } finally {
        this.isLoadingListas = false; // Ocultar el spinner cuando las listas se hayan cargado
      }
    }
    ,
    calcularPrecios() {
      const costoPromedio = parseFloat(this.producto.costoPromedio) || 0;
      const impuesto = this.impuestos.find(i => i.id === this.producto.impuesto);
      const valorImpuesto = impuesto ? impuesto.valor / 100 : 0;

      if (this.tipoUtilidad === 'porcentaje') {
        const margenBeneficio = parseFloat(this.producto.utilidad) / 100 || 0;
        this.producto.precioSinImpuestos = (costoPromedio * (1 + margenBeneficio)).toFixed(2);
      } else {
        const valorUtilidad = parseFloat(this.producto.utilidad) || 0;
        this.producto.precioSinImpuestos = (costoPromedio + valorUtilidad).toFixed(2);
      }

      this.producto.precioVenta = (this.producto.precioSinImpuestos * (1 + valorImpuesto)).toFixed(2);
    },
    validateAndCalculate: debounce(function (event) {
      const value = event.target.value.replace(',', '.');
      event.target.value = value;
      this.calcularPrecios();
    }, 300),
    resetForm() {
      this.producto = {
        codigoBarras: '',
        nombre: '',
        descripcion: '',
        costoPromedio: 0,
        utilidad: 0,
        precioSinImpuestos: 0,
        precioVenta: 0,
        stockActual: 0,
        activo: true,
        proveedor: null,
        impuesto: null,
        categoria: null,
        marca: null,
        idNegocio: this.negocioId
      };
      this.wasValidated = false;
    },
    async actualizarProducto() {
      this.wasValidated = true;
      this.errorMessage = '';
      this.successMessage = '';

      if (this.producto.proveedor === "Seleccione un proveedor") {
        this.producto.proveedor = null;
      }
      if (this.producto.marca === "Seleccione una marca") {
        this.producto.marca = null;
      }
      if (this.producto.categoria === "Seleccione una categoría") {
        this.producto.categoria = null;
      }

      // Validar que todos los campos estén completos
      if (!this.producto.codigoBarras || !this.producto.nombre || !this.producto.costoPromedio || this.producto.stockActual === null || this.producto.impuesto === null) {
        this.errorMessage = 'Por favor, complete todos los campos obligatorios';
        return;
      }

      // Validar que los campos cumplan con los patrones requeridos
      if (isNaN(this.producto.costoPromedio) || isNaN(this.producto.stockActual)) {
        this.errorMessage = 'El costo promedio y el stock actual deben ser números válidos';
        return;
      }

      // Si todos los campos son válidos, proceder con la actualización
      this.isLoadingActualizar = true;
      try {

        const response = await actualizarProductoFachada(this.searchCodigoBarras, this.producto);
        this.successMessage = 'Producto actualizado exitosamente';
        this.errorMessage = '';
        this.resetForm();
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.errorMessage = 'Producto no encontrado';
        } else {
          this.errorMessage = 'Ha ocurrido un error al actualizar el producto';
        }
        this.successMessage = '';
        console.error('Error al actualizar producto:', error);
      } finally {
        this.isLoadingActualizar = false;
      }
    },
    mostrarContenedorEscaner() {
      document.getElementById('scanner-container').style.display = 'block';
    },
    configurarQuagga() {
      Quagga.init({
        inputStream: {
          type: "LiveStream",
          target: document.querySelector('#scanner-container'),
          constraints: {
            facingMode: "environment",
            width: 480,
            height: 320
          }
        },
        decoder: {
          readers: [
            "code_128_reader",
            "ean_reader",
            "ean_8_reader",
            "code_39_reader",
            "upc_reader",
            "upc_e_reader",
            "codabar_reader",
            "code_93_reader"
          ],
          multiple: false
        },
        locate: true,
        locator: {
          halfSample: false,
          patchSize: "medium"
        },
        frequency: 100
      }, this.iniciarQuagga);
    },
    iniciarQuagga(err) {
      if (err) {
        console.error('Error al iniciar Quagga:', err);
        return;
      }
      Quagga.start();
    },
    manejarDeteccion(result) {
      if (result && result.codeResult && result.codeResult.code) {
        if (this.target === 'search') {
          this.searchCodigoBarras = result.codeResult.code;
          this.buscarProducto();
        } else if (this.target === 'producto') {
          this.producto.codigoBarras = result.codeResult.code;
        }
        Quagga.stop();
        document.getElementById('scanner-container').style.display = 'none';
      }
    },
    abrirCamara(target) {
      this.target = target;
      this.mostrarContenedorEscaner();
      this.configurarQuagga();
      Quagga.onDetected(this.manejarDeteccion);
    }
  },
  mounted() {
    const codigoBarras = this.$route.query.codigoBarras;
    if (codigoBarras) {
      this.searchCodigoBarras = codigoBarras;
      this.buscarProducto();
    }
    this.cargarListas();
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

#scanner-container {
  width: 100%;
  height: auto;
  max-height: 300px;
  overflow: hidden;
  margin: 10px auto !important;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
