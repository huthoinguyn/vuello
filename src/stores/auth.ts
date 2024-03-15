import {defineStore} from 'pinia'
import {ref} from 'vue'
import type {UserInterface} from '@/models/users/user.interface'
import axios from '@/lib/axios'
import {useRouter} from 'vue-router'
// import axios from '@/lib/axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserInterface | null>(
    (JSON.parse(localStorage.getItem('user') as any) as UserInterface) || null
  )
  const users = ref<UserInterface[]>([])

  const router = useRouter()

  const returnUrl = ref<String | null>(null)

  const fetchUser = async () => {
    try {
      const response = await axios.post('/auth/me')
      if (response.status === 200) {
        user.value = response.data
      }
    } catch (error) {
      console.log(error)
    }
  }

  const refreshToken = async () => {
    try {
      const response = await axios.post('/auth/refresh')
      if (response.status === 200) {
        localStorage.setItem('access_token', response.data.access_token)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await axios.post('/auth/login', credentials)
      if (response.status === 200) {
        localStorage.setItem('access_token', response.data.access_token)
        await fetchUser()
        localStorage.setItem('user', JSON.stringify(user.value))
        await router.push((returnUrl.value as any) || '/')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const logout = async () => {
    try {
      const response = await axios.post('/auth/logout')
      if (response.status === 200) {
        user.value = null
        localStorage.removeItem('user')
        await router.push((returnUrl.value as any) || '/login')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return {
    user,
    fetchUser,
    refreshToken,
    login,
    logout,
    users,
    returnUrl
  }
})
