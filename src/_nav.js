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
        to: '/inventario/productos/actualizar',
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
        to: '/inventario/subproductos/agregar',
        icon: 'fas fa-plus-square', // Registrar subproducto
      },
      {
        component: 'CNavItem',
        name: 'Actualizar',
        to: '/inventario/subproductos/actualizar',
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
    to: '/transacciones/ventas/realizar-venta',
    icon: 'fas fa-shopping-cart', // Ventas
  },
  {
    component: 'CNavItem',
    name: 'Compras',
    to: '/transacciones/compra/realizar-compra',
    icon: 'fas fa-receipt', // Compras
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
