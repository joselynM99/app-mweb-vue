<template>


  <CRow :xs="{ gutter: 4 }">
    <CCol :sm="6" :xl="4" :xxl="3">
      <CWidgetStatsD class="clickable-widget" style="--cui-card-cap-bg: #42b883" :values="[
        { value: 'Productos' }
      ]" @click="goToProductos">
        <template #icon>
          <i class="fas fa-box fa-3x my-4 text-white"></i>
        </template>
      </CWidgetStatsD>
    </CCol>
    <CCol :sm="6" :xl="4" :xxl="3">
      <CWidgetStatsD class="clickable-widget" style="--cui-card-cap-bg: #00aced" :values="[
        { value: 'Subproductos' }
      ]" @click="goToSubproductos">
        <template #icon>
          <i class="fas fa-box-open fa-3x my-4 text-white"></i>
        </template>
      </CWidgetStatsD>
    </CCol>
    <CCol :sm="6" :xl="4" :xxl="3">
      <CWidgetStatsD class="clickable-widget" style="--cui-card-cap-bg: #4875b4" :values="[
        { value: 'Proveedores' }
      ]" @click="goToProveedores">
        <template #icon>
          <i class="fas fa-truck fa-3x my-4 text-white"></i>
        </template>
      </CWidgetStatsD>
    </CCol>
    <CCol :sm="6" :xl="4" :xxl="3">
      <CWidgetStatsD class="clickable-widget" color="warning" :values="[
        { value: 'Categorías' },
      ]" @click="goToCategorias">
        <template #icon>
          <i class="fas fa-tags fa-3x my-4 text-white"></i>
        </template>
      </CWidgetStatsD>
    </CCol>
    <CCol :sm="6" :xl="4" :xxl="3">
      <CWidgetStatsD class="clickable-widget" color="danger" :values="[
        { value: 'Marcas' },
      ]" @click="goToMarcas">
        <template #icon>
          <i class="fas fa-trademark fa-3x my-4 text-white"></i>
        </template>
      </CWidgetStatsD>
    </CCol>
  </CRow>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToProductos = () => {
  router.push({ name: 'Productos' });
};

const goToSubproductos = () => {
  router.push({ name: 'Subproductos' });
};

const goToProveedores = () => {
  router.push({ name: 'Proveedores' });
};

const goToCategorias = () => {
  router.push({ name: 'Categorías' });
};

const goToMarcas = () => {
  router.push({ name: 'Marcas' });
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