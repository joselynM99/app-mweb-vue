export default [

  {
    component: 'CNavTitle',
    name: 'Negocio',
  },
  {
    component: 'CNavItem',
    name: 'Perfil de Negocio',
    to: '/negocio/perfil',
    icon: 'fas fa-briefcase', // Icono de negocio
  },


  {
    component: 'CNavItem',
    name: 'Clientes',
    to: '/clientes',
    icon: 'fas fa-address-book', // Libreta de contactos para clientes
    items: [
      {
        component: 'CNavItem',
        name: 'Lista',
        to: '/clientes',
        icon: 'fas fa-list', // Lista
      },
      {
        component: 'CNavItem',
        name: 'Registrar',
        to: '/clientes/agregar',
        icon: 'fas fa-user-check', // Registrar cliente
      },
      {
        component: 'CNavItem',
        name: 'Actualizar',
        to: '/clientes/actualizar',
        icon: 'fas fa-user-edit', // Actualizar cliente
      },
    ],
  },



  {
    component: 'CNavTitle',
    name: 'Transacciones',
  },
  {
    component: 'CNavItem',
    name: 'Ventas',
    to: '/transacciones/ventas/realizar-venta',
    icon: 'fas fa-shopping-cart', // Ventas
  },

  {
    component: 'CNavItem',
    name: 'Deudas',
    to: '/transacciones/deudas',
    icon: 'fas fa-money-check-alt', // Deudas
  },

  {
    component: 'CNavItem',
    name: 'Adicionales',
    to: '/transacciones/adicionales',
    icon: 'fas fa-shopping-cart', // Ventas
  },

]
