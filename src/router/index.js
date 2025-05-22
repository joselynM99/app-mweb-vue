import { h, resolveComponent } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout'
import Pagina403 from '@/views/pages/Page403.vue'
import Pagina404 from '@/views/pages/Page404.vue'

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
        meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO', 'EMPLEADO'] }
      },
    ],
  },
  {
    path: '/negocio',
    name: 'Negocio',
    redirect: '/negocio/menu',
    component: DefaultLayout,
    children: [
      {
        path: 'menu',
        name: '',
        component: () =>
          import(
            /* webpackChunkName: "NegocioMenu" */ '@/views/inicio/NegocioMenu.vue'
          ),
        meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO', 'EMPLEADO'] }
      },
      {
        path: 'perfil',
        name: 'Perfil de Negocio',
        component: () =>
          import(
            /* webpackChunkName: "PerfilNegocio" */ '@/views/negocios/PerfilNegocio.vue'
          ),
        meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO', 'EMPLEADO'] }
      },
      {
        path: 'cajas',
        name: 'Cajas',
        component: () =>
          import(
            /* webpackChunkName: "CajasNegocio" */ '@/views/gestion-cajas/CajasNegocio.vue'
          ),
        meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO'] }
      },
      {
        path: 'cajas/abrir-caja',
        name: 'Abrir Caja',
        component: () =>
          import(
            /* webpackChunkName: "AbrirCaja" */ '@/views/gestion-cajas/AbrirCaja.vue'
          ),
        meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO', 'EMPLEADO'] }
      },
      {
        path: 'cajas/cerrar-caja',
        name: 'Cerrar Caja',
        component: () =>
          import(
            /* webpackChunkName: "CerrarCaja" */ '@/views/gestion-cajas/CerrarCaja.vue'
          ),
        meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO', 'EMPLEADO'] }
      },


      {
        path: '/usuarios',
        name: 'Usuarios',
        redirect: '/usuarios/lista',
        component: { render: () => h(resolveComponent('router-view')) },
        children: [
          {
            path: 'lista',
            name: '',
            component: () =>
              import(
                /* webpackChunkName: "ListaUsuarios" */ '@/views/usuarios/ListaUsuarios.vue'
              ),
            meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO'] }
          },
          {
            path: 'agregar',
            name: 'Registrar Usuario',
            component: () =>
              import(
                /* webpackChunkName: "RegistrarUsuario" */ '@/views/usuarios/RegistrarUsuario.vue'
              ),
            meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO'] }
          },
          {
            path: 'actualizar',
            name: 'Actualizar Usuario',
            component: () =>
              import(
                /* webpackChunkName: "ActualizarUsuario" */ '@/views/usuarios/ActualizarUsuario.vue'
              ),
            meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO', 'EMPLEADO'] }
          },
        ],
      },
      {
        path: '/clientes',
        name: 'Clientes',
        redirect: '/clientes/lista',
        component: { render: () => h(resolveComponent('router-view')) },
        children: [
          {
            path: 'lista',
            name: '',
            component: () =>
              import(
                /* webpackChunkName: "ListaClientes" */ '@/views/clientes/ListaClientes.vue'
              ),
            meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO', 'EMPLEADO'] }
          },
          {
            path: 'agregar',
            name: 'Registrar Cliente',
            component: () =>
              import(
                /* webpackChunkName: "RegistrarClientes" */ '@/views/clientes/RegistrarClientes.vue'
              ),
            meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO', 'EMPLEADO'] }
          },
          {
            path: 'actualizar',
            name: 'Actualizar Cliente',
            component: () =>
              import(
                /* webpackChunkName: "ActualizarClientes" */ '@/views/clientes/ActualizarClientes.vue'
              ),
            meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO', 'EMPLEADO'] }
          },
        ],
      },
    ],
  },
  {
    path: '/inventario',
    name: 'Inventario',
    redirect: '/inventario/menu',
    component: DefaultLayout,
    children: [
      {
        path: 'menu',
        name: '',
        component: () =>
          import(
            /* webpackChunkName: "InventarioMenu" */ '@/views/inicio/InventarioMenu.vue'
          ),
        meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO'] }
      },
      {
        path: 'productos',
        name: 'Productos',
        redirect: '/inventario/productos/lista',
        component: { render: () => h(resolveComponent('router-view')) },
        children: [
          {
            path: 'lista',
            name: '',
            component: () =>
              import(
                /* webpackChunkName: "ListaProductos" */ '@/views/inventario/productos/ListaProductos.vue'
              ),
            meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO'] }
          },
          {
            path: 'agregar',
            name: 'Registrar Producto',
            component: () =>
              import(
                /* webpackChunkName: "RegistrarProductos" */ '@/views/inventario/productos/RegistrarProductos.vue'
              ),
            meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO'] }
          },
          {
            path: 'actualizar',
            name: 'Actualizar Productos',
            component: () =>
              import(
                /* webpackChunkName: "ActualizarProductos" */ '@/views/inventario/productos/ActualizarProductos.vue'
              ),
            meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO'] }
          },
        ],
      },
      {
        path: 'subproductos',
        name: 'Subproductos',
        redirect: '/inventario/subproductos/lista',
        component: { render: () => h(resolveComponent('router-view')) },
        children: [
          {
            path: 'lista',
            name: '',
            component: () =>
              import(
                /* webpackChunkName: "ListaSubproductos" */ '@/views/inventario/subproductos/ListaSubproductos.vue'
              ),
            meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO'] }
          },
          {
            path: 'agregar',
            name: 'Registrar Subproducto',
            component: () =>
              import(
                /* webpackChunkName: "RegistrarSubproductos" */ '@/views/inventario/subproductos/RegistrarSubproductos.vue'
              ),
            meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO'] }
          },
          {
            path: 'actualizar',
            name: 'Actualizar Subproducto',
            component: () =>
              import(
                /* webpackChunkName: "ActualizarSubproducto" */ '@/views/inventario/subproductos/ActualizarSubproducto.vue'
              ),
            meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO'] }
          },
        ],
      },
      {
        path: 'proveedores',
        name: 'Proveedores',
        redirect: '/inventario/proveedores/lista',
        component: { render: () => h(resolveComponent('router-view')) },
        children: [
          {
            path: 'lista',
            name: '',
            component: () =>
              import(
                /* webpackChunkName: "ListaProveedores" */ '@/views/inventario/proveedores/ListaProveedores.vue'
              ),
            meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO'] }
          },
          {
            path: 'agregar',
            name: 'Registrar Proveedor',
            component: () =>
              import(
                /* webpackChunkName: "RegistrarProveedores" */ '@/views/inventario/proveedores/RegistrarProveedores.vue'
              ),
            meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO'] }
          },
          {
            path: 'actualizar',
            name: 'Actualizar Proveedor',
            component: () =>
              import(
                /* webpackChunkName: "ActualizarProveedores" */ '@/views/inventario/proveedores/ActualizarProveedores.vue'
              ),
            meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO'] }
          },
        ],
      },
      {
        path: 'categorias',
        name: 'Categorías',
        redirect: '/inventario/categorias/gestion',
        component: { render: () => h(resolveComponent('router-view')) },
        children: [
          {
            path: 'gestion',
            name: '',
            component: () =>
              import(
                /* webpackChunkName: "Categorias" */ '@/views/inventario/categorias/Categorias.vue'
              ),
            meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO'] }
          },
        ],
      },
      {
        path: 'marcas',
        name: 'Marcas',
        redirect: '/inventario/marcas/gestion',
        component: { render: () => h(resolveComponent('router-view')) },
        children: [
          {
            path: 'gestion',
            name: '',
            component: () =>
              import(
                /* webpackChunkName: "Marcas" */ '@/views/inventario/marcas/Marcas.vue'
              ),
            meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO'] }
          },
        ],
      },
    ],
  },
  {
    path: '/reportes',
    name: 'Reportes',
    redirect: '/reportes/menu',
    component: DefaultLayout,
    children: [
      {
        path: 'menu',
        name: '',
        component: () =>
          import(
            /* webpackChunkName: "ReportesMenu" */ '@/views/inicio/ReportesMenu.vue'
          ),
        meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO'] }
      },
      {
        path: 'ventas',
        name: 'Reporte Ventas',
        component: () =>
          import(
          /* webpackChunkName: "ReporteVentas" */ '@/views/reportes/ReporteVentas.vue'
          ),
        meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO'] }
      },
      {
        path: 'compras',
        name: 'Reporte Compras',
        component: () =>
          import(
          /* webpackChunkName: "ReporteCompras" */ '@/views/reportes/ReporteCompras.vue'
          ),
        meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO'] }
      },
      {
        path: 'productos-mas-vendidos',
        name: 'Reporte Productos Más Vendidos',
        component: () =>
          import(
          /* webpackChunkName: "ReporteProductosMasVendidos" */ '@/views/reportes/ReporteProductosMasVendidos.vue'
          ),
        meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO'] }

      }
    ]
  },

  {
    path: '/transacciones',
    name: 'Transacciones',
    redirect: '/transacciones/menu',
    children: [
      {
        path: 'menu',
        name: '',
        component: () =>
          import(
            /* webpackChunkName: "TransaccionesMenu" */ '@/views/inicio/TransaccionesMenu.vue'
          ),
        meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO', 'EMPLEADO'] }
      },
      {
        path: 'adicionales',
        name: 'Adicionales',
        component: () =>
          import(
            /* webpackChunkName: "Adicionales" */ '@/views/transacciones/Adicionales.vue'
          ),
        meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO', 'EMPLEADO'] }
      },
      {
        path: 'ventas/realizar-venta',
        name: 'Ventas',
        component: () =>
          import(
            /* webpackChunkName: "Ventas" */ '@/views/transacciones/ventas/Ventas.vue'
          ),
        meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO', 'EMPLEADO'] }
      },
      {
        path: 'ventas/completar-venta',
        name: 'CompletarVenta',
        component: () =>
          import(
            /* webpackChunkName: "CompletarVenta" */ '@/views/transacciones/ventas/CompletarVenta.vue'
          ),
        meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO', 'EMPLEADO'] }
      },
      {
        path: 'compra/realizar-compra',
        name: 'Compras',
        component: () =>
          import(
            /* webpackChunkName: "Compras" */ '@/views/transacciones/compras/Compras.vue'
          ),
        meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO', 'EMPLEADO'] }
      },
      {
        path: 'deudas',
        name: 'Deudas',
        component: () =>
          import(
            /* webpackChunkName: "Deudas" */ '@/views/transacciones/deudas/Deudas.vue'
          ),
        meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO', 'EMPLEADO'] }
      },
    ],
  },
  {
    path: '/403',
    name: 'Pagina403',
    component: Pagina403,
  },

  {
    path: '/404',
    name: 'Pagina404',
    component: Pagina404,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: Pagina404,
  },

  {
    path: '/negocios',
    name: 'Negocios',
    redirect: '/negocios/lista',
    component: DefaultLayout,
    children: [
      {
        path: 'lista',
        name: '',
        component: () =>
          import(
            /* webpackChunkName: "ListaNegocios" */ '@/views/negocios/ListaNegocios.vue'
          ),
        meta: { roles: ['ADMINISTRADOR'] }
      },
      {
        path: 'agregar',
        name: 'Registrar Negocio',
        component: () =>
          import(
            /* webpackChunkName: "RegistrarNegocio" */ '@/views/negocios/RegistrarNegocio.vue'
          ),
        meta: { roles: ['ADMINISTRADOR'] }
      },
      {
        path: 'actualizar',
        name: 'Actualizar Negocio',
        component: () =>
          import(
            /* webpackChunkName: "ActualizarNegocio" */ '@/views/negocios/ActualizarNegocio.vue'
          ),
        meta: { roles: ['ADMINISTRADOR'] }
      },
    ],
  },

  {
    path: '/cuadres-caja',
    name: 'Cuadres de Caja',
    redirect: '/cuadres-caja/lista',
    component: DefaultLayout,
    children: [
      {
        path: 'lista',
        name: '',
        component: () =>
          import(
            /* webpackChunkName: "CierresCajas" */ '@/views/gestion-cajas/CierresCajas.vue'
          ),
        meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO'] }
      },

      {
        path: 'detalles-cuadre-caja',
        name: 'Detalles Cuadre Caja',
        component: () =>
          import(
            /* webpackChunkName: "DetalleCuadreCaja" */ '@/views/gestion-cajas/DetallesCuadresCaja.vue'
          ),
        meta: { roles: ['ADMINISTRADOR', 'PROPIETARIO'] }
      },

    ],
  },


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
    next(to.path)
  } else {
    const usuario = JSON.parse(sessionStorage.getItem('usuario'))


    if (usuario && usuario.rol && to.meta.roles && to.meta.roles.includes(usuario.rol)) {
      next()
    } else if (to.name !== 'Pagina403') {
      next({ name: 'Pagina403' }) // Redirige a la página 403
    } else {
      next() // Permite la navegación a la página 403
    }
  }
})

export default router