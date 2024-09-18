<script>
import { KeycloakService } from '@/assets/js/keycloak';
export default {

  data() {
    return {
      username: null
    };
  },
  created() {
    if (KeycloakService.isLoggedIn()) {
      this.username = KeycloakService.getUsername();
    }
  }
};

</script>

<template>
  <CDropdown placement="bottom-end" variant="nav-item">
    <CDropdownToggle class="py-0 pe-0" :caret="false">
      <div class="user-info">
        <span v-if="username">{{ username }}</span>

        <CIcon name="cil-user" size="lg" style="margin: 7px auto;" />
      </div>
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">

      <CDropdownItem>
        <CIcon icon="cil-user" /> Perfil
      </CDropdownItem>

      <CDropdownItem>
        <CIcon icon="cil-lock-locked" /> Cerrar sesión
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>
<style scoped>
.user-info {
  display: flex;
  align-items: center;
}

.user-info span {
  margin-left: 15px;
  margin-right: 15px;
}
</style>
