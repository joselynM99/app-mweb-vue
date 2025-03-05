<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center bg-light">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="6">
          <div class="clearfix text-center">
            <h1 class="display-3 text-danger">403</h1>
            <p class="text-secondary">
              No tiene permiso para acceder a esta página.
            </p>
            <router-link to="/" class="btn btn-primary mt-3">Volver al inicio</router-link>
          </div>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<style scoped>
.wrapper {
  background-color: #f8f9fa;
}
</style>