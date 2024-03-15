import {createRouter, createWebHistory, type RouteLocation} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BoardView from '../views/BoardView.vue'
import {useAuthStore} from '@/stores/auth'
import {storeToRefs} from 'pinia'
import LoginView from '@/views/LoginView.vue'
import {computed} from 'vue'

// const auth = async (to: RouteLocation, from: RouteLocation) => {
//   const authStore = useAuthStore()
//   await authStore.fetchUser()
//   const { user } = storeToRefs(authStore)
//   if (!user.value) {
//     return '/login'
//   }
// }

// const guest = async (to: RouteLocation, from: RouteLocation) => {
//   const token = localStorage.getItem('access_token')
//   const authStore = useAuthStore()
//   if (token) {
//     await authStore.fetchUser()
//   }
//   const { user } = storeToRefs(authStore)
//   if (user.value) {
//     return '/'
//   }
// }

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/board/:id',
      name: 'board',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: BoardView
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: LoginView
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: HomeView }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

router.beforeEach(async (to: RouteLocation) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  const authStore = useAuthStore()
  const { user } = storeToRefs(authStore)

  const isLoggedIn = computed(() => !!user.value)

  if (authRequired && !isLoggedIn.value) {
    authStore.returnUrl = to.fullPath
    return '/login'
  }
})

export default router
