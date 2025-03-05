<template>
  <CRow :xs="{ gutter: 4 }">
    <template v-if="isAdminWithoutNegocio">
      <CCol :sm="6" :xl="4" :xxl="3">
        <CWidgetStatsD class="clickable-widget" style="--cui-card-cap-bg: #42b883" :values="[
          { value: 'Lista de Negocios' }
        ]" @click="goToListaNegocios">
          <template #icon>
            <i class="fas fa-list fa-3x my-4 text-white"></i>
          </template>
        </CWidgetStatsD>
      </CCol>
      <CCol :sm="6" :xl="4" :xxl="3">
        <CWidgetStatsD class="clickable-widget" style="--cui-card-cap-bg: #00aced" :values="[
          { value: 'Registrar Negocio' }
        ]" @click="goToRegistrarNegocio">
          <template #icon>
            <i class="fas fa-plus fa-3x my-4 text-white"></i>
          </template>
        </CWidgetStatsD>
      </CCol>
      <CCol :sm="6" :xl="4" :xxl="3">
        <CWidgetStatsD class="clickable-widget" style="--cui-card-cap-bg: #4875b4" :values="[
          { value: 'Actualizar Negocio' }
        ]" @click="goToActualizarNegocio">
          <template #icon>
            <i class="fas fa-edit fa-3x my-4 text-white"></i>
          </template>
        </CWidgetStatsD>
      </CCol>
    </template>
    <template v-else>
      <CCol :sm="6" :xl="4" :xxl="3">
        <CWidgetStatsD class="clickable-widget" style="--cui-card-cap-bg: #42b883" :values="[
          { value: 'Transacciones' }
        ]" @click="goToTransacciones">
          <template #icon>
            <i class="fas fa-exchange-alt fa-3x my-4 text-white"></i>
          </template>
        </CWidgetStatsD>
      </CCol>
      <CCol v-if="!isEmpleado" :sm="6" :xl="4" :xxl="3">
        <CWidgetStatsD class="clickable-widget" style="--cui-card-cap-bg: #00aced" :values="[
          { value: 'Inventario' }
        ]" @click="goToInventario">
          <template #icon>
            <i class="fas fa-boxes fa-3x my-4 text-white"></i>
          </template>
        </CWidgetStatsD>
      </CCol>
      <CCol :sm="6" :xl="4" :xxl="3">
        <CWidgetStatsD class="clickable-widget" style="--cui-card-cap-bg: #4875b4" :values="[
          { value: 'Negocio' }
        ]" @click="goToNegocio">
          <template #icon>
            <i class="fas fa-briefcase fa-3x my-4 text-white"></i>
          </template>
        </CWidgetStatsD>
      </CCol>
      <CCol v-if="!isEmpleado" :sm="6" :xl="4" :xxl="3">
        <CWidgetStatsD class="clickable-widget" color="warning" :values="[
          { value: 'Cuadres de caja' },
        ]" @click="goToCuadresDeCaja">
          <template #icon>
            <i class="fas fa-cash-register fa-3x my-4 text-white"></i>
          </template>
        </CWidgetStatsD>
      </CCol>
      <CCol v-if="!isEmpleado" :sm="6" :xl="4" :xxl="3">
        <CWidgetStatsD class="clickable-widget" color="danger" :values="[
          { value: 'Reportes' },
        ]" @click="goToReportes">
          <template #icon>
            <i class="fas fa-chart-line fa-3x my-4 text-white"></i>
          </template>
        </CWidgetStatsD>
      </CCol>
    </template>
  </CRow>
</template>

<script setup>
import { useRouter, resolveComponent, h } from 'vue-router';

const router = useRouter();
const usuario = JSON.parse(sessionStorage.getItem('usuario'));
console.log(usuario);
const isEmpleado = usuario && usuario.rol === 'EMPLEADO';
const isAdminWithoutNegocio = usuario && usuario.rol === 'ADMINISTRADOR' && usuario.negocioId === null;

const goToTransacciones = () => {
  router.push({ name: 'Transacciones' });
};

const goToInventario = () => {
  router.push({ name: 'Inventario' });
};

const goToNegocio = () => {
  router.push({ name: 'Negocio' });
};

const goToCuadresDeCaja = () => {
  router.push({ name: 'CuadresDeCaja' });
};

const goToReportes = () => {
  router.push({ name: 'Reportes' });
};

const goToListaNegocios = () => {
  router.push({ path: '/negocios/lista' });
};

const goToRegistrarNegocio = () => {
  router.push({ path: '/negocios/agregar' });
};

const goToActualizarNegocio = () => {
  router.push({ path: '/negocios/actualizar' });
};
</script>

<style scoped>
.clickable-widget {
  cursor: pointer;
  transition: transform 0.2s;
}

.clickable-widget:hover {
  transform: scale(1.05);
}
</style>