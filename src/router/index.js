import { createRouter, createWebHistory } from 'vue-router'
import VistaInicio from '../views/VistaInicio.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'inicio',
      component: VistaInicio
    },
    {
      path: '/pass/:id',
      name: 'pass',
      component: () => import('../views/VistaInicioContrasenia.vue')
    },
    {
      path: '/opciones',
      name: 'opciones',
      component: () => import('../components/Opciones.vue')
    },
    {
      path: '/nav',
      name: 'nav',
      component: () => import('../components/Nav.vue')
    },
    {
      path: '/clientes',
      name: 'clientes',
      component: () => import('../views/VistaCliente.vue')
    },
    {
      path: '/cliente/:id',
      name: 'clientexid',
      component: () => import('../components/Cliente.vue')
    },
    {
      path: '/productos',
      name: 'productos',
      component: () => import('../views/VistaProducto.vue')
    },
    {
      path: '/producto/:id',
      name: 'producto',
      component: () => import('../components/Producto.vue')
    },
    {
      path: '/productoEdit/:id',
      name: 'productoEditable',
      component: () => import('../components/EditarProducto.vue')
    },
    {
      path: '/borrar/:id',
      name: 'borrar',
      component: () => import('../components/Borrar.vue')
    },
  ],

  // Reinicia el scroll
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash };
    } else {

      return { top: 0 };
    }
  },
});

export default router
