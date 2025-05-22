<template>
  <CRow :xs="{ gutter: 4 }">
    <CCol :sm="6" :xl="4" :xxl="3">
      <CWidgetStatsD class="clickable-widget" style="--cui-card-cap-bg: #42b883" :values="[
        { value: 'Reporte Ventas' }
      ]" @click="goToVentas">
        <template #icon>
          <i class="fas fa-shopping-cart fa-3x my-4 text-white"></i>
        </template>
      </CWidgetStatsD>
    </CCol>
    <CCol :sm="6" :xl="4" :xxl="3">
      <CWidgetStatsD class="clickable-widget" style="--cui-card-cap-bg: #00aced" :values="[
        { value: 'Reporte Compras' }
      ]" @click="goToCompras">
        <template #icon>
          <i class="fas fa-shopping-bag fa-3x my-4 text-white"></i>
        </template>
      </CWidgetStatsD>
    </CCol>

    <CCol :sm="6" :xl="4" :xxl="3">
      <CWidgetStatsD class="clickable-widget" style="--cui-card-cap-bg: #4875b4" :values="[
        { value: 'Reporte productos más vendidos' }
      ]" @click="goToProdMasVendidos">
        <template #icon>
          <i class="fas fa-shopping-bag fa-3x my-4 text-white"></i>
        </template>
      </CWidgetStatsD>
    </CCol>
    
    
  </CRow>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToVentas = () => {
  router.push({ name: 'Reporte Ventas' });
};

const goToCompras = () => {
  router.push({ name: 'Reporte Compras' });
};

const goToProdMasVendidos = () => {
  router.push({ name: 'Reporte Productos Más Vendidos' });
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