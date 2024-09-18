import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import CoreuiVue from '@coreui/vue';
import CIcon from '@coreui/icons-vue';
import { iconsSet as icons } from '@/assets/icons';
import DocsExample from '@/components/DocsExample';
import { initKeycloak } from '@/assets/js/keycloak';
import '@fortawesome/fontawesome-free/css/all.css'; // Importa los estilos de Font Awesome

const app = createApp(App);

initKeycloak(() => {

  app.use(createPinia());
  app.use(router);
  app.use(CoreuiVue);
  app.provide('icons', icons);
  app.component('CIcon', CIcon);
  app.component('DocsExample', DocsExample);

  app.mount('#app');


});
