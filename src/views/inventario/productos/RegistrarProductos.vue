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
              <CForm @submit.prevent="registrarProducto" novalidate :class="{ 'was-validated': wasValidated }">
                <CAlert v-if="successMessage" color="success">{{ successMessage }}</CAlert>
                <CAlert v-if="errorMessage" color="danger">{{ errorMessage }}</CAlert>
                <CRow>
                  <CCol md="6">
                    <div class="mb-2">
                      <label for="codigoBarras" class="form-label">Código de Barras</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-barcode"></i></CInputGroupText>
                        <CFormInput id="codigoBarras" v-model="producto.codigoBarras" required />

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
                    <!-- Aquí ajustamos el área de vista previa del escáner -->
                    <div id="scanner-container" style="width: 100%; height: auto; display: none;"></div>

                    <div class="mb-2">
                      <label for="nombre" class="form-label">Nombre</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-tag"></i></CInputGroupText>
                        <CFormInput id="nombre" v-model="producto.nombre" required />
                        <div class="invalid-feedback">El nombre es obligatorio</div>
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="descripcion" class="form-label">Descripción</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-info-circle"></i></CInputGroupText>
                        <CFormInput id="descripcion" v-model="producto.descripcion" />
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="proveedor" class="form-label">Proveedor</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-truck"></i></CInputGroupText>
                        <CFormSelect id="proveedor" v-model="producto.proveedor" :disabled="isLoadingListas">
                          <option :value="null" disabled selected>Seleccione un proveedor</option>
                          <option v-for="proveedor in proveedores" :key="proveedor.identificacion"
                            :value="proveedor.identificacion">
                            {{ proveedor.nombreComercial }}
                          </option>
                        </CFormSelect>
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="categoria" class="form-label">Categoría</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-list"></i></CInputGroupText>
                        <CFormSelect id="categoria" v-model="producto.categoria" :disabled="isLoadingListas">
                          <option :value="null" disabled selected>Seleccione una categoría</option>
                          <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                            {{ categoria.nombre }}
                          </option>
                        </CFormSelect>
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="marca" class="form-label">Marca</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-tag"></i></CInputGroupText>
                        <CFormSelect id="marca" v-model="producto.marca" :disabled="isLoadingListas">
                          <option :value="null" disabled selected>Seleccione una marca</option>
                          <option v-for="marca in marcas" :key="marca.id" :value="marca.id">
                            {{ marca.nombre }}
                          </option>
                        </CFormSelect>
                      </CInputGroup>
                    </div>
                  </CCol>
                  <CCol md="6">
                    <div class="mb-2">
                      <label for="costoPromedio" class="form-label">Costo Promedio</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-dollar-sign"></i></CInputGroupText>
                        <CFormInput id="costoPromedio" v-model="producto.costoPromedio" @input="validateAndCalculate"
                          required />
                        <div class="invalid-feedback">El costo promedio es obligatorio</div>
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="utilidad" class="form-label">Utilidad</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-percentage"></i></CInputGroupText>
                        <CFormInput id="utilidad" v-model="producto.utilidad" @input="validateAndCalculate" required />
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
                        <CFormInput id="precioSinImpuestos" v-model="producto.precioSinImpuestos" readonly />
                      </CInputGroup>
                    </div>
                    <div class="mb-2">
                      <label for="impuesto" class="form-label">Impuesto</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-receipt"></i></CInputGroupText>
                        <CFormSelect id="impuesto" v-model="producto.impuesto" @change="validateAndCalculate" required
                          :disabled="isLoadingListas">
                          <option :value="null" disabled selected>Seleccione un impuesto</option>
                          <option v-for="impuesto in impuestos" :key="impuesto.id" :value="impuesto.id">
                            {{ impuesto.tipoImpuesto }} - {{ impuesto.valor }}%
                          </option>
                        </CFormSelect>
                        <div class="invalid-feedback">El impuesto es obligatorio</div>
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="precioVenta" class="form-label">Precio de Venta</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-dollar-sign"></i></CInputGroupText>
                        <CFormInput id="precioVenta" v-model="producto.precioVenta" readonly />
                      </CInputGroup>
                    </div>

                    <div class="mb-2">
                      <label for="stockActual" class="form-label">Stock Actual</label>
                      <CInputGroup>
                        <CInputGroupText><i class="fas fa-boxes"></i></CInputGroupText>
                        <CFormInput id="stockActual" v-model="producto.stockActual" @input="validateAndCalculate"
                          required />
                        <div class="invalid-feedback">El stock actual es obligatorio</div>
                      </CInputGroup>
                    </div>
                  </CCol>
                </CRow>
                <div class="d-grid" style="width:30%; margin: 2px auto;">
                  <CButton color="success" type="submit" :disabled="isLoading">
                    Registrar
                    <CSpinner v-if="isLoading" color="light" class="spinner-border-sm" />
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
import { debounce } from 'lodash';
import { registrarProductoFachada } from '@/assets/js/productos';
import { listaProveedoresFachada } from '@/assets/js/proveedor';
import { listaCategoriasFachada } from '@/assets/js/categorias';
import { listaMarcasFachada } from '@/assets/js/marcas';
import { listaImpuestosFachada } from '@/assets/js/impuestos';
import Quagga from 'quagga'; // Importamos QuaggaJS
import '@fortawesome/fontawesome-free/css/all.css'; // Importamos Font Awesome

