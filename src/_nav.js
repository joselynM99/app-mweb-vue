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
    name: 'Usuarios',
    to: '/usuarios',
    icon: 'fas fa-users', // Icono de usuarios
    items: [
      {
        component: 'CNavItem',
        name: 'Lista',
        to: '/usuarios',
        icon: 'fas fa-list', // Lista
      },
      {
        component: 'CNavItem',
        name: 'Registrar',
        to: '/usuarios/agregar',
        icon: 'fas fa-user-plus', // Registrar usuario
      },
      {
        component: 'CNavItem',
        name: 'Actualizar',
        to: '/usuarios/actualizar',
        icon: 'fas fa-user-edit', // Editar usuario
      },
    ],
  },
  {
    component: 'CNavItem',
    name: 'Cajas',
    to: '/negocio/cajas',
    icon: 'fas fa-cash-register', // Caja registradora
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
    name: 'Inventario',
  },
  {
    component: 'CNavItem',
    name: 'Productos',
    to: '/inventario/productos',
    icon: 'fas fa-boxes', // Productos
    items: [
      {
        component: 'CNavItem',
        name: 'Lista',
        to: '/inventario/productos',
        icon: 'fas fa-list', // Lista
      },
      {
        component: 'CNavItem',
        name: 'Registrar',
        to: '/inventario/productos/agregar',
        icon: 'fas fa-plus-square', // Registrar producto
      },
      {
        component: 'CNavItem',
        name: 'Actualizar',
        to: '/negocio/actualizar-producto',
        icon: 'fas fa-edit', // Editar producto
      },
    ],
  },
  {
    component: 'CNavItem',
    name: 'Subproductos',
    to: '/inventario/subproductos',
    icon: 'fas fa-box', // Subproductos
    items: [
      {
        component: 'CNavItem',
        name: 'Lista',
        to: '/inventario/subproductos',
        icon: 'fas fa-list', // Lista
      },
      {
        component: 'CNavItem',
        name: 'Registrar',
        to: '/inventario/agregar-subproducto',
        icon: 'fas fa-plus-square', // Registrar subproducto
      },
      {
        component: 'CNavItem',
        name: 'Actualizar',
        to: '/negocio/actualizar-subproducto',
        icon: 'fas fa-edit', // Editar subproducto
      },
    ],
  },
  {
    component: 'CNavItem',
    name: 'Proveedores',
    to: '/inventario/proveedores',
    icon: 'fas fa-truck', // Proveedores
    items: [
      {
        component: 'CNavItem',
        name: 'Lista',
        to: '/inventario/proveedores',
        icon: 'fas fa-list', // Lista
      },
      {
        component: 'CNavItem',
        name: 'Registrar',
        to: '/inventario/proveedores/agregar',
        icon: 'fas fa-user-plus', // Registrar proveedor
      },
      {
        component: 'CNavItem',
        name: 'Actualizar',
        to: '/inventario/proveedores/actualizar',
        icon: 'fas fa-user-edit', // Actualizar proveedor
      },
    ],
  },
  {
    component: 'CNavItem',
    name: 'Categorías',
    to: '/inventario/categorias',
    icon: 'fas fa-tags', // Categorías

  },
  {
    component: 'CNavItem',
    name: 'Marcas',
    to: '/inventario/marcas',
    icon: 'fas fa-certificate', // Marcas
    
  },
  {
    component: 'CNavTitle',
    name: 'Transacciones',
  },
  {
    component: 'CNavItem',
    name: 'Ventas',
    to: '/ventas/realizar-venta',
    icon: 'fas fa-shopping-cart', // Ventas
  },
  {
    component: 'CNavItem',
    name: 'Compras',
    to: '/compras/realizar-compra',
    icon: 'fas fa-receipt', // Compras
  },
  {
    component: 'CNavItem',
    name: 'Deudas',
    to: '/ventas/registrar-deuda',
    icon: 'fas fa-money-check-alt', // Deudas
  },


  {
    component: 'CNavTitle',
    name: 'Components',
  },
  {
    component: 'CNavGroup',
    name: 'Base',
    to: '/base',
    icon: 'cil-puzzle',
    items: [
      {
        component: 'CNavItem',
        name: 'Accordion',
        to: '/base/accordion',
      },
      {
        component: 'CNavItem',
        name: 'Breadcrumbs',
        to: '/base/breadcrumbs',
      },
      {
        component: 'CNavItem',
        name: 'Cards',
        to: '/base/cards',
      },
      {
        component: 'CNavItem',
        name: 'Carousels',
        to: '/base/carousels',
      },
      {
        component: 'CNavItem',
        name: 'Collapses',
        to: '/base/collapses',
      },
      {
        component: 'CNavItem',
        name: 'List Groups',
        to: '/base/list-groups',
      },
      {
        component: 'CNavItem',
        name: 'Navs & Tabs',
        to: '/base/navs',
      },
      {
        component: 'CNavItem',
        name: 'Paginations',
        to: '/base/paginations',
      },
      {
        component: 'CNavItem',
        name: 'Placeholders',
        to: '/base/placeholders',
      },
      {
        component: 'CNavItem',
        name: 'Popovers',
        to: '/base/popovers',
      },
      {
        component: 'CNavItem',
        name: 'Progress',
        to: '/base/progress',
      },
      {
        component: 'CNavItem',
        name: 'Spinners',
        to: '/base/spinners',
      },
      {
        component: 'CNavItem',
        name: 'Tables',
        to: '/base/tables',
      },
      {
        component: 'CNavItem',
        name: 'Tabs',
        to: '/base/tabs',
      },
      {
        component: 'CNavItem',
        name: 'Tooltips',
        to: '/base/tooltips',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Buttons',
    to: '/buttons',
    icon: 'cil-cursor',
    items: [
      {
        component: 'CNavItem',
        name: 'Buttons',
        to: '/buttons/standard-buttons',
      },
      {
        component: 'CNavItem',
        name: 'Button Groups',
        to: '/buttons/button-groups',
      },
      {
        component: 'CNavItem',
        name: 'Dropdowns',
        to: '/buttons/dropdowns',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Forms',
    to: '/forms',
    icon: 'cil-notes',
    items: [
      {
        component: 'CNavItem',
        name: 'Form Control',
        to: '/forms/form-control',
      },
      {
        component: 'CNavItem',
        name: 'Select',
        to: '/forms/select',
      },
      {
        component: 'CNavItem',
        name: 'Checks & Radios',
        to: '/forms/checks-radios',
      },
      {
        component: 'CNavItem',
        name: 'Range',
        to: '/forms/range',
      },
      {
        component: 'CNavItem',
        name: 'Input Group',
        to: '/forms/input-group',
      },
      {
        component: 'CNavItem',
        name: 'Floating Labels',
        to: '/forms/floating-labels',
      },
      {
        component: 'CNavItem',
        name: 'Layout',
        to: '/forms/layout',
      },
      {
        component: 'CNavItem',
        name: 'Validation',
        to: '/forms/validation',
      },
    ],
  },
  {
    component: 'CNavItem',
    name: 'Charts',
    to: '/charts',
    icon: 'cil-chart-pie',
  },
  {
    component: 'CNavGroup',
    name: 'Icons',
    to: '/icons',
    icon: 'cil-star',
    items: [
      {
        component: 'CNavItem',
        name: 'CoreUI Icons',
        to: '/icons/coreui-icons',
        badge: {
          color: 'info',
          text: 'NEW',
        },
      },
      {
        component: 'CNavItem',
        name: 'Brands',
        to: '/icons/brands',
      },
      {
        component: 'CNavItem',
        name: 'Flags',
        to: '/icons/flags',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Notifications',
    to: '/notifications',
    icon: 'cil-bell',
    items: [
      {
        component: 'CNavItem',
        name: 'Alerts',
        to: '/notifications/alerts',
      },
      {
        component: 'CNavItem',
        name: 'Badges',
        to: '/notifications/badges',
      },
      {
        component: 'CNavItem',
        name: 'Modals',
        to: '/notifications/modals',
      },
      {
        component: 'CNavItem',
        name: 'Toasts',
        to: '/notifications/toasts',
      },
    ],
  },
  {
    component: 'CNavItem',
    name: 'Widgets',
    to: '/widgets',
    icon: 'cil-calculator',
    badge: {
      color: 'primary',
      text: 'NEW',
      shape: 'pill',
    },
  },
  {
    component: 'CNavTitle',
    name: 'Extras',
  },
  {
    component: 'CNavGroup',
    name: 'Pages',
    to: '/pages',
    icon: 'cil-star',
    items: [
      {
        component: 'CNavItem',
        name: 'Login',
        to: '/pages/login',
      },
      {
        component: 'CNavItem',
        name: 'Register',
        to: '/pages/register',
      },
      {
        component: 'CNavItem',
        name: 'Error 404',
        to: '/pages/404',
      },
      {
        component: 'CNavItem',
        name: 'Error 500',
        to: '/pages/500',
      },
    ],
  },
]
