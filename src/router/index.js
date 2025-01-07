import { h, resolveComponent } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/inicio',
    component: DefaultLayout,
    children: [
      {
        path: '/inicio',
        name: 'Inicio',
        component: () =>
          import(
            /* webpackChunkName: "inicio" */ '@/views/inicio/PaginaInicio.vue'
          ),
      },
    ]
  },
  {
    path: '/negocio',
    name: 'Negocio',
    redirect: '/negocio/perfil',
    component: DefaultLayout,
    children: [
      {
        path: 'perfil',
        name: 'Perfil de Negocio',
        component: () =>
          import(
            /* webpackChunkName: "PerfilNegocio" */ '@/views/negocios/PerfilNegocio.vue'
          ),
      },
      {
        path: 'cajas',
        name: 'Cajas',
        component: () =>
          import(
            /* webpackChunkName: "CajasNegocio" */ '@/views/gestion-cajas/CajasNegocio.vue'
          ),
      },
      {
        path: 'cajas/abrir-caja',
        name: 'AbrirCaja',
        component: () =>
          import(
            /* webpackChunkName: "AbrirCaja" */ '@/views/gestion-cajas/AbrirCaja.vue'
          ),
      },
    ]
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Lista de Usuarios',
        component: () =>
          import(
            /* webpackChunkName: "ListaUsuarios" */ '@/views/usuarios/ListaUsuarios.vue'
          ),
      },
      {
        path: 'agregar',
        name: 'Registrar Usuario',
        component: () =>
          import(
            /* webpackChunkName: "RegistrarUsuario" */ '@/views/usuarios/RegistrarUsuario.vue'
          ),
      },
      {
        path: 'actualizar',
        name: 'Actualizar Usuario',
        component: () =>
          import(
            /* webpackChunkName: "ActualizarUsuario" */ '@/views/usuarios/ActualizarUsuario.vue'
          ),
      },
    ]
  },
  {
    path: '/clientes',
    name: 'Clientes',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Lista de Clientes',
        component: () =>
          import(
            /* webpackChunkName: "ListaClientes" */ '@/views/clientes/ListaClientes.vue'
          ),
      },
      {
        path: 'agregar',
        name: 'Registrar Cliente',
        component: () =>
          import(
            /* webpackChunkName: "RegistrarClientes" */ '@/views/clientes/RegistrarClientes.vue'
          ),
      },

      {
        path: 'actualizar',
        name: 'Actualizar Cliente',
        component: () =>
          import(
            /* webpackChunkName: "ActualizarClientes" */ '@/views/clientes/ActualizarClientes.vue'
          ),
      }
    ]
  },

  {
    path: '/inventario/productos',
    name: 'Productos',
    component: DefaultLayout,
    children: [

      {
        path: '',
        name: 'Lista de Productos',
        component: () =>
          import(
            /* webpackChunkName: "ListaProductos" */ '@/views/inventario/productos/ListaProductos.vue'
          ),
      },

      {
        path: 'agregar',
        name: 'Registrar Producto',
        component: () =>
          import(
            /* webpackChunkName: "RegistrarProductos" */ '@/views/inventario/productos/RegistrarProductos.vue'
          ),
      },

      {
        path: 'actualizar',
        name: 'Actualizar Productos',
        component: () =>
          import(
            /* webpackChunkName: "ActualizarProductos" */ '@/views/inventario/productos/ActualizarProductos.vue'
          ),
      }
    ]
  },


  {
    path: '/inventario/subproductos',
    name: 'Subproductos',
    component: DefaultLayout,
    children: [

      {
        path: '',
        name: 'Lista de Subproductos',
        component: () =>
          import(
            /* webpackChunkName: "ListaSubproductos" */ '@/views/inventario/subproductos/ListaSubproductos.vue'
          ),
      },

      {
        path: 'agregar',
        name: 'Registrar Subproducto',
        component: () =>
          import(
            /* webpackChunkName: "RegistrarSubproductos" */ '@/views/inventario/subproductos/RegistrarSubproductos.vue'
          ),
      },

      {
        path: 'actualizar',
        name: 'Actualizar Subproducto',
        component: () =>
          import(
            /* webpackChunkName: "ActualizarSubproducto" */ '@/views/inventario/subproductos/ActualizarSubproducto.vue'
          ),
      }
    ]
  },

  {
    path: '/inventario/proveedores',
    name: 'Proveedores',
    component: DefaultLayout,
    children: [

      {
        path: '',
        name: 'Lista de Proveeedores',
        component: () =>
          import(
            /* webpackChunkName: "ListaProveedores" */ '@/views/inventario/proveedores/ListaProveedores.vue'
          ),
      },

      {
        path: 'agregar',
        name: 'Registrar Proveedor',
        component: () =>
          import(
            /* webpackChunkName: "RegistrarProveedores" */ '@/views/inventario/proveedores/RegistrarProveedores.vue'
          ),
      },

      {
        path: 'actualizar',
        name: 'Actualizar Proveedor',
        component: () =>
          import(
            /* webpackChunkName: "ActualizarProveedores" */ '@/views/inventario/proveedores/ActualizarProveedores.vue'
          ),
      }
    ]
  },

  {
    path: '/inventario/categorias',
    name: 'Categorías',
    component: DefaultLayout,
    children: [

      {
        path: '',
        component: () =>
          import(
            /* webpackChunkName: "Categorias" */ '@/views/inventario/categorias/Categorias.vue'
          ),
      },
    ]
  },

  {
    path: '/inventario/marcas',
    name: 'Marcas',
    component: DefaultLayout,
    children: [

      {
        path: '',
        component: () =>
          import(
            /* webpackChunkName: "Marcas" */ '@/views/inventario/marcas/Marcas.vue'
          ),

      },
    ]
  },

  {
    path: '/transacciones',
    name: 'Transacciones',
    children: [

      {
        path: 'ventas/realizar-venta',
        name: 'Ventas',
        component: () =>
          import(
            /* webpackChunkName: "Ventas" */ '@/views/transacciones/ventas/Ventas.vue'
          ),
      },
      {
        path: 'ventas/completar-venta',
        name: 'CompletarVenta',
        
        component: () =>
          import(
            /* webpackChunkName: "CompletarVenta" */ '@/views/transacciones/ventas/CompletarVenta.vue'
          ),
      },

    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  if (to.hash.includes('state=') || to.hash.includes('session_state=')) {
    next(to.path);
  } else {
    next();
  }
});

export default router
