<template>
    <CRow>
        <CCol :xs="12">
            <CCard class="mb-4">
                <CCardHeader>
                    <strong style="margin-right:5px;">Negocios</strong>
                    <CSpinner v-if="isLoading" color="success" class="spinner-border-sm" />
                    <CButton color="success" size="sm" @click="goToRegistrarNegocio" style="float: right;">
                        Registrar Negocio
                    </CButton>
                </CCardHeader>
                <CCardBody>
                    <CInputGroup style="width: 300px; margin-bottom: 10px;">
                        <CFormInput v-model="searchQuery" @input="buscarNegocios"
                            placeholder="Buscar por nombre comercial" />
                        <CInputGroupText style="padding:0px 5px">
                            <button @click="buscarNegocios" :disabled="isLoading"
                                style="border: none; background: none; margin:0px; padding:5px">
                                Buscar
                                <CSpinner v-if="isLoading" color="light" class="spinner-border-sm" />
                            </button>
                        </CInputGroupText>
                    </CInputGroup>
                    <CAlert v-if="error" color="danger" dismissible @close="error = null">
                        {{ error }}
                    </CAlert>
                    <CAlert v-if="infoMessage" color="info" dismissible @close="infoMessage = null">
                        {{ infoMessage }}
                    </CAlert>
                    <div class="table-responsive">
                        <div class="scroll-indicator">
                            <span class="arrow">←</span> Desliza para ver más <span class="arrow">→</span>
                        </div>
                        <CTable v-if="filteredNegocios.length > 0" hover>
                            <CTableHead color="light">
                                <CTableRow>
                                    <CTableHeaderCell scope="col" class="text-center">Acciones</CTableHeaderCell>
                                    <CTableHeaderCell v-for="column in columns" :key="column.key" scope="col"
                                        @click="sortBy(column.key)" style="cursor: pointer;">
                                        {{ column.label }}
                                        <i v-if="sortKey !== column.key" class="fas fa-sort"></i>
                                        <span v-if="sortKey === column.key">
                                            <i :class="sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
                                        </span>
                                    </CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                <CTableRow v-for="negocio in filteredNegocios" :key="negocio.id">
                                    <CTableDataCell class="text-center">
                                        <div class="action-buttons">
                                            <CButton color="warning" size="sm" @click="actualizarNegocio(negocio.id)">
                                                <i class="fas fa-edit"></i>
                                            </CButton>
                                            <CButton v-if="negocio.activo" color="danger" size="sm"
                                                @click="confirmarDesactivacion(negocio)">
                                                <i class="fas fa-trash-alt"></i>
                                            </CButton>
                                            <CButton v-else color="success" size="sm"
                                                @click="confirmarActivacion(negocio)">
                                                <i class="fas fa-check"></i>
                                            </CButton>
                                            <CButton v-if="negocio.activo" color="primary" size="sm"
                                                @click="iniciarSesionComo(negocio.id)">
                                                Iniciar sesión como
                                            </CButton>
                                        </div>
                                    </CTableDataCell>
                                    <CTableDataCell class="text-wrap">{{ negocio.nombreComercial }}</CTableDataCell>
                                    <CTableDataCell class="text-wrap">{{ negocio.direccion }}</CTableDataCell>
                                    <CTableDataCell class="text-wrap">{{ negocio.telefono }}</CTableDataCell>
                                    <CTableDataCell class="text-wrap">{{ negocio.razonSocial }}</CTableDataCell>
                                    <CTableDataCell class="text-wrap">{{ negocio.ruc }}</CTableDataCell>
                                    <CTableDataCell class="text-wrap">{{ negocio.activo ? 'Activo' : 'Inactivo' }}
                                    </CTableDataCell>
                                </CTableRow>
                            </CTableBody>
                        </CTable>
                    </div>
                    <CAlert v-if="!filteredNegocios.length && !error && !isLoading && !infoMessage" color="info">
                        No se encontraron negocios.
                    </CAlert>
                </CCardBody>
            </CCard>
        </CCol>

        <!-- Modal de confirmación -->
        <CModal :visible="visibleConfirmacion" @close="visibleConfirmacion = false">
            <CModalHeader @close="visibleConfirmacion = false">
                <CModalTitle>Confirmar eliminación</CModalTitle>
            </CModalHeader>
            <CModalBody>¿Estás seguro de que deseas eliminar este negocio?</CModalBody>
            <CModalFooter>
                <CButton color="secondary" @click="visibleConfirmacion = false">Cancelar</CButton>
                <CButton color="danger" @click="desactivarNegocioConfirmado">
                    Eliminar
                    <CSpinner v-if="isDeleting" color="light" class="spinner-border-sm" />
                </CButton>
            </CModalFooter>
        </CModal>

        <!-- Modal de confirmación de activación -->
        <CModal :visible="visibleConfirmacionActivacion" @close="visibleConfirmacionActivacion = false">
            <CModalHeader @close="visibleConfirmacionActivacion = false">
                <CModalTitle>Confirmar activación</CModalTitle>
            </CModalHeader>
            <CModalBody>¿Estás seguro de que deseas activar este negocio?</CModalBody>
            <CModalFooter>
                <CButton color="secondary" @click="visibleConfirmacionActivacion = false">Cancelar</CButton>
                <CButton color="success" @click="activarNegocioConfirmado">
                    Activar
                    <CSpinner v-if="isActivating" color="light" class="spinner-border-sm" />
                </CButton>
            </CModalFooter>
        </CModal>
    </CRow>
</template>

