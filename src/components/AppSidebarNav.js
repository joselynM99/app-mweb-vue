import { defineComponent, h, onMounted, ref, resolveComponent } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { CBadge, CSidebarNav, CNavItem, CNavGroup, CNavTitle } from '@coreui/vue'
import nav from '@/_nav.js'
import navEmpleado from '@/_navEmpleado.js'
import navAdmin from '@/_navAdmin.js'
import simplebar from 'simplebar-vue'
import 'simplebar-vue/dist/simplebar.min.css'

import { FontAwesomeIcon } from '@fortawesome/fontawesome-free/css/all.css'

const normalizePath = (path) =>
  decodeURI(path)
    .replace(/#.*$/, '')
    .replace(/(index)?\.(html)$/, '')

const isActiveLink = (route, link) => {
  if (!link) {
    return false
  }

  const currentPath = normalizePath(route.path)
  const targetPath = normalizePath(link)

  return currentPath === targetPath
}

const isActiveItem = (route, item) => {
  if (isActiveLink(route, item.to)) {
    return true
  }

  if (item.items) {
    return item.items.some((child) => isActiveItem(route, child))
  }

  return false
}

const AppSidebarNav = defineComponent({
  name: 'AppSidebarNav',
  components: {
    CNavItem,
    CNavGroup,
    CNavTitle,
    FontAwesomeIcon,
  },
  setup() {
    const route = useRoute()
    const firstRender = ref(true)

    onMounted(() => {
      firstRender.value = false
    })

    const usuario = JSON.parse(sessionStorage.getItem('usuario'))
    const negocioId = JSON.parse(sessionStorage.getItem('negocioId'));

    let navItems
    if (usuario && usuario.rol === 'ADMINISTRADOR') {
      if (negocioId === null) {
        navItems = navAdmin
      } else {
        navItems = nav
      }
    } else if (usuario && usuario.rol === 'EMPLEADO') {
      navItems = navEmpleado
    } else {
      navItems = nav
    }

    const renderItem = (item, isChild = false) => {
      if (item.items) {
        return h(
          CNavGroup,
          {
            as: 'div',
            compact: true,
            style: isChild ? 'margin-left: 20px;' : '',
            ...(firstRender.value && {
              visible: item.items.some((child) => isActiveItem(route, child)),
            }),
          },
          {
            togglerContent: () => [
              h('i', { class: `${item.icon} nav-icon`, style: 'width: 24px; height: 24px;' }),
              item.name,
            ],
            default: () => item.items.map((child) => renderItem(child, true)),
          }
        )
      }

      return item.to
        ? h(
          RouterLink,
          {
            to: item.to,
            custom: true,
          },
          {
            default: (props) =>
              h(
                resolveComponent(item.component),
                {
                  active: isActiveLink(route, item.to),
                  as: 'div',
                  href: props.href,
                  style: isChild ? 'margin-left: 20px;' : '',
                  onClick: () => props.navigate(),
                },
                {
                  default: () => [
                    item.icon
                      ? h('i', { class: `${item.icon} nav-icon`, style: 'width: 24px; height: 24px;' })
                      : h('span', { class: 'nav-icon', style: 'width: 24px;' }, h('span', { class: 'nav-icon-bullet' })),
                    item.name,
                    item.badge &&
                    h(
                      CBadge,
                      {
                        class: 'ms-auto',
                        color: item.badge.color,
                      },
                      {
                        default: () => item.badge.text,
                      }
                    ),
                  ],
                }
              ),
          }
        )
        : h(
          resolveComponent(item.component),
          {
            as: 'div',
          },
          {
            default: () => item.name,
          }
        )
    }

    return () =>
      h(
        CSidebarNav,
        {
          as: simplebar,
        },
        {
          default: () => navItems.map((item) => renderItem(item)),
        },
      )
  },
})

export { AppSidebarNav }