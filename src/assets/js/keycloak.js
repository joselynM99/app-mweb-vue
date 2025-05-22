// keycloak.js
import Keycloak from 'keycloak-js';
import { buscarUsuarioPorNombreUsuarioFachada } from './negocios';

export const keycloak = new Keycloak({
  url: process.env.VUE_APP_KEYCLOAK_URL,
  realm: process.env.VUE_APP_KEYCLOAK_REALM,
  clientId: process.env.VUE_APP_KEYCLOAK_CLIENT
});

export const initKeycloak = (onAuthenticatedCallback) => {
  keycloak.init({
    onLoad: 'login-required',
    checkLoginIframe: false,
    pkceMethod: 'S256'
  })
    .then((authenticated) => {
      if (authenticated) {
        

        const username = keycloak.tokenParsed?.preferred_username;
        const email = keycloak.tokenParsed?.email;
        const firstName = keycloak.tokenParsed?.given_name;
        const lastName = keycloak.tokenParsed?.family_name;
        const roles = keycloak.tokenParsed?.realm_access?.roles;

      
        if (username) {
          (async () => {
            try {
              const usuario = await buscarUsuarioPorNombreUsuarioFachada(username);
            
              sessionStorage.setItem('usuario', JSON.stringify(usuario));
              onAuthenticatedCallback();
            } catch (error) {
              if (roles.includes('ADMINISTRADOR')) {
                const nuevoUsuario = {
                  nombreUsuario: username,
                  correo: email,
                  nombre: firstName,
                  apellido: lastName,
                  rol: 'ADMINISTRADOR',
                  negocioId: sessionStorage.getItem('negocioId') || null,
                  activo: true,
                };

                sessionStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
                onAuthenticatedCallback();
              } else {
                keycloak.logout();
              }
            }
          })();
        }
      } else {
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
