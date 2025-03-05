<template>
  <CRow :xs="{ gutter: 4 }">
    <CCol :sm="6" :xl="4" :xxl="3">
      <CWidgetStatsD class="clickable-widget" style="--cui-card-cap-bg: #42b883" :values="[
        { value: 'Ventas' }
      ]" @click="goToVentas">
        <template #icon>
          <i class="fas fa-shopping-cart fa-3x my-4 text-white"></i>
        </template>
      </CWidgetStatsD>
    </CCol>
    <CCol v-if="!isEmpleado" :sm="6" :xl="4" :xxl="3">
      <CWidgetStatsD class="clickable-widget" style="--cui-card-cap-bg: #00aced" :values="[
        { value: 'Compras' }
      ]" @click="goToCompras">
        <template #icon>
          <i class="fas fa-shopping-bag fa-3x my-4 text-white"></i>
        </template>
      </CWidgetStatsD>
    </CCol>
    <CCol :sm="6" :xl="4" :xxl="3">
      <CWidgetStatsD class="clickable-widget" style="--cui-card-cap-bg: #4875b4" :values="[
        { value: 'Deudas' }
      ]" @click="goToDeudas">
        <template #icon>
          <i class="fas fa-money-bill-wave fa-3x my-4 text-white"></i>
        </template>
      </CWidgetStatsD>
    </CCol>
    <CCol :sm="6" :xl="4" :xxl="3">
      <CWidgetStatsD class="clickable-widget" color="warning" :values="[
        { value: 'Adicionales' },
      ]" @click="goToAdicionales">
        <template #icon>
          <i class="fas fa-plus-circle fa-3x my-4 text-white"></i>
        </template>
      </CWidgetStatsD>
    </CCol>
  </CRow>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const usuario = JSON.parse(sessionStorage.getItem('usuario'));
const isEmpleado = usuario && usuario.rol === 'EMPLEADO';

const goToVentas = () => {
  router.push({ name: 'Ventas' });
};

const goToCompras = () => {
  router.push({ name: 'Compras' });
};

const goToDeudas = () => {
  router.push({ name: 'Deudas' });
};

const goToAdicionales = () => {
  router.push({ name: 'Adicionales' });
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