<script setup>

import WidgetsTransacciones from '../widgets/WidgetsTransacciones.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'

</script>

<template>
  <div>

    <AppSidebar />
    <div class="wrapper d-flex flex-column min-vh-100">
      <AppHeader />
      <div class="body flex-grow-1">
        <CContainer class="px-4" lg>
          <WidgetsTransacciones class="mb-4" /> 
        </CContainer>
      </div>

    </div>




  </div>
</template>
