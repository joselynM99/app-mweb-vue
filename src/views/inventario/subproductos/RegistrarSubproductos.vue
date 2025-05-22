<template>
  <div class="bwrapper align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol>
          <CCard>
            <CCardBody class="p-3">
              <div v-if="isLoadingListas" class="text-center mt-3">
                <CSpinner color="success" />
                <p>Cargando...</p>
              </div>
              <CForm @submit.prevent="registrarSubproducto" novalidate :class="{ 'was-validated': wasValidated }">
                <CAlert v-if="successMessage" color="success">{{ successMessage }}</CAlert>
                <CAlert v-if="errorMessage" color="danger">{{ errorMessage }}</CAlert>
                <CRow>
                  <CCol md="6">
                    <div class="mb-2">
                      <label for="codigoBarras" class="form-label">Código de Barras</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-barcode"></i></CInputGroupText>
                        <CFormInput id="codigoBarras" v-model="subproducto.codigoBarras" required />
                        <div class="invalid-feedback">El código de barras es obligatorio</div>
                        <CInputGroupText style="padding:0px 5px">
                          <button type="button" @click="abrirCamara" :disabled="isLoading"
                            style="border: none; background: none; margin:0px; padding:5px">
                            <i class="fas fa-camera"></i>
                            <CSpinner v-if="isLoading" color="light" class="spinner-border-sm" />
                          </button>
                        </CInputGroupText>
                      </CInputGroup>
                    </div>
                    <div id="scanner-container" style="width: 100%; height: auto; display: none;"></div>

                    <div class="mb-2">
                      <label for="nombre" class="form-label">Nombre</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-tag"></i></CInputGroupText>
                        <CFormInput id="nombre" v-model="subproducto.nombre" required />
                        <div class="invalid-feedback">El nombre es obligatorio</div>
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="descripcion" class="form-label">Descripción</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-info-circle"></i></CInputGroupText>
                        <CFormInput id="descripcion" v-model="subproducto.descripcion" />
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="producto" class="form-label">Producto - Costo Promedio</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-box"></i></CInputGroupText>
                        <CFormSelect id="producto" v-model="subproducto.producto" required>
                          <option value="" disabled selected>Seleccione un producto</option>
                          <option v-for="producto in productos" :key="producto.codigoBarras"
                            :value="producto.codigoBarras">
                            {{ producto.nombre + " - " + "$" + producto.costoPromedio }}
                          </option>
                        </CFormSelect>
                        <div class="invalid-feedback">El producto es obligatorio</div>
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="cantidadRelacionada" class="form-label">Cantidad Relacionada</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-sort-numeric-up"></i></CInputGroupText>
                        <CFormInput id="cantidadRelacionada" v-model.number="subproducto.cantidadRelacionada"
                          @keyup="handleCantidadInput" required min="1" />
                        <div class="invalid-feedback">La cantidad relacionada es obligatoria y debe ser mayor que 0
                        </div>
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="costoPromedio" class="form-label">Costo Promedio</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-dollar-sign"></i></CInputGroupText>
                        <CFormInput id="costoPromedio" v-model="subproducto.costoPromedio" readonly disabled/>
                      </CInputGroup>
                    </div>
                  </CCol>
                  <CCol md="6">
                    <div class="mb-2">
                      <label for="utilidad" class="form-label">Utilidad</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-percentage"></i></CInputGroupText>
                        <CFormInput id="utilidad" v-model="subproducto.utilidad" @input="validateAndCalculate"
                          required />
                        <CFormSelect v-model="tipoUtilidad" @change="validateAndCalculate">
                          <option value="porcentaje">Porcentaje</option>
                          <option value="valor">Valor</option>
                        </CFormSelect>
                        <div class="invalid-feedback">La utilidad es obligatoria</div>
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="precioSinImpuestos" class="form-label">Precio Sin Impuestos</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-dollar-sign"></i></CInputGroupText>
                        <CFormInput id="precioSinImpuestos" v-model="subproducto.precioSinImpuestos" readonly disabled/>
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="impuesto" class="form-label">Impuesto</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-percentage"></i></CInputGroupText>
                        <CFormSelect id="impuesto" v-model="subproducto.impuesto" @change="validateAndCalculate"
                          required :disabled="isLoadingListas">
                          <option :value="null" disabled selected>Seleccione un impuesto</option>
                          <option v-for="impuesto in impuestos" :key="impuesto.id" :value="impuesto.id">
                            {{ impuesto.tipoImpuesto }} - {{ impuesto.valor }}%
                          </option>
                        </CFormSelect>
                        <div class="invalid-feedback">El impuesto es obligatorio</div>
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="precioVenta" class="form-label">Precio Venta</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-money-bill-wave"></i></CInputGroupText>
                        <CFormInput id="precioVenta" v-model="subproducto.precioVenta" readonly disabled/>
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="stockActual" class="form-label">Stock Actual</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-boxes"></i></CInputGroupText>
                        <CFormInput id="stockActual" v-model="subproducto.stockActual" readonly disabled/>
                        <div class="invalid-feedback">El stock actual es obligatorio</div>
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="categoria" class="form-label">Categoría</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-list"></i></CInputGroupText>
                        <CFormSelect id="categoria" v-model="subproducto.categoria" required>
                          <option :value="null" disabled selected>Seleccione una categoría</option>
                          <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                            {{ categoria.nombre }}
                          </option>
                        </CFormSelect>
                        <div class="invalid-feedback">La categoría es obligatoria</div>
                      </CInputGroup>
                    </div>
                  </CCol>
                </CRow>
                <div class="d-grid" style="width:30%; margin: 2px auto;">
                  <CButton type="submit" color="success" :disabled="isLoading">
                    Registrar
                    <CSpinner v-if="isLoading" color="light" class="spinner-border-sm" />
                  </CButton>
                </div>
              </CForm>

              <div v-if="subproducto.producto && subproducto.cantidadRelacionada">
                <p>{{ subproducto.cantidadRelacionada }} {{
                  subproducto.nombre }} equivale a 1 {{ productoSeleccionado.nombre }}</p>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import { debounce } from 'lodash';
