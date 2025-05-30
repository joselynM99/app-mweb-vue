<template>
  <CRow :xs="{ gutter: 4 }">
    <!-- Tarjeta Perfil visible solo si no es EMPLEADO -->
    <CCol v-if="!isEmpleado" :sm="6" :xl="4" :xxl="3">
      <CWidgetStatsD class="clickable-widget" style="--cui-card-cap-bg: #42b883" :values="[
        { value: 'Perfil' }
      ]" @click="goToPerfil">
        <template #icon>
          <i class="fas fa-user fa-3x my-4 text-white"></i>
        </template>
      </CWidgetStatsD>
    </CCol>

    <!-- Tarjeta Usuarios visible solo si no es EMPLEADO -->
    <CCol v-if="!isEmpleado" :sm="6" :xl="4" :xxl="3">
      <CWidgetStatsD class="clickable-widget" style="--cui-card-cap-bg: #00aced" :values="[
        { value: 'Usuarios' }
      ]" @click="goToUsuarios">
        <template #icon>
          <i class="fas fa-users fa-3x my-4 text-white"></i>
        </template>
      </CWidgetStatsD>
    </CCol>

    <!-- Tarjeta Cajas visible solo si no es EMPLEADO -->
    <CCol v-if="!isEmpleado" :sm="6" :xl="4" :xxl="3">
      <CWidgetStatsD class="clickable-widget" style="--cui-card-cap-bg: #4875b4" :values="[
        { value: 'Cajas' }
      ]" @click="goToCajas">
        <template #icon>
          <i class="fas fa-cash-register fa-3x my-4 text-white"></i>
        </template>
      </CWidgetStatsD>
    </CCol>

    <!-- Tarjeta Clientes siempre visible -->
    <CCol :sm="6" :xl="4" :xxl="3">
      <CWidgetStatsD class="clickable-widget" color="warning" :values="[
        { value: 'Clientes' }
      ]" @click="goToClientes">
        <template #icon>
          <i class="fas fa-user-friends fa-3x my-4 text-white"></i>
        </template>
      </CWidgetStatsD>
    </CCol>
  </CRow>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// Obtener usuario desde sessionStorage
const usuario = JSON.parse(sessionStorage.getItem('usuario'));
const isEmpleado = usuario && usuario.rol === 'EMPLEADO';

const goToPerfil = () => {
  router.push({ name: 'Perfil de Negocio' });
};

const goToUsuarios = () => {
  router.push({ name: 'Usuarios' });
};

const goToCajas = () => {
  router.push({ name: 'Cajas' });
};

const goToClientes = () => {
  router.push({ name: 'Clientes' });
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