<script>
import { debounce } from 'lodash';
import { listaNegociosFachada, desactivarNegocioFachada, activarNegocioFachada } from '@/assets/js/negocios';

export default {
    data() {
        return {
            searchQuery: '',
            negocios: [],
            isLoading: false,
            error: null,
            infoMessage: null,
            isDeleting: false,
            isActivating: false,
            negocioSeleccionado: null,
            visibleConfirmacion: false,
            visibleConfirmacionActivacion: false,
            sortKey: '',
            sortOrder: 'asc',
            columns: [
                { key: 'nombreComercial', label: 'Nombre Comercial' },
                { key: 'direccion', label: 'Dirección' },
                { key: 'telefono', label: 'Teléfono' },
                { key: 'razonSocial', label: 'Razón Social' },
                { key: 'ruc', label: 'RUC' },
                { key: 'activo', label: 'Estado' }
            ]
        };
    },
    computed: {
        sortedNegocios() {
            const sorted = [...this.negocios];
            if (this.sortKey) {
                sorted.sort((a, b) => {
                    let aValue = a[this.sortKey];
                    let bValue = b[this.sortKey];

                    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
                    if (typeof bValue === 'string') bValue = bValue.toLowerCase();

                    if (aValue < bValue) return this.sortOrder === 'asc' ? -1 : 1;
                    if (aValue > bValue) return this.sortOrder === 'asc' ? 1 : -1;
                    return 0;
                });
            }
            return sorted;
        },
        filteredNegocios() {
            if (!this.searchQuery) {
                return this.sortedNegocios;
            }
            return this.sortedNegocios.filter(negocio =>
                negocio.nombreComercial.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }
    },
    methods: {
        goToRegistrarNegocio() {
            this.$router.push({ name: 'Registrar Negocio' });
        },

        async fetchNegocios() {
            this.isLoading = true;
            this.error = null;
            this.infoMessage = null;
            try {
                const response = await listaNegociosFachada();
                this.negocios = response;
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    this.infoMessage = 'No se encontraron negocios';
                } else {
                    this.error = 'Error al obtener la lista de negocios. Inténtalo de nuevo más tarde.';
                }
            } finally {
                this.isLoading = false;
            }
        },
        buscarNegocios() {
            // Filtrar negocios localmente
            this.filteredNegocios;
        },
        confirmarDesactivacion(negocio) {
            this.negocioSeleccionado = negocio;
            this.visibleConfirmacion = true;
        },
        async desactivarNegocioConfirmado() {
            this.isDeleting = true;
            try {
                await desactivarNegocioFachada(this.negocioSeleccionado.id);
                this.negocios = this.negocios.filter(negocio => negocio.id !== this.negocioSeleccionado.id);
                this.visibleConfirmacion = false;
                this.negocioSeleccionado = null;
            } catch (err) {
                this.error = 'Error al eliminar el negocio. Inténtalo de nuevo más tarde.';
                this.visibleConfirmacion = false;
            } finally {
                this.isDeleting = false;
            }
        },
        confirmarActivacion(negocio) {
            this.negocioSeleccionado = negocio;
            this.visibleConfirmacionActivacion = true;
        },
        async activarNegocioConfirmado() {
            this.isActivating = true;
            try {
                await activarNegocioFachada(this.negocioSeleccionado.id);
                this.negocios = this.negocios.map(negocio => {
                    if (negocio.id === this.negocioSeleccionado.id) {
                        negocio.activo = true;
                    }
                    return negocio;
                });
                this.visibleConfirmacionActivacion = false;
                this.negocioSeleccionado = null;
            } catch (err) {
                this.error = 'Error al activar el negocio. Inténtalo de nuevo más tarde.';
                this.visibleConfirmacionActivacion = false;
            } finally {
                this.isActivating = false;
            }
        },
        actualizarNegocio(negocioId) {
            this.$router.push({ name: 'Actualizar Negocio', query: { negocioId } });
        },
        iniciarSesionComo(id) {
            const usuario = JSON.parse(sessionStorage.getItem('usuario'));
            if (usuario) {
                sessionStorage.setItem('negocioId', id);
                window.location.href = '/';
            } else {
                console.error('No se encontró el usuario en sessionStorage');
            }
        },


        debouncedBuscarNegocios: debounce(function () {
            this.buscarNegocios();
        }, 300),
        sortBy(key) {
            if (this.sortKey === key) {
                this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortKey = key;
                this.sortOrder = 'asc';
            }
        }
    },
    watch: {
        searchQuery() {
            this.debouncedBuscarNegocios();
        },
    },
    mounted() {
        this.fetchNegocios();
    },
};
</script>

<style scoped>
.table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    position: relative;
}

.text-wrap {
    max-width: 150px;
    word-wrap: break-word;
    white-space: normal;
}

.action-buttons {
    display: flex;
    gap: 5px;
    justify-content: center;
}

.scroll-indicator {
    display: none;
}

@media (max-width: 768px) {
    .scroll-indicator {
        display: block;
        position: relative;
        background-color: rgba(0, 0, 0, 0.1);
        color: #666;
        padding: 5px 10px;
        font-size: 0.8rem;
        text-align: center;
        margin-bottom: 10px;
        border-radius: 5px;
    }

    .scroll-indicator .arrow {
        font-size: 1rem;
        margin: 0 5px;
    }

    .table-responsive::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 7px;
        height: 7px;
    }

    .table-responsive::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background-color: rgba(0, 0, 0, .5);
        -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, .5);
    }

    CTableHeaderCell {
        font-size: 0.9rem;
    }
}
</style>