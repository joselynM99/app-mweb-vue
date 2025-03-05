<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center bg-light">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="6">
          <div class="clearfix text-center">
            <h1 class="display-3 text-danger">404</h1>
            <p class="text-secondary">
              La página que está buscando no ha sido encontrada.
            </p>
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