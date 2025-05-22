<script setup>
import { AppSidebarNav } from '@/components/AppSidebarNav.js'
import { useSidebarStore } from '@/stores/sidebar.js'

const sidebar = useSidebarStore()

const usuario = JSON.parse(sessionStorage.getItem('usuario'))
const negocioId = JSON.parse(sessionStorage.getItem('negocioId'));

const isAdminWithNegocioId = usuario && usuario.rol === 'ADMINISTRADOR' && negocioId

const volverAlAdministrador = () => {
  sessionStorage.removeItem('negocioId')
  window.location.href = '/'
}
</script>

<template>
  <CSidebar class="border-end" colorScheme="dark" position="fixed" :unfoldable="sidebar.unfoldable"
    :visible="sidebar.visible" @visible-change="(value) => sidebar.toggleVisible(value)">
    <CSidebarHeader class="border-bottom">
      <img class="sidebar-logo" src="/logo.png" alt="MWEB"
        style="width: 100px; height: auto; display: block; margin: 0 auto;" />
      <CCloseButton class="d-lg-none" dark @click="sidebar.toggleVisible()" />
    </CSidebarHeader>
    <div v-if="isAdminWithNegocioId" class="text-center mt-3">
      <CButton color="success" @click="volverAlAdministrador">
        Volver al administrador
      </CButton>
    </div>
    <AppSidebarNav />

    <!-- <CSidebarFooter class="border-top d-none d-lg-flex">
      <CSidebarToggler @click="sidebar.toggleUnfoldable()" />
    </CSidebarFooter> -->
  </CSidebar>
</template>

<style scoped>
.sidebar-title {
  font-size: 30px;
  font-weight: 700;
  color: #42b883;
  text-align: center;
  margin: 10px auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  border-bottom: 2px solid #e0e0e0;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: linear-gradient(90deg, rgb(103, 230, 172) 0%, rgb(33, 156, 101) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.submenu-item {
  padding-left: 100px !important;
}
</style>