import { registrarSubproductoFachada } from '@/assets/js/subproductos';
import { listaProductosFachada, obtenerProductoCodigoBarrasFachada } from '@/assets/js/productos';
import { listaCategoriasFachada } from '@/assets/js/categorias';
import { listaImpuestosFachada } from '@/assets/js/impuestos';
import Quagga from 'quagga'; // Importamos QuaggaJS
import '@fortawesome/fontawesome-free/css/all.css'; // Importamos Font Awesome

export default {
  data() {
    return {
      negocioId: null,
      subproducto: {
        codigoBarras: '',
        nombre: '',
        descripcion: '',
        costoPromedio: 0,
        utilidad: 0,
        precioSinImpuestos: 0,
        precioVenta: 0,
        stockActual: 0,
        activo: true,
        producto: '',
        cantidadRelacionada: 0,
        impuesto: null,
        categoria: null,
        idNegocio: null
      },
      tipoUtilidad: 'porcentaje',
      productos: [],
      categorias: [],
      impuestos: [],
      productoSeleccionado: null,
      successMessage: '',
      errorMessage: '',
      wasValidated: false,
      isLoading: false,
      isLoadingListas: true // Nueva variable para controlar el estado de carga de las listas
    };
  },

  watch: {
    'subproducto.producto'(newValue) {
      if (newValue) {
        this.obtenerCostoPromedioProducto();
      }
    },
    'subproducto.cantidadRelacionada'(newValue) {
      if (newValue > 0) {
        this.calcularStockSubproducto();
      }
    }
  },
  mounted() {
    this.negocioId = JSON.parse(sessionStorage.getItem('usuario')).negocioId  || JSON.parse(sessionStorage.getItem('negocioId'));
    this.cargarListas();
  },
  methods: {
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
        this.subproducto.codigoBarras = result.codeResult.code;
        Quagga.stop();
        document.getElementById('scanner-container').style.display = 'none';
      }
    },

    abrirCamara() {
      this.mostrarContenedorEscaner();
      this.configurarQuagga();
      Quagga.onDetected(this.manejarDeteccion);
    },

    async cargarListas() {
      this.isLoadingListas = true; // Mostrar el spinner mientras se cargan las listas
      try {
        // Manejar cada llamada de manera independiente
        try {
          this.productos = await listaProductosFachada(this.negocioId);
        } catch (error) {
          console.error('Error al cargar productos:', error);
        }

        try {
          this.categorias = await listaCategoriasFachada(this.negocioId);
        } catch (error) {
          console.error('Error al cargar categorías:', error);
        }

        try {
          this.impuestos = await listaImpuestosFachada();
        } catch (error) {
          console.error('Error al cargar impuestos:', error);
        }
      } finally {
        this.isLoadingListas = false; // Ocultar el spinner cuando las listas se hayan cargado
      }
    },


    async obtenerCostoPromedioProducto() {
      try {

        const producto = await obtenerProductoCodigoBarrasFachada(this.subproducto.producto, this.negocioId);
        this.productoSeleccionado = producto;
        this.calcularCostoPromedioSubproducto();
        this.calcularStockSubproducto();
      } catch (error) {
        console.error('Error al obtener costo promedio del producto:', error);
      }
    },

    handleCantidadInput() {
      if (!this.productoSeleccionado) {
        this.subproducto.cantidadRelacionada = 0;
        return;
      }
      this.calcularCostoPromedioSubproducto();
      this.calcularStockSubproducto();
    },

    calcularCostoPromedioSubproducto() {
      const cantidadRelacionada = parseFloat(this.subproducto.cantidadRelacionada) || 0;
      const costoPromedioProducto = parseFloat(this.productoSeleccionado.costoPromedio) || 0;

      if (cantidadRelacionada > 0) {
        this.subproducto.costoPromedio = (costoPromedioProducto / cantidadRelacionada).toFixed(2);
      } else {
        this.subproducto.costoPromedio = 0;
      }
      this.calcularPrecios();
    },

    calcularStockSubproducto() {
      const cantidadRelacionada = parseFloat(this.subproducto.cantidadRelacionada) || 0;
      const stockProducto = parseInt(this.productoSeleccionado.stockActual) || 0;
      if (cantidadRelacionada > 0) {
        this.subproducto.stockActual = Math.floor(stockProducto * cantidadRelacionada);
      } else {
        this.subproducto.stockActual = 0;
      }
    },

    calcularPrecios() {
      const costoPromedio = parseFloat(this.subproducto.costoPromedio) || 0;
      const impuesto = this.impuestos.find(i => i.id === Number(this.subproducto.impuesto));
      const valorImpuesto = impuesto ? impuesto.valor / 100 : 0;

      if (this.tipoUtilidad === 'porcentaje') {
        const margenBeneficio = parseFloat(this.subproducto.utilidad) / 100 || 0;
        this.subproducto.precioSinImpuestos = (costoPromedio * (1 + margenBeneficio)).toFixed(2);
      } else {
        const valorUtilidad = parseFloat(this.subproducto.utilidad) || 0;
        this.subproducto.precioSinImpuestos = (costoPromedio + valorUtilidad).toFixed(2);
      }

      this.subproducto.precioVenta = (this.subproducto.precioSinImpuestos * (1 + valorImpuesto)).toFixed(2);
    },

    validateAndCalculate: debounce(function (event) {
      const value = event.target.value.replace(',', '.');
      event.target.value = value;
      this.calcularPrecios();
    }, 300),

    resetForm() {
      this.subproducto = {
        codigoBarras: '',
        nombre: '',
        descripcion: '',
        costoPromedio: 0,
        utilidad: 0,
        precioSinImpuestos: 0,
        precioVenta: 0,
        stockActual: 0,
        activo: true,
        producto: null,
        cantidadRelacionada: 0,
        impuesto: null,
        categoria: null,
        idNegocio: this.negocioId
      };
      this.wasValidated = false;
    },

    async registrarSubproducto() {
      this.wasValidated = true;
      this.errorMessage = '';
      this.successMessage = '';
      this.subproducto.idNegocio = this.negocioId;

      // Validar que todos los campos obligatorios estén completos
      if (!this.subproducto.codigoBarras || !this.subproducto.nombre || !this.subproducto.costoPromedio || this.subproducto.stockActual === null || this.subproducto.impuesto === null || !this.subproducto.producto || this.subproducto.cantidadRelacionada <= 0) {
        this.errorMessage = 'Por favor, complete todos los campos obligatorios y asegúrese de que la cantidad relacionada sea mayor que 0';
        this.isLoading = false;
        return;
      }

      // Validar que los campos cumplan con los patrones requeridos
      if (isNaN(this.subproducto.costoPromedio) || isNaN(this.subproducto.stockActual)) {
        this.errorMessage = 'El costo promedio y el stock actual deben ser números válidos';
        this.isLoading = false;
        return;
      }

      // Si todos los campos son válidos, proceder con el registro
      this.isLoading = true;
      try {
        const response = await registrarSubproductoFachada(this.subproducto);
        this.successMessage = 'Subproducto registrado exitosamente';
        this.errorMessage = '';

        this.resetForm();
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.errorMessage = 'Ya existe un producto o subproducto con el mismo código de barras para este negocio';
        } else if (error.response && error.response.status === 400) {
          this.errorMessage = error.response.data;
        } else {
          this.errorMessage = 'Ha ocurrido un error al registrar el subproducto';
        }
        this.successMessage = '';
        console.error('Error al registrar subproducto:', error);
      } finally {
        this.isLoading = false;
      }
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
}
</style>
