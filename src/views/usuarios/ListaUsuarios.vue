<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong style="margin-right:5px;">Usuarios</strong>
          <CSpinner v-if="isLoading" color="success" class="spinner-border-sm" />
        </CCardHeader>
        <CCardBody>
          <CAlert v-if="error" color="danger" dismissible @close="error = null">
            {{ error }}
          </CAlert>
          <div class="table-responsive">
            <div class="scroll-indicator">
              <span class="arrow">←</span> Desliza para ver más <span class="arrow">→</span>
            </div>
            <CTable v-if="usuarios.length > 0" hover>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell scope="col" class="text-center">Acciones</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nombre de Usuario</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Correo</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Rol</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Apellido</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Teléfono</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="usuario in usuarios" :key="usuario.id">
                  <CTableDataCell class="text-center">
                    <div class="action-buttons">
                      <CButton color="success" size="sm" @click="actualizarUsuario(usuario.nombreUsuario)">
                        <i class="fas fa-edit"></i>
                      </CButton>
                      <CButton color="danger" size="sm" @click="confirmarEliminacion(usuario)">
                        <i class="fas fa-trash-alt"></i>
                      </CButton>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ usuario.nombreUsuario }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ usuario.correo }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ usuario.rol }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ usuario.nombre }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ usuario.apellido }}</CTableDataCell>
                  <CTableDataCell class="text-wrap">{{ usuario.telefono }}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </div>
          <CAlert v-if="!usuarios.length && !error && !isLoading" color="info">
            No se encontraron usuarios para el negocio especificado.
          </CAlert>
        </CCardBody>
      </CCard>
    </CCol>

    <!-- Modal de confirmación -->
    <CModal :visible="visibleConfirmacion" @close="visibleConfirmacion = false">
      <CModalHeader @close="visibleConfirmacion = false">
        <CModalTitle>Confirmar Eliminación</CModalTitle>
      </CModalHeader>
      <CModalBody>¿Estás seguro de que deseas eliminar este usuario?</CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="visibleConfirmacion = false">Cancelar</CButton>
        <CButton color="danger" @click="eliminarUsuarioConfirmado">
          Eliminar
          <CSpinner v-if="isDeleting" color="light" class="spinner-border-sm" />
        </CButton>
      </CModalFooter>
    </CModal>
  </CRow>
</template>

<script>
import { listarUsuariosPorNegocioFachada, eliminarUsuarioFachada } from '../../assets/js/usuarios'; // Importa las funciones necesarias

export default {
  data() {
    return {
      usuarios: [],
      error: null,
      isLoading: false,
      isDeleting: false,
      visibleConfirmacion: false,
      usuarioSeleccionado: null
    };
  },
  mounted() {
    this.fetchUsuarios();
  },
  methods: {
    async fetchUsuarios() {
      this.isLoading = true;
      try {
        const us = JSON.parse(sessionStorage.getItem('usuario')); // Parsear la cadena JSON a un objeto
        const negocioId = us ? us.negocioId : null;
        if (negocioId) {
          const response = await listarUsuariosPorNegocioFachada(negocioId);
          this.usuarios = response.filter(usuario => usuario.nombreUsuario !== us.nombreUsuario); // Filtrar el usuario actual
        } else {
          this.error = 'No se encontró el ID del negocio en la sesión.';
        }
      } catch (err) {
        this.error = 'Error al obtener la lista de usuarios. Inténtalo de nuevo más tarde.';
      } finally {
        this.isLoading = false;
      }
    },
    confirmarEliminacion(usuario) {
      this.usuarioSeleccionado = usuario;
      this.visibleConfirmacion = true;
    },
    async eliminarUsuarioConfirmado() {
      this.isDeleting = true;
      try {
        await eliminarUsuarioFachada(this.usuarioSeleccionado.keycloakId, JSON.parse(sessionStorage.getItem('usuario')).idNegocio);
        this.usuarios = this.usuarios.filter(usuario => usuario.id !== this.usuarioSeleccionado.id);
        this.visibleConfirmacion = false;
        this.usuarioSeleccionado = null;
      } catch (err) {
        this.error = 'Error al eliminar el usuario. Inténtalo de nuevo más tarde.';
        this.visibleConfirmacion = false;
      } finally {
        this.isDeleting = false;
      }
    },
    actualizarUsuario(nombreUsuario) {
      this.$router.push({ path: '/actualizar-usuario', query: { username: nombreUsuario } });
    }
  }
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
