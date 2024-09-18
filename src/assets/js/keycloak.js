import Keycloak from 'keycloak-js';
import { buscarUsuarioPorNombreUsuarioFachada } from './usuarios';

const keycloak = new Keycloak({
  url: process.env.VUE_APP_KEYCLOAK_URL,
  realm: process.env.VUE_APP_KEYCLOAK_REALM,
  clientId: process.env.VUE_APP_KEYCLOAK_CLIENT
});

export const initKeycloak = (onAuthenticatedCallback) => {
  keycloak.init({ onLoad: 'login-required' })
    .then((authenticated) => {
      if (authenticated) {
        const username = keycloak.tokenParsed?.preferred_username;

        if (username) {
          (async () => {
            try {
              const usuario = await buscarUsuarioPorNombreUsuarioFachada(username);
              sessionStorage.setItem('usuario', JSON.stringify(usuario));
              console.log(keycloak.token);

              onAuthenticatedCallback();
            } catch (error) {
              console.error('Error al buscar el usuario:', error);
            }
          })();
        }
      } else {
        console.warn('No autenticado');
        keycloak.login();
      }
    })
    .catch((error) => console.error('Error inicializando Keycloak', error));
};

export const KeycloakService = {
  isLoggedIn: () => !!keycloak.authenticated,
  getToken: () => keycloak.token,
  login: () => keycloak.login(),
  logout: () => keycloak.logout({ redirectUri: window.location.origin }),
  getUsername: () => keycloak.tokenParsed?.preferred_username,
  getRoles: () => keycloak.tokenParsed?.realm_access?.roles
};
