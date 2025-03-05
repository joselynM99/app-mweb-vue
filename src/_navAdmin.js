export default [

  {
    component: 'CNavTitle',
    name: 'Negocio',
  },


  {
    component: 'CNavItem',
    name: 'Negocios',
    to: '/negocios',
    icon: 'fas fa-briefcase', // Icono de negocio
    items: [
      {
        component: 'CNavItem',
        name: 'Lista',
        to: '/negocios',
        icon: 'fas fa-list', // Lista
      },
      {
        component: 'CNavItem',
        name: 'Registrar',
        to: '/negocios/agregar',
        icon: 'fas fa-plus-circle', // Registrar negocio
      },
      {
        component: 'CNavItem',
        name: 'Actualizar',
        to: '/negocios/actualizar',
        icon: 'fas fa-edit', // Actualizar negocio
      },
    ],
  },
  

]
