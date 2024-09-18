<template>
  <CRow :xs="{ gutter: 4 }">
    <CCol :sm="6" :xl="4" :xxl="3">
      <CWidgetStatsD
        style="--cui-card-cap-bg: #42b883"
        :values="[
          { value: 'Transacciones' }
        ]"
      >
        <template #icon>
          <i class="fas fa-exchange-alt fa-3x my-4 text-white"></i>
        </template>
      </CWidgetStatsD>
    </CCol>
    <CCol :sm="6" :xl="4" :xxl="3">
      <CWidgetStatsD
        style="--cui-card-cap-bg: #00aced"
        :values="[
          { value: 'Inventario' }
        ]"
      >
        <template #icon>
          <i class="fas fa-boxes fa-3x my-4 text-white"></i>
        </template>
      </CWidgetStatsD>
    </CCol>
    <CCol :sm="6" :xl="4" :xxl="3">
      <CWidgetStatsD
        style="--cui-card-cap-bg: #4875b4"
        :values="[
          { value: 'Negocio' }
        ]"
      >
        <template #icon>
          <i class="fas fa-briefcase fa-3x my-4 text-white"></i>
        </template>
      </CWidgetStatsD>
    </CCol>
    <CCol :sm="6" :xl="4" :xxl="3">
      <CWidgetStatsD
        color="warning"
        :values="[
          { value: 'Cuadres de caja' },
        ]"
      >
        <template #icon>
          <i class="fas fa-cash-register fa-3x my-4 text-white"></i>
        </template>
      </CWidgetStatsD>
    </CCol>
    <CCol :sm="6" :xl="4" :xxl="3">
      <CWidgetStatsD
        color="danger"
        :values="[
          { value: 'Reportes' },
        ]"
      >
        <template #icon>
          <i class="fas fa-chart-line fa-3x my-4 text-white"></i>
        </template>
      </CWidgetStatsD>
    </CCol>
  </CRow>
</template>

<script setup>
import { CChart } from '@coreui/vue-chartjs';

const options = {
  elements: {
    line: {
      tension: 0.4,
    },
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
      hoverBorderWidth: 3,
    },
  },
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
    },
  },
};
</script>