export default {
  data() {
    return {
      negocioId: null,
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
      isLoading: false,
      isLoadingListas: true // Nueva variable para controlar el estado de carga de las listas
    };
  },
  mounted() {
    this.negocioId = JSON.parse(sessionStorage.getItem('usuario')).negocioId;
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
        this.producto.codigoBarras = result.codeResult.code;
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
          this.proveedores = await listaProveedoresFachada(this.negocioId);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.warn('Proveedores no encontrados (404)');
          } else {
            console.error('Error al cargar proveedores:', error);
          }
        }

        try {
          this.categorias = await listaCategoriasFachada(this.negocioId);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.warn('Categorías no encontradas (404)');
          } else {
            console.error('Error al cargar categorías:', error);
          }
        }

        try {
          this.marcas = await listaMarcasFachada(this.negocioId);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.warn('Marcas no encontradas (404)');
          } else {
            console.error('Error al cargar marcas:', error);
          }
        }

        try {
          this.impuestos = await listaImpuestosFachada();
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.warn('Impuestos no encontrados (404)');
          } else {
            console.error('Error al cargar impuestos:', error);
          }
        }
      } finally {
        this.isLoadingListas = false; // Ocultar el spinner cuando las listas se hayan cargado
      }
    },

    calcularPrecios() {
      const costoPromedio = parseFloat(this.producto.costoPromedio) || 0;
      const impuesto = this.impuestos.find(i => i.id === Number(this.producto.impuesto));
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
    async registrarProducto() {
      this.wasValidated = true;
      this.errorMessage = '';
      this.successMessage = '';
      this.producto.idNegocio = this.negocioId;
      // Validar que todos los campos obligatorios estén completos
      if (!this.producto.codigoBarras || !this.producto.nombre || !this.producto.costoPromedio || this.producto.stockActual === null || this.producto.impuesto === null) {
        this.errorMessage = 'Por favor, complete todos los campos obligatorios';
        this.isLoading = false;
        return;
      }

      // Validar que los campos cumplan con los patrones requeridos
      if (isNaN(this.producto.costoPromedio) || isNaN(this.producto.stockActual)) {
        this.errorMessage = 'El costo promedio y el stock actual deben ser números válidos';
        this.isLoading = false;
        return;
      }

      // Si todos los campos son válidos, proceder con el registro
      this.isLoading = true;
      try {
        const response = await registrarProductoFachada(this.producto);
        this.successMessage = 'Producto registrado exitosamente';
        this.errorMessage = '';
        this.resetForm();
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.errorMessage = 'Ya existe un producto o subproducto con el mismo código de barras para este negocio';
        } else if (error.response && error.response.status === 400) {
          this.errorMessage = error.response.data;
        } else {
          this.errorMessage = 'Ha ocurrido un error al registrar el producto';
        }
        this.successMessage = '';
        console.error('Error al registrar producto:', error);
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